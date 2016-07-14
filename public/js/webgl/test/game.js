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
        strafe: .8,
        break: 1,
        rotation: 0.1
    },
    passive_deceleration: {
        break: 0.1,
        rotation: 0.01
    },
    weapon: {
        blaster: {
            firerate: 0.05,
            recoil: 3,
            overheat: 0.01,
            cooldown: 0.995
        }
    }
}

var view = {
    width: 42.87,
    height: 24
}

fireTimer = new THREE.Clock( true );
firerate = player.weapon.blaster.firerate;
// Rendering the scene
function render() {
    requestAnimationFrame( render );
    
    // Update rock
    rock.rotation.z += 0.1;

    // Bullet animation
    var tmp = [];
    projectiles.forEach(function(projectile, index) {
        // Update position
        projectile.position.x += projectile.inertia.x;
        projectile.position.y += projectile.inertia.y;
        projectile.translateY(.6);
        projectile.timer --;
        
        if (sphereCollision( projectile, rock )) {
            projectile.alive = false;
        } else if ( outsideView( projectile ) ) {
            projectile.alive = false;
        } else if (projectile.timer <= 0) {
            projectile.alive = false;
        }

        if (projectile.alive) {
            tmp.push( projectile );
        } else {
            // Kill projectile
            killProjectile( projectile );
        }
    });
    projectiles = tmp;

    // Fire bullet
    if (key.fire) {
        if (fireTimer.getElapsedTime() >= firerate) {
            firerate += player.weapon.blaster.overheat;
            fireTimer = new THREE.Clock( true );
            fire(spaceship.position.x, spaceship.position.y, player.inertia.x, player.inertia.y, spaceship.rotation.z);
            // recoil
            if (!key.stall) {
                player.inertia.x -= Math.cos(toRadians(player.direction)) * player.weapon.blaster.recoil;
                player.inertia.y -= Math.sin(toRadians(player.direction)) * player.weapon.blaster.recoil;
            }
        }
    } else if (firerate > player.weapon.blaster.firerate) {
        firerate *= player.weapon.blaster.cooldown;
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

    // Controls
    if (key.stall) {
        activeDeceleration();
    } else {
        passiveDeceleration();
    }

    if (key.thrust) {
        player.inertia.x += Math.cos(toRadians(player.direction)) * player.acceleration.thrust;
        player.inertia.y += Math.sin(toRadians(player.direction)) * player.acceleration.thrust;
    } else if (key.break) {
        player.inertia.x -= Math.cos(toRadians(player.direction)) * player.acceleration.break;
        player.inertia.y -= Math.sin(toRadians(player.direction)) * player.acceleration.break;
    }

    if (key.yaw.left) {
        player.inertia.rotation += player.acceleration.rotation;
    }
    if (key.yaw.right) {
        player.inertia.rotation -= player.acceleration.rotation;
    }

    if (key.strafe.left) {
        player.inertia.x += Math.cos(toRadians(player.direction+90)) * player.acceleration.strafe;
        player.inertia.y += Math.sin(toRadians(player.direction+90)) * player.acceleration.strafe;
    }
    if (key.strafe.right) {
        player.inertia.x += Math.cos(toRadians(player.direction-90)) * player.acceleration.strafe;
        player.inertia.y += Math.sin(toRadians(player.direction-90)) * player.acceleration.strafe;
    }
    
    // Update position
    spaceship.position.x += player.inertia.x / 400;
    spaceship.position.y += player.inertia.y / 400;
    spaceship.rotation.z = toRadians((player.direction-90));

    // Lock: position
    limitToView ( spaceship );

    renderer.render( scene, camera );
}
render();

function limitToView ( object ) {
    if (object.position.x < -(view.width / 2)) {
        object.position.x += view.width;
    }
    if (object.position.x > (view.width / 2)) {
        object.position.x -= view.width;
    }
    if (object.position.y < -(view.height / 2)) {
        object.position.y += view.height;
    }
    if (object.position.y > (view.height / 2)) {
        object.position.y -= view.height;
    }
}

function outsideView ( object ) {
    return (object.position.x < -(view.width / 2) ||
    object.position.x > (view.width / 2) ||
    object.position.y < -(view.height / 2) ||
    object.position.y > (view.height / 2));
}

function sphereCollision (a, b) {
    if (a.position.x > (b.position.x + b.scale.x)) {
        return false;
    }
    if (a.position.x < (b.position.x - b.scale.x)) {
        return false;
    }
    if (a.position.y > (b.position.y + b.scale.y)) {
        return false;
    }
    if (a.position.y < (b.position.y - b.scale.y)) {
        return false;
    }
    return true;
}

function killProjectile ( projectile ) {
    scene.remove( projectile );
};

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
    if (!key.thrust && !key.break && !key.strafe.left && !key.strafe.right) {
        if (player.velocity.magnitude > 0) {
            player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.acceleration.break;
            player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.acceleration.break;
        }
    }
}