/**
 * Main 
 */

//Global variables
var startPressed = false,
    resetPressed = false,
    rings = [], 
    oneRing,
    index = 0;

//GUI Menu --------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.projectileMass = 0.7;
    this.counterMass = 160;
    this.leverLength = 3;
    this.airResistance = 0.1;
    this.followProjectile = false;
    this.start = function() {startPressed = true; resetPressed = false;}
    this.reset = function() {resetPressed = true; startPressed = false; i = 0; index++;}   
}

var datGUI = new dat.GUI();
datGUI.domElement.id = 'gui';

datGUI.add(guiControls, "projectileMass", 0.6, 1);
datGUI.add(guiControls, "counterMass", 80, 200);  
datGUI.add(guiControls, "leverLength", 2,4);
datGUI.add(guiControls,"airResistance",0.09,0.15);
datGUI.add(guiControls, "followProjectile");
datGUI.add(guiControls,'start');
datGUI.add(guiControls,'reset');


//Create Scene -----------------------------------------------------------------------------------------
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf2f2f2, 1, 700);

//var canvas = document.getElementById('canvas'); 
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xb3e0ff,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

document.body.appendChild( renderer.domElement );

//Create Camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(15,15,10);

// Mouse Control
var controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.6;
controls.maxDistance = 100;

//Load external objects
loadObjects();

// Creating Geometries ----------------------------------------------------------------------------------
var map2 = THREE.ImageUtils.loadTexture('textures/desert.jpg');
var map5 = THREE.ImageUtils.loadTexture('textures/black_stone.jpg');

var geometry = new THREE.SphereGeometry( 0.7, 18, 18 ),
    material = new THREE.MeshPhongMaterial( { color: 0x333333 } ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

var leverGeometry = new THREE.BoxGeometry(1,0.5,1),
    leverMaterial = new THREE.MeshPhongMaterial({ map: map2, bumpMap: map2, bumpScale: 0.1 }),
    lever = new THREE.Mesh(leverGeometry, leverMaterial);

lever.position.set(4,6.2,1);
lever.rotation.z = Math.PI/3.5;
lever.castShadow = true;
scene.add(lever);

var counterWeightGeometry = new THREE.BoxGeometry(3,3,3), 
    counterWeightMaterial = new THREE.MeshPhongMaterial({  map: map5, bumpMap: map5, bumpScale: 1, specular: 0.1}),
    counterWeight = new THREE.Mesh(counterWeightGeometry,counterWeightMaterial);

counterWeight.position.set(8,8,1);
counterWeight.castShadow = true;
scene.add(counterWeight);

var cylinderGeometry = new THREE.CylinderGeometry(0.1,0.1,2.7),
    cylinderMaterial = new THREE.MeshPhongMaterial({  map: map2, bumpMap: map2, bumpScale: 0.5 }),
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

cylinder.position.set(8, 10, 1);
cylinder.castShadow = true;
scene.add(cylinder);

var planeGeometry = new THREE.PlaneGeometry(2000,2000);
    planeMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('textures/sand.jpg') }),
    plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -Math.PI/2;
plane.position.y = -2;
scene.add(plane);

//Initialize trees
initTrees();

//Creating ring
var ringGeometry = new THREE.TorusGeometry(3, 0.1, 10, 60);
var ringMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

for(let i = 0; i < 25; i++)
{
    oneRing = new THREE.Mesh( ringGeometry, ringMaterial );
    rings[i] = oneRing;
}

//Initialize lights
initLights();

//Camera will follow projectile		
camera.lookAt(projectile.position);

var i = 0;

render();

//Functions --------------------------------------------------------------------------------------------

//Render loop (including functions here are located in renderFunctions.js)
function render(){

    requestAnimationFrame(render);

    if(guiControls.followProjectile == false)
        camera.lookAt(projectile.position);
    else if(guiControls.followProjectile == true && startPressed == true)
        projectile.add(camera);


    //GUI Updates
    if(startPressed == false)
        updateGUI();

    if(resetPressed == true){
        projectile.position.set(0,2,1);
        lever.rotation.z = Math.PI/3.5;
        counterWeight.position.set(8,8,1);
        cylinder.position.set(8,10,1);   
        cylinder.add(camera);
        updateGUI();
    }
        
    if(startPressed == true)
        animate();

 	renderer.render(scene, camera);
}


