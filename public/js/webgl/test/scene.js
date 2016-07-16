// Populating the scene
var geometry = new THREE.PlaneGeometry( 960, 540);
var texture = new THREE.TextureLoader().load('http://slim/img/game_bg_a.png')
var material = new THREE.MeshBasicMaterial({
    map: texture
});
var background = new THREE.Mesh( geometry, material );
scene.add( background );

var textureFlare = new THREE.TextureLoader().load( "http://slim/img/lensflare.png" );
var flareColor = new THREE.Color( 0xffffff );
var position = new THREE.Vector3(0,0,0);
var star = addLensFlare( textureFlare, flareColor, position, 1.5, false);
scene.add( star );

var geometry = new THREE.CylinderGeometry( .2, .6, 1.4, 16 );
var texture = new THREE.TextureLoader().load('http://slim/img/rasta.jpg');
var material = new THREE.MeshLambertMaterial({
    map: texture
});
var spaceship = new THREE.Mesh( geometry, material );
scene.add( spaceship );

// Lights
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, .8 );
directionalLight.position.set( -80, 40, 60 );
scene.add( ambientLight );
scene.add( directionalLight );

// Rocks
var rock_texture = new THREE.TextureLoader().load('http://slim/img/rock.jpg');
var rock_material = new THREE.MeshLambertMaterial({
    map: rock_texture
});

var rocks = [];
function rockRadius ( volume ) {
    return Math.pow((volume/Math.PI)*(3/4), 1/3);
}

var rock_health = [1, 1, 2, 2, 3, 3];
var rock_radius = [
  rockRadius( 1 ),
  rockRadius( 3 ),
  rockRadius( 9 ),
  rockRadius( 27 ),
  rockRadius( 81 ),
  rockRadius( 243 )
];
function createRock ( origin_x, origin_y, inertia_x, inertia_y, type) {
   var rock_geometry = new THREE.SphereGeometry( rock_radius[type-1] );
   var rock = new THREE.Mesh ( rock_geometry, rock_material );
   rock.position.x = origin_x;
   rock.position.y = origin_y;
   rock.inertia = {};
   rock.inertia.x = inertia_x;
   rock.inertia.y = inertia_y;
   rock.type = type;
   rock.time = 0;
   rock.health = rock_health[type-1];
   rocks.push( rock );
   scene.add( rock );
}

/*function createRock ( origin_x, origin_y, inertia_x, inertia_y, type) {
   var rock_geometry = new THREE.SphereGeometry( rock_radius[type-1] );
   var rock = new THREE.Mesh ( rock_geometry, rock_material );
   rock.position.x = origin_x;
   rock.position.y = origin_y;
   rock.inertia = {};
   rock.inertia.x = inertia_x;
   rock.inertia.y = inertia_y;
   rock.type = type;
   rock.time = 0;
   rock.health = rock_health[type-1];
   rocks.push( rock );
   scene.add( rock );
}*/

// Projectiles
var projectile_geometry = new THREE.PlaneGeometry( .2, 1.2, 1 );
var projectile_material = new THREE.MeshBasicMaterial( { color: 0xdd0000 } );
var projectiles = [];

function fire ( origin_x, origin_y, inertia_x, inertia_y, rotation_z ) {
    soundFire.play();
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



// Positioning
background.position.z = -330;
star.position.z = -200;
star.position.x = -190;
star.position.y = 72;




//  This function retuns a lesnflare THREE object to be .add()ed to the scene graph
function addLensFlare( textureFlare, flareColor, position, size, overrideImage){

  var lensFlare = new THREE.LensFlare( overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor );

  //    we're going to be using multiple sub-lens-flare artifacts, each with a different size
  //lensFlare.add( textureFlare, 4096, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare, 512, 0.0, THREE.AdditiveBlending );

  var f, fl = lensFlare.lensFlares.length;
  var flare;
  var vecX = -lensFlare.positionScreen.x * 2;
  var vecY = -lensFlare.positionScreen.y * 2;

  var camDistance = camera.position.length();

  for( f = 0; f < fl; f ++ ) {
    flare = lensFlare.lensFlares[ f ];

    flare.x = lensFlare.positionScreen.x + vecX * flare.distance;
    flare.y = lensFlare.positionScreen.y + vecY * flare.distance;

    flare.scale = size / camDistance;
    flare.rotation = 0;
  }

  lensFlare.position = position;
  lensFlare.size = size;
  return lensFlare;
}

// Audio
// instantiate a listener
var audioListener = new THREE.AudioListener();

// add the listener to the camera
camera.add( audioListener );

// instantiate audio object
var soundFire = new THREE.Audio( audioListener );
var soundThrust = new THREE.Audio( audioListener );
var soundBangSmall = new THREE.Audio( audioListener );
var soundBangMedium = new THREE.Audio( audioListener );
var soundBangLarge = new THREE.Audio( audioListener );

// add the audio object to the scene
scene.add( soundFire );

// instantiate a loader
var audioLoader = new THREE.AudioLoader();

// load a resource
// Load Fire
audioLoader.load(
  // resource URL
  'http://slim/sound/asteroid/fire.wav',
  // Function when resource is loaded
  function ( audioBuffer ) {
    // set the audio object buffer to the loaded object
    soundFire.setBuffer( audioBuffer );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);
// Load Thrust
audioLoader.load(
  // resource URL
  'http://slim/sound/asteroid/thrust.wav',
  // Function when resource is loaded
  function ( audioBuffer ) {
    // set the audio object buffer to the loaded object
    soundThrust.setBuffer( audioBuffer );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);

// Load Bang small
audioLoader.load(
  // resource URL
  'http://slim/sound/asteroid/bangSmall.wav',
  // Function when resource is loaded
  function ( audioBuffer ) {
    // set the audio object buffer to the loaded object
    soundBangSmall.setBuffer( audioBuffer );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);

// Load Bang medium
audioLoader.load(
  // resource URL
  'http://slim/sound/asteroid/bangMedium.wav',
  // Function when resource is loaded
  function ( audioBuffer ) {
    // set the audio object buffer to the loaded object
    soundBangMedium.setBuffer( audioBuffer );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);

// Load Bang large
audioLoader.load(
  // resource URL
  'http://slim/sound/asteroid/bangLarge.wav',
  // Function when resource is loaded
  function ( audioBuffer ) {
    // set the audio object buffer to the loaded object
    soundBangLarge.setBuffer( audioBuffer );
  },
  // Function called when download progresses
  function ( xhr ) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  // Function called when download errors
  function ( xhr ) {
    console.log( 'An error happened' );
  }
);




/**
// Rocks
var rock_texture = new THREE.TextureLoader().load('http://slim/img/rock.jpg');
var rock_material = new THREE.MeshLambertMaterial({
    map: rock_texture
});

var rocks = [];
function rockRadius ( volume ) {
    return Math.pow((volume/Math.PI)*(3/4), 1/3);
}
//console.log(rockRadius( 1 ));

var rock_health = [1, 2, 3, 4, 5, 6];
var rock_radius = [
  rockRadius( 1 ),
  rockRadius( 3 ),
  rockRadius( 9 ),
  rockRadius( 27 ),
  rockRadius( 81 ),
  rockRadius( 243 )
];
function createRock ( origin_x, origin_y, inertia_x, inertia_y, type) {
   var rock_geometry = new THREE.SphereGeometry( rock_radius[type-1] );
   var rock = new THREE.Mesh ( rock_geometry, rock_material );
   rock.position.x = origin_x;
   rock.position.y = origin_y;
   rock.inertia = {};
   rock.inertia.x = inertia_x;
   rock.inertia.y = inertia_y;
   rock.type = type;
   rock.time = 0;
   rock.health = rock_health[type-1];
   rocks.push( rock );
   scene.add( rock );
}**/