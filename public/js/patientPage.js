const nameDom = document.querySelector(".header-right .username");
nameDom.innerText = window.localStorage.getItem("username");

let content = document.querySelector("#main-content");
let liDom = document.querySelectorAll("#list-ops li");
let section2 = document.querySelector("#part2");
let section3 = document.querySelector("#part3");

for(let i=0;i<liDom.length;i++){
	liDom[i].addEventListener("click",function(){
		updateBack(i);
		if(i==0){
			section2.setAttribute("style","height: 100%;");
			section3.setAttribute("style","height: 0px;");
		}else{
			section2.setAttribute("style","height: 0px;");
			section3.setAttribute("style","height: 100%;");
		}
	});
}

function updateBack(index){
	for(let i=0;i<liDom.length;i++){
		if(i==index){
			liDom[i].setAttribute("style","background: #222437;");
		}else{
			liDom[i].setAttribute("style","background: #0000;");
		}
	}
}