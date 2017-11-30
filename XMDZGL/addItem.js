var tpl, template, html, index;

$(document).ready(function() {

  // $.ajax({
  //   url: "http://192.168.50.121:80/estateplat-cadastre/fwXmGl/queryFwXmxx",
  //   data: getQueryString("fw_xmmc_index"),
  //   type: "GET",
  //   success: function(result) {
  //用jquery获取模板
  tpl = $("#panelXMXXTpl").html();
  //预编译模板
  template = Handlebars.compile(tpl);
  index = {
    "fw_xmmc_index": getQueryString("fw_xmmc_index"),
    "zl":"haha",
    "fwlx":"经济适用房"
  };
  html = template(index);
  //输入模板
  $(".panel-body").html(html);
  //   }
  // });


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
});

$("#linkFCQLR").on("click", function() {
  tpl = $("#panelLJZLBTpl").html();
  template = Handlebars.compile(tpl);
  html = template();
  $(".panel-body").html(html);
});

$("#linkFCQLR").on("click", function() {
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

$("#close").on("click", function() {
  var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
  parent.layer.close(index); //执行关闭
});
