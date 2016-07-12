// Controls
$( document ).keydown( function(e) {
    if ( e.keyCode == 13) {
        alert('Haii');
    }
});

// Rendering the scene
function render() {
    requestAnimationFrame( render );

    // Animating the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
}
render();