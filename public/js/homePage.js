const nameDom = document.querySelector(".header-right .username");
nameDom.innerText = window.localStorage.getItem("username");

const signOutDom = document.querySelector(".signOut");
signOutDom.addEventListener("click", function(){
	window.location.href="index2.html";
});

let content = document.querySelector("#main-content");
let liDom = document.querySelectorAll("#list-ops li");
let section1 = document.querySelector("#part1");
let section2 = document.querySelector("#part2");
let section3 = document.querySelector("#part3");
let bodyDom = document.querySelector("body");

for(let i=0;i<liDom.length;i++){
	liDom[i].addEventListener("click",function(){
		updateBack(i);
		if(i==0){
			section1.setAttribute("style","height: 100%;");
			section2.setAttribute("style","height: 0px;");
			section3.setAttribute("style","height: 0px;");
			updatePage();
		}else if(i==1){
			section1.setAttribute("style","height: 0px;");
			section2.setAttribute("style","height: 100%;");
			section3.setAttribute("style","height: 0px;");
		}else{
			section1.setAttribute("style","height: 0px;");
			section2.setAttribute("style","height: 0px;");
			section3.setAttribute("style","height: 100%;");
		}
	});
}

updatePage();
function updateBack(index){
	for(let i=0;i<liDom.length;i++){
		if(i==index){
			liDom[i].setAttribute("style","background: #222437;");
		}else{
			liDom[i].setAttribute("style","background: #0000;");
		}
	}
}
function updatePage(){
	const userNumDom = document.querySelector("#userNum");
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/userCount',
		dataType: 'json',
		success:function(data){
			userNumDom.innerText = data.msg;
		},
		error:function (e) {
	
		}
	});
	const dataGroupDom = document.querySelector("#dataGroupNum");
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/dataGroupCount',
		dataType: 'json',
		success:function(data){
			dataGroupDom.innerText = data.msg;
		},
		error:function (e) {
	
		}
	});
	
	const dataNumDom = document.querySelector("#dataNum");
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/dataCount',
		dataType: 'json',
		success:function(data){
			dataNumDom.innerText = data.msg;
		},
		error:function (e) {
	
		}
	});
	
	let graphDom = document.querySelector(".graph");
	let width = (graphDom.clientWidth-60)/2;
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/averageScore',
		success:function(data){
			var chartDom1 = document.getElementById('pie1');
			var myChart1 = echarts.init(chartDom1, 'dark');
			var option1;
			chartDom1.style.width = width;
			option1 = {
				title: {
					text: '患者训练平均评分',
					top: '3%',
					left: '3%'
				},
			    tooltip: {
			            trigger: 'axis',
						extraCssText:'width:110px;height:60px;background:#000;',
			            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			            }
			        },
					backgroundColor:  '#181827',
			        grid: {
			            left: '3%',
			            right: '4%',
			            bottom: '3%',
			            containLabel: true
			        },
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
			        xAxis: [
			            {
			                type: 'category',
			                data: data[0],
			                axisTick: {
			                    alignWithLabel: true
			                }
			            }
			        ],
			        yAxis: [
			            {
			                type: 'value'
			            }
			        ],
			        series: [
			            {
			                name: '平均评分',
			                type: 'bar',
			                barWidth: '60%',
			                data: data[1],
							itemStyle:{
								color: '#4c92ff'
							}
			            }
			        ]
			};
			
			option1 && myChart1.setOption(option1);
		},
		error:function (e) {
	
		}
	});
	
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/rate',
		dataType: 'json',
		success:function(data){
			var chartDom3 = document.getElementById('pie3');
			var myChart3 = echarts.init(chartDom3, 'dark');
			var option3;
			chartDom3.style.width = width;
			option3 = {
				title: {
					text: '传感器使用频率',
					top: '3%',
					left: '3%'
				},
			    tooltip: {
					trigger: 'axis'
				},
				backgroundColor:  '#181827',
				legend: {
					data: ['大臂传感器使用频率', '小臂传感器使用频率']
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: data[0]
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						formatter: '{value} 次'
					}
				},
				series: [
					{
						name: '传感器使用频率',
						type: 'line',
						data: data[1],
						itemStyle:{
							color: '#4c92ff'
						},
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						markLine: {
							data: [
								{type: 'average', name: '平均值'},
								
							]
						}
					}
				]
			};
			
			option3 && myChart3.setOption(option3);
		},
		error:function (e) {
	
		}
	});
	
	$.ajax({
		type: 'GET',
		url: 'http://101.132.125.83:8081/arm/weekRate',
		dataType: 'json',
		success:function(data){
			var chartDom4 = document.getElementById('pie4');
			var myChart4 = echarts.init(chartDom4, 'dark');
			var option4;
			chartDom4.style.width = width;
			option4 = {
			    title: {
			    	text: '患者近七天训练频率',
			    	top: '3%',
			    	left: '3%'
			    },
			    tooltip: {
			            trigger: 'axis',
			    		extraCssText:'width:110px;height:60px;background:#000;',
			            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			            }
			        },
			    	backgroundColor:  '#181827',
			        grid: {
			            left: '3%',
			            right: '4%',
			            bottom: '3%',
			            containLabel: true
			        },
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
			        xAxis: [
			            {
			                type: 'category',
			                data: data[0],
			                axisTick: {
			                    alignWithLabel: true
			                }
			            }
			        ],
			        yAxis: [
			            {
			                type: 'value',
							name: '次'
			            }
			        ],
			        series: [
			            {
			                name: '训练频率',
			                type: 'bar',
			                barWidth: '60%',
			                data: data[1],
			    			itemStyle:{
			    				color: '#4c92ff'
			    			}
			            }
			        ]
			};
			
			option4 && myChart4.setOption(option4);
		},
		error:function (e) {
	
		}
	});
}
