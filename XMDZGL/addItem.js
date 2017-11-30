var tpl, template, html;

$(document).ready(function() {
  //用jquery获取模板
  tpl = $("#panelXMXXTpl").html();
  //预编译模板
  template = Handlebars.compile(tpl);
  html = template();
  //输入模板
  $(".panel-body").html(html);
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
  var data = {
    "xmmc": "",
    "zl": "",
    "fwlx": "",
    "fwxz": "",
    "dymj": "",
    "ftmj": "",
    "jyjg": "",
    "bz": ""
  };
  $.ajax({
    url: "?",
    data: data,
    type: "POST",
    success: function() {
      console.log("保存成功！");
    }
  });
});

var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引

$("#close").on("click", function() {
  parent.layer.close(index); //执行关闭
});
