// Player properties
var player = {
    inertia: {
        x: 0,
        y: 0,
        rotation: 0
    },
    direction: 0,
    acceleration: {
        thrust: 1,
        break: 1,
        rotation: 0.1
    }
}

var view = {
    width: 42.87,
    height: 24
}

// Rendering the scene
function render() {
    requestAnimationFrame( render );

    // Inertia direction
    player.direction += player.inertia.rotation;

    // Lock direction
    if (player.direction > 360) {
        player.direction -= 360;
    }
    if (player.direction < 0) {
        player.direction += 360;
    }

    console.log('cos(' + player.direction + '): ' + String(Math.cos(player.direction)));
    console.log('sin(' + player.direction + '): ' + String(Math.sin(player.direction)));

    // Input
    if (key.down.w) {
        player.inertia.x += Math.cos(player.direction) * player.acceleration.thrust;
        player.inertia.y += Math.sin(player.direction) * player.acceleration.thrust;
    }
    if (key.down.s) {

    }
    if (key.down.a) {
        player.inertia.rotation += player.acceleration.rotation;
    }
    if (key.down.d) {
        player.inertia.rotation -= player.acceleration.rotation;
    }
    
    // Update position
    spaceship.position.x += player.inertia.x / 100;
    spaceship.position.y += player.inertia.y / 100;
    spaceship.rotation.z = (player.direction-90) / 57.5;

    // Lock position
    if (spaceship.position.x < -(view.width / 2)) {
        spaceship.position.x += view.width;
    }
    if (spaceship.position.x > (view.width / 2)) {
        spaceship.position.x -= view.width;
    }
    if (spaceship.position.y < -(view.height / 2)) {
        spaceship.position.y += view.height;
    }
    if (spaceship.position.y > (view.height / 2)) {
        spaceship.position.y -= view.height;
    }

    renderer.render( scene, camera );
}
render();