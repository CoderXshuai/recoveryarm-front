const txtFile = document.querySelectorAll(".filer_input");
const fileName = document.querySelectorAll(".file-name");
const fileSize = document.querySelectorAll(".file-size");
const noFileDom = document.querySelectorAll(".no-file");
const haveFileDom = document.querySelectorAll(".have-file");
const tableDom = document.querySelector(".data-table");
const dataTipDom = document.querySelector(".data-tip");

const patientsUlDoms = document.querySelector("#patients");
$.ajax({
	type: 'GET',
	url: 'http://101.132.125.83:8081/arm/findAllUser',
	dataType: 'json',
	success:function(data){
		let patientList = ``;
		for(let i=0;i<data.length;i++){
			patientList = patientList + `<li data-id="${data[i].userId}">${data[i].username}</li>`;
		}
		patientsUlDoms.innerHTML = patientList;
		
		const liDoms = document.querySelectorAll("#patients li");
		const pDoms = document.querySelector(".select-user");
		const userDom = document.querySelector("#user");
		for(let i=0;i<liDoms.length;i++){
			liDoms[i].addEventListener("click", function(evt){
				userDom.value = liDoms[i].getAttribute("data-id");
				pDoms.innerText = liDoms[i].innerText;
			});
		}
	},
	error:function (e) {

	}
});

function noData(){
	let dh = `<tr>
							<td>角速度X(°/s)</td>
							<td>角速度Y(°/s)</td>
							<td>角速度Z(°/s)</td>
							<td>角度X(°)</td>
							<td>角度Y(°)</td>
							<td>角度Z(°)</td>
						</tr>
						<tr>
							<td rowspan="3" colspan="6" class="data-tip">暂无数据</td>
						</tr>`;
	tableDom.innerHTML = dh;
}


let txtStyle = false;
for(let i=0;i<txtFile.length;i++){
	txtFile[i].addEventListener("change", function(evt){
		let len = evt.target.files.length;
		if(len == 0){
			noFileDom[i].setAttribute("style", "display: block;");
			haveFileDom[i].setAttribute("style", "display: none;");
			noData();
		}else{
			fileName[i].innerText = evt.target.files[0].name;
			fileSize[i].innerText = ((evt.target.files[0].size)/1000).toFixed(1)+"KB";
			noFileDom[i].setAttribute("style", "display: none;");
			haveFileDom[i].setAttribute("style", "display: block;");
			if((evt.target.files[0].name).indexOf(".txt") != -1){
				try{
					let reader = new FileReader();
					// 新建 FileReader 对象
					reader.onload = function(){
						let txtArray = this.result.split("\n");
						
						let dataHTML = `<tr>
											<td>角速度X(°/s)</td>
											<td>角速度Y(°/s)</td>
											<td>角速度Z(°/s)</td>
											<td>角度X(°)</td>
											<td>角度Y(°)</td>
											<td>角度Z(°)</td>
										</tr>`;
						for(let i=1;i<txtArray.length-1;i++){
							let dataArr = txtArray[i].split('\t');
							if(dataArr.length != 20){
								txtStyle = false;
								dataTipDom.innerText = '警告！数据格式出错！';
								noData();
								alert("警告！数据格式出错！");
								return;
							}else{
								dataHTML = dataHTML + `<tr>
												<td>${dataArr[7]}</td>
												<td>${dataArr[8]}</td>
												<td>${dataArr[9]}</td>
												<td>${dataArr[10]}</td>
												<td>${dataArr[11]}</td>
												<td>${dataArr[12]}</td>
											</tr>`;
							}
						}
						tableDom.innerHTML = dataHTML;
						txtStyle = true;
					};
					reader.readAsText(evt.target.files[0]);
				}catch(e){
					txtStyle = false;
					dataTipDom.innerText = '出错了';
					noData();
					alert("出错了");
				}
			}else{
				txtStyle = false;
				noData();
				alert("请选择txt文本文件");
			}
		}
	});
}


const submitBtn = document.querySelector(".submit");
const maskDom = document.querySelector(".mask-info");
const tipDom = document.querySelector(".file-tip");
const loadDom = document.querySelector(".loading");
submitBtn.addEventListener("click", function(){
	uploadFile(txtStyle);
});
function uploadFile(txtStyle){
	if(txtStyle){
		let formData = new FormData();
		let userId = $("#user").val();
		if(userId == -1){
			alert("请选择数据对应的康复患者");
			return;
		}
		let file1 = $(".filer_input")[0].files[0];
		let file2 = $(".filer_input")[1].files[0];
		let file3 = $(".filer_input")[2].files[0];
		let file4 = $(".filer_input")[3].files[0];
		let file5 = $(".filer_input")[4].files[0];
		let file6 = $(".filer_input")[5].files[0];
		
		let form1 = new FormData();
		form1.append("file", file1);
		let form2 = new FormData();
		form2.append("file", file2);
		let form3 = new FormData();
		form3.append("file", file3);
		let form4 = new FormData();
		form4.append("file", file4);
		let form5 = new FormData();
		form5.append("file", file5);
		let form6 = new FormData();
		form6.append("file", file6);
		let scores = [];
		
		maskDom.setAttribute("style", "display: block;");
		tipDom.innerText = "数据评分中";
		//loadDom.setAttribute("style", "display: block;");
		
		$.ajax({
			type: 'POST',
			url: 'http://www.coderxshuai.xyz:8085/eva/xiongdaji',
			data: form1,
			contentType: false,
			processData: false,
			dataType: 'json',
			success:function(data){
				tipDom.innerText = "数据1评分完成";
				console.log(data);
				scores.push(data);
				$.ajax({
					type: 'POST',
					url: 'http://www.coderxshuai.xyz:8085/eva/gongertouji',
					data: form2,
					contentType: false,
					processData: false,
					dataType: 'json',
					success:function(data){
						tipDom.innerText = "数据2评分完成";
						console.log(data);
						scores.push(data);
						$.ajax({
							type: 'POST',
							url: 'http://www.coderxshuai.xyz:8085/eva/sanjiaoji',
							data: form3,
							contentType: false,
							processData: false,
							dataType: 'json',
							success:function(data){
								tipDom.innerText = "数据3评分完成";
								console.log(data);
								scores.push(data);
								$.ajax({
									type: 'POST',
									url: 'http://www.coderxshuai.xyz:8085/eva/gongsantouji',
									data: form4,
									contentType: false,
									processData: false,
									dataType: 'json',
									success:function(data){
										tipDom.innerText = "数据4评分完成";
										console.log(data);
										scores.push(data);
										
										$.ajax({
											type: 'POST',
											url: 'http://www.coderxshuai.xyz:8085/eva/sanjiaojihoushu',
											data: form5,
											contentType: false,
											processData: false,
											dataType: 'json',
											success:function(data){
												tipDom.innerText = "数据5评分完成";
												console.log(data);
												scores.push(data);
												$.ajax({
													type: 'POST',
													url: 'http://www.coderxshuai.xyz:8085/eva/beikuoji',
													data: form6,
													contentType: false,
													processData: false,
													dataType: 'json',
													success:function(data){
														tipDom.innerText = "数据6评分完成";
														console.log(data);
														scores.push(data);
														//保存数据
														
														
														//loadDom.setAttribute("style", "display: block;");
														
														formData.append('user', userId);
														formData.append('file1', file1);
														formData.append('file2', file2);
														formData.append('file3', file3);
														formData.append('file4', file4);
														formData.append('file5', file5);
														formData.append('file6', file6);
														formData.append("scores", scores);	
														
														maskDom.setAttribute("style", "display: block;");
														tipDom.innerText = "数据6评分完成，数据保存中";
													
														
														$.ajax({
															type: 'POST',
															url: 'http://101.132.125.83:8081/arm/upload',
															data: formData,
															contentType: false,
															processData: false,
															dataType: 'json',
															success:function(data){
																tipDom.innerText = "数据保存成功";
																//loadDom.setAttribute("style", "display: none;");
																setTimeout(function(){
																	maskDom.setAttribute("style", "display: none;");
																}, 2000);
															},
															error:function (e) {
														
															}
														});
														
													},
													error:function (e) {
														tipDom.innerText = "网络出错";
													}
												});
											},
											error:function (e) {
												tipDom.innerText = "网络出错";
											}
										});
									},
									error:function (e) {
										tipDom.innerText = "网络出错";
									}
								});
							},
							error:function (e) {
								tipDom.innerText = "网络出错";
							}
						});
					},
					error:function (e) {
						tipDom.innerText = "网络出错";
					}
				});
			},
			error:function (e) {
				tipDom.innerText = "网络出错";
			}
		});
		
		// maskDom.setAttribute("style", "display: block;");
		// tipDom.innerText = "数据保存中";
		// loadDom.setAttribute("style", "display: block;");
		
		// formData.append('user', userId);
		// formData.append('file1', file1);
		// formData.append('file2', file2);
		// formData.append('file3', file3);
		// formData.append('file4', file4);
		// formData.append('file5', file5);
		// formData.append('file6', file6);
		// formData.append("scores", [1,0,0,1,0,0]);	
		
		// $.ajax({
		// 	type: 'POST',
		// 	url: 'http://101.132.125.83:8081/arm/upload',
		// 	data: formData,
		// 	contentType: false,
		// 	processData: false,
		// 	dataType: 'json',
		// 	success:function(data){
		// 		tipDom.innerText = "数据上传评分成功";
		// 		loadDom.setAttribute("style", "display: none;");
		// 		setTimeout(function(){
		// 			maskDom.setAttribute("style", "display: none;");
		// 		}, 2000);
		// 	},
		// 	error:function (e) {
		
		// 	}
		// });
	}else{
		alert("请选择正确数据格式的txt文本文件");
		return;
	}
}