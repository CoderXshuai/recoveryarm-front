<template>
  <div ref="box" id="box">
  </div>
  <div id="loading"></div>
</template>

<script>
  import * as THREE from "./three/three.module";
  import Stats from "./three/stats.module";
  import {OrbitControls} from "./three/OrbitControls";
  import {ConvexGeometry} from "./three/ConvexGeometry";
  import {GUI} from "./three/dat.gui.module";
  // import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
  var gui, scene, camera, renderer, controls, lights, mesh, bones, skeletonHelper, clock;
  var bone1, bone2, bone3, bone4, bone5, bone6, bone7, bone8, bone9, bone10, bone11, bone12, bone13, bone14, bone15;
  var mixer = [], action = [], options = {timeScale: 1, showHelper: false, run: false};
  
  let xhr = new XMLHttpRequest();
  let data;
  let count;
  let interval;
  let interval2;
  let xtData = new Array();
  let xbData = new Array();
  let ytData = new Array();
  let ybData = new Array();
  let ztData = new Array();
  let zbData = new Array();
  let totalTime = 0.0;
  
  export default {
    name: "bone2",
    methods: {
      initScene() {
        gui = new GUI();

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x444444);

        //scene.add(new THREE.AxesHelper(12))
        scene.add(new THREE.GridHelper(200, 100));

        camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2 - 20)/(window.innerWidth / 2 - 100), 0.1, 1000);
        camera.position.set(70, 30, 0)

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth / 2 - 20, window.innerWidth / 2 - 100);
        this.$refs.box.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        clock = new THREE.Clock();
        controls.target = new THREE.Vector3(0, 10, 0);
        camera.lookAt(new THREE.Vector3(0, 10, 0));
        // controls.enableZoom = false;

        lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 100, 0);
        lights[1].position.set(100, 100, 100);
        lights[2].position.set(-100, -100, -100);

        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);

        this.initBones();
      },
      initBones() {
        let head = new THREE.SphereGeometry(3, 60, 40);
        let eye_l = new THREE.BoxGeometry(2, 1, 1);
        let eye_r = new THREE.BoxGeometry(2, 1, 1);
        let mouth = new THREE.BoxGeometry(2, 0.4, 1);
        head.merge(eye_l, new THREE.Matrix4().makeTranslation(2, 1, 1))
        head.merge(eye_r, new THREE.Matrix4().makeTranslation(2, 1, -1))
        head.merge(mouth, new THREE.Matrix4().makeTranslation(2, -1, 0))

        let body = new THREE.BoxGeometry(5, 10, 8, 10, 20, 4);
        let leg_l = new THREE.CylinderGeometry(2, 2, 14, 8, 14);
        let leg_r = new THREE.CylinderGeometry(2, 2, 14, 8, 14);
        let arm_l = new THREE.CylinderGeometry(1, 1, 12, 8, 11);
        let arm_r = new THREE.CylinderGeometry(1, 1, 12, 8, 11);
        let human = body.clone();

        human.merge(head, new THREE.Matrix4().makeTranslation(0, 8, 0));
        human.merge(leg_l, new THREE.Matrix4().makeTranslation(0, -12, 2.1));
        human.merge(leg_r, new THREE.Matrix4().makeTranslation(0, -12, -2.1));
        human.merge(arm_l, new THREE.Matrix4().makeTranslation(0, -1, 5.3));
        human.merge(arm_r, new THREE.Matrix4().makeTranslation(0, -1, -5.3));

        human = new THREE.BufferGeometry().fromGeometry(human);

        // let material = new THREE.MeshNormalMaterial({wireframe: true});
        // scene.add(new THREE.Mesh(human, material));

        var skinIndices = [];
        var skinWeights = [];
        let position = human.attributes.position;
        var vertex = new THREE.Vector3();

        for (let i = 0; i < position.count; i++) {
          vertex.fromBufferAttribute(position, i);
          if (vertex.z > 4.3 && vertex.y >= 0) {
            skinIndices.push(9, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.z < -4.3 && vertex.y >= 0) {
            skinIndices.push(10, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.z > 4.3 && vertex.y < 0) {
            skinIndices.push(11, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.z < -4.3 && vertex.y < 0) {
            skinIndices.push(12, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.y <= 5 && vertex.y >= -5) {
            let w = (vertex.y + 5) / 10;
            skinIndices.push(0, 2, 0, 0);
            skinWeights.push(Math.sqrt(w), 1 - Math.sqrt(w), 0, 0);
          } else if (vertex.y > 5) {
            skinIndices.push(1, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.y < -5 && vertex.y >= -12 && vertex.z > 0) {
            skinIndices.push(3, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.y < -12 && vertex.z > 0) {
            skinIndices.push(5, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else if (vertex.y < -5 && vertex.y >= -12 && vertex.z < 0) {
            skinIndices.push(4, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          } else {
            skinIndices.push(6, 0, 0, 0);
            skinWeights.push(1, 0, 0, 0);
          }
        }

        human.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
        human.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

        let bones = [];
        bone1 = new THREE.Bone(); //胸
        bone1.position.y = 5;
        bone2 = new THREE.Bone(); //头
        bone2.position.y = 3;
        bone3 = new THREE.Bone(); //尾椎
        bone3.position.y = -10;


        bone4 = new THREE.Bone(); //左腿上
        bone4.position.y = -0.1;
        bone4.position.z = 2.1;
        bone5 = new THREE.Bone(); //右腿上
        bone5.position.y = -0.1;
        bone5.position.z = -2.1;
        bone6 = new THREE.Bone(); //左腿中
        bone6.position.y = -7;
        bone7 = new THREE.Bone(); //右腿中
        bone7.position.y = -7;
        bone8 = new THREE.Bone(); //左腿下
        bone8.position.y = -7;
        bone9 = new THREE.Bone(); //右腿下
        bone9.position.y = -7;

        bone10 = new THREE.Bone(); //左臂上
        bone10.position.z = 5.3;
        bone11 = new THREE.Bone(); //右臂上
        bone11.position.z = -5.3;
        bone12 = new THREE.Bone(); //左臂中
        bone12.position.y = -6;
        bone13 = new THREE.Bone(); //右臂中
        bone13.position.y = -6;
        bone14 = new THREE.Bone(); //左臂下
        bone14.position.y = -6;
        bone15 = new THREE.Bone(); //右臂下
        bone15.position.y = -6;

        bone1.add(bone2);

        bone1.add(bone3);
        bone3.add(bone4);
        bone3.add(bone5);
        bone4.add(bone6);
        bone5.add(bone7);
        bone6.add(bone8);
        bone7.add(bone9);

        bone1.add(bone10)
        bone1.add(bone11)
        bone10.add(bone12)
        bone11.add(bone13)
        bone12.add(bone14)
        bone13.add(bone15)

        bones.push(bone1);
        bones.push(bone2);
        bones.push(bone3);
        bones.push(bone4);
        bones.push(bone5);
        bones.push(bone6);
        bones.push(bone7);
        bones.push(bone8);
        bones.push(bone9);
        bones.push(bone10);
        bones.push(bone11);
        bones.push(bone12);
        bones.push(bone13);
        bones.push(bone14);
        bones.push(bone15);

        let material = new THREE.MeshPhongMaterial({
          skinning: true,
          color: 0x156289,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          flatShading: true,
          // wireframe: true,
        })

        mesh = new THREE.SkinnedMesh(human, material);
        let skeleton = new THREE.Skeleton(bones);

        mesh.add(bones[0]);
        mesh.bind(skeleton);
        mesh.position.y = 19;

        skeletonHelper = new THREE.SkeletonHelper(mesh);
        skeletonHelper.material.linewidth = 1;
        scene.add(skeletonHelper);
        skeletonHelper.visible = false;

        scene.add(mesh);

		let obj = this;
		xhr.onload = function() {
			data = JSON.parse(xhr.responseText);
			count = data.length;
			for(let i=0;i<count;i++){
				xtData.push(data[i].txa);
				xbData.push(data[i].bxa);
				ytData.push(data[i].tya);
				ybData.push(data[i].bya);
				ztData.push(data[i].tza);
				zbData.push(data[i].bza);
			}
			totalTime = (data[data.length-1].msec - data[0].msec)/1000;
			
			obj.createAnimation();
			obj.setupDatGui();
			
		}
		let groupId = window.localStorage.getItem("modeGroup");
		xhr.open('get','http://101.132.125.83:8081/arm/data/'+groupId);
		xhr.send();
		
      },
      createAnimation() {
		
        let temp = new THREE.Mesh(new THREE.BoxGeometry(1), new THREE.MeshBasicMaterial());
        let q1 = this.getQuater(0, 0, -Math.PI / 4)//0, 0, -45
        let q2 = this.getQuater(0, 0, Math.PI / 3)//0, 0, 60
        let q3 = this.getQuater(0, 0, -Math.PI / 2)//0, 0, -90
        let q4 = this.getQuater(0, 0, 0)//0, 0, 0
        let q5 = this.getQuater(0, 0, Math.PI / 4)//0, 0, 45
        let q6 = this.getQuater(0, 0, Math.PI / 3)//0, 0, 60
        let q7 = this.getQuater(0, Math.PI / 4, Math.PI / 12)//0, 45, 15
        let q8 = this.getQuater(0, 0, -Math.PI / 6)//0, 0, -30
        let q9 = this.getQuater(0, -Math.PI / 4, Math.PI / 12)//0, -45, 15
        let q10 = this.getQuater(0, Math.PI / 12, 0)//0, 15, 0
        let q11 = this.getQuater(0, -Math.PI / 12, 0)//0, -15, 0
		
		let tArray = new Array();
		let bArray = new Array();
		let uid = window.localStorage.getItem("mId");
		let doIndex = window.localStorage.getItem("doIndex");
		let gradient = 56/80;
		if(uid == 2){
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 6, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, 0, 0);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 6, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
		}else if(uid == 3){
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 4, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, 0, 0);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 4, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
		}else if(uid == 4){
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, 0, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, 0, 0);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, 0, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
		}else if(uid == 5){
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 3, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, 0, 0);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 3, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
		}else if(uid == 8){
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 2, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 2, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, -Math.PI / 2, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
			
		}else{
			if(doIndex == 3){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, 0, -((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}else if(doIndex == 4){
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, 0, 0);
					bArray[i] = this.getQuater(0, 0, 0);
				}
			}else{
				for(let i=0;i<count;i++){
					tArray[i] = this.getQuater(0, 0, ((data[i].tya-data[0].tya) / 180) * Math.PI);
					bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tya-data[0].tya)) / 180) * Math.PI);
				}
			}
		}
		function calDelta(x, y){
			if(x*y < 0){
				if(x<0 && y>0){
					return -(x+180+y);
				}else{
					return 180-x+180+y;
				}
			}else{
				return x-y;
			}
		}
		// for(let i=0;i<count;i++){
		// 	// tArray[i] = this.getQuater((data[i].tza / 180) * Math.PI, (-data[i].txa / 180) * Math.PI, ((-data[i].tya+90) / 180) * Math.PI);
		// 	// bArray[i] = this.getQuater(0, 0, (-(data[i].bya+90) / 180) * Math.PI);
		// 	// tArray[i] = this.getQuater(0, 0, ((data[i].tza-90) / 180) * Math.PI);
		// 	//bArray[i] = this.getQuater(0, 0, ((data[i].bza-180) / 180) * Math.PI);
			
		// 	// tArray[i] = this.getQuater(((data[i].txa-45)/2 / 180) * Math.PI, ((data[i].tya+45)/2 / 180) * Math.PI, ((data[i].tza-90)/2 / 180) * Math.PI);
		// 	// bArray[i] = this.getQuater(0, 0, ((data[i].bza-90) / 180) * Math.PI);
			
		// 	//tArray[i] = this.getQuater(-((data[i].tya-data[0].tya) / 180) * Math.PI, -((data[i].txa-data[0].txa) / 180) * Math.PI, ((data[i].tza-data[0].tza) / 180) * Math.PI);
		// 	tArray[i] = this.getQuater(0, -Math.PI / 6, ((data[i].tya-data[0].tya) / 180) * Math.PI);
		// 	bArray[i] = this.getQuater(0, 0, ((data[i].bya-data[0].bya - (data[i].tza-data[0].tza)) / 180) * Math.PI);
		// }
		let txyz = new Array();
		let bxyz = new Array();
		for(let i=0;i<count;i++){
			txyz.push(tArray[i].x, tArray[i].y, tArray[i].z, tArray[i].w);
			bxyz.push(bArray[i].x, bArray[i].y, bArray[i].z, bArray[i].w);
		}
		let period = new Array();
		let start = data[0].msec;
		for(let i=0;i<count;i++){
			period[i] = (data[i].msec - data[0].msec) / 1000;
		}
		
		let arm_l_t = new THREE.KeyframeTrack('temp.quaternion', period, txyz);
		let arm_l_b = new THREE.KeyframeTrack('temp.quaternion', period, bxyz);
		

        //let leg_l_t = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q2.x, q2.y, q2.z, q2.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]);
        //let leg_r_t = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q1.x, q1.y, q1.z, q1.w]);
        //let leg_l_b = new THREE.KeyframeTrack('temp.quaternion', [0, 1.2, 2, 3.2, 4], [q4.x, q4.y, q4.z, q4.w, q3.x, q3.y, q3.z, q3.w, q4.x, q4.y, q4.z, q4.w, q3.x, q3.y, q3.z, q3.w, q4.x, q4.y, q4.z, q4.w]);
        //let leg_r_b = new THREE.KeyframeTrack('temp.quaternion', [0, 1.2, 2, 3.2, 4], [q4.x, q4.y, q4.z, q4.w, q3.x, q3.y, q3.z, q3.w, q4.x, q4.y, q4.z, q4.w, q3.x, q3.y, q3.z, q3.w, q4.x, q4.y, q4.z, q4.w]);
        
		//let arm_l_t = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q1.x, q1.y, q1.z, q1.w, q5.x, q5.y, q5.z, q5.w, q1.x, q1.y, q1.z, q1.w]);
        //let arm_r_t = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q5.x, q5.y, q5.z, q5.w, q1.x, q1.y, q1.z, q1.w, q5.x, q5.y, q5.z, q5.w]);
        //let arm_l_b = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q4.x, q4.y, q4.z, q4.w, q6.x, q6.y, q6.z, q6.w, q4.x, q4.y, q4.z, q4.w]);
        //let arm_r_b = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q6.x, q6.y, q6.z, q6.w, q4.x, q4.y, q4.z, q4.w, q6.x, q6.y, q6.z, q6.w]);
        
		//let head = new THREE.KeyframeTrack('temp.quaternion', [0, 1, 2, 3, 4], [q7.x, q7.y, q7.z, q7.w, q8.x, q8.y, q8.z, q8.w, q9.x, q9.y, q9.z, q9.w, q8.x, q8.y, q8.z, q8.w, q7.x, q7.y, q7.z, q7.w]);
        //let body = new THREE.KeyframeTrack('temp.quaternion', [0, 2, 4], [q10.x, q10.y, q10.z, q10.w, q11.x, q11.y, q11.z, q11.w, q10.x, q10.y, q10.z, q10.w]);

        let duration = period[period.length];

        //let clip_leg_l_t = new THREE.AnimationClip("default", duration, [leg_l_t]);
        //let clip_leg_r_t = new THREE.AnimationClip("default", duration, [leg_r_t]);
        //let clip_leg_l_b = new THREE.AnimationClip("default", duration, [leg_l_b]);
        //let clip_leg_r_b = new THREE.AnimationClip("default", duration, [leg_r_b]);
        let clip_arm_l_t = new THREE.AnimationClip("default", duration, [arm_l_t]);
        //let clip_arm_r_t = new THREE.AnimationClip("default", duration, [arm_r_t]);
        let clip_arm_l_b = new THREE.AnimationClip("default", duration, [arm_l_b]);
        //let clip_arm_r_b = new THREE.AnimationClip("default", duration, [arm_r_b]);
        //let clip_head = new THREE.AnimationClip("default", duration, [head]);
        //let clip_body = new THREE.AnimationClip("default", duration, [body]);

        mixer[0] = new THREE.AnimationMixer(bone4);
        mixer[1] = new THREE.AnimationMixer(bone5);
        mixer[2] = new THREE.AnimationMixer(bone6);
        mixer[3] = new THREE.AnimationMixer(bone7);
        mixer[4] = new THREE.AnimationMixer(bone10);
        mixer[5] = new THREE.AnimationMixer(bone11);
        mixer[6] = new THREE.AnimationMixer(bone12);
        mixer[7] = new THREE.AnimationMixer(bone13);
        mixer[8] = new THREE.AnimationMixer(bone2);
        mixer[9] = new THREE.AnimationMixer(bone3);

        //action[0] = mixer[0].clipAction(clip_leg_l_t);
        //action[1] = mixer[1].clipAction(clip_leg_r_t);
        //action[2] = mixer[2].clipAction(clip_leg_l_b);
        //action[3] = mixer[3].clipAction(clip_leg_r_b);
        action[4] = mixer[4].clipAction(clip_arm_l_t);
        //action[5] = mixer[5].clipAction(clip_arm_r_t);
        action[6] = mixer[6].clipAction(clip_arm_l_b);
        //action[7] = mixer[7].clipAction(clip_arm_r_b);
        //action[8] = mixer[8].clipAction(clip_head);
        //action[9] = mixer[9].clipAction(clip_body);

        action.forEach(d => {
          d.timeScale = 1
        }); 

        this.render();
        document.getElementById("loading").style.display = "none";
      },
      getQuater(x, y, z) {
        return new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
      },
      setupDatGui() {
        var bones = mesh.skeleton.bones;
		
        gui.add(options, 'run').onChange(e => {
          if (e) {
            action.forEach(d => d.play());
			gui.close();
			updateGraph();
          } else {
            action.forEach(d => d.stop());
			clearInterval(interval);
          }
        })
        gui.add(options, 'timeScale', 1, 3).onChange(e => action.forEach(d => {
          d.timeScale = e
        }))
        gui.add(options, 'showHelper').onChange(e => {
          skeletonHelper.visible = e
        })
        gui.add(mesh, "pose");

        gui.add(bones[0].rotation, 'y', bones[0].rotation.y - Math.PI / 4, bones[0].rotation.y + Math.PI / 4);
        gui.add(bones[0].rotation, 'z', bones[0].rotation.z - Math.PI / 2, bones[0].rotation.z);
        gui.add(bones[0].position, 'y', bones[0].position.y - 21.5, bones[0].position.y);

        gui.add(bones[1].rotation, 'y', bones[1].rotation.y - Math.PI / 4, bones[1].rotation.y + Math.PI / 4);
        gui.add(bones[1].rotation, 'z', bones[1].rotation.z - Math.PI / 6, bones[1].rotation.z + Math.PI / 6);

        gui.add(bones[2].rotation, 'y', bones[2].rotation.y - Math.PI / 6, bones[2].rotation.y + Math.PI / 6);

        gui.add(bones[3].rotation, 'z', bones[3].rotation.z - Math.PI / 3, bones[3].rotation.z + Math.PI / 3);
        gui.add(bones[4].rotation, 'z', bones[4].rotation.z - Math.PI / 3, bones[4].rotation.z + Math.PI / 3);
        gui.add(bones[5].rotation, 'z', bones[5].rotation.z - Math.PI / 3, bones[5].rotation.z);
        gui.add(bones[6].rotation, 'z', bones[6].rotation.z - Math.PI / 3, bones[6].rotation.z);

        gui.add(bones[9].rotation, 'x', bones[9].rotation.x - Math.PI, bones[9].rotation.x);
        gui.add(bones[9].rotation, 'y', bones[9].rotation.y - Math.PI / 2, bones[9].rotation.y + Math.PI / 4);
		gui.add(bones[9].rotation, 'z', bones[9].rotation.z - Math.PI / 3, bones[9].rotation.z + Math.PI);

        gui.add(bones[10].rotation, 'x', bones[10].rotation.x, bones[10].rotation.x + Math.PI);
        gui.add(bones[10].rotation, 'y', bones[10].rotation.y - Math.PI / 4, bones[10].rotation.y + Math.PI / 2);
        gui.add(bones[10].rotation, 'z', bones[10].rotation.z - Math.PI / 3, bones[10].rotation.z + Math.PI);

        gui.add(bones[11].rotation, 'z', bones[11].rotation.z, bones[11].rotation.z + Math.PI / 4 * 3);
        gui.add(bones[12].rotation, 'z', bones[12].rotation.z, bones[12].rotation.z + Math.PI / 4 * 3);

        gui.__controllers[0].name("运动");
        gui.__controllers[1].name("速度");
        gui.__controllers[2].name("显示骨架");
        gui.__controllers[3].name("重置身体");
        gui.__controllers[4].name("身体-旋转");
        gui.__controllers[5].name("身体-前趴");
        gui.__controllers[6].name("身体-下移");

        gui.__controllers[7].name("头-左右转");
        gui.__controllers[8].name("头-上下转");

        gui.__controllers[9].name("腰-扭动");

        gui.__controllers[10].name("左大腿");
        gui.__controllers[11].name("右大腿");
        gui.__controllers[12].name("左小腿");
        gui.__controllers[13].name("右小腿");

        gui.__controllers[14].name("左大臂-侧平举");
        gui.__controllers[15].name("左大臂-内旋");
        gui.__controllers[16].name("左大臂-前平举");

        gui.__controllers[17].name("右大臂-侧平举");
        gui.__controllers[18].name("右大臂-内旋");
        gui.__controllers[19].name("右大臂-前平举");

        gui.__controllers[20].name("左小臂");
        gui.__controllers[21].name("右小臂");
		
		gui.close();
		
		function updateGraph(){
			
			const score = document.querySelector(".score");
			const ti = document.querySelector(".exer_time");
			
			const xChartDom = document.getElementById('xAngle');
			let xChart = echarts.init(xChartDom, 'dark');
			const yChartDom = document.getElementById('yAngle');
			let yChart = echarts.init(yChartDom, 'dark');
			const zChartDom = document.getElementById('zAngle');
			let zChart = echarts.init(zChartDom, 'dark');
			
			let xttemp = new Array();
			let xbtemp = new Array();
			let yttemp = new Array();
			let ybtemp = new Array();
			let zttemp = new Array();
			let zbtemp = new Array();
			let timePeriod = new Array();
			let index = 0;
			interval = setInterval(function(){
				
				if(timePeriod.length < 20){
					xttemp.push(xtData[index]);
					xbtemp.push(xbData[index]);
					yttemp.push(ytData[index]);
					ybtemp.push(ybData[index]);
					zttemp.push(ztData[index]);
					zbtemp.push(zbData[index]);
					timePeriod.push((index*0.1).toFixed(1)+'');
					//console.log(xttemp);
				}else{
					xttemp.shift();
					xbtemp.shift();
					yttemp.shift();
					ybtemp.shift();
					zttemp.shift();
					zbtemp.shift();
					timePeriod.shift();
					
					xttemp.push(xtData[index]);
					xbtemp.push(xbData[index]);
					yttemp.push(ytData[index]);
					ybtemp.push(ybData[index]);
					zttemp.push(ztData[index]);
					zbtemp.push(zbData[index]);
					timePeriod.push((index*0.1).toFixed(1)+'');
				}
				
				let xOption = {
				    tooltip: {
				        trigger: 'axis'
				    },
					backgroundColor: '',
				    legend: {
				        data: ['大臂', '小臂']
				    },
				    grid: {
				        left: '3%',
				        right: '8%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
				        type: 'category',
				        name: '时间(s)',
				        boundaryGap: false,
				        data: timePeriod
				    },
				    yAxis: {
				        type: 'value',
				        name: '角度(°)',
						show: false
				    },
				    series: [
				        {
				            name: '大臂',
				            type: 'line',
				            stack: '总量',
				            data: xttemp
				        },
				        {
				            name: '小臂',
				            type: 'line',
				            stack: '总量',
				            data: xbtemp
				        },
				    ]
				};
				xOption && xChart.setOption(xOption);
				
				let yOption = {
				    tooltip: {
				        trigger: 'axis'
				    },
					backgroundColor: '',
				    legend: {
				        data: ['大臂', '小臂']
				    },
				    grid: {
				        left: '3%',
				        right: '8%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
				        type: 'category',
				        name: '时间(s)',
				        boundaryGap: false,
				        data: timePeriod
				    },
				    yAxis: {
				        type: 'value',
				        name: '角度(°)',
						show: false
				    },
				    series: [
				        {
				            name: '大臂',
				            type: 'line',
				            stack: '总量',
				            data: yttemp
				        },
				        {
				            name: '小臂',
				            type: 'line',
				            stack: '总量',
				            data: ybtemp
				        },
				    ]
				};
				yOption && yChart.setOption(yOption);
				
				let zOption = {
				    tooltip: {
				        trigger: 'axis'
				    },
					backgroundColor: '',
				    legend: {
				        data: ['大臂', '小臂']
				    },
				    grid: {
				        left: '3%',
				        right: '8%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: {
				        type: 'category',
				        name: '时间(s)',
				        boundaryGap: false,
				        data: timePeriod
				    },
				    yAxis: {
				        type: 'value',
				        name: '角度(°)',
						show: false
				    },
				    series: [
				        {
				            name: '大臂',
				            type: 'line',
				            stack: '总量',
				            data: zttemp
				        },
				        {
				            name: '小臂',
				            type: 'line',
				            stack: '总量',
				            data: zbtemp
				        },
				    ]
				};
				zOption && zChart.setOption(zOption);
				ti.innerText = (index*0.1).toFixed(1)+'s';
			
				if(typeof(xtData[index]) == 'undefined'){
					score.innerText = window.localStorage.getItem("score");
					action.forEach(d => d.stop());
					clearInterval(interval);
				}
				index++;
			}, 100);
		}
      },
      render() {
        let clk = clock.getDelta();
        mixer.forEach(d => d.update(clk));
        renderer.render(scene, camera);
        this.globalID = requestAnimationFrame(this.render);
      }
    },
    mounted() {
      this.initScene();
      window.onresize = () => {
        camera.aspect =
            this.$refs.box.clientWidth / this.$refs.box.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
            this.$refs.box.clientWidth,
            this.$refs.box.clientHeight
        );
      };
    },
    beforeDestroy() {
      renderer.forceContextLoss();
      renderer = null;
      gui = null;
      scene = null;
      camera = null;
      controls = null;
      lights = null;
      mesh = null;
      bones = null;
      skeletonHelper = null;
      cancelAnimationFrame(this.globalID);
      document
          .getElementsByClassName("ac")[0]
          .removeChild(document.getElementsByClassName("main")[0]);
    },
	
  };
</script>

<style lang="less" scope>
  #box {

  }
</style>
