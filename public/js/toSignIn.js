let whetherSign = window.sessionStorage.getItem("sign");
if(whetherSign == null || whetherSign == undefined){
	window.sessionStorage.setItem("sign", true);
	window.location.href="index2.html";
}