// Player properties
var player = {
    inertia: {
        x: 0,
        y: 0,
        rotation: 0
    },
    velocity: {
        direction: 0,
        magnitude: 0
    },
    direction: 0,
    acceleration: {
        thrust: 1.5,
        break: 1,
        rotation: 0.1
    }
}

var view = {
    width: 42.87,
    height: 24
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

// Rendering the scene
function render() {
    requestAnimationFrame( render );

    // Physics: Player rotation
    player.direction += player.inertia.rotation;

    // Calculate: player.velocity.direction
    if (player.inertia.x >= 0 && player.inertia.y >= 0) {
        // x y
        player.velocity.direction = toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    } else if (player.inertia.x >= 0 && player.inertia.y < 0) {
        // x -y
        player.velocity.direction = 360 + toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    } else {
        // -x y
        // -x -y
        player.velocity.direction = 180 + toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    }

    // Calculate: player.velocity.magnitude
    player.velocity.magnitude = Math.sqrt(Math.pow(player.inertia.x, 2) + Math.pow(player.inertia.y, 2));

    // Lock: direction
    if (player.direction > 360) {
        player.direction -= 360;
    }
    if (player.direction < 0) {
        player.direction += 360;
    }

    // Input
    if (key.down.q) {
        // Decelerate rotation
        if (player.inertia.rotation != 0) {
            if (Math.abs(player.inertia.rotation) < player.acceleration.rotation) {
                player.inertia.rotation = 0;
            } else if (player.inertia.rotation > 0) {
                player.inertia.rotation -= player.acceleration.rotation;
            } else if (player.inertia.rotation < 0) {
                player.inertia.rotation += player.acceleration.rotation;
            }
        }
        
        // Fix inertia
        player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.acceleration.break;
        player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.acceleration.break;
    } else {
        if (key.down.w || key.down.up) {
            player.inertia.x += Math.cos(toRadians(player.direction)) * player.acceleration.thrust;
            player.inertia.y += Math.sin(toRadians(player.direction)) * player.acceleration.thrust;
        }
        if (key.down.s || key.down.down) {
            player.inertia.x -= Math.cos(toRadians(player.direction)) * player.acceleration.break;
            player.inertia.y -= Math.sin(toRadians(player.direction)) * player.acceleration.break;
        }
        if (key.down.a || key.down.left) {
            player.inertia.rotation += player.acceleration.rotation;
        }
        if (key.down.d || key.down.right) {
            player.inertia.rotation -= player.acceleration.rotation;
        }
    }
    
    // Update position
    spaceship.position.x += player.inertia.x / 400;
    spaceship.position.y += player.inertia.y / 400;
    spaceship.rotation.z = toRadians((player.direction-90));

    // Lock: position
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