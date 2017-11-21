define(["dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/on",
  "layer",
  "mustache",
  "handlebars",
  "slimScroll",
  "static/thirdparty/laypage/laypage",
  "esri/toolbars/draw",
  "esri/graphic",
  "esri/lang",
  "map/core/QueryTask",
  "esri/tasks/FeatureSet",
  "map/utils/MapUtils",
  "map/component/MapPopup",
  "map/core/JsonConverters",
  "map/core/BaseWidget",
  "map/core/GeometryIO",
  "map/component/ListDataRenderer",
  "map/component/ChosenSelect",
  "static/thirdparty/laydate/laydate",
  "static/thirdparty/bootstrap/js/bootstrap-v3.min"
], function(declare, lang, arrayUtil, on, layer, Mustache, Handlebars, SlimScroll, laypage, Draw, Graphic, esriLang,
  QueryTask, FeatureSet, MapUtils, MapPopup, JsonConverters, BaseWidget, GeometryIO, ListDataRenderer, ChosenSelect) {

  var _queryConfig, _map;
  var mapPopup = MapPopup.getInstance();
  var filterServiceId = ""; //过滤图层id
  var query = declare([BaseWidget], {
    /**
     *
     */
    constructor: function() {},
    /**
     *
     */
    onCreate: function() {
      _map = this.getMap().map();
      _queryConfig = this.getConfig();
      _init();
    },
    onOpen: function() {
      if (_map.getLayer("graphics4Print")) _map.getLayer("graphics4Print").show();
    },
    onPause: function() {
      if (mapPopup.isShowing) mapPopup.closePopup();
      _map.graphics.clear();
      if (_map.getLayer("graphics4Print")) _map.getLayer("graphics4Print").hide();
    },
    onDestroy: function() {
      if (mapPopup.isShowing) mapPopup.closePopup();
      dateCondition = {};
      rangeCondition = {};
      clearDefinitionExpression();
      if (_map.getLayer("graphics4Print")) _map.removeLayer(_map.getLayer("graphics4Print"));
    }
  });

  var drawTool, drawHandler;
  var dateCondition = {}; //存放日期型查询字段查询条件
  var rangeCondition = {}; //存放范围型的字段查询条件

  var STATE_QUERY = "query";
  var STATE_RESULT = "result";

  //设置属性识别后信息弹出窗的样式
  var POPUP_OPTION_INFO = "infoWindow";
  var POPUP_OPTION_MODAL = "modal";

  //默认是infowindow样式
  var popUpStyle = POPUP_OPTION_INFO;

  var $attrQueryPanel, $spatialQueryPanel, $qResultPanel, $qSearchBtn, $lyrSelector;
  var _currentState = STATE_QUERY;

  var geometryIO;

  var showFooter = false;
  var exportData = false;
  var exportTypes = "";

  /**
   *  初始化图层查询界面及功能
   * @param _queryConfig
   */
  function _init() {

    geometryIO = new GeometryIO();
    $("#spatialQueryPanel_FWCSCX").animate();
    Handlebars.registerHelper('equals', function(left, operator, right, options) {
      if (arguments.length < 3) {
        throw new Error('Handlerbars Helper "compare" needs 2 parameters');
      }
      var operators = {
        '==': function(l, r) {
          return l == r;
        },
        '===': function(l, r) {
          if (l != undefined)
            return l === r;
          else
            return false;
        },
        '!=': function(l, r) {
          return l != r;
        },
        '!==': function(l, r) {
          return l !== r;
        },
        '<': function(l, r) {
          return l < r;
        },
        '>': function(l, r) {
          return l > r;
        },
        '<=': function(l, r) {
          return l <= r;
        },
        '>=': function(l, r) {
          return l >= r;
        },
        'typeof': function(l, r) {
          return typeof l == r;
        }
      };

      if (!operators[operator]) {
        throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
      }

      var result = operators[operator](left, right);

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    layer.config();
    laydate.skin('molv');
    //初始化jq变量
    $attrQueryPanel = $("#attrQueryPanel_FWCSCX");
    $qResultPanel = $("#queryResultPanel_FWCSCX");
    $spatialQueryPanel = $("#spatialQueryPanel_FWCSCX");
    //读取弹出层方式
    if (_queryConfig.popUpStyle && _queryConfig.popUpStyle.equalsIgnoreCase('modal')) {
      popUpStyle = POPUP_OPTION_MODAL;
    } else {
      popUpStyle = POPUP_OPTION_INFO;
    }
    exportData = _queryConfig.exportData;
    exportTypes = _queryConfig.exportTypes;
    highlightFeatureOpacity = _queryConfig.locateOpacity;
    //空间查询按钮监听
    // $spatialQueryPanel.find('span').on('click', function() {
    //   spatialClickHandler($(this).data("type"));
    // });
    //初始化默认模板
    $attrQueryPanel.append(renderTpl($("#layersDefaultTpl_FWCSCX").html(), {
      layers: _queryConfig.layers
    }));
    $lyrSelector = $("#layersSelect_FWCSCX");
    $qSearchBtn = $("#qSearchBtn_FWCSCX");

    //查询图层
    $qSearchBtn.on('click', function() {
      var serviceId = $('#layersSelect_FWCSCX').val();
      $qSearchBtn.text('查询中 ...');
      $.each(_queryConfig.layers, function(i, n) {
        if (serviceId === (n.serviceId + "-" + n.layerIndex)) {
          var outFields = [];
          var outFieldsStr = "";
          var where = '';
          $.each(n.returnFields, function(i1, n1) {
            outFields.push(n1.name);
            if (i1 == n.returnFields.length - 1)
              outFieldsStr = outFieldsStr.concat(n1.name);
            else
              outFieldsStr = outFieldsStr.concat(n1.name).concat(",");
          });
          //从表单获取值组装where的条件
          $.each($("#layerForm_FWCSCX .query-val"), function(index, layerFormItem) {
            var prefix = n.queryFields.prefix;
            var operator = ' LIKE ';
            var field;
            //获取输入框输入的条件组成sql条件
            if (layerFormItem.nodeName.toLowerCase() === 'input' || layerFormItem.nodeName.toLowerCase() === 'select') {
              var tmp = arrayUtil.filter(n.queryFields.fields, function(item) {
                return item.name === layerFormItem.name;
              });
              field = tmp[0];
              if (esriLang.isDefined(field.operator)) {
                operator = field.operator;
              }
              if (layerFormItem.nodeName.toLowerCase() === 'input') {
                if (layerFormItem.value != undefined && layerFormItem.value != '') {
                  if (where.length > 0 && index < $("#layerForm_FWCSCX :input").length) {
                    where += ' AND ';
                  }
                  where += " " + layerFormItem.name + " " + operator + " '" + prefix + layerFormItem.value + prefix + "'";
                }
              } else {
                var arr = chosenValsHash[layerFormItem.name];
                if (field.type === 'STRING' || field.type === 'string') {
                  arr = arrayUtil.map(arr, function(item) {
                    return "'" + item + "'";
                  });
                }
                if (arr.length > 0) {
                  if (where.length > 0) {
                    where += ' AND ';
                  }
                  where += layerFormItem.name + ' in (' + arr.join(',') + ')';
                }
              }
            }
          });


          if (where.length == 0) {
            where = null;
            $qSearchBtn.html('<i class="iconfont">&#xe602;</i>查询');
            return false;
          }
          console.info("---属性查询条件----" + where);
          var data = {
            layerUrl: getLayerUrl(n.layerUrl),
            where: where,
            returnFields: outFieldsStr,
            page: 1,
            // size: parseInt(($(window).height() - 280) / 65, 10)
            size:10
          };
          $.ajax({
            url: "/omp/map/query",
            data: data,
            success: function(r) {
              parseQueryResult(r, data);
              showPageTool("pageTool", r.totalPages, r.number, data); //使用分页
            }
          });
          if (_queryConfig.filterAfterQuery) {
            var layerDefinitions = [];
            layerDefinitions[parseInt(n.layerIndex, 10)] = where;
            MapUtils.getLayer(serviceId).setLayerDefinitions(layerDefinitions);
            filterServiceId = serviceId;
            window.definitionExpression = {};
            window.definitionExpression[serviceId] = [{
              "id": parseInt(n.layerIndex, 10),
              "layerDefinition": {
                "definitionExpression": where
              }
            }];
          }
          where = null;
          return false;
        }
      });
    });

    //渲染查询条件模板 11.21
    $.each(_queryConfig.layers, function(index, layer) {
      var currentQueryFields = layer.queryFields.fields;
      $("#layerCondition_FWCSCX").empty();
      $("#layerCondition_FWCSCX").append(renderTpl($("#layersSearchTpl_FWCSCX").html(), {
        fields: currentQueryFields
      }));
    });

    //清空重置监听
    $("#qResetBtn_FWCSCX").on('click', function() {
      var _selItem = $lyrSelector.val();
      $("#layerForm_FWCSCX")[0].reset();
      $lyrSelector.val(_selItem);
      clearDefinitionExpression();
      dateCondition = {};
      rangeCondition = {};
    });
  }

  /*
  2017.11.21開始編輯
  */
  /***
   * 处理图层url
   * @param lyrUrl
   * @returns {string}
   */
  function getLayerUrl(lyrUrl) {
    var sr = _map.spatialReference.wkid;
    var realUrl;
    if (lyrUrl.startWith("http://")) {
      realUrl = sr != undefined ? lyrUrl.concat("/query").concat("?outSR=" + sr) : lyrUrl.concat("/query");
    } else {
      realUrl = sr != undefined ? lyrUrl.replace("/oms", omsUrl).concat("/query").concat("?outSR=" + sr) : lyrUrl.replace("/oms", omsUrl).concat("/query");
    }
    return encodeURI(realUrl);
  }

  /***
   * 定位图形
   * @param g
   */
  function doLocation(g, lyr) {
      var geo = g.geometry;
      var geoType = geo.type;
      var geoCenter;
      switch (geoType) {
          case 'point':
              geoCenter = geo;
              break;
          case 'polyline':
          case 'polygon':
              geoCenter = geo.getExtent().getCenter();
              break;
      }
      geoCenter = lang.mixin(geoCenter, {spatialReference: _map.spatialReference});
      var graphic = new Graphic(lang.mixin(geo, {spatialReference: _map.spatialReference}));
      graphic.setAttributes(g.attributes);
      MapUtils.setMap(map.map());
      MapUtils.highlightFeatures([graphic], false, highlightFeatureOpacity, "graphics4Print");
      if (popUpStyle == POPUP_OPTION_INFO) {
          var bdcQueryField=lyr.bdcQueryField;
          if (mapPopup.isShowing)mapPopup.closePopup();
          if(bdcQueryField&&esriLang.substitute(g.attributes, bdcQueryField)){
              $.ajax({
                  url:root+"/bdcQuery/bdczt?bdcdybh="+ esriLang.substitute(g.attributes, bdcQueryField),
                  async:false,
                  success:function(r){
                      if(r.bdcdybh){
                          r.empty = 'true';
                          for (var i in r) {
                              if (r[i] == 1) {
                                  r.empty = false;
                                  break;
                              }
                          }
                          r.bdcUrl = esriLang.substitute(g.attributes,lyr.bdcUrl);
                          mapPopup.setBdczt(r);
                      }else{
                          mapPopup.setBdczt({empty:true,bdcUrl:esriLang.substitute(g.attributes, lyr.bdcUrl)});
                      }
                  }
              });
          }
          mapPopup.setData(g.attributes);
          mapPopup.setTitleField(lyr.titleField.name);
          mapPopup.setFields(lyr.returnFields);
          mapPopup.setLink(lyr.link);
          if (showFooter) mapPopup.setBLinkEnabled(showFooter);
          mapPopup.openPopup(geoCenter).then(function () {
              if (geoType == 'point')
                  MapUtils.locatePoint(graphic);
              else
                  MapUtils.locateFeatures([graphic]);
          });
      } else if (popUpStyle == POPUP_OPTION_MODAL) {

          var x = (_map.position.x + 20) + 'px';
          layer.open({
              title: lyr.layerName,
              area: '300px',
              content: getInfoContent(graphic, lyr.returnFields),
              shade: 1,
              btn: [],
              offset: ['140px', x]
          });
          MapUtils.locateFeatures([graphic]);
      }

  }

  /**
   *  图层查询后回调函数处理结果
   */
  function parseQueryResult(r, data) {
    $qSearchBtn.html('<i class="iconfont">&#xe602;</i>查询');
    if (r.hasOwnProperty("success")) {
      layer.open({
        icon: 0,
        title: '提示',
        content: r.msg
      });
      return;
    }
    var rp = {};
    var totalSize = 0;
    if (r.hasOwnProperty("content")) {
      if (r.totalElements == 0) {
        layer.msg('未查询到结果');
        return;
      }
      rp.features = r.content;
      totalSize = r.totalElements;
    } else {
      rp = r;
      totalSize = rp.features.length;
    }
    if (rp == undefined || rp.features == undefined) {
      layer.msg("查询结果为空！");
    } else {
      var attrs = []; //存放要进行展示的属性集合
      var layerObj = null; //选定的图层对象
      $.each(_queryConfig.layers, function(n, layerItem) {
        if ($lyrSelector.val() == (layerItem.serviceId + "-" + layerItem.layerIndex)) {
          layerObj = layerItem;
          var tf = layerItem.titleField;
          var sf = getSubTitleField(layerItem);
          var rf = layerItem.returnFields;
          var graphics = [];
          $.each(rp.features, function(i, feature) {
            for (var j in rf) {
              if (rf[j].type == "DATE" && feature.attributes[rf[j].name]) {
                feature.attributes[rf[j].name] = new Date(feature.attributes[rf[j].name]).toLocaleString();
              }
            }
            var titleText = esriLang.substitute({
              alias: tf.alias,
              value: feature.attributes[tf.name] || '空'
            }, '${alias}:${value}');
            var subTitleText = esriLang.isDefined(sf) ? esriLang.substitute({
              alias: sf.alias,
              value: feature.attributes[sf.name] || '空'
            }, '${alias}:${value}') : '';
            var g = rp.features[i];
            var graphic = new Graphic(g);
            graphics.push(graphic);
            attrs.push({
              title: titleText,
              subtitle: subTitleText,
              graphic: graphic
            });
          });
        }
      });
      //切换面板状态 隐藏查询面板
      changeState(STATE_RESULT);
      //渲染模板显示结果
      var tpl = $("#layersResultTpl_FWCSCX").html();
      $qResultPanel.empty();
      $qResultPanel.append(Mustache.render(tpl, {
        result: attrs,
        size: totalSize,
        exportData: exportData
      }));
      var listDataRenderer = new ListDataRenderer({
        renderTo: $('#layers_result_FWCSCX'),
        type: exportData ? "export" : "loc",
        map: map.map(),
        renderData: attrs
      });;
      listDataRenderer.on('location', function(data) {
        doLocation(data.graphic, layerObj);
      });
      listDataRenderer.on("export", function(data) {
        var obj = data.graphic;
        if (obj != null) {
          var featureSet = new FeatureSet();
          featureSet.features = [obj];
          var exportSelTpl = $("#export-select-tpl").html();
          var template = Handlebars.compile(exportSelTpl);
          var content = template({
            types: parseTypesArray
          });

          layer.open({
            title: '选择导出格式',
            content: content,
            area: '300px',
            yes: function(index, layero) {
              var type = $(layero).find('select').val();
              layer.close(index);
              geometryIO.expToFile(featureSet, type);
            }
          });
        }
      });
      listDataRenderer.render();
      //结果界面可滚动
      var scrollHeight = $(window).height() - 220;
      $("#layers_result_FWCSCX").slimScroll({
        height: scrollHeight,
        railVisible: true,
        railColor: '#333',
        railOpacity: .2,
        railDraggable: true
      });

      //返回查询界面
      $("#qReturnBtn_FWCSCX").on('click', function() {
        changeState(STATE_QUERY);
      });
      $("#qExportBtn_FWCSCX").on('click', function() {
        data.page = -1;
        $.ajax({
          url: "/omp/map/query",
          data: data,
          success: function(r) {
            var features = $.parseJSON(r).features;
            var data = [];
            var keys = [];
            for (var key in features[0].attributes) {
              keys.push(key);
            }
            data.push(keys);
            arrayUtil.forEach(features, function(item) {
              var att = item.attributes;
              var str = [];
              arrayUtil.forEach(keys, function(k) {
                str.push(att[k]);
              });
              data.push(str);
            });
            geometryIO._exportAttInfo(data);
          }
        });
      })
    }
  }

  /***
   * 切换当前面板状态
   * @param s
   */
  function changeState(s) {
    _currentState = s;
    switch (_currentState) {
      case STATE_QUERY:
        $qResultPanel.empty();
        $attrQueryPanel.show();
        $spatialQueryPanel.show();
        if (mapPopup.isShowing) mapPopup.closePopup();
        _map.graphics.clear();
        if (_map.getLayer("graphics4Print")) _map.getLayer("graphics4Print").clear();
        clearDefinitionExpression();
        break;
      case STATE_RESULT:
        $attrQueryPanel.hide();
        $spatialQueryPanel.hide();
        break;
    }
  }

  /***
   * 显示分页工具
   * @param selector
   * @param pageCount
   * @param currPage
   * @param callback
   */
  function showPageTool(selector, pageCount, currPage, data) {
    if (typeof selector === "string")
      selector = $("#" + selector);
    selector.show();
    laypage({
      cont: selector,
      pages: pageCount,
      groups: 5,
      curr: currPage,
      skip: false,
      skin: 'molv',
      first: 1,
      last: pageCount,
      prev: false,
      next: false,
      jump: function(obj, first) {
        if (!first) {
          data.page = obj.curr;
          $.ajax({
            url: "/omp/map/query",
            data: data,
            success: function(r) {
              parseQueryResult(r, data);
              showPageTool("pageTool", r.totalPages, r.number, data);
            }
          });
        }
      }
    });
  }

  /**
   *
   * @param graphic
   * @param returnFields
   * @returns {*}
   */
  function getInfoContent(graphic, returnFields) {

      var data = [];
      var tmpl = $("#infoContentTpl_FWCSCX").html();
      var showData = graphic.attributes;
      for (var i in showData) {
          for (var j = 0; j < returnFields.length; j++) {
              if (i.equalsIgnoreCase(returnFields[j].name)) {
                  data.push({key: returnFields[j].alias, value: showData[i]});
              }
          }
      }
      return Mustache.render(tmpl, {data: data});
  }

  /**
   * 设置二级标题字段
   * 选取非标题字段的第一个字段
   * @param lyr
   */
  function getSubTitleField(lyr) {
    var tf = lyr.titleField;
    var rf = lyr.returnFields;
    for (var i = 0, l = rf.length; i < l; i++) {
      var item = rf[i];
      if (esriLang.isDefined(item) && item.name != tf.name) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * 清除图层过滤
   */
  function clearDefinitionExpression() {
    if (filterServiceId) {
      MapUtils.getLayer(filterServiceId).setLayerDefinitions([]);
      filterServiceId = null;
      window.definitionExpression = null;
    }
  }

  /***
   *
   * @param tpl
   * @param data
   * @returns {*}
   */
  function renderTpl(tpl, data) {
    var templ = Handlebars.compile(tpl);
    return templ(data);
  }

  return query;
});
