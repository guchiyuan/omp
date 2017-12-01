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
  "map/widgets/XMDZGL/ListDataRenderer",
  "map/component/ChosenSelect",
  "static/thirdparty/laydate/laydate",
  "static/thirdparty/bootstrap/js/bootstrap-v3.min"
], function(declare, lang, arrayUtil, on, layer, Mustache, Handlebars, SlimScroll, laypage, Draw, Graphic, esriLang,
  QueryTask, FeatureSet, MapUtils, MapPopup, JsonConverters, BaseWidget, GeometryIO, ListDataRenderer, ChosenSelect) {

  // var _queryConfig, _map;
  // var mapPopup = MapPopup.getInstance();
  var query = declare([BaseWidget], {
    constructor: function() {},

    onCreate: function() {
      _init();
    },
    onPause: function() {
      // if (mapPopup.isShowing) mapPopup.closePopup();
      // _map.graphics.clear();
    },
    onDestroy: function() {
      // if (mapPopup.isShowing) mapPopup.closePopup();

    }
  });


  var STATE_QUERY = "query";
  var STATE_RESULT = "result";

  var $attrQueryPanel, $qResultPanel, $qSearchBtn, $lyrSelector;
  var _currentState = STATE_QUERY;


  //测试数据
  var items_fake = [{
      "title": "22",
      "subtitle": "33"
    },
    {
      "title": "44",
      "subtitle": "55"
    },
    {
      "title": "66",
      "subtitle": "77"
    }
  ];

  /**
   *  初始化图层查询界面及功能
   * @param _queryConfig
   */
  function _init() {


    //初始化jq变量
    $attrQueryPanel = $("#XMDZGLQueryPanel");
    $qResultPanel = $("#XMDZGLResultPanel");
    $lyrSelector = $("#XMDZGLayersSelect");
    $qSearchBtn = $("#XMDZGLSearchBtn");

    //从数据库表里获取行政单位，作为option添加到行政单位的select里
    $.ajax({
      url: "/omp/static/js/map/widgets/XMDZGL/xzqdm.json",
      dataType: "json",
      type: 'GET',
      // async: false,
      // url: "http://192.168.50.121:80/estateplat-cadastre/bdcdy/getXzqdm",
      // dataType: 'jsonp',
      // jsonp: "callback",
      success: function(data) {
        // $("#XZDW").append("<option value='" + data[0].xzqdm + "'>" + data[0].xzqdm + "</option>");
        loadSelectOptions($("#XZDW"), data);
      },
      error: function() {
        alert("完了");
      }
    });

    //查询图层
    $qSearchBtn.on('click', function() {

      // renderQueryResult(items_fake);
      // var data = {
      //   "page": 1,
      //   "pagesize": 10,
      //   "xzqdm": $('#XZDW').val(),
      //   "xmmc": $('#queryValXMMC').val(),
      //   "lszd": $('#queryValLSZD').val()
      // };

      $.ajax({
        url: "/omp/static/js/map/widgets/XMDZGL/xmxx.json",
        dataType: "json",
        type: 'GET',
        // url: "http://192.168.50.121:80/estateplat-cadastre/fwXmGl/queryFwXmJson",
        // data: data,
        // type: 'GET',
        // dataType: 'jsonp',
        // jsonp: "callback",
        success: function(r) {
          console.log(r);
          renderQueryResult(r);
          // showPageTool("pageTool", r[r.length - 1].total, data.page, data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest.status);
          console.log(textStatus);
        }
      });



    });
  }

  // 动态加载select的选项
  function loadSelectOptions($selector, data) {
    var options = [];
    // var responseData = data.data[0];
    var responseData = data;
    $.each(responseData, function(idx, obj) {
      // console.log(obj.xzqdm);
      options.push({
        xzqdm: obj.xzqdm
      });
    });

    var tpl = $("#XMDZGLConditionTpl").html();
    var rendered = RenderData(tpl, {
      condition: options
    });
    $selector.append(rendered);
  }

  function RenderData(tpl, data) {
    var tempelete = Handlebars.compile(tpl);
    return tempelete(data);
  }

  //渲染模板显示结果
  function renderQueryResult(items) {
    changeState(STATE_RESULT);

    var tpl = $("#XMDZGLResultTpl").html();
    $qResultPanel.empty();
    $qResultPanel.append(Mustache.render(tpl, {
      result: items,
      size: items.length
    }));
    var listDataRenderer = new ListDataRenderer({
      renderTo: $('#XMDZGLResultList'),
      type: "editAndDel",
      // map: map.map(),
      renderData: items
    });
    listDataRenderer.render();
    listDataRenderer.on('edit', function(item) {
      editItem(item);
      // console.log(item);
      // alert("edit!");
    });

    listDataRenderer.on('delete', function() {
      alert("delete!")
      // deleteItem(items);
    });
    // //返回查询界面
    // $("#XMDZGLReturnBtn").on('click', lang.hitch(this, changeState, STATE_QUERY));

    $("#XMDZGLAddBtn").on("click", function() {
      layer.open({
        type: 2,
        title: '新增项目',
        shadeClose: true,
        shade: 0.8,
        area: ['720px', '90%'],
        content: '/omp/static/js/map/widgets/XMDZGL/addItem.html' //iframe的url
      });
    });

    //返回查询界面
    $("#XMDZGLReturnBtn").on('click', function() {
      changeState(STATE_QUERY);
    });

  }

  // var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
  function editItem(data) {
    console.log(data);
    layer.open({
      type: 2,
      title: '新增项目',
      shadeClose: true,
      shade: 0.8,
      area: ['720px', '90%'],
      content: '/omp/static/js/map/widgets/XMDZGL/addItem.html?fw_xmmc_index=' + data.title, //iframe的url
      //父传子的关键是把通信放在success后面的回调里
      success: function() {
        // console.log(data.title);
        // var body = layer.getChildFrame('body', index);
        // var input_xmmc = body.contents().find('#XMXX_XMMC');
        // input_xmmc.val(data.title);
        // console.log(input_xmmc.val());
        // console.log(input_xmmc);

      },
      end: function(layero, index) {

      }
    });
  }

  function deleteItem() {

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
        // if (mapPopup.isShowing) mapPopup.closePopup();
        // _map.graphics.clear();
        break;
      case STATE_RESULT:
        $attrQueryPanel.hide();
        break;
    }
  }

  return query;
});
