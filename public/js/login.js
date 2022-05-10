const reDom=document.querySelector(".re");
const siDom=document.querySelector(".si");

const signForm=document.querySelector(".signIn");
const registerForm=document.querySelector(".register");

const passwordCheck = document.querySelectorAll(".register .password");
const tipDom = document.querySelector(".register .tip");
const emailRegisterCheck = document.querySelector(".register .email");
const registerButtonDom = document.querySelector(".register button");

const signinButtonDom = document.querySelector(".signIn button");

const usernameCheck = document.querySelectorAll(".name");

let form=window.localStorage.getItem('form');
if(form!=""){
	if(form == 'register'){
		signForm.setAttribute("style", "display:none;");
		registerForm.setAttribute("style", "display:block;");
	}else if(form == 'signIn'){
		signForm.setAttribute("style", "display:block;");
		registerForm.setAttribute("style", "display:none;");
	}
}

let retip=tipDom.children[0].innerHTML;
if(retip=='success'){
	signForm.setAttribute("style", "display:block;");
	registerForm.setAttribute("style", "display:none;");
}

reDom.addEventListener("click",function(){
	signForm.setAttribute("style", "display:none;");
	registerForm.setAttribute("style", "display:block;");
});
siDom.addEventListener("click",function(){
	signForm.setAttribute("style", "display:block;");
	registerForm.setAttribute("style", "display:none;");
});

registerButtonDom.addEventListener("click",function(){
	window.localStorage.setItem('form','register');
});
signinButtonDom.addEventListener("click",function(){
	window.localStorage.setItem('form','signIn');
});

for(let i=0;i<usernameCheck.length;i++){
	usernameCheck[i].addEventListener("change",function(){
		let oldname=usernameCheck[i].value;
		let newname=usernameCheck[i].value.replace(/\s+/g,"");
		usernameCheck[i].value=newname;
		if(oldname.length != newname.length){
			alert("用户昵称不能包括空格");
		}
	});
}

passwordCheck[1].addEventListener("input",function(){
	if(passwordCheck[1].value == passwordCheck[0].value){
		tipDom.innerHTML="";
		passwordCheck[1].setAttribute("style", "border: 1px solid #aaaaaa;");
		registerButtonDom.setAttribute("style", "background:#3487ff;");
		registerButtonDom.disabled=false;
	}else{
		tipDom.innerHTML="密码与确认密码不同";
		passwordCheck[1].setAttribute("style", "border: 1px solid #ff0000;");
		passwordCheck[1].focus();
		registerButtonDom.setAttribute("style", "background:#8db4ec;");
		registerButtonDom.disabled=true;
	}
});

const userSignInBtn = document.querySelector("#user-signIn");
const signInTipDom = document.querySelector(".signIn .tip");
userSignInBtn.addEventListener("click", function(){
	let formData = new FormData();
	let username = $("#username").val();
	let password = $("#password").val();
	if(username != null && username.length > 0 && password != null && password.length > 0){
		formData.append("username", username);
		formData.append("password", password);
		$.ajax({
			type: 'POST',
			url: 'http://101.132.125.83:8081/arm/signIn',
			data: formData,
			contentType: false,
			processData: false,
			dataType: 'json',
			success:function(data){
				if(data.success){
					if(data.admin == 1){
						window.localStorage.setItem("username", username);
						window.location.href="homePage.html";
					}else{
						//跳转到普通用户视图
						window.sessionStorage.setItem("userId", data.userId);
						window.localStorage.setItem("username", username);
						window.location.href="patientPage.html";
					}
				}else{
					signInTipDom.innerText = data.msg;
				}
			},
			error:function (e) {
				signInTipDom.innerText = "发送请求失败";
			}
		});
	}else{
		signInTipDom.innerText = "用户名和密码不能为空";
	}
});
const userRegisterBtn = document.querySelector("#user-register");
const registerTipDom = document.querySelector(".register .tip");
userRegisterBtn.addEventListener("click", function(){
	let formData = new FormData();
	let username = $("#register-username").val();
	let password = $("#register-password").val();
	let surePwd = $("#register-sure-password").val();
	if(username != null && username.length > 0 && password != null && password.length > 0){
		formData.append("username", username);
		formData.append("password", password);
		formData.append("note", "");
		$.ajax({
			type: 'POST',
			url: 'http://101.132.125.83:8081/arm/register',
			data: formData,
			contentType: false,
			processData: false,
			dataType: 'json',
			success:function(data){
				if(data.success){
					signForm.setAttribute("style", "display:block;");
					registerForm.setAttribute("style", "display:none;");
					signInTipDom.innerText = "注册成功";
				}else{
					registerTipDom.innerText = data.msg;
				}
			},
			error:function (e) {
				registerTipDom.innerText = "发送请求失败";
			}
		});
	}else{
		registerTipDom.innerText = "用户名和密码不能为空";
	}
});