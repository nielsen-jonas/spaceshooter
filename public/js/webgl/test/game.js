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
        rotation: 0.2
    },
    passive_deceleration: {
        break: 0.1,
        rotation: 0.01
    }
}

var view = {
    width: 42.87,
    height: 24
}

// Rendering the scene
function render() {
    requestAnimationFrame( render );
    
    // Bullet animation
    var tmp = [];
    projectiles.forEach(function(projectile, index) {
        projectile.position.x += projectile.inertia.x;
        projectile.position.y += projectile.inertia.y;
        projectile.translateY(.6);

        // Kill projectile
        if ( projectile.position.x < -(view.width / 2) ||
            projectile.position.x > (view.width / 2) ||
            projectile.position.y < -(view.height / 2) ||
            projectile.position.y > (view.height / 2)) {
            scene.remove(projectile);
        } else {
            tmp.push(projectile);
        }
    });
    projectiles = tmp;

    // Fire bullet
    if (key.fire) {
        fire(spaceship.position.x, spaceship.position.y, player.inertia.x, player.inertia.y, spaceship.rotation.z);
    }

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
    if (key.stall) {
        activeDeceleration();
    } else {
        passiveDeceleration();
    }
    if (key.break) {
        player.inertia.x -= Math.cos(toRadians(player.direction)) * player.acceleration.break;
        player.inertia.y -= Math.sin(toRadians(player.direction)) * player.acceleration.break;
    } else if (key.thrust) {
        player.inertia.x += Math.cos(toRadians(player.direction)) * player.acceleration.thrust;
        player.inertia.y += Math.sin(toRadians(player.direction)) * player.acceleration.thrust;
    }
    if (key.yaw.left) {
        player.inertia.rotation += player.acceleration.rotation;
    }
    if (key.yaw.right) {
        player.inertia.rotation -= player.acceleration.rotation;
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

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

function passiveDeceleration () {
    // Decelerate rotation
    if (!key.yaw.left && !key.yaw.right) {
        if (player.inertia.rotation != 0) {
            if (Math.abs(player.inertia.rotation) < player.acceleration.rotation) {
                player.inertia.rotation = 0;
            } else if (player.inertia.rotation > 0) {
                player.inertia.rotation -= player.passive_deceleration.rotation;
            } else if (player.inertia.rotation < 0) {
                player.inertia.rotation += player.passive_deceleration.rotation;
            }
        }
    }
    
    // Fix inertia
    if (!key.thrust && !key.break) {
        if (player.velocity.magnitude > 0) {
            player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.passive_deceleration.break;
            player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.passive_deceleration.break;
        }
    }
}

function activeDeceleration () {
    // Decelerate rotation
    if (!key.yaw.left && !key.yaw.right) {
        if (player.inertia.rotation != 0) {
            if (Math.abs(player.inertia.rotation) < player.acceleration.rotation) {
                player.inertia.rotation = 0;
            } else if (player.inertia.rotation > 0) {
                player.inertia.rotation -= player.acceleration.rotation;
            } else if (player.inertia.rotation < 0) {
                player.inertia.rotation += player.acceleration.rotation;
            }
        }
    }
    
    // Fix inertia
    if (!key.thrust && !key.break) {
        if (player.velocity.magnitude > 0) {
            player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.acceleration.break;
            player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.acceleration.break;
        }
    }
}