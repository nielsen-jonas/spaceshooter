// Populating the scene
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var geometry = new THREE.ConeGeometry( .4, 1.2 );
var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
var spaceship = new THREE.Mesh( geometry, material );
scene.add( spaceship );

// Positioning
cube.position.x = -5;

// Lights
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( -1, 1, 1 );
scene.add( ambientLight );
scene.add( directionalLight );

// Projectiles
var projectile_geometry = new THREE.SphereGeometry( .1, 3, 3 );
var projectile_material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
var projectiles = [];
function fire ( origin_x, origin_y, inertia_x, inertia_y, rotation_z ) {
    var projectile = new THREE.Mesh( projectile_geometry, projectile_material );
    projectile.position.x = origin_x;
    projectile.position.y = origin_y;
    projectile.rotation.z = rotation_z;
    projectile.inertia = {};
    projectile.inertia.x = inertia_x / 400;
    projectile.inertia.y = inertia_y / 400;
    projectiles.push( projectile );
    scene.add( projectile );
}