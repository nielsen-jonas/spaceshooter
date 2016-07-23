// Populating the scene
var geometry = new THREE.PlaneGeometry( 960, 540);
var texture = new THREE.TextureLoader().load('http://slim/img/game_bg_a.png')
var material = new THREE.MeshBasicMaterial({
    map: texture,
    fog: false
});
var background = new THREE.Mesh( geometry, material );
scene.add( background );

var textureFlare = new THREE.TextureLoader().load( "http://slim/img/lensflare.png" );
var flareColor = new THREE.Color( 0xffffff );
var position = new THREE.Vector3(0,0,0);
var star = addLensFlare( textureFlare, flareColor, position, 1.5, false);
scene.add( star );

var spaceship_geometry = new THREE.CylinderGeometry( .2, .6, 1.4, 16 );
var spaceship_texture = new THREE.TextureLoader().load('http://slim/img/rasta.jpg');
var spaceship_material = new THREE.MeshLambertMaterial({
    map: spaceship_texture
});
var spaceship = new THREE.Mesh( spaceship_geometry, spaceship_material );

// Lights
var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
var directionalLight = new THREE.DirectionalLight( 0xffffff, .9 );
directionalLight.position.set( -80, 40, 60 );
scene.add( ambientLight );
scene.add( directionalLight );

// Rocks
var rock_texture = new THREE.TextureLoader().load('http://slim/img/rock.jpg');
var rock_material = new THREE.MeshLambertMaterial({
    map: rock_texture
});

function rockRadius ( volume ) {
    return Math.pow((volume/Math.PI)*(3/4), 1/3);
}

var rock_health = [1, 1, 1, 1, 1, 1];
var rock_radius = [
  rockRadius( 1 ),
  rockRadius( 3 ),
  rockRadius( 9 ),
  rockRadius( 27 ),
  rockRadius( 81 ),
  rockRadius( 243 )
];

// Projectiles
var projectile_geometry = new THREE.PlaneGeometry( .2, 1.2, 1 );
var projectile_material = new THREE.MeshBasicMaterial( { color: 0xdd0000 } );

// Positioning
background.position.z = -330;
star.position.z = -329;
star.position.x = -302;
star.position.y = 115;


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

// Sound
myGlobals.sound = {
    clip: {},
    asset: {
        path: 'http://slim/sound/jonas/',
        files: [
            { src: 'fire.wav', id: 'Blaster'},
            { src: 'thrust.wav', id: 'Thrust'},
            { src: 'rock1_exp.wav', id: 'BangSm'},
            { src: 'rock2_exp.wav', id: 'BangMd'},
            { src: 'rock3_exp.wav', id: 'BangLg'},
            { src: 'hit1.wav', id: 'Hit1'},
            { src: 'hit2.wav', id: 'Hit2'},
            { src: 'hit3.wav', id: 'Hit3'},
            { src: 'hit4.wav', id: 'Hit4'},
            { src: 'hit5.wav', id: 'Hit5'},
            { src: 'hit6.wav', id: 'Hit6'},
            { src: 'bg/bg_gameover_loop.wav', id: 'GameOver'},
            { src: 'bg/bg_aerodynamic_loop.wav', id: 'Menu'},
        ]
    },
    load: function() {
        createjs.Sound.registerSounds( this.asset.files, this.asset.path );
        this.clip.Blaster = createjs.Sound.play( 'Blaster' );
        this.clip.Thrust = createjs.Sound.play( 'Thrust' );
        this.clip.GameOver = createjs.Sound.play( 'GameOver' );
        this.clip.Menu = createjs.Sound.play( 'Menu' );
        this.clip.BangSm = createjs.Sound.play( 'BangSm' );
        this.clip.BangMd = createjs.Sound.play( 'BangMd' );
        this.clip.BangLg = createjs.Sound.play( 'BangLg' );
    },
    pause: function() {
        $.each( this.clip, function( index, clip ) {
            clip.paused = true;
        });
        return 0;
    },
    unpause: function() {
        $.each( this.clip, function( index, clip ) {
            clip.paused = false;
        });
        return 0;
    },
    stop: function() {
        $.each( this.clip, function( index, clip ) {
            clip.stop();
        });
    }
};

// Particle explosion effect
//////////////settings/////////
/*var movementSpeed = .8;
var totalObjects = 400;
var objectSize = .06;
var sizeRandomness = 10000;*/
//var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
var dirs = [];
var parts = [];

function ExplodeAnimation(x,y, color = 0xBBBBBB, totalObjects = 400, movementSpeed = .8, objectSize = .06, sizeRandomness = 10000)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;
  
    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }

  var material = new THREE.PointsMaterial( { size: objectSize,  color: color });
  var particles = new THREE.Points( geometry, material );
  this.lifetime = 2000;
  this.object = particles;
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.update = function(){
    this.lifetime --;
    if ( this.lifetime <= 0 ) {
        scene.remove(this.object);
    }
    if (this.status == true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
  
}