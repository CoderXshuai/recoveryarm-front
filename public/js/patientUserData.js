// 重写方法，自定义格式化日期
Date.prototype.toLocaleString = function() {
    // 补0   例如 2018/7/10 14:7:2  补完后为 2018/07/10 14:07:02
    function addZero(num) {
        if(num<10)
            return "0" + num;
        return num;
    }
    // 按自定义拼接格式返回
    return this.getFullYear() + "/" + addZero(this.getMonth() + 1) + "/" + addZero(this.getDate()) + " " +
        addZero(this.getHours()) + ":" + addZero(this.getMinutes()) + ":" + addZero(this.getSeconds());
};

let uid = window.sessionStorage.getItem("userId");
let uname = window.localStorage.getItem("username");
$.ajax({
	type: 'POST',
	url: 'http://101.132.125.83:8081/arm/userScoreAllGroup',
	data: {userId: uid},
	dataType: 'json',
	success:function(data){
		if(typeof(uid) != 'undefined' && uid != null){
			updateTable(data, uid, uname);
		}
	},
	error:function (e) {

	}
});

function updateTable(data, uid, uname){
	const userDataTableDom = document.querySelector(".table-data");
	let userDataPieDom = document.getElementById('pie-user');
	let userDataLinearDom = document.getElementsByClassName('linear-user');
	let tableContent = ``;
	let muscle = ['胸大肌','肱二头肌','三角肌','肱三头肌','三角肌后束','背阔肌'];
	let dos = ['前平举','小臂前平举','屈臂上举','后摆','侧平举','直举过头顶'];
	if(data.length == 0){
		tableContent = tableContent + `<tr>
						<td>动作编号</td>
						<td>用户名称</td>
						<td>训练时间</td>
						<td>训练动作</td>
						<td>训练肌群</td>
						<td>训练评分</td>
						<td>操作</td>
					</tr>
					<tr>
								<td rowspan="3" colspan="5" class="data-tip">暂无数据</td>
							</tr>`;
		userDataTableDom.innerHTML = tableContent;
		userDataPieDom.setAttribute("style","display: none;");
		for(let ui =0;ui < userDataLinearDom.length;ui++){
			userDataLinearDom[ui].setAttribute("style", "display: none;");
		}
	}else{
		for(let j=0;j<data.length;j++){
			let ts = 0;
			for(let m=0;m<data[j].length;m++){
				ts = ts + data[j][m].score;
			}
			tableContent = tableContent + `<tr>
			<td colspan="6" style="text-align:left;">动作组${j+1}，总评分为${ts}</td>
			</tr>
			<tr>
								<td>动作编号</td>
								<td>用户名称</td>
								<td>训练时间</td>
								<td>训练动作</td>
								<td>训练肌群</td>
								<td>训练评分</td>
								<td>操作</td>
							</tr>`;
			for(let k=0;k<data[j].length;k++){
				tableContent = tableContent + `<tr data-group="${data[j][k].modeGroup}" data-id="${uid}" data-score="${data[j][k].score}" data-index="${data[j][k].doIndex}">
								<td>${data[j][k].modeGroup}</td>
								<td>${uname}</td>
								<td>${(new Date(data[j][k].time)).toLocaleString()}</td>
								<td>${dos[k]}</td>
								<td>${muscle[k]}</td>
								<td>${data[j][k].score}</td>
								<td><img src="./images/play.svg"/></td>
							</tr>`;
			}
		}
		tableContent = tableContent + ``;
		userDataTableDom.innerHTML = tableContent;
		
		userDataTableDom.addEventListener("click", function(evt){
			let tagName = event.target.tagName;
			if (tagName === 'IMG') {
				let tr = event.target.parentNode.parentNode;
				let mGroup = tr.getAttribute('data-group');
				let mId = tr.getAttribute('data-id');
				let mScore = tr.getAttribute('data-score');
				let mIndex = tr.getAttribute('data-index');
				window.localStorage.setItem("mId", mId);
				window.localStorage.setItem("score", mScore);
				window.localStorage.setItem("modeGroup", mGroup);
				window.localStorage.setItem('doIndex', mIndex);
				window.location.href="show.html";
			}
		});
		userDataPieDom.setAttribute("style","display: block;");
		for(let ui =0;ui < userDataLinearDom.length;ui++){
			userDataLinearDom[ui].setAttribute("style", "display: block;");
		}
		updateGraph(uid);
	}
}

function updateGraph(uid){
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userTotalScore',
		data: {userId: uid},
		dataType: 'json',
		success:function(data){
			let xData = [];
			let cData = [];
			for(let i=0;i<data.length;i++){
				let d = {};
				d.name = i;
				d.value = data[i].score;
				cData.push(d);
				xData.push((i+1));
			}
			var userDataPieDom = document.getElementById('pie-user');
			var userDataPie = echarts.init(userDataPieDom, 'dark');
			var userDataPieOption;
			userDataPieOption = {
				title: {
					text: '康复动作总评分折线图',
				},
				tooltip: {
				    trigger: 'axis',
					formatter: function(data) {
						return "第"+data[0].name+"次训练<br/>动作总评分："+data[0].value+"分";
					}
				},
				backgroundColor:  '#181827',
				grid: {
					left: '3%',
					right: '10%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					name: '次数',
				    type: 'category',
				    data: xData,
				},
				yAxis: {
					name: '总评分',
				    type: 'value'
				},
				series: [{
				    data: cData,
				    type: 'line'
				}]
			};
			
			userDataPieOption && userDataPie.setOption(userDataPieOption);
		},
		error:function (e) {
	
		}
	});
	
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 0},
		dataType: 'json',
		success:function(cdata){
			var do0Dom = document.getElementById('do0');
			showChangeGraph(cdata, do0Dom, '前平举康复趋势图');
		},
		error:function (e) {
	
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 1},
		dataType: 'json',
		success:function(cdata){
			var do1Dom = document.getElementById('do1');
			showChangeGraph(cdata, do1Dom, '上勾拳康复趋势图');
		},
		error:function (e) {
	
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 2},
		dataType: 'json',
		success:function(cdata){
			var do2Dom = document.getElementById('do2');
			showChangeGraph(cdata, do2Dom, '小臂前平举康复趋势图');
		},
		error:function (e) {
	
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 3},
		dataType: 'json',
		success:function(cdata){
			var do3Dom = document.getElementById('do3');
			showChangeGraph(cdata, do3Dom, '举过头顶康复趋势图');
		},
		error:function (e) {
	
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 4},
		dataType: 'json',
		success:function(cdata){
			var do4Dom = document.getElementById('do4');
			showChangeGraph(cdata, do4Dom, '后举康复趋势图');
		},
		error:function (e) {
	
		}
	});
	$.ajax({
		type: 'POST',
		url: 'http://101.132.125.83:8081/arm/userScoreByIndex',
		data: {userId: uid, doIndex: 5},
		dataType: 'json',
		success:function(cdata){
			var do5Dom = document.getElementById('do5');
			showChangeGraph(cdata, do5Dom, '侧平举康复趋势图');
		},
		error:function (e) {
	
		}
	});
}

function showChangeGraph(cdata, doDom, title){
	let aData = [];
	let bData = [];
	for(let i=0;i<cdata.length;i++){
		aData.push((i+1)+'');
		bData.push(cdata[i].score);
	}
	
	var userDataLinear = echarts.init(doDom, 'dark');
	var userDataLinearOption;
	
	userDataLinearOption = {
		title: {
			text: title
		},
	    tooltip: {
	        trigger: 'axis',
			formatter: function(data) {
				return "第"+data[0].name+"次训练<br/>动作评分："+data[0].value+"分";
			}
	    },
		backgroundColor:  '#181827',
	    xAxis: {
			name: '次数',
	        type: 'category',
	        data: aData,
	    },
	    yAxis: {
			name: '评分',
	        type: 'value',
			min: 0,
			max: 4
	    },
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: {
			left: '3%',
			right: '10%',
			bottom: '3%',
			containLabel: true
		},
	    series: [{
	        data: bData,
	        type: 'line'
	    }]
	};
	
	userDataLinearOption && userDataLinear.setOption(userDataLinearOption);
}