// Configurations
var myConst = {};
var myGlobals = {};
var config = {
    camera: {
        fov: 75,
        aspectRatio: window.innerWidth / window.innerHeight,
        clippingPlane: {
        	near: 0.1,
        	far: 1000
        }
    },
    renderer: {
    	width: window.innerWidth,
    	height: window.innerHeight
    }
};

// Setup
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x111111, 0.015, 100);

var camera = new THREE.PerspectiveCamera (
    config.camera.fov,
    config.camera.aspectRatio,
    config.camera.clippingPlane.near,
    config.camera.clippingPlane.far
);

//camera.position.z = 16;
camera.position.z = 20;

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize (
    config.renderer.width,
    config.renderer.height
);

$( '#game-container' ).append( renderer.domElement );
//document.body.appendChild( renderer.domElement );
