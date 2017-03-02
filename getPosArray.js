/**
 * Mathematical function for fetching projectile position arrays 
 * Function returning result, an object of two arrays (x,y)
 */

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