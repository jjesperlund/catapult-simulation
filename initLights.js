/**
 * Initializing lights in scene
 */

function initLights(){

    // Sunlight 1
    var spotLight = new THREE.PointLight(0xffffff, 1.2, 200);
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 700;
    spotLight.shadowMapHeight =700;

    spotLight.position.set(100,150,40);
    scene.add(spotLight);

    // Sun Light 2
    var sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.castShadow = true;
    scene.add(sun);

    //Light at catapult
    var light = new THREE.PointLight(0xffffff, 1.2, 8);
    light.position.set(8,8,5);
    scene.add(light);

}