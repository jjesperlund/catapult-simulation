//GUI --------------------------------------------------------------------------------------------------
var guiControls = new function(){
    this.height1 = 1;
}

var datGUI = new dat.GUI();
datGUI.add(guiControls, "height1", 0, 1.8);
//------------------------------------------------------------------------------------------------------


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor (0xffffff,1);
document.body.appendChild( renderer.domElement );


var geometry = new THREE.CylinderGeometry( 1, 1, 4, 32, 20,20 );
var material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

			
camera.position.z = 10;

// Creating position array ------------------------------------------------

var x = [], y = [];		

//Gravity
const g = 9.81; 

//Calculate init velocity
var m1 = 50,            //counter weight mass
m2 = 1,                 //projectile mass
d1 = 1,                 //distance: frame to counter weight 
d2 = 5,                 //distance: projectile to frame   
theta = Math.PI/4,      //degree (rad)
frameHeight = 0.5;

var v0 = getInitVelocity(m1,m2,d1,d2,theta);
var vx = v0*Math.cos(theta),       
    vy = v0*Math.sin(theta);       

//Initial values
var delta_t = 0.01;     // step size       
x[0] = 0;                                
y[0] = Math.sin(theta) * d2 + frameHeight;

//Air drag
const r = 0.2;              //radius of projectil
const A = Math.PI * r^2;    //area of projectile (disc)
const C = 1;                //air drag coeff (0 - 1)
const rho = 1.2;            // air density

var Fdrag_x, Fdrag_y, ax, ay;
var i = 0;

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

//------------------------------------------------------------------------------------------------------

i = 0;
render();
function render() {
    requestAnimationFrame( render );

    cube.scale.y = guiControls.height1;

    while(i < y.length)
    {
        cube.translateX(x[i]);
        //.....

        console.log("x: " + cube.position.x + " 	y: " + cube.position.y);
        i++;	
    }	  
    
    renderer.render(scene, camera);
};


function getInitVelocity(m1,m2,d1,d2,theta)
{
    const g = 9.81;   
    var V0;

    V0 = d2 * ( 2 * theta * (m1 * g * d1 - m2 * g * d2)/(m1 * d1^2 + m2 * d2^2) )^(1/2);

    return V0;

}