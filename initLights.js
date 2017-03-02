function initLights(){

    // Spotlight
    var spotLight = new THREE.SpotLight(0xffffff, 1, 30);
    spotLight.castShadow = true;
    spotLight.position.set(0,20,5);
    scene.add(spotLight);

    // Sun Lightning
    var sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.castShadow = true;
    scene.add(sun);
    
}