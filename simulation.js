//Global variables
var startPressed = false;
var resetPressed = false;
var rings = [];
var oneRing;
var index = 0;

//Initialize GUI ---------------------------------------------------------------------------------------
var guiControls = new function(){
    this.projectileMass = 1;
    this.counterMass = 120;
    this.leverLength = 14;
    this.airResistance = 0.1;
    this.start = function() {startPressed = true; resetPressed = false;}
    this.reset = function() {resetPressed = true; startPressed = false; i = 0; index++;}   
}

var datGUI = new dat.GUI();
datGUI.domElement.id = 'gui';

datGUI.add(guiControls, "projectileMass", 0.8, 1.5);
datGUI.add(guiControls, "counterMass", 80, 200);  
datGUI.add(guiControls, "leverLength", 12, 18);
datGUI.add(guiControls,"airResistance",0.09,0.15);
datGUI.add(guiControls,'start');
datGUI.add(guiControls,'reset');


//Create Scene -----------------------------------------------------------------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(15,10,15);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xb3e0ff,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

// Mouse Control
var controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.2;

//Load external objects
loadObjects();

// Creating Geometries --------------------------------------------------------------------------------
var geometry = new THREE.SphereGeometry( 0.7, 10,10 ),
    material = new THREE.MeshLambertMaterial( { color: 0x333333} ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

var map2 = THREE.ImageUtils.loadTexture('textures/desert.jpg');

var leverGeometry = new THREE.BoxGeometry(1,0.5,1),
    leverMaterial = new THREE.MeshLambertMaterial({ map: map2 }),
    lever = new THREE.Mesh(leverGeometry, leverMaterial);

lever.position.set(4,6.2,1);
lever.rotation.z = Math.PI/3.5;
scene.add(lever);

var counterWeightGeometry = new THREE.BoxGeometry(3,3,3), 
    counterWeightMaterial = new THREE.MeshLambertMaterial({  map: map2}),
    counterWeight = new THREE.Mesh(counterWeightGeometry,counterWeightMaterial);

counterWeight.position.set(8,8,1);
scene.add(counterWeight);

var cylinderGeometry = new THREE.CylinderGeometry(0.1,0.1,2.7),
    cylinderMaterial = new THREE.MeshLambertMaterial({  map: map2, bumpMap: map2, bumpScale: 0.5 }),
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

cylinder.position.set(8, 10, 1);
scene.add(cylinder);

//Initialize trees
initTrees();

//Creating ring when projectile hit the ground
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
projectile.add(camera);	

var i = 0;
render();

//Functions --------------------------------------------------------------------------------------------

//Render function (all animation)
function render(){

    requestAnimationFrame(render);

    //GUI Updates
    if(startPressed == false){
        projectile.scale.set(guiControls.projectileMass, guiControls.projectileMass, guiControls.projectileMass);
        counterWeight.scale.set(guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2);
        lever.scale.x = guiControls.leverLength;

        projectile.position.x = lever.position.x -(guiControls.leverLength*Math.cos(lever.rotation.z))/2;
        projectile.position.y = lever.position.y -(guiControls.leverLength*Math.sin(lever.rotation.z))/2 + 1;
        projectile.position.z = lever.position.z;
    }

    if(resetPressed == true){
        projectile.position.set(0,2,1);
        lever.rotation.z = Math.PI/3.5;
        counterWeight.position.set(8,8,1);
        cylinder.position.set(8,10,1);   
    }
        
    if(startPressed == true){ 
        var result = [], x = [], y = [];
        result = getPosArray(x,y);

        //Catapult animation on launch
        if(i < 10){
            lever.rotation.z -= Math.PI/22;
            counterWeight.position.y -= 0.75;
            cylinder.position.y -= 0.75;
        }

        //Updating projectile position if still in air
        if(result.y[i] >= 0){
            console.log("x: " + projectile.position.x + " 	y: " + projectile.position.y);
            projectile.position.x = result.x[i] * 3;
            projectile.position.y = result.y[i] * 3 - 1.5;
            projectile.position.z = 0;  
            
            if(i < result.x.length)
              i++;

            //Visualizing rings when touch-down
            if(i == result.x.length - 1) 
            {
                if(projectile.position.y <= 0.0)
                projectile.position.y = 0.1
                
                if(projectile.position.y >= 0.5)
                projectile.position.y = 0.1

                r = rings[index];
                r.rotation.x = Math.PI/2;
                
                scene.add(r);
                r.position.set(projectile.position.x, projectile.position.y , 0); 
            }
        }    
    } 

 	renderer.render(scene, camera);
}

function getInitVelocity(m1,m2,d1,d2,theta){

    const g = 9.81;   
    var V0;
    V0 = d2 * ( 2 * theta * (m1 * g * d1 - m2 * g * d2)/(m1 * d1^2 + m2 * d2^2) )^(1/2);

    return V0;
}
