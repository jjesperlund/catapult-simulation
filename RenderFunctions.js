/**
 * Functions called from render loop
 */

function animate(){
    var result = [], x = [], y = [];
    result = getPosVectors(x,y);

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
        projectile.position.y = result.y[i] * 3 - 3.3;
        projectile.position.z = 0;  

        if(i < result.x.length)
            i++;

        //Visualizing rings when touch-down
        if(i == result.x.length - 1) 
        {
            projectile.position.y = -0.5;

            r = rings[index];
            r.rotation.x = Math.PI/2;
            
            scene.add(r);
            r.position.set(projectile.position.x, projectile.position.y , 0); 
        }
    } 
}

function updateGUI(){
    projectile.scale.set(guiControls.projectileMass + 0.1, guiControls.projectileMass + 0.1, guiControls.projectileMass + 0.1);
    counterWeight.scale.set(guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2, guiControls.counterMass/300 + 0.2);
    lever.scale.x = guiControls.leverLength;

    projectile.position.x = lever.position.x -(guiControls.leverLength*Math.cos(lever.rotation.z))/2;
    projectile.position.y = lever.position.y -(guiControls.leverLength*Math.sin(lever.rotation.z))/2 + 1;
    projectile.position.z = lever.position.z;
}

function getInitVelocity(m1,m2,d1,d2,theta){

    const g = 9.81;   
    var V0;
    V0 = d2 * ( 2 * theta * (m1 * g * d1 - m2 * g * d2)/(m1 * d1^2 + m2 * d2^2) )^(1/2);

    return V0;
}
