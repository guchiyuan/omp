{
	"coordinateVisible":true,
	"createAt":"2017-11-15 10:17:20",
	"defaultRegionCode":"320000",
	"description":"This is the first template.",
	"dockWidgets":[
		{
			"config":{
				"expandLevel":1
			},
			"desc":"分类数据",
			"display":true,
			"icon":"glyphicon glyphicon-tasks",
			"id":"DataList",
			"label":"数据",
			"open":false,
			"url":"DataList",
			"weight":0
		},
		{
			"config":{
				"autoCreateProject":false,
				"exportXls":false,
				"identifyLayers":[],
				"modifyProVideo":false,
				"newProjectLayer":[],
				"panoramaSwitch":"off",
				"popupStyle":"layer",
				"proType":[
					{
						"color":"#ffb61e",
						"name":"建设用地"
					},
					{
						"color":"#00bc12",
						"name":"农用地"
					},
					{
						"color":"#ff2d51",
						"name":"未利用地"
					},
					{
						"color":"#000000",
						"name":"其他"
					}
				],
				"searchVideoByXy":false,
				"showArcCenter":false,
				"showStatus":false,
				"style":"list",
				"supervise":false,
				"txVersionEnable":false,
				"txtSymbol":{
					"color":"#32bfef",
					"fontSize":"12"
				}
			},
			"desc":"视频管理",
			"display":true,
			"icon":"glyphicon glyphicon-facetime-video",
			"id":"VideoManager",
			"label":"视频",
			"open":false,
			"url":"VideoManager",
			"weight":0
		}
	],
	"geometryService":{
		"url":"http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
	},
	"logo":"/omp/file/logo/维尼logo",
	"logoVisible":true,
	"map":{
		"baseLayers":[],
		"defaultScale":0,
		"initExtent":{
			"spatialReference":{
				"wkt":"PROJCS[\"Xian_1980_3_Degree_GK_CM_120E\",GEOGCS[\"GCS_Xian_1980\",DATUM[\"D_Xian_1980\",SPHEROID[\"Xian_1980\",6378140.0,298.257]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",500000.0],PARAMETER[\"False_Northing\",0.0],PARAMETER[\"Central_Meridian\",119.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]"
			},
			"xmax":516132.60124840005,
			"xmin":496289.4513229,
			"ymax":3727521.851378075,
			"ymin":3714719.819168075
		},
		"operationalLayers":[{
			"alias":"房屋",
			"alpha":1,
			"category":"1",
			"group":"015fbd38090c4028b2ff5fbd1f8d0019",
			"id":"015fbd6fa3b54028b2ff5fbd5f530002",
			"index":1,
			"name":"FW",
			"type":"dynamic",
			"url":"/oms/arcgisrest/1/FW/MapServer",
			"visible":true,
			"xMaxExtent":511494.552,
			"xMinExtent":497055.873,
			"xzdm":"320000",
			"yMaxExtent":3721757.416,
			"yMinExtent":3717380.672,
			"year":2017
		}]
	},
	"name":"test_1115",
	"title":"江苏省国土资源 一张图",
	"widgetContainer":{
		"widgets":[
			{
				"config":{
					"layers":[{
						"html":"",
						"layerIndex":"0",
						"layerName":"地籍子区",
						"layerUrl":"/oms/arcgisrest/1/DJZQ/MapServer/0",
						"link":{
							"tip":"",
							"url":""
						},
						"queryFields":{
							"fields":[{
								"alias":"地籍子区编号",
								"name":"DJZQBH",
								"type":"STRING"
							}],
							"prefix":"%"
						},
						"returnFields":[
							{
								"alias":"地籍子区名称",
								"name":"DJZQMC",
								"type":"STRING"
							},
							{
								"alias":"地籍子区编号",
								"name":"DJZQBH",
								"type":"STRING"
							}
						],
						"serviceId":"015fbd2252834028b2ff5fbd1f8d0002",
						"titleField":{
							"alias":"地籍子区编号",
							"name":"DJZQBH"
						},
						"type":"field"
					}],
					"merge":false
				},
				"display":true,
				"icon":"fa-search",
				"id":"f15fd717c4c24028b2ff5fd717c40001",
				"label":"测试_1120",
				"open":false,
				"url":"test_1120",
				"weight":0
			},
			{
				"config":{
					"layers":[{
						"layerIndex":"0",
						"layerName":"房屋",
						"layerUrl":"/oms/arcgisrest/1/FW/MapServer/0",
						"queryFields":{
							"fields":[{
								"alias":"房屋编号",
								"name":"FWBH",
								"type":"STRING"
							}],
							"prefix":"%"
						},
						"returnFields":[
						{
							"alias":"房屋编号",
							"name":"FWBH",
							"type":"STRING"
						},
						{
							"alias":"房屋层数",
							"name":"FWCS",
							"type":"INTEGER"
						}
						],
						"serviceId":"111222333",
						"titleField":{
							"alias":"房屋编号",
							"name":"FWBH",
							"type":"STRING"
						}
					}]
				},
				"display":true,
				"icon":"fa-search",
				"id":"f15fd773e4b44028b2ff5fd717c40002",
				"label":"房屋层数查询",
				"open":false,
				"url":"floor_query",
				"weight":0
			}
		],
		"widgetsGroup":[]
	},
	"widgets":[
		{
			"config":{
				"style":"normal"
			},
			"display":true,
			"id":"MenuBar",
			"open":false,
			"url":"MenuBar",
			"weight":0
		},
		{
			"display":true,
			"id":"Navigation",
			"open":false,
			"url":"Navigation",
			"weight":0
		},
		{
			"config":{
				"style":"default"
			},
			"display":true,
			"open":true,
			"url":"Scalebar",
			"weight":0
		},
		{
			"display":true,
			"id":"Region",
			"open":false,
			"url":"Region",
			"weight":0
		},
		{
			"config":{
				"layers":[]
			},
			"display":false,
			"icon":"fa-location",
			"id":"Location",
			"label":"定位",
			"open":false,
			"url":"Location",
			"weight":0
		}
	]
}
