//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.height1 = 1;
}

var datGUI = new dat.GUI();
datGUI.add(guiControls, "height1", 0, 1.8);

stats = new Stats();
document.body.appendChild(stats.domElement);
//------------------------------------------------------------------------------------------------------


//Create Scene -----------------------------------------------------------------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xffffff,1);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

var axis = new THREE.AxisHelper(20);
scene.add(axis);

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
			
camera.position.set(30,25,30);
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

    if(result.y[i] >= 0){

        projectile.position.x = result.x[i] * 5;
        projectile.position.y = result.y[i] * 5;
        projectile.position.z = 0;  

        console.log("x: " + projectile.position.x + " 	y: " + projectile.position.y);

        i++;
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
    let m1 = 200,               //counter weight mass
        m2 = 0.5,                 //projectile mass
        d1 = 0.6,                 //distance: frame to counter weight 
        d2 = 7,                 //distance: projectile to frame   
        theta = Math.PI/4,      //degree (rad)
        frameHeight = 0.5 - 3;

    var v0 = getInitVelocity(m1,m2,d1,d2,theta);
    let vx = v0*Math.cos(theta),       
        vy = v0*Math.sin(theta);       

    //Initial values
    let delta_t = 0.01;     // step size       
    x[0] = 0;                                
    y[0] = Math.sin(theta) * d2 + frameHeight;

    //Air drag
    const r = 0.1,              //radius of projectil
          A = Math.PI * r^2,    //area of projectile (disc)
          C = 0.5,                //air drag coeff (0 - 1)
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