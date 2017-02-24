// "Must-be" global variables
var startPressed = false;

//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.projectileMass = 1;
    this.counterMass = 120;
    this.leverLength = 14;
    this.start = function() {startPressed = true;}
}

var datGUI = new dat.GUI();

datGUI.add(guiControls, "projectileMass", 0.8, 1.5);
datGUI.add(guiControls, "counterMass", 70, 200);  
datGUI.add(guiControls, "leverLength", 12, 20);
datGUI.add(guiControls,'start');

stats = new Stats();
document.body.appendChild(stats.domElement);
//------------------------------------------------------------------------------------------------------


//Create Scene -----------------------------------------------------------------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xE5F6FF,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

// Coord. Axis
var axis = new THREE.AxisHelper(20);
scene.add(axis);

// Mouse Control
var controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.2;

// Import objects
var loader = new THREE.JSONLoader();

    loader.load(
    'objects/catapult.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
        var catapultMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('textures/desert.jpg') });
        var catapult = new THREE.Mesh( geometry, catapultMaterial );
        scene.add( catapult );

    //JSON Object Static Transformations
    catapult.scale.x = 0.05;
    catapult.scale.y = 0.05;
    catapult.scale.z = 0.05;
    catapult.position.set(4,-0.6,1);
    }
);

    loader.load(
        'objects/landscape.js',
        // Function when resource is loaded
        function ( geometry, materials ) {
            var terrainMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('textures/sand.jpg') });
            var terrain = new THREE.Mesh( geometry, terrainMaterial );
            scene.add( terrain );

        //JSON Object Static Transformations
        terrain.scale.x = 0.2;
        terrain.scale.y = 0.2;
        terrain.scale.z = 0.2;
        terrain.position.set(0,-1.6,0);
        }
    );

// Geometries
var geometry = new THREE.SphereGeometry( 0.7, 10,10 ),
    material = new THREE.MeshLambertMaterial( { color: 0x333333} ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

var leverGeometry = new THREE.BoxGeometry(1,0.5,1),
    leverMaterial = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('textures/desert.jpg') }),
    lever = new THREE.Mesh(leverGeometry, leverMaterial);

lever.position.set(4,6.2,1);
lever.rotation.z = Math.PI/4;

scene.add(lever);

var counterWeightGeometry = new THREE.BoxGeometry(3,3,3), 
    counterWeightMaterial = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('textures/desert.jpg') }),
     counterWeight = new THREE.Mesh(counterWeightGeometry,counterWeightMaterial);

scene.add(counterWeight);
counterWeight.position.set(7.5,12.8,1);

// Spotlight
var spotLight = new THREE.SpotLight(0xffffff, 1, 30);
spotLight.castShadow = true;
spotLight.position.set(0,20,5);
scene.add(spotLight);

// Sun Lightning
var sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.castShadow = true;
scene.add(sun);
			
camera.position.set(10,15,10);
camera.lookAt(scene.position);
//------------------------------------------------------------------------------------------------------

// Creating position array 
var x = [], y = [], result = [], i = 0;
projectile.position.set(0,1, 1);
render();


//Functions --------------------------------------------------------------------------------------------

function render(){

    requestAnimationFrame(render);
    stats.update();

    //GUI Updates
    projectile.scale.x = guiControls.projectileMass;
    projectile.scale.y = guiControls.projectileMass;
    projectile.scale.z = guiControls.projectileMass;
    counterWeight.scale.set(guiControls.counterMass/150, guiControls.counterMass/150, guiControls.counterMass/150);

    lever.scale.x = guiControls.leverLength;

    if(startPressed == true)
    { 
        result = getPosArray(x,y);

        if(i < 10){
            lever.rotation.z -= Math.PI/20;
            counterWeight.position.y -= 1.2;
        }
        if(result.y[i] >= 0){

        projectile.position.x = result.x[i] * 3;
        projectile.position.y = result.y[i] * 3;
        projectile.position.z = 0;  
        

        console.log("x: " + projectile.position.x + " 	y: " + projectile.position.y);

        i++;
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
    let m1 = 100,               //counter weight mass
        m2 = guiControls.projectileMass,                 //projectile mass
        d1 = 0.6,               //distance: frame to counter weight 
        d2 = guiControls.leverLength,                 //distance: projectile to frame   
        theta = Math.PI/4,      //degree (rad)
        frameHeight = 0.5;

    var v0 = getInitVelocity(m1,m2,d1,d2,theta);
    let vx = v0*Math.cos(theta),       
        vy = v0*Math.sin(theta);       

    //Initial values
    let delta_t = 0.01;     // step size       
    x[0] = 0;                                
    y[0] = Math.sin(theta) * d2 + frameHeight;

    //Air drag
    const r = 0.2,              //radius of projectil
          A = Math.PI * r^2,    //area of projectile (disc)
          C = 0.2,                //air drag coeff (0 - 1)
          rho = 1.2;            // air density

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