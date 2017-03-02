/**
 * Loading .obj-files, mapping textures to them and adding to scene
 */

function loadObjects(){

    var loader = new THREE.JSONLoader();
    var map2 = THREE.ImageUtils.loadTexture('textures/desert.jpg');
    
    loader.load(
    'objects/catapult.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
        var catapultMaterial = new THREE.MeshPhongMaterial({ map: map2, bumpMap: map2, bumpScale: 0.5 });
        var catapult = new THREE.Mesh( geometry, catapultMaterial );
        scene.add( catapult );

        //JSON Object Static Transformations
        catapult.scale.x = 0.05;
        catapult.scale.y = 0.05;
        catapult.scale.z = 0.05;
        catapult.position.set(4,-0.6,1);
    }
    );

    var map = THREE.ImageUtils.loadTexture('textures/sand.jpg');
    loader.load(
        'objects/landscape.js',
        // Function when resource is loaded
        function ( geometry, materials ) {
            var terrainMaterial = new THREE.MeshPhongMaterial({ map: map, 
            bumpMap: map, bumpScale: 0.5 });
            var terrain = new THREE.Mesh( geometry, terrainMaterial );
            scene.add( terrain );

        //JSON Object Static Transformations
        terrain.scale.x = 0.2;
        terrain.scale.y = 0.2;
        terrain.scale.z = 0.2;
        terrain.position.set(60,-1,0);
        }
    );

}