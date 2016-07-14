// Populating the scene
var geometry = new THREE.PlaneGeometry( 960, 540);
var material = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('http://slim/img/game_bg_a.png')
});
var background = new THREE.Mesh( geometry, material );
scene.add( background );

var textureFlare = new THREE.TextureLoader().load( "http://slim/img/lensflare.png" );
var flareColor = new THREE.Color( 0xffffff );
var position = new THREE.Vector3(0,0,0);
var star = addLensFlare( textureFlare, flareColor, position, 2, false);
scene.add( star );

var geometry = new THREE.SphereGeometry( 1 );
var material = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('http://slim/img/rock.jpg')
});
var rock = new THREE.Mesh( geometry, material );
scene.add( rock );

var geometry = new THREE.CylinderGeometry( .2, .6, 1.4, 16 );
var material = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('http://slim/img/rasta.jpg')
});
var spaceship = new THREE.Mesh( geometry, material );
scene.add( spaceship );

// Positioning
background.position.z = -330;
star.position.z = -200;
star.position.x = -190;
star.position.y = 72;
rock.position.x = 5;
rock.rotation.z = 2;

// Lights
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, .8 );
directionalLight.position.set( -80, 40, 60 );
scene.add( ambientLight );
scene.add( directionalLight );

// Projectiles
var projectile_geometry = new THREE.PlaneGeometry( .2, 1.2, 1 );
var projectile_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var projectiles = [];
function fire ( origin_x, origin_y, inertia_x, inertia_y, rotation_z ) {
    var projectile = new THREE.Mesh( projectile_geometry, projectile_material );
    projectile.position.x = origin_x;
    projectile.position.y = origin_y;
    projectile.rotation.z = rotation_z;
    projectile.inertia = {};
    projectile.timer = 2000;
    projectile.inertia.x = inertia_x / 380;
    projectile.inertia.y = inertia_y / 380;
    projectile.alive = true;
    projectiles.push( projectile );
    scene.add( projectile );
}

//  This function retuns a lesnflare THREE object to be .add()ed to the scene graph
function addLensFlare( textureFlare, flareColor, position, size, overrideImage){

  lensFlare = new THREE.LensFlare( overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor );

  //    we're going to be using multiple sub-lens-flare artifacts, each with a different size
  //lensFlare.add( textureFlare, 4096, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare, 512, 0.0, THREE.AdditiveBlending );

  // and run each through a function below
  lensFlare.customUpdateCallback = lensFlareUpdateCallback;

  lensFlare.position = position;
  lensFlare.size = size;
  return lensFlare;
}

//  this function will operate over each lensflare artifact, moving them around the screen
function lensFlareUpdateCallback( object ) {
  var f, fl = this.lensFlares.length;
  var flare;
  var vecX = -this.positionScreen.x * 2;
  var vecY = -this.positionScreen.y * 2;
  var size = object.size ? object.size : 16000;

  var camDistance = camera.position.length();

  for( f = 0; f < fl; f ++ ) {
    flare = this.lensFlares[ f ];

    flare.x = this.positionScreen.x + vecX * flare.distance;
    flare.y = this.positionScreen.y + vecY * flare.distance;

    flare.scale = size / camDistance;
    flare.rotation = 0;
  }
}