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