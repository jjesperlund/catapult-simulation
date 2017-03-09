/**
 * Creating trees and adding to scene
 */

function initTrees(){

    //Three specification
    var tree = new THREE.Tree({
        generations : 5,        // # for branch' hierarchy
        length      : 7.0,      // length of root branch
        uvLength    : 20.0,     // uv.v ratio against geometry length (recommended is generations * length)
        radius      : 0.3,      // radius of root branch
        radiusSegments : 8,     // # of radius segments for each branch geometry
        heightSegments : 8      // # of height segments for each branch geometry
    });

    var geometry = THREE.TreeGeometry.build(tree);

    var tree1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x4d2800}));
    tree1.position.set(10,-1,-40);
    scene.add(tree1);

    var tree2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
    tree2.position.set(80,-1,-50);
    scene.add(tree2);

    var tree3 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x4d2800}));
    tree3.position.set(170,-1,-10);
    scene.add(tree3);

    var tree4 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
    tree4.position.set(70,-1,40);
    scene.add(tree4);

    var tree5 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x663300}));
    tree5.position.set(30,-1,50);
    scene.add(tree5);

}
