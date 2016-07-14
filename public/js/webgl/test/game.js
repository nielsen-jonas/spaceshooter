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
        rotation: 0.14
    },
    max: {
        speed: 200,
        rotation: 8
    },
    passive_deceleration: {
        break: 0.1,
        rotation: 0.01
    },
    weapon: {
        blaster: {
            firerate: 0.05,
            recoil: 1.8,
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
    rock.position.x += 0.2;
    rock.position.y -= 0.05;

    // Projectile step
    projectileUpdate();

    // Fire bullet
    if (key.fire) {
        playerWeaponBlasterFire();
    } else {
        playerWeaponBlasterCooldown();
    }

    // Physics: Player rotation
    player.direction += player.inertia.rotation;

    // Calculate: player.velocity.direction
    player.velocity.direction = playerGetVelocityDirection();

    // Calculate: player.velocity.magnitude
    player.velocity.magnitude = playerGetVelocityMagnitude();

    // Lock: direction
    player.direction = lockDegrees(player.direction);
    player.velocity.direction = lockDegrees(player.velocity.direction);

    // Limit: speed
    playerLimitSpeed();

    // Controls
    if (key.stall) {
        activeDeceleration();
    } else {
        passiveDeceleration();

        if (key.thrust) {
            playerThrust();
        } else if (key.break) {
            playerBreak();
        }

        if (key.yaw.left) {
            if (player.inertia.rotation < player.max.rotation) {
                playerYawLeft();
            }
        }
        if (key.yaw.right) {
            if (player.inertia.rotation > -player.max.rotation) {
                playerYawRight();
            }
        }

        if (key.strafe.left) {
            playerStrafeLeft();
        }
        if (key.strafe.right) {
            playerStrafeRight();
        }
        
        if (!key.yaw.left && !key.yaw.right) {
            if (key.calibrate.forward) {
                playerEqualize();
            } else if (key.calibrate.backward){
                playerEqualize( 180 );
            }
        }
    }
    
    // Update position
    spaceship.position.x += player.inertia.x / 400;
    spaceship.position.y += player.inertia.y / 400;
    spaceship.rotation.z = toRadians((player.direction-90));

    // Lock: position
    limitToView ( spaceship );
    limitToView ( rock );

    renderer.render( scene, camera );
}
render();

function projectileUpdate() {
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
}

function playerWeaponBlasterFire() {
    if (fireTimer.getElapsedTime() >= firerate) {
        firerate += player.weapon.blaster.overheat;
        fireTimer = new THREE.Clock( true );
        fire(spaceship.position.x, spaceship.position.y, player.inertia.x, player.inertia.y, spaceship.rotation.z);
        // recoil
        player.inertia.x -= Math.cos(toRadians(player.direction)) * player.weapon.blaster.recoil;
        player.inertia.y -= Math.sin(toRadians(player.direction)) * player.weapon.blaster.recoil;
    }
}
function playerWeaponBlasterCooldown() {
    if (firerate > player.weapon.blaster.firerate) {
        firerate *= player.weapon.blaster.cooldown;
    }
}

function playerGetVelocityDirection() {
    if (player.inertia.x >= 0 && player.inertia.y >= 0) {
        // x y
        return toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    } else if (player.inertia.x >= 0 && player.inertia.y < 0) {
        // x -y
        return 360 + toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    } else {
        // -x y
        // -x -y
        return 180 + toDegrees(Math.atan(player.inertia.y / player.inertia.x));
    }
}
function playerGetVelocityMagnitude() {
    return Math.sqrt(Math.pow(player.inertia.x, 2) + Math.pow(player.inertia.y, 2));
}

function playerYawLeft( acceleration = player.acceleration.rotation ) {
    player.inertia.rotation += acceleration;
}
function playerYawRight( acceleration = player.acceleration.rotation ) {
    player.inertia.rotation -= acceleration;
}
function playerStrafeLeft() {
    player.inertia.x += Math.cos(toRadians(player.direction+90)) * player.acceleration.strafe;
    player.inertia.y += Math.sin(toRadians(player.direction+90)) * player.acceleration.strafe;
}
function playerStrafeRight() {
    player.inertia.x += Math.cos(toRadians(player.direction-90)) * player.acceleration.strafe;
    player.inertia.y += Math.sin(toRadians(player.direction-90)) * player.acceleration.strafe;
}
function playerThrust() {
    player.inertia.x += Math.cos(toRadians(player.direction)) * player.acceleration.thrust;
    player.inertia.y += Math.sin(toRadians(player.direction)) * player.acceleration.thrust;
}
function playerBreak() {
    player.inertia.x -= Math.cos(toRadians(player.direction)) * player.acceleration.break;
    player.inertia.y -= Math.sin(toRadians(player.direction)) * player.acceleration.break;
}

function playerEqualize(rotate = 0) {
        if (player.velocity.magnitude > 0) {
        var DR = lockDegrees(player.direction - (player.velocity.direction) + rotate );
        var DL = lockDegrees(player.velocity.direction - (player.direction) + rotate );
        if ( DR < 2 || DL < 2) {
            if (Math.abs(player.inertia.rotation) < 2) {
                player.direction = player.velocity.direction - rotate ;
                player.inertia.rotation = 0;
            }
        } else {
            var V = player.inertia.rotation; // R: (-), L: (+) 
            if (V != 0) {
                var TL = DL/V;
                var TR = DR/V;
            } else {
                var TL = DL;
                var TR = DR;
            }

            if (TL < 0) {
                TL = Math.abs(TL) * (1 + Math.abs(V)) / player.acceleration.rotation;
            }
            if (TR < 0) {
                TR = Math.abs(TR) * (1 + Math.abs(V)) / player.acceleration.rotation;
            }
            var Mid = .05;
            if (TL < TR) {
                // Rotate left
                var R = V/DL;
                if ( R < Mid)
                {
                    playerYawLeft();
                } else {
                    playerYawRight();
                }
            } else {
                // Rotate right
                var R = V/DR;
                //console.log('Right: ' + String(R));
                if ( R < Mid) {
                    playerYawRight();
                } else {
                    playerYawLeft();
                }
            }
        }
    } else {
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
}

function lockDegrees ( deg ) {
    var tmp = deg;
    while (tmp > 360) {
        tmp -= 360;
    }
    while (tmp < 0) {
        tmp += 360;
    }
    return tmp;
}
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
}

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
    if (player.velocity.magnitude > 0) {
        player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.acceleration.break;
        player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.acceleration.break;
    }
}

function playerLimitSpeed () {
    if (player.velocity.magnitude > player.max.speed) {
        if (player.velocity.magnitude > 0) {
            player.inertia.x -= Math.cos(toRadians(player.velocity.direction)) * player.acceleration.thrust;
            player.inertia.y -= Math.sin(toRadians(player.velocity.direction)) * player.acceleration.thrust;
        }
    }
}



/*if (key.calibrate.forward) {
            if (player.velocity.magnitude > 0) {
                var DR = lockDegrees(player.direction - player.velocity.direction);
                var DL = lockDegrees(player.velocity.direction - player.direction);
                if ( DR < 2 || DL < 2) {
                    if (Math.abs(player.inertia.rotation) < .2) {
                        player.direction = player.velocity.direction;
                        player.inertia.rotation = 0;
                    }
                } else {
                    var V = player.inertia.rotation; // R: (-), L: (+) 
                    if (V != 0) {
                        var TL = DL/V;
                        var TR = DR/V;
                    } else {
                        var TL = DL;
                        var TR = DR;
                    }

                    if (TL < 0) {
                        TL = Math.abs(TL) * (1 + Math.abs(V)) / player.acceleration.rotation;
                    }
                    if (TR < 0) {
                        TR = Math.abs(TR) * (1 + Math.abs(V)) / player.acceleration.rotation;
                    }
                    var Mid = .05;
                    if (TL < TR) {
                        // Rotate left
                        var R = V/DL;
                        if ( R < Mid)
                        {
                            playerYawLeft();
                        } else {
                            playerYawRight();
                        }
                    } else if (TR < TL){
                        // Rotate right
                        var R = V/DR;
                        //console.log('Right: ' + String(R));
                        if ( R < Mid) {
                            playerYawRight();
                        } else {
                            playerYawLeft();
                        }
                    }
                }
            }
        }*/