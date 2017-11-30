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
  var query = declare([BaseWidget], {
    constructor: function() {},

    onCreate: function() {
      _map = this.getMap().map();
      _queryConfig = this.getConfig();
      _init();
    },
    onPause: function() {
      if (mapPopup.isShowing) mapPopup.closePopup();
      _map.graphics.clear();

    },
    onDestroy: function() {
      if (mapPopup.isShowing) mapPopup.closePopup();

    }
  });

  var drawTool, drawHandler;

  var STATE_QUERY = "query";
  var STATE_RESULT = "result";

  //设置属性识别后信息弹出窗的样式
  var POPUP_OPTION_INFO = "infoWindow";
  var POPUP_OPTION_MODAL = "modal";

  //默认是infowindow样式
  var popUpStyle = POPUP_OPTION_INFO;

  var $attrQueryPanel, $qResultPanel, $qSearchBtn, $lyrSelector;
  var _currentState = STATE_QUERY;

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

    // //从数据库表里获取行政单位，作为option添加到行政单位的select里
    // $.ajax({
    //   async: false,
    //   url: "http://192.168.50.121:80/estateplat-cadastre/bdcdy/getXzqdm",
    //   dataType: 'jsonp',
    //   jsonp: "callback",
    //   success: function(data) {
    //     $("#XZDW").append("<option value='" + data[0].xzqdm + "'>" + data[0].xzqdm + "</option>");
    //   }
    // });

    //查询图层
    $qSearchBtn.on('click', function() {
      changeState(STATE_RESULT);

      //测试数据
      var items_fake = [{
          "title": "玩具城",
          "subtitle": "你大爷"
        },
        {
          "title": "渔具城",
          "subtitle": "你二爷"
        },
        {
          "title": "家具城",
          "subtitle": "你小爷"
        }
      ];

      renderQueryResult(items_fake);


      // var data = {
      //   "page": 1,
      //   "pagesize": 10,
      //   "xzqdm": $('#XZDW').val(),
      //   "xmmc": $('#queryValXMMC').val(),
      //   "lszd": $('#queryValLSZD').val()
      // };
      //
      // $.ajax({
      //   url: "http://192.168.50.121:80/estateplat-cadastre/fwXmGl/queryFwXmJson",
      //   data: data,
      //   type: 'GET',
      //   dataType: 'jsonp',
      //   jsonp: "callback",
      //   success: function(r) {
      //     renderQueryResult(r);
      //     showPageTool("pageTool", r[r.length - 1].total, data.page, data);
      //   },
      //   error: function(XMLHttpRequest, textStatus, errorThrown) {
      //     console.log(XMLHttpRequest.status);
      //     console.log(textStatus);
      //   }
      // });


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

    });
  }


  //渲染模板显示结果
  function renderQueryResult(items_fake) {

    var tpl = $("#XMDZGLResultTpl").html();
    $qResultPanel.empty();
    $qResultPanel.append(Mustache.render(tpl, {
      result: items_fake,
      size: items_fake.length
    }));
    var listDataRenderer = new ListDataRenderer({
      renderTo: $('#XMDZGLResult'),
      type: "editAndDel",
      map: map.map(),
      renderData: items_fake
    });
    listDataRenderer.render();
    listDataRenderer.on('edit', function(items_fake) {
      editItem(items_fake);
      // alert("edit!");
    });

    listDataRenderer.on('delete', function(items_fake) {
      deleteItem(items_fake);
      // alert("delete!")
    });

  }

  // var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
  function editItem() {
    layer.open({
      type: 2,
      title: '新增项目',
      shadeClose: true,
      shade: 0.8,
      area: ['720px', '90%'],
      content: '/omp/static/js/map/widgets/XMDZGL/addItem.html', //iframe的url
      //父传子的关键是把通信放在success后面的回调里
      success: function(layero, index) {
        // var items = window.parent.$("#XMDZGLSearchBtn").items_fake;
        var items = [{
            "title": "玩具城",
            "subtitle": "你大爷"
          },
          {
            "title": "渔具城",
            "subtitle": "你二爷"
          },
          {
            "title": "家具城",
            "subtitle": "你小爷"
          },
          {
            "title": "家具城",
            "subtitle": "你小爷"
          },
          {
            "title": "家具城",
            "subtitle": "你小爷"
          }
        ];

        console.log(items);
        // console.log(layero, index);
        var body = layer.getChildFrame('body', index);
        var inputList = body.find('input');
        // console.log(inputList);
        for (var j = 0; j < inputList.length; j++) {
          $(inputList[j]).val(items[j].title);
        }
      }
    });
  }

  function deleteItem(items) {

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
        if (mapPopup.isShowing) mapPopup.closePopup();
        _map.graphics.clear();
        break;
      case STATE_RESULT:
        $attrQueryPanel.hide();
        break;
    }
  }



  return query;
});
