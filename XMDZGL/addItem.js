var tpl, template, html, index;

$(document).ready(function() {

  $.ajax({
    // url: "http://192.168.50.121:80/estateplat-cadastre/fwXmGl/queryFwXmxx",
    // data: getQueryString("fw_xmmc_index"),
    // type: "GET",
    url: "single_xmxx.json",
    dataType: "json",
    success: function(result) {
      console.log(result);
      //用jquery获取模板
      tpl = $("#panelXMXXTpl").html();
      //预编译模板
      template = Handlebars.compile(tpl);

      html = template(result);
      //输入模板
      $(".panel-body").html(html);
    }
  });


});

$("#linkXMXX").on("click", function() {
  tpl = $("#panelXMXXTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
});

$("#linkDCXX").on("click", function() {
  tpl = $("#panelDCXXTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
});

$("#linkFCQLR").on("click", function() {
  tpl = $("#panelFCQLRTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
  $("#tb_FCQLR").bootstrapTable({
    striped: true,
    pagination: true, //启用分页
    pageCount: 10, //每页行数
    pageIndex: 0,
    url: 'qlrxx.json',
    columns: [{
      field: 'name',
      title: '权利人'
    }, {
      field: 'id',
      title: '权利人编号'
    }, {
      field: 'type',
      title: '权利人证件类型'
    }, {
      field: 'number',
      title: '权利人证件号'
    }]
  });
  // $("#tb_FCQLR").bootstrapTable('load', qlrxx);
});

$("#linkLJZLB").on("click", function() {
  tpl = $("#panelLJZLBTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
});

$("#linkPMT").on("click", function() {
  tpl = $("#panelPMTTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
});






//保存和关闭事件
$("#save").on("click", function() {


  // var data = {
  //   "xmmc": "",
  //   "zl": "",
  //   "fwlx": "",
  //   "fwxz": "",
  //   "dymj": "",
  //   "ftmj": "",
  //   "jyjg": "",
  //   "bz": ""
  // };
  // $.ajax({
  //   url: "?",
  //   data: data,
  //   type: "POST",
  //   success: function() {
  //     console.log("保存成功！");
  //   }
  // });
});


function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 点击关闭按钮
$("#close").on("click", function() {
  var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
  parent.layer.close(index); //执行关闭
});
