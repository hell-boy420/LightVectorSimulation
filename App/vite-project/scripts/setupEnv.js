import * as THREE from 'three';

export default class setupEnv{
    constructor(){
        this.eObjects = new THREE.Group();
        this.aObjects = new THREE.Group();
        this.rObjects=new THREE.Group();
        this.boundSize=200;
    }

    addEvironment(){
        let compassRose=new THREE.Group();
        compassRose.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,-1), new THREE.Vector3(0,0,0), 10, 0xF00000 ,5,1),new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 10, 0xFFF000 ,5,1),new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 10, 0x0FFF0F ,5,1),new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(0,0,0), 10, 0x00F0F0 ,5,1))
        compassRose.translateY(-9);
        compassRose.translateZ(40);
        //North z=-1 , South Z=1, East X=1, West X=-1

        //Add Grid Helper
        const gridHelper=new THREE.GridHelper(this.boundSize,50);
        gridHelper.position.set(0,-10,0);

        //Add Lights
        const pointLight = new THREE.PointLight( 0xffffff, 100, 100 );
        pointLight.position.set( 0, -5, 0 );
        const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
        const light = new THREE.AmbientLight( 0x404040,4 ); // soft white light

        this.eObjects.add(gridHelper,pointLight,pointLightHelper,light, compassRose);

        return this.eObjects
    }

    addAbsorbers(){ 
        //Create Carboard Box
        const carboardMaterial= new THREE.MeshStandardMaterial({color:0xB0916E ,side:THREE.DoubleSide})

        const boxBaseGeometry = new THREE.BoxGeometry(21,24,0.1) 
        const boxSide1Geometry = new THREE.BoxGeometry(21,20,0.1)
        const boxSide2Geometry = new THREE.BoxGeometry(24,20,0.1)
        const boxSide3Geometry = new THREE.BoxGeometry(21,20,0.1)
        const boxSide4Geometry = new THREE.BoxGeometry(24,20,0.1)

        boxBaseGeometry.rotateX(Math.PI/2)
        boxSide2Geometry.rotateY(Math.PI/2)
        boxSide4Geometry.rotateY(Math.PI/2)

        boxBaseGeometry.translate(0,-10,0)
        boxSide1Geometry.translate(0,0,-24/2)
        boxSide2Geometry.translate(-21/2,0,0)
        boxSide3Geometry.translate(0,0,24/2)
        boxSide4Geometry.translate(21/2,0,0)
        const boxBase = new THREE.Mesh(boxBaseGeometry,carboardMaterial);
        const boxSide1 = new THREE.Mesh(boxSide1Geometry,carboardMaterial);
        const boxSide2 = new THREE.Mesh(boxSide2Geometry,carboardMaterial);
        const boxSide3 = new THREE.Mesh(boxSide3Geometry,carboardMaterial);
        const boxSide4 = new THREE.Mesh(boxSide4Geometry,carboardMaterial);

        this.aObjects.add(boxBase,boxSide1,boxSide2,boxSide4);

        return this.aObjects
    }

    addMirrors(){
        const mirrorMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF,side:THREE.DoubleSide})

        const mirror1Geometry=new THREE.BoxGeometry(21/2,24,0.1)
        const mirror1=new THREE.Mesh(mirror1Geometry,mirrorMaterial)
        mirror1Geometry.rotateX(Math.PI/2)
        
        const pivotGeometry = new THREE.SphereGeometry( 2, 32, 16 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
        const sphere = new THREE.Mesh( pivotGeometry, material ); 
        sphere.position.set(21/2+1,10,0)
        
        mirror1Geometry.translate(21/4-1,0,0)
        sphere.add(mirror1)
        
        sphere.rotateZ(Math.PI/4)
        this.rObjects.add(sphere)

        return this.rObjects

    }
}