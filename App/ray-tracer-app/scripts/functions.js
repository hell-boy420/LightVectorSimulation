

import * as THREE from 'three';

/*
const pointer = new THREE.Vector2();

let boundSize=200
let yStep=5
let xStep=5

//Add A Sky Plane
const skyGeometry = new THREE.PlaneGeometry(boundSize,boundSize)
const skyMaterial= new THREE.MeshBasicMaterial({color:0x87CEEB,side:THREE.DoubleSide})
const skyPlane = new THREE.Mesh(skyGeometry,skyMaterial);
skyPlane.rotateX(Math.PI/2);
skyPlane.position.y=boundSize;
//z=200 100<x<100 100<y<100
let skyNormal=new THREE.Vector3(0,-1,0)

//Add A Mirror Plane
const mirrorGeometry = new THREE.BoxGeometry(50,50,0.1)
mirrorGeometry.rotateX(-Math.PI/1.1)
mirrorGeometry.translate(0,0,40)
const mirrorMaterial= new THREE.MeshBasicMaterial({color:0xFFFFFF,side:THREE.DoubleSide})
const mirrorPlane = new THREE.Mesh(mirrorGeometry,mirrorMaterial);

//Add second mirror
const mirrorGeometry2 = new THREE.BoxGeometry(50,50,0.1)
mirrorGeometry2.rotateX(-Math.PI/4)
mirrorGeometry2.translate(0,0,-40)
const mirrorMaterial2= new THREE.MeshBasicMaterial({color:0xFFFFFF,side:THREE.DoubleSide})
const mirrorPlane2 = new THREE.Mesh(mirrorGeometry2,mirrorMaterial2);


//Groups
const mirrors=new THREE.Group();
mirrors.add(mirrorPlane,mirrorPlane2)
const aBodies = new THREE.Group();
aBodies.add(boxBase,boxSide1,boxSide2,boxSide3,boxSide4)  
const interactable=new THREE.Group();
interactable.add(aBodies,mirrors);



for(let xp=-boundSize/2; xp<boundSize/2;xp+=xStep){
  for(let zp=-boundSize/2; zp<boundSize/2;zp+=yStep){
    let yp=boundSize;
    raycaster.set(new THREE.Vector3(xp,yp,zp),skyNormal);

    // calculate objects intersecting the picking ray
    
    interact(raycaster,0)

    
  }
}
*/


export function interact(raycaster,bounces,scene){
    
    let maxDistance=100;
    let intersect=raycaster.intersectObjects(interactable.children)
    console.log(intersect.length)
    //Check if ray hits interactable object
    
    if(intersect.length!=0){
      console.log("interact")
      intersect=intersect[0]
      //Check if object absorbs
      if(aBodies.children.includes( intersect.object)){
        if(bounces>0){
          absorb(raycaster)
        }
        
        bounces+=1
      
      //Else check if reflect
      }else if(mirrors.children.includes( intersect.object)){
          bounces+=1
          reflect(raycaster,bounces,scene)
        
      }
      }else{
        if(bounces!=-1){
          const ray = raycaster.ray;
          //Add an arrow to intersect
          scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, maxDistance, 0xFDB813 ,1,1) )
        }
    }
  }
  
export function reflect(raycaster,bounces,scene){
  
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
  
export  function absorb(raycaster,scene){
    let intersect=raycaster.intersectObjects(aBodies.children)
    if(intersect.length!=-1){
      intersect=intersect[0]
      const ray = raycaster.ray;
      scene.add(new THREE.ArrowHelper(ray.direction, ray.origin, intersect.distance, 0xF00000 ,1,1) )
  
    }
    
  }