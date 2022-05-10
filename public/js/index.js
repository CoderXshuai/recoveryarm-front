/*1. 引入echarts  `dist/echarts.min.js`
2. 准备一个具备大小的DOM容器
<div id="main" style="width: 600px;height:400px;"></div>
3.  初始化echarts实例对象
4. 指定配置项和数据(option)
5. 将配置项设置给echarts实例对象
*/
//角度 折线图
(function() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("line1"));
  
        // 模拟数据开始
        // 每秒更新数据，图标共显示60s数据，所以要第一次渲染初始化60条数据
        var data = [];
        var now = +new Date();
        var oneDay = 1000;
        function randomData() {
            now = new Date(+now + oneDay);
            value = Math.random() * 90;
            var valueName=now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() +' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
            /*var valueName = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() +
                ' ' + (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + ':' +
                (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
                ':' + (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());原判断时间*/
            return {
                name: now.toString(),//当前时间转换为 字符串
                value: [
                    valueName,
                    Math.round(value*100)/100//取整
                ]
            }
        }
        var value = Math.random() * 1000;
        for (var i = 0; i < 60; i++) {
            data.push(randomData());
        }
        // 模拟数据完毕

        // 使用定时器每秒更新数据
        setInterval(function() {
            //模拟获取数据异步请求，模拟数据更新
            let item = randomData()
            if (data.length < 60) {
                data.push(item);
            } else {
                data.shift();
                data.push(item);
            }

            // 更新数据后push进data数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];//鼠标移动显示
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                grid: {//定义上下左右距离
                    left:30,
                    right:10,
                    height:180,
                    bottom:40

                },
                xAxis: {
                    axisLabel:{
                      rotate:'30',
                      formatter:'{m}-{s}'
                    },
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show:false
                    }
                },
                series: [{
                    name: '模拟数据',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data
                }]
            };
            // 更新echarts图表
            myChart.setOption(option, true);
        }, 1000);
})();
//加速度 折线图
(function() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("line2"));
  
        // 模拟数据开始
        // 每秒更新数据，图标共显示60s数据，所以要第一次渲染初始化60条数据
        var data = [];
        var now = +new Date();
        var oneDay = 1000;
        function randomData() {
            now = new Date(+now + oneDay);
            value = Math.random() * 5;
            var valueName=now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() +' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
            /*var valueName = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() +
                ' ' + (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + ':' +
                (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
                ':' + (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());原判断时间*/
            return {
                name: now.toString(),//当前时间转换为 字符串
                value: [
                    valueName,
                    Math.round(value * 100)/100//取整
                ]
            }
        }
        var value = Math.random() * 1000;
        for (var i = 0; i < 60; i++) {
            data.push(randomData());
        }
        // 模拟数据完毕

        // 使用定时器每秒更新数据
        setInterval(function() {
            //模拟获取数据异步请求，模拟数据更新
            let item = randomData()
            if (data.length < 60) {
                data.push(item);
            } else {
                data.shift();
                data.push(item);
            }

            // 更新数据后push进data数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];//鼠标移动显示
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                grid: {//定义上下左右距离
                    left:30,
                    right:10,
                    height:180,
                    bottom:40

                },
                xAxis: {
                    axisLabel:{
                     rotate:'30',
                     formatter:'{m}-{s}'
                    },
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show:false
                    }
                },
                series: [{
                    name: '模拟数据',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data
                }]
            };
            // 更新echarts图表
            myChart.setOption(option, true);
        }, 1000);
})();

// 点位分布统计模块
(function() {
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".pie1  .chart"));
    // 2. 指定配置项和数据
    var option = {
      legend: {
        top: "90%",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12"
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
	  legend: {
		show: false
	  },
      // 注意颜色写的位置
      color: [
        "#006cff",
        "#60cda0",
        "#ed8884",
        "#ff9f7f",
        "#0096ff",
        "#9fe6b8",
        "#1d9dff"
      ],
      series: [
        {
          name: "点位统计",
          type: "pie",
          // 如果radius是百分比则必须加引号
          radius: ["10%", "70%"],
          center: ["50%", "42%"],
          roseType: "radius",
          data: [
            { value: 20, name: "第1次" },
            { value: 26, name: "第2次" },
            { value: 24, name: "第3次" },
            { value: 25, name: "第4次" },
            { value: 20, name: "第5次" },
            { value: 25, name: "第6次" },
            { value: 30, name: "第7次" },
          ],
          // 修饰饼形图文字相关的样式 label对象
          label: {
            fontSize: 10,
            color:'#fff'
          },
          // 修饰引导线样式
          labelLine: {
            // 连接到图形的线长度
            length: 10,
            // 连接到文字的线长度
            length2: 10
          }
        }
      ]
    };
  
    // 3. 配置项和数据给我们的实例化对象
    myChart.setOption(option);
    // 4. 当我们浏览器缩放的时候，图表也等比例缩放
    window.addEventListener("resize", function() {
      // 让我们的图表调用 resize这个方法
      myChart.resize();
    });
  })();
  
//本周评分柱状图
(function(){
    // 实例化对象
    var myChart =echarts.init(document.getElementById("bar2"));
    // 指定配置和数据
    var option = {
        color:['#2f89cf'],
        grid: {
            left: "0%",
            top: "10px",
            right: "0%",
            bottom: "20px",
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['第1次', '第2次', '第3次', '第4次', '第5次', '第6次', '第7次'],
            axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                textStyle: {
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12"
                }
              },
              axisLine: {
                show: false
              }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                  color: "rgba(255,255,255,.6)",
                  fontSize: "12"
                }
              },
            axisLine: {
                lineStyle: {
                  color: "rgba(255,255,255,0.1)"
                  // width: 1,
                  // type: "solid"
                }
             },
            splitLine: {
                lineStyle: {
                  color: "rgba(255,255,255,.1)"
                }
             }
        },
        series: [{
            name:"近七次评测得分",
            data: [30, 40, 30, 40, 50, 40, 30],
            type: 'bar',
            barWidth:"35%",
            itemStyle: {
                borderRadius:5
                //borderRadius: [5, 5, 0, 0] //（顺时针左上，右上，右下，左下）
            }//改变四角的矩形曲边
        }]
    };
    myChart.setOption(option);
})();
