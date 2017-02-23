// "Must-be" global variables
var startPressed = false;

//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.height1 = 1;
    this.start = function() {startPressed = true;}
}

var datGUI = new dat.GUI();
//var obj = { add:function(){ console.log("clicked") }};

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
renderer.setClearColor (0xffff1f,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

var axis = new THREE.AxisHelper(20);
scene.add(axis);

var controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.maxPolarAngle = Math.PI/2.2;

var geometry = new THREE.SphereGeometry( 2, 20,20 ),
    material = new THREE.MeshLambertMaterial( { color: 0x0000ff} ),
    projectile = new THREE.Mesh( geometry, material );

projectile.castShadow = true;
scene.add(projectile);

var planeGeometry = new THREE.PlaneGeometry(80,30,30),
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}),
    plane         = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5*Math.PI;
plane.receive = true;
scene.add(plane);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set(0,30,30);
scene.add(spotLight);
			
camera.position.set(10,30,45);
camera.lookAt(scene.position);
//------------------------------------------------------------------------------------------------------

// Creating position array 
var x = [], y = [], result = [], i = 0;

result = getPosArray(x,y);
projectile.position.set(result.x[0], result.y[0], 1);
render();


//Functions --------------------------------------------------------------------------------------------

function render(){

    setTimeout( function() { requestAnimationFrame(render); }, 20 );
    stats.update();
    projectile.scale.y = guiControls.height1;

    if(startPressed == true)
    {
        if(result.y[i] >= 0){

        projectile.position.x = result.x[i] * 5;
        projectile.position.y = result.y[i] * 5;
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

