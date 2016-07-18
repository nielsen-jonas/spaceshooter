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
        strafe: 1.25,
        break: 1,
        rotation: 0.1
    },
    max: {
        speed: 200,
        rotation: 3
    },
    passive_deceleration: {
        break: 0.1,
        rotation: 0.1
    },
    weapon: {
        blaster: {
            firerate: .2,
            recoil: 1.8,
            overheat: 0,
            cooldown: 0
        }
    }
}

var view = {
    width: 42.87,
    height: 24
}

fireTimer = new THREE.Clock( true );
firerate = player.weapon.blaster.firerate;

createRock(4,0,.01,.03, 6);

// Rendering the scene
function render() {
    requestAnimationFrame( render );
    
    /* PARTICLE EXPERIMENTAL */
        var pCount = parts.length;
        while(pCount--) {
        parts[pCount].update();
        }
    /* END PARTICLE EXPERIMENTAL */



    // TODO: Find out why inertia variables arent arent still when not moving
    if (Math.abs(player.inertia.x) < .1) {
        player.inertia.x = 0;
    }
    if (Math.abs(player.inertia.y) < .1) {
        player.inertia.y = 0;
    }

    // Collision: Rock/Projectile
    rocks.forEach( function( rock, index ) {
        projectiles.forEach( function( projectile, index ) {
            if ( projectileRockCollision( projectile, rock )) {
                projectile.alive = false;
                if ( rock.time > 10) {
                    rock.health--;
                }
            }
        });
    });

    rocks.forEach( function( rock, index ) {
        // Collision: Rock/Projectile
        projectiles.forEach( function( projectile, index ) {
            if ( projectileRockCollision( projectile, rock )) {
                projectile.alive = false;
                if ( rock.time > 20) {
                    rock.health--;
                }
            }
        });
        // Collision: Rock/Player
        if (projectileRockCollision( spaceship, rock )) {
             spaceship.position.x = 0;
             spaceship.position.y = 0;
             player.inertia.x = 0;
             player.inertia.y = 0;
             player.direction = 0;
        }
    });

    // Update: Projectile
    projectileUpdate();

    // Update: Rock
    rockUpdate();

    // Fire bullet
    if (key.fire) {
        playerWeaponBlasterFire();
    } else {
        playerWeaponBlasterCooldown();
    }

    // Physics: Player rotation
    player.direction += player.inertia.rotation;
    player.direction = lockDegrees(player.direction + player.inertia.rotation);

    // Calculate: player.velocity.direction
    if (playerGetVelocityDirection()) {
        player.velocity.direction = lockDegrees(playerGetVelocityDirection());
    }

    // Calculate: player.velocity.magnitude
    player.velocity.magnitude = playerGetVelocityMagnitude();

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

    renderer.render( scene, camera );
}
render();

function rockUpdate() {
    var kill = [];
    var tmp = [];
    rocks.forEach( function( rock, index ) {
        // Update position
        rock.time++;
        rock.position.x += rock.inertia.x;
        rock.position.y += rock.inertia.y;

        limitToView ( rock );

        if ( rock.health <= 0 ) {
            kill.push( rock );
            killRock( rock );
        } else {
            tmp.push( rock );
        }
    });
    rocks = tmp;
    kill.forEach( function( rock, index ) {
        parts.push(new ExplodeAnimation(rock.position.x, rock.position.y));
        if ( rock.type >= 2 ) {
            var inertia = rockInertia();
            createRock( rock.position.x, rock.position.y, rock.inertia.x + inertia[0].x, rock.inertia.y + inertia[0].y, rock.type - 1 );
            createRock( rock.position.x, rock.position.y, rock.inertia.x + inertia[1].x, rock.inertia.y + inertia[1].y, rock.type - 1 );
        }
    });
}
function myRand( min, max ) {
    return Math.floor(Math.random()*(max-min+1)+min); 
}
function rockInertia() {
    function rockInertiaRand() {
        return .008 * myRand( -10, 10);
    };
    return [
        {
            x: rockInertiaRand(),
            y: rockInertiaRand()
        },
        {
            x: rockInertiaRand(),
            y: rockInertiaRand()
        },
        {
            x: rockInertiaRand(),
            y: rockInertiaRand()
        }]
}
function projectileUpdate() {
    var tmp = [];
    projectiles.forEach( function( projectile, index ) {
        // Update position
        projectile.position.x += projectile.inertia.x;
        projectile.position.y += projectile.inertia.y;
        projectile.translateY(.6);
        projectile.timer --;
        
        limitToView( projectile );

        if (projectile.timer <= 0) {
            projectile.alive = false;
        }

        if (projectile.alive) {
            tmp.push( projectile );
        } else {
            // Kill projectile
            killObject( projectile );
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
    soundPlay( 'Thrust' );
    player.inertia.x += Math.cos(toRadians(player.direction+90)) * player.acceleration.strafe;
    player.inertia.y += Math.sin(toRadians(player.direction+90)) * player.acceleration.strafe;
}
function playerStrafeRight() {
    soundPlay( 'Thrust' );
    player.inertia.x += Math.cos(toRadians(player.direction-90)) * player.acceleration.strafe;
    player.inertia.y += Math.sin(toRadians(player.direction-90)) * player.acceleration.strafe;
}
function playerThrust() {
    soundPlay( 'Thrust' );
    player.inertia.x += Math.cos(toRadians(player.direction)) * player.acceleration.thrust;
    player.inertia.y += Math.sin(toRadians(player.direction)) * player.acceleration.thrust;
}
function playerBreak() {
    soundPlay( 'Thrust' );
    player.inertia.x -= Math.cos(toRadians(player.direction)) * player.acceleration.break;
    player.inertia.y -= Math.sin(toRadians(player.direction)) * player.acceleration.break;
}

function playerEqualize(rotate = 0) {
    var DR = lockDegrees(player.direction - (player.velocity.direction) + rotate );
    var DL = lockDegrees(player.velocity.direction - (player.direction) + rotate );
    var V = player.inertia.rotation; // R: (-), L: (+) 
    var aV = Math.abs(V);
    if ( DR < 1 || DL < 1) {
        if (aV < 1) {
            player.direction = player.velocity.direction - rotate ;
            player.inertia.rotation = 0;
        } 
    } else if (aV > 4) {
        if (V > 0) {
            playerYawRight();
        } else {
            playerYawLeft();
        }
    } else {
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
            var R = (V*V)/(DL);
            if ( R < Mid) {
                playerYawLeft( player.acceleration.rotation * 6 );
            } else {
                playerYawRight( player.acceleration.rotation );
            }
        } else {
            // Rotate right
            var R = (V*V)/(DR);
            if ( R < Mid) {
                playerYawRight( player.acceleration.rotation * 6 );
            } else {
                playerYawLeft( player.acceleration.rotation );
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

function projectileRockCollision (projectile, rock) {
    if (projectile.position.x > (rock.position.x + rock_radius[rock.type-1])) {
        return false;
    }
    if (projectile.position.x < (rock.position.x - rock_radius[rock.type-1])) {
        return false;
    }
    if (projectile.position.y > (rock.position.y + rock_radius[rock.type-1])) {
        return false;
    }
    if (projectile.position.y < (rock.position.y - rock_radius[rock.type-1])) {
        return false;
    }
    return true;
}

function killObject ( object ) {
    scene.remove( object );
}

function killRock ( rock ) {
    switch( rock.type ) {
        case 1:
        case 2:
            soundPlay( 'BangSm' );
            break;
        case 3:
        case 4:
            soundPlay( 'BangMd' );
            break;
        case 5:
        case 6:
            soundPlay( 'BangLg' );
            break;
    }
    killObject( rock );
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
        if (Math.abs(player.inertia.rotation) <= player.acceleration.rotation) {
            player.inertia.rotation = 0;
        } else if (player.inertia.rotation > 0) {
            player.inertia.rotation -= player.acceleration.rotation;
        } else if (player.inertia.rotation < 0) {
            player.inertia.rotation += player.acceleration.rotation;
        }
    }
    
    // Fix inertia
    if (player.velocity.magnitude > 1) {
        soundPlay( 'Thrust' );
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