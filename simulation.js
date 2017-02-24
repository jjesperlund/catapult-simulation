// "Must-be" global variables
var startPressed = false;
var resetPressed = false;
var rings = [];
var oneRing;
var index = 0;


//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.projectileMass = 1;
    this.counterMass = 120;
    this.leverLength = 14;
    this.airResistance = 0.2;
    this.start = function() {startPressed = true; resetPressed = false;}
    this.reset = function() {resetPressed = true; startPressed = false; i = 0; index++;}

    
}

var datGUI = new dat.GUI();
datGUI.domElement.id = 'gui';

datGUI.add(guiControls, "projectileMass", 0.8, 1.5);
datGUI.add(guiControls, "counterMass", 80, 200);  
datGUI.add(guiControls, "leverLength", 12, 18);
datGUI.add(guiControls,"airResistance",0.12,0.3);
datGUI.add(guiControls,'start');
datGUI.add(guiControls,'reset');

//------------------------------------------------------------------------------------------------------


//Create Scene -----------------------------------------------------------------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xb3e0ff,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

// Mouse Control
var controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.2;

// Import objects
var loader = new THREE.JSONLoader();

var map2 = THREE.ImageUtils.loadTexture('textures/desert.jpg');
    loader.load(
    'objects/catapult.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
        var catapultMaterial = new THREE.MeshPhongMaterial({ map: map2, bumpMap: map2, bumpScale: 0.5 });
        var catapult = new THREE.Mesh( geometry, catapultMaterial );
        scene.add( catapult );

    //JSON Object Static Transformations
    catapult.scale.x = 0.05;
    catapult.scale.y = 0.05;
    catapult.scale.z = 0.05;
    catapult.position.set(4,-0.6,1);
    }
);
    var map = THREE.ImageUtils.loadTexture('textures/sand.jpg');
    loader.load(
        'objects/landscape.js',
        // Function when resource is loaded
        function ( geometry, materials ) {
            var terrainMaterial = new THREE.MeshPhongMaterial({ map: map, 
            bumpMap: map, bumpScale: 0.5 });
            var terrain = new THREE.Mesh( geometry, terrainMaterial );
            scene.add( terrain );

        //JSON Object Static Transformations
        terrain.scale.x = 0.2;
        terrain.scale.y = 0.2;
        terrain.scale.z = 0.2;
        terrain.position.set(60,-1,0);
        }
    );

// Geometries
var geometry = new THREE.SphereGeometry( 0.7, 10,10 ),
    material = new THREE.MeshLambertMaterial( { color: 0x333333} ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

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

//Trees
var tree = new THREE.Tree({
    generations : 5,        // # for branch' hierarchy
    length      : 7.0,      // length of root branch
    uvLength    : 20.0,     // uv.v ratio against geometry length (recommended is generations * length)
    radius      : 0.3,      // radius of root branch
    radiusSegments : 8,     // # of radius segments for each branch geometry
    heightSegments : 8      // # of height segments for each branch geometry
});

var geometry = THREE.TreeGeometry.build(tree);

var tree1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x4d2800}));
tree1.position.set(10,-1,-40);
scene.add(tree1);

var tree2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
tree2.position.set(50,-1,-50);
scene.add(tree2);

var tree3 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x4d2800}));
tree3.position.set(100,-1,-5);
scene.add(tree3);

var tree4 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
tree4.position.set(40,-1,40);
scene.add(tree4);

var tree5 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
tree5.position.set(10,-1,50);
scene.add(tree5);

//Ring
var ringGeometry = new THREE.TorusGeometry(3, 0.1, 10, 60);
var ringMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

for(let i = 0; i < 25; i++)
{
    //ring = new THREE.Object3D();
    oneRing = new THREE.Mesh( ringGeometry, ringMaterial );
    //ring.add(oneRing);

    rings[i] = oneRing;
}
var goalRingGeometry = new THREE.TorusGeometry(5, 0.3, 10, 60);
var goalRingMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var goalRing = new THREE.Mesh(goalRingGeometry,goalRingMaterial);
scene.add(goalRing);
goalRing.rotation.x = Math.PI/2;
goalRing.position.set(100,0.1,0);

// Spotlight
var spotLight = new THREE.SpotLight(0xffffff, 1, 30);
spotLight.castShadow = true;
spotLight.position.set(0,20,5);
scene.add(spotLight);

// Sun Lightning
var sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.castShadow = true;
scene.add(sun);
			
camera.position.set(15,10,15);
projectile.add(camera);
//------------------------------------------------------------------------------------------------------

var i = 0;
projectile.position.set(0,2, 1);
render();

//Functions --------------------------------------------------------------------------------------------

function render(){

    requestAnimationFrame(render);

    //GUI Updates
    projectile.scale.set(guiControls.projectileMass, guiControls.projectileMass, guiControls.projectileMass);
    counterWeight.scale.set(guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2);
    lever.scale.x = guiControls.leverLength;

    if(resetPressed == true)
    {
        projectile.position.set(0,2,1);
        lever.rotation.z = Math.PI/3.5;
        counterWeight.position.set(8,8,1);
        cylinder.position.set(8,10,1);   
    }
        
    if(startPressed == true)
    { 
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

function getPosArray(x,y){

    //Gravity
    const g = 9.81; 

    //Calculate init velocity
    let m1 = guiControls.counterMass,     //counter weight mass
        m2 = guiControls.projectileMass,  //projectile mass
        d1 = 0.6,                         //distance: frame to counter weight 
        d2 = guiControls.leverLength,     //distance: projectile to frame   
        theta = Math.PI/4,                //degree (rad)
        frameHeight = 0.5;

        var v0 = getInitVelocity(m1,m2,d1,d2,theta);
        var vx = v0*Math.cos(theta),       
        vy = v0*Math.sin(theta);       

    //Initial values
    let delta_t = 0.01;     // step size       
    x[0] = 0;                                
    y[0] = 0;

    //Air drag
    const r = 0.2,                //radius of projectil
          A = Math.PI * r^2,      //area of projectile (disc)
          rho = 1.2;              // air density

    var C = guiControls.airResistance;       // Air resistance coeff. (0 - 1)
  
    let Fdrag_x, Fdrag_y, ax, ay, i = 0;

    //Do simulation loop while projectile is above ground (ground: y = 0)
    while (y[i] >= 0)
    {
        //only for debugging
        if(x.length > 2000)
        {
            console.log('too many samples');
            break;
        }
        
        Fdrag_x = (rho * C * A * vx^2)/2;  
        Fdrag_y = (rho * C * A * vy^2)/2;
        
        //Acceleration with air drag
        ax = - Fdrag_x * vx;
        ay = - g - Fdrag_y * vy;
        
        //Euler (acc -> velocity)
        vx = vx + delta_t * ax;
        vy = vy + delta_t * ay;
    
        //Euler (velocity -> position)
        x[i+1] = x[i] + delta_t * vx;
        y[i+1] = y[i] + delta_t * vy;
            
        i++; 
    }

    return {x:x, y:y}


}