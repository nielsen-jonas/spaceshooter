// Configurations
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

var camera = new THREE.PerspectiveCamera (
    config.camera.fov,
    config.camera.aspectRatio,
    config.camera.clippingPlane.near,
    config.camera.clippingPlane.far
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize (
    config.renderer.width,
    config.renderer.height
);

document.body.appendChild( renderer.domElement );