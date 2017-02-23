// "Must-be" global variables
var startPressed = false;

//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.height1 = 1;
    this.start = function() {startPressed = true;}
}

var datGUI = new dat.GUI();

datGUI.add(guiControls, "height1", 0, 1.8); 
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
        var catapultMaterial = new THREE.MeshPhongMaterial({ color: 0x444444, specular: 5 });
        var catapult = new THREE.Mesh( geometry, catapultMaterial );
        scene.add( catapult );

    //JSON Object Static Transformations
    catapult.scale.x = 0.05;
    catapult.scale.y = 0.05;
    catapult.scale.z = 0.05;
    catapult.position.set(4,-3,1);
    }
);
/*
    loader.load(
        'objects/landscape.js',
        // Function when resource is loaded
        function ( geometry, materials ) {
            var terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x444444, specular: 5 });
            var terrain = new THREE.Mesh( geometry, terrainMaterial );
            scene.add( terrain );

        //JSON Object Static Transformations
        terrain.scale.x = 0.0007;
        terrain.scale.y = 0.0007;
        terrain.scale.z = 0.0007;
        }
    );
*/


var geometry = new THREE.SphereGeometry( 1, 20,20 ),
    material = new THREE.MeshLambertMaterial( { color: 0x0000ff} ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

var leverGeometry = new THREE.BoxGeometry(12,0.5,1),
    leverMaterial = new THREE.MeshLambertMaterial({color: 0x000000, specular: 3}),
    lever = new THREE.Mesh(leverGeometry, leverMaterial);

lever.position.set(4,3.8,1);
lever.rotation.z = Math.PI/4;

scene.add(lever);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(0,30,30);
scene.add(spotLight);
			
camera.position.set(10,15,5);
camera.lookAt(scene.position);
//------------------------------------------------------------------------------------------------------

// Creating position array 
var x = [], y = [], result = [], i = 0;

result = getPosArray(x,y);
projectile.position.set(result.x[0], result.y[0], 1);
render();


//Functions --------------------------------------------------------------------------------------------

function render(){

    requestAnimationFrame(render);
    stats.update();
    projectile.scale.y = guiControls.height1;

    if(startPressed == true)
    {
        
        if(i < 40)
            lever.rotation.z -= Math.PI/60;

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
        m2 = 1,                 //projectile mass
        d1 = 0.6,                 //distance: frame to counter weight 
        d2 = 4,                 //distance: projectile to frame   
        theta = Math.PI/4,      //degree (rad)
        frameHeight = 0.5 - 3;

    var v0 = getInitVelocity(m1,m2,d1,d2,theta);
    let vx = v0*Math.cos(theta),       
        vy = v0*Math.sin(theta);       

    //Initial values
    let delta_t = 0.005;     // step size       
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