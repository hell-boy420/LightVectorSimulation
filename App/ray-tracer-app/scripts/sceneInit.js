import * as THREE from 'three';
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import Stats from 'three/examples/jsm/libs/stats.module';
import {CSS2DRenderer, CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import setupEnv from "./setupEnv";
const testingControls=true;

 //Groups
 let mirrors=new THREE.Group();
 let aBodies = new THREE.Group();
 let interactable=new THREE.Group();

export default class SceneInit {
  constructor(canvasID, camera, scene, stats, controls, renderer, fov = 36,composer, outlinePass) {
    this.fov = fov;
    this.scene = scene;
    this.stats = stats;
    this.camera = camera;
    this.controls = controls;
    this.renderer = renderer;
    this.canvasID = canvasID;
    this.raycaster=new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.composer=composer;
    this.outlinePass=outlinePass;
    this.interactableObjects=new THREE.Group();
    
  }
  
  async initScene() {
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );


    this.scene = new THREE.Scene();

    const canvas = document.getElementById(this.canvasID);
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.camera.position.setZ(30);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene,this.camera);

    this.stats = Stats();
    document.body.appendChild(this.stats.dom);
    
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.maxDistance = 200;
    this.camera.position.setZ(100)
    const pointer = new THREE.Vector2();
    
    let boundSize=200
    
    


    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

    window.addEventListener('pointermove', () => {
      this.pointer.x= ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      //console.log(this.pointer.x,this.pointer.y)
    }, false);


    window.addEventListener('click', () => {
    

    }, false);
    
    const s=new setupEnv();
    
    //Groups
    mirrors.add(s.addMirrors())
    aBodies.add(s.addAbsorbers())  
    aBodies=aBodies.children[0]
    mirrors=mirrors.children[0]
    interactable.add(aBodies,mirrors);
    
    //Add to Scene
    this.scene.add(s.addEvironment(),interactable);
    
    let yStep=5
    let xStep=5

    //Add A Sky Plane
    const skyGeometry = new THREE.PlaneGeometry(boundSize,boundSize)
    const skyMaterial= new THREE.MeshBasicMaterial({color:0x87CEEB,side:THREE.DoubleSide})
    const skyPlane = new THREE.Mesh(skyGeometry,skyMaterial);
    console.log(skyPlane)
    skyPlane.rotateX(Math.PI/2);
    skyPlane.position.y=boundSize;
    //z=200 100<x<100 100<y<100
    let skyNormal=new THREE.Vector3(0,-1,0)


    for(let xp=-boundSize/2; xp<boundSize/2;xp+=xStep){
        for(let zp=-boundSize/2; zp<boundSize/2;zp+=yStep){
          let yp=boundSize;
          this.raycaster.set(new THREE.Vector3(xp,yp,zp),skyNormal);
      
          // calculate objects intersecting the picking ray
          
          interact(this.raycaster,0,this.scene)
      
          
        }
      }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.controls.update();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.render(this.scene,this.camera);

  }
  


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.handleResize();
  }
}


function interact(raycaster,bounces,scene){

    let maxDistance=100;
    let intersect=raycaster.intersectObjects(interactable.children)

    //Check if ray hits interactable object
    if(intersect.length!=0){
      
      intersect=intersect[0]
      //Check if object absorbs

      if(aBodies.children.includes( intersect.object)){
        if(bounces>-1){
          absorb(raycaster,scene)
        }
        
        bounces+=1
      
      //Else check if reflect
      }else if(mirrors.children.includes( intersect.object)){
          bounces+=1
          reflect(raycaster,bounces,scene)
        
      }
      }else{
        if(bounces!=0){
          const ray = raycaster.ray;
          //Add an arrow to intersect
          scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, maxDistance, 0xFDB813 ,1,1) )
        }
    }
  }
  
  function reflect(raycaster,bounces,scene){
  
    let maxBounces=5;
      if(bounces<maxBounces){
      let intersect=raycaster.intersectObjects(mirrors.children)
  
      //If intersect with mirror
      if(intersect.length!=0){
        
        intersect=intersect[0]
        const ray = raycaster.ray;
        //Add an arrow to intersect
        scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, intersect.distance, 0xFDB813 ,1,1) )
  
        //Check bounce
        raycaster.set(intersect.point.add(intersect.normal),intersect.normal);
        interact(raycaster,bounces,scene)
      }
    }
    
  }
  
  function absorb(raycaster,scene){
    let intersect=raycaster.intersectObjects(aBodies.children)
    
    if(intersect.length!=0){
        
      intersect=intersect[0]
      const ray = raycaster.ray;
      if(intersect.normal.y==1){
        scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, intersect.distance, 0x00FF00 ,1,1) )
      }else{
         scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, intersect.distance, 0xF00000 ,1,1) )
        }
    }
    
  }
  