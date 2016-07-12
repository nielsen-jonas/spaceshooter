// Rendering the scene
function render() {
    requestAnimationFrame( render );
    
    // Animating the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    if (key.down.w) {
        cube.rotation.x -= 0.01;
    }
    if (key.down.s) {
        cube.rotation.x += 0.01;
    }
    if (key.down.a) {
        cube.rotation.y -= 0.01;
    }
    if (key.down.d) {
        cube.rotation.y += 0.01;
    }
    renderer.render( scene, camera );
}
render();