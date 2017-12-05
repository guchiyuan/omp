var tpl, template, html, index;

$(document).ready(function() {

  $.ajax({
    // url: "http://192.168.50.121:80/estateplat-cadastre/fwXmGl/queryFwXmxx",
    // data: getQueryString("fw_xmmc_index"),
    // type: "GET",
    url: "single_xmxx.json",
    dataType: "json",
    success: function(result) {
      // console.log(result);
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
    // data: ["name:王二小"],
    striped: true,
    toolbar: "#toolbar",
    pagination: true, //启用分页
    pageSize: 5, //每页行数
    pageIndex: 0,
    // url: 'qlrxx.json',
    columns: [{
        field: "qlr",
        title: "权利人"
      }, {
        field: "qlrbh",
        title: "权利人编号"
      }, {
        field: "qlrzjlx",
        title: "权利人证件类型"
      }, {
        field: "qlrzjh",
        title: "权利人证件号"
      },
      {
        field: "id",
        title: "操作",
        align: "center",
        formatter: operateFormatter
      }
    ]
  });
  // $("#tb_FCQLR").bootstrapTable('load', qlrxx);

  function operateFormatter(value, row, index) {
    var e = '<a href="#" mce_href="#" onclick="editQLRXX(\'' + row.qlrbh + '\')">编辑</a> ';
    var d = '<a href="#" mce_href="#" onclick="deleteQLRXX(\'' + row.qlrbh + '\')">删除</a> ';
    return e + d;
  }

  $.ajax({
    url: "/omp/static/js/map/widgets/XMDZGL/qlrxx.json",
    dataType: "json",
    success: function(data) {
      $("#tb_FCQLR").bootstrapTable('load', data);
    }
  });
});

function addQLRXX() {
  layer.msg("新增权利人");
}

function editQLRXX(index) {
  console.log(index);
}

function deleteQLRXX(ids) {
  $("#tb_FCQLR").bootstrapTable('remove', {
    field: 'qlrbh',
    values: [ids]
  });
}

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
