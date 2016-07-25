var EnumRoomState = {
    CONSTRUCT: 0,
    LOOP: 1,
    DESTRUCT: 2
}

var EnumPlayerState = {
    SPAWN: 0,
    ALIVE: 1
}

var EnumGameRoom = {
    INIT: 0,
    MENU: 1,
    GAME_ENTER: 2,
    LEVEL_PLAYING: 3,
    LEVEL_COMPLETE: 4,
    LEVEL_PAUSE: 5,
    GAME_OVER: 6
}

var CtlGame = {
    room: EnumGameRoom.INIT,
    level: 1,
    score: 0,
    score_pre: 0,
    lives_score: 0,
    lives: 3,
    lives_pre: 3,
    rocks: [],
    projectiles: [],
    explosions: []
};

var CtlRoom = {
    init: {
        state: EnumRoomState.CONSTRUCT
    },
    menu: {
        state: EnumRoomState.CONSTRUCT
    },
    game: {
        state: EnumRoomState.CONSTRUCT
    },
    game_over: {
        state: EnumRoomState.CONSTRUCT
    },
    pause: {
        state: EnumRoomState.CONSTRUCT
    }

}

// Player properties
var player = {
    state: {
        player: EnumPlayerState.SPAWN,
        player_pre: EnumPlayerState.ALIVE,
        spawn_cooldown: 160,
        fire_timer: new THREE.Clock( true )
    },
    spawn_cooldown: 160,
    hyperspace: {
        out: false,
        in: false,
        cooldown: 0
    },
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
        strafe: 1.5,
        break: 1.5,
        rotation: .14
    },
    max: {
        speed: 200,
        rotation: 3
    },
    passive_deceleration: {
        break: 0.1,
        rotation: .14
    },
    weapon: {
        blaster: {
            firerate: .16,
        }
    }
}

var view = {
    width: 54,
    height: 30.23
}

$( document ).ready( function () {
    render();
});

function myRand( min, max ) {
    return Math.floor(Math.random()*(max-min+1)+min); 
}

function render() {
    requestAnimationFrame( render );
    
    switch( CtlGame.room ) {
        case EnumGameRoom.INIT:
            init();
            break;
        case EnumGameRoom.MENU:
            menu();
            break;
        case EnumGameRoom.GAME_ENTER:
            game_enter();
            break;
        case EnumGameRoom.LEVEL_PLAYING:
            level_playing();
            break;
        case EnumGameRoom.LEVEL_COMPLETE:
            level_complete();
            break;
        case EnumGameRoom.LEVEL_PAUSE:
            level_pause();
            break;
        case EnumGameRoom.GAME_OVER:
            game_over();
            break;
    }

    renderer.render( scene, camera );

    // Pressed keys reset
    keypress.reset();

    return 0;

    function init() {
        CtlGame.room = EnumGameRoom.MENU;
        return 0;
    }

    function menu() {
        switch (CtlRoom.menu.state) {
            case EnumRoomState.CONSTRUCT:
                menuConstruct();
                break;
            case EnumRoomState.LOOP:
                menuLoop();
                break;
        }

        return 0;
        function menuConstruct(){
            myGlobals.sound.stop();
            myGlobals.sound.clip.Menu.play( { loop: -1 } );
            hudReset();
            $( '#hud-menu-main' ).show( 600 );
            CtlRoom.menu.state = EnumRoomState.LOOP;
            return 0;
        }
        function menuLoop(){
            $( '#hud-menu-main-start' ).click(function(e){
                e.preventDefault();
                CtlGame.room = EnumGameRoom.GAME_ENTER;
                return false;
            });
            particleExplosionUpdate();
            projectileUpdate();
            rockUpdate();
            return 0;
        }
    }

    function game_enter() {
        myGlobals.sound.stop();
        myGlobals.sound.clip.Thrust.position = 0;
        myGlobals.sound.clip.Thrust.play( {loop: -1} );
        myGlobals.sound.clip.Thrust.volume = 0;
        sceneReset();
        stateResetGame();
        hudReset();
        if ( !$('#hud-level-container').is( ':visible' )) {
            $( '#hud-level-container' ).show( 600 );
        } 
        scene.add( spaceship );

        $( '#hud-score' ).html(hudRenderScore( CtlGame.score ));
        $( '#hud-lives' ).html(hudRenderLives( CtlGame.lives ));
        var inertia = rockInertia();
        var rand_pos = randomViewPosition();
        createRock(
            3,
            rand_pos.x,
            rand_pos.y,
            inertia.x,
            inertia.y,
            [
                inertia.x*.1,
                inertia.y*.1,
                inertia.z*.1
            ]
        );
        CtlGame.room = EnumGameRoom.LEVEL_PLAYING;
        return 0;
    }
    function level_complete() {
        for (var i = 0; i <= CtlGame.level; i++) {
            var inertia = rockInertia();
            var rand_pos = randomViewPosition();
            createRock(
                3,
                rand_pos.x,
                rand_pos.y,
                inertia.x,
                inertia.y,
                [
                    inertia.x*.1,
                    inertia.y*.1,
                    inertia.z*.1
                ]
            );
        }
        CtlGame.room = EnumGameRoom.LEVEL_PLAYING;
        CtlGame.level ++;
        player.state.player = EnumPlayerState.SPAWN;
        return 0;
    }
    function game_over() {
        switch ( CtlRoom.game_over.state ) {
            case EnumRoomState.CONSTRUCT:
                gameOverConstruct();
                break;
            case EnumRoomState.LOOP:
                gameOverLoop();
                break;
        }
        return 0;
        function gameOverConstruct() {
            hudReset();
            if ( !$('#hud-game-over-container').is( ':visible' )) {
                $( '#hud-game-over-container' ).show( 600 );
            }
            $( '#hud-game-over-score' ).html(hudRenderScore( CtlGame.score ));
            scene.remove( spaceship );
            myGlobals.sound.stop();
            myGlobals.sound.clip.GameOver.play( { loop: -1 } );
            CtlRoom.game_over.state = EnumRoomState.LOOP;
            return 0;
        }
        function gameOverLoop() {
            $( '#hud-game-over-menu' ).click(function(e){
                e.preventDefault();
                stateResetMenu();
                stateResetGameOver();
                CtlGame.room = EnumGameRoom.MENU;
                return false;
            });
            particleExplosionUpdate();
            projectileUpdate();
            rockUpdate();
            return 0;
        }
    }

    function level_pause() {

        switch ( CtlRoom.pause.state ) {
            case EnumRoomState.CONSTRUCT:
                pauseConstruct();
                break;
            case EnumRoomState.LOOP:
                pauseLoop();
                break;
            case EnumRoomState.DESTRUCT:
                pauseUnpause();
                break;
        }

        return 0;

        function pauseConstruct() {
            $( '#hud-pause-container' ).show();
            myGlobals.sound.pause();
            CtlRoom.pause.state = EnumRoomState.LOOP;
            return 0;
        }

        function pauseLoop() {
            // Unpause
            if ( keypress.pause ) {
                CtlRoom.pause.state = EnumRoomState.DESTRUCT;
            }
            return 0;
        }

        function pauseUnpause() {
            $( '#hud-pause-container' ).hide();
            myGlobals.sound.unpause();
            stateResetPause();
            CtlGame.room = EnumGameRoom.LEVEL_PLAYING;
            return 0;
        }
    }

    function level_playing() {
        // Pause
        if ( keypress.pause ) {
            CtlGame.room = EnumGameRoom.LEVEL_PAUSE;
            return 0;
        }
        // Level win condition
        if ( CtlGame.rocks.length == 0 ) {
            CtlGame.room = EnumGameRoom.LEVEL_COMPLETE;
            return 0;
        }
        // Update score
        if (CtlGame.score_pre != CtlGame.score) {
            CtlGame.lives_score += CtlGame.score - CtlGame.score_pre;
            CtlGame.score_pre = CtlGame.score;
            $( '#hud-score' ).html(hudRenderScore( CtlGame.score ));
            // Extra life
            if ( CtlGame.lives_score >= 10000) {
                CtlGame.lives_score -= 10000;
                CtlGame.lives ++;
            }
        }
        // Update lives
        if (CtlGame.lives_pre != CtlGame.lives) {
            CtlGame.lives_pre = CtlGame.lives;
            $( '#hud-lives' ).html(hudRenderLives( CtlGame.lives ));
            if (CtlGame.lives <= 0) {
                CtlGame.room = EnumGameRoom.GAME_OVER;
            }
        }

        // Test player state change
        if (player.state.player_pre != player.state.player ) {
            player.state.player_pre = player.state.player;
            if (player.state.player == EnumPlayerState.ALIVE ) {
                spaceship_material.emissive.setRGB( 0, 0, 0 );
            } else {
                player.state.spawn_cooldown = player.spawn_cooldown;
            }
        }

        // Player state spawn
        if (player.state.player == EnumPlayerState.SPAWN) {
            if ( player.state.spawn_cooldown > 0 ) {
                var sin = Math.sin(player.state.spawn_cooldown);
                if ( sin > .5 ) {
                    sin = .5;
                } else if ( sin < 0 ) {
                    sin = 0;
                }
                spaceship_material.emissive.setRGB( sin, sin, sin);
                player.state.spawn_cooldown --;
            } else {
                player.state.player = EnumPlayerState.ALIVE;
            }
        }

        // Thrust volume control based on key input
        soundThrustCtl();

        // Particle explosion update
        particleExplosionUpdate();

        // TODO: Find out why inertia variables arent arent still when not moving
        if (Math.abs(player.inertia.x) < .1) {
            player.inertia.x = 0;
        }
        if (Math.abs(player.inertia.y) < .1) {
            player.inertia.y = 0;
        }

        CtlGame.rocks.forEach( function( rock, index ) {
            // Collision: Rock/Projectile
            CtlGame.projectiles.forEach( function( projectile, index ) {
                if ( projectileRockCollision( projectile, rock )) {
                    projectile.alive = false;
                    if ( rock.time > 4) {
                        rock.alive = false;
                    }
                }
            });
            // Collision: Rock/Player
            if ( player.state.player == EnumPlayerState.ALIVE ) {
                if (spaceshipRockCollision( spaceship, rock )) {
                    playerDie();
                }
            }
        });

        // Update: Projectile
        projectileUpdate();

        // Update: Rock
        rockUpdate();

        // Fire bullet
        if (key.fire) {
            playerWeaponBlasterFire();
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
        passiveDeceleration();
        if (key.stall) {
            activeDeceleration();
        }

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

        if ( keypress.hyperspace ) {
            keypress.hyperspace = false;
            if ( player.hyperspace.cooldown == 0 ) {
                playerHyperspaceInit();
            }
        }

        if ( player.hyperspace.out ) {
            playerHyperspaceOut();
        } else if ( player.hyperspace.in ) {
            playerHyperspaceIn();
        } else if ( player.hyperspace.cooldown > 0 ) {
            player.hyperspace.cooldown --;
        }
    
        // Update position
        spaceship.position.x += player.inertia.x / 400;
        spaceship.position.y += player.inertia.y / 400;
        spaceship.rotation.z = toRadians((player.direction-90));

        // Lock: position
        limitToView ( spaceship );

        return 0;

        // Functions
        function playerDie() {
            if ( CtlGame.lives > 2 ) {
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0xEE0000, 1600, 1.6, .12));
            } else if ( CtlGame.lives == 2 ) {
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0xEEEE00, 1600, 1.6, .12));
            } else {
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600, 1.6, .12));
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600));
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600, .4, .12, 10000, null));
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600, .2, .12, 10000, null));
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600, .1, .12, 10000, null));
                CtlGame.explosions.push(new ParticleExplosion(spaceship.position.x, spaceship.position.y, 0x00BB00, 1600, .06, .12, 10000, null));
            }
            player.state.player = EnumPlayerState.SPAWN;
            spaceship.position.x = 0;
            spaceship.position.y = 0;
            player.inertia.x = 0;
            player.inertia.y = 0;
            player.direction = 0;
            CtlGame.lives -= 1;
            return 0;
        }

        function fire ( origin_x, origin_y, origin_z, inertia_x, inertia_y, rotation_z ) {
            myGlobals.sound.clip.Blaster.position = 0;
            myGlobals.sound.clip.Blaster.play();
            var projectile = new THREE.Mesh( projectile_geometry, projectile_material );
            projectile.position.x = origin_x;
            projectile.position.y = origin_y;
            projectile.position.z = origin_z;
            projectile.rotation.z = rotation_z;
            projectile.inertia = {};
            projectile.timer = 32;
            projectile.inertia.x = inertia_x / 380;
            projectile.inertia.y = inertia_y / 380;
            projectile.alive = true;
            CtlGame.projectiles.push( projectile );
            scene.add( projectile );
        }

        function playerWeaponBlasterFire() {
            if ( Math.abs( spaceship.position.z ) < 5 ) {
                if ( player.state.fire_timer.getElapsedTime() >= player.weapon.blaster.firerate ) {
                    player.state.fire_timer = new THREE.Clock( true );
                    fire(spaceship.position.x, spaceship.position.y, spaceship.position.z, player.inertia.x, player.inertia.y, spaceship.rotation.z);
                }
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
        function playerHyperspaceInit() {
            player.hyperspace.in = false;
            player.hyperspace.out = true;
            player.hyperspace.cooldown = 1;
            if ( spaceship.position.z > -.1 ) {
                spaceship.position.z = -.1;
            }
        }
        function playerHyperspaceOut() {
            if ( spaceship.position.z < (-200)) {
                spaceship.position.z = 50;
                var rand_pos = randomViewPosition();
                spaceship.position.x = rand_pos.x;
                spaceship.position.y = rand_pos.y;
                player.hyperspace.out = false;
                player.hyperspace.in = true;
            } else {
                spaceship.position.z *= 1.6;
            }
        }
        function playerHyperspaceIn() {
            if ( spaceship.position.z <= 0.01 ) {
                spaceship.position.z = 0;
                player.hyperspace.in = false;
            } else {
                spaceship.position.z = spaceship.position.z / 1.05;
            }
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
                        playerYawLeft( player.acceleration.rotation * 4 );
                    } else {
                        playerYawRight( player.acceleration.rotation );
                    }
                } else {
                    // Rotate right
                    var R = (V*V)/(DR);
                    if ( R < Mid) {
                        playerYawRight( player.acceleration.rotation * 4 );
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
        function spaceshipRockCollision (spaceship, rock) {
            if ( player.hyperspace.out ) {
                return false;
            }
            if ( Math.abs(spaceship.position.z) > rock_radius[rock.type-1] ) {
                return false;
            }
            if (spaceship.position.x > (rock.position.x + rock_radius[rock.type-1])) {
                return false;
            }
            if (spaceship.position.x < (rock.position.x - rock_radius[rock.type-1])) {
                return false;
            }
            if (spaceship.position.y > (rock.position.y + rock_radius[rock.type-1])) {
                return false;
            }
            if (spaceship.position.y < (rock.position.y - rock_radius[rock.type-1])) {
                return false;
            }
            return true;
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

        function soundThrustCtl() {
            if ( (key.thrust || key.break || key.strafe.left || key.strafe.right) || (key.stall && player.velocity.magnitude != 0)) {
                if (myGlobals.sound.clip.Thrust.volume < 1 ) {
                    myGlobals.sound.clip.Thrust.volume += 0.2;
                }
            }
            else {
                if ( myGlobals.sound.clip.Thrust.volume > 0 ) {
                        myGlobals.sound.clip.Thrust.volume -= 0.4;
                }
            }
            if ( player.hyperspace.out || player.hyperspace.in ) {
                if ( spaceship.position.z != 0 ) {
                    var max_volume = 1 / Math.abs(spaceship.position.z);
                } else {
                    var max_volume = 1;
                }
                if ( myGlobals.sound.clip.Thrust.volume > max_volume)
                myGlobals.sound.clip.Thrust.volume = max_volume;
            }
        }
    }

    function hudRenderLives ( lives ) {
        var render = '';
        for ( i = 0; i < lives; i++ ) {
            render += '&#5579;'
        }
        return render;
    }

    function hudRenderScore ( score ) {
        return padToTwo( score );
        function padToTwo(number) {
            if (number<=99) { number = ("0"+number).slice(-2); }
            return number;
        }
    }

    function stateResetGame() {
        CtlGame.room = EnumGameRoom.MENU;
        CtlGame.level = 1;
        CtlGame.score = 0;
        CtlGame.score_pre = 0;
        CtlGame.lives = 3;
        CtlGame.lives_pre = 3;
        CtlGame.lives_score = 0;
        CtlGame.rocks = [];
        CtlGame.explosions.forEach( function (explosion, index ) {
            scene.remove( explosion.object );
        });
        CtlGame.explosions = [];
        player.state.player = EnumPlayerState.SPAWN;
        player.state.player_pre = EnumPlayerState.ALIVE;
        player.state.spawn_cooldown = player.spawn_cooldown;
        player.inertia.rotation = 0;

    }

    function stateResetGameOver() {
        CtlRoom.game_over.state = EnumRoomState.CONSTRUCT;
    }

    function stateResetMenu() {
        CtlRoom.menu.state = EnumRoomState.CONSTRUCT;
    }
    function stateResetPause() {
        CtlRoom.pause.state = EnumRoomState.CONSTRUCT;
    }

    function hudReset() {
        $( '.hud' ).hide();
        return 0;
    }

    function sceneReset() {
        scene.remove( spaceship );
        CtlGame.rocks.forEach( function( rock, index ) {
            scene.remove( rock );
        });
        CtlGame.rocks = [];
        return 0;
    }

    function particleExplosionUpdate() {
        var tmp = [];
        CtlGame.explosions.forEach( function( explosion, index ) {
            explosion.update();
            if ( explosion.lifetime > 0 || explosion.lifetime === null ) {
                tmp.push( explosion );
            } else {
                killObject( explosion.object );
            }
        });
        CtlGame.explosions = tmp;
    }

    function projectileUpdate() {
        var tmp = [];
        CtlGame.projectiles.forEach( function( projectile, index ) {
            // Update position
            projectile.position.x += projectile.inertia.x;
            projectile.position.y += projectile.inertia.y;
            projectile.translateY(.8);
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
        CtlGame.projectiles = tmp;
    }

    function createRock ( type = 3, origin_x = 0, origin_y = 0, inertia_x = 0, inertia_y = 0, inertia_rotation = [ 0, 0, 0 ]) {
        var rock_geometry = new THREE.SphereGeometry( rock_radius[type-1] );
        var rock = new THREE.Mesh ( rock_geometry, rock_material );
        rock.position.x = origin_x;
        rock.position.y = origin_y;
        rock.inertia = {};
        rock.inertia.x = inertia_x;
        rock.inertia.y = inertia_y;
        rock.type = type;
        rock.time = 0;
        rock.alive = true;
        rock.inertia.rotation = inertia_rotation;
        CtlGame.rocks.push( rock );
        scene.add( rock );
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

    function randomViewPosition () {
        return {
            x: (0 - (view.width*.8) / 2) + myRand(0, (view.width*.8)),
            y: (0 - (view.height*.8) / 2) + myRand(0, (view.height*.8))
        }
    }

    function rockUpdate() {
        var kill = [];
        var tmp = [];
        CtlGame.rocks.forEach( function( rock, index ) {
            // Update position
            rock.time++;
            rock.position.x += rock.inertia.x;
            rock.position.y += rock.inertia.y;
            rock.rotateX( rock.inertia.rotation[0] );
            rock.rotateY( rock.inertia.rotation[1] );
            rock.rotateZ( rock.inertia.rotation[2] );

            limitToView ( rock );

            if ( !rock.alive ) {
                kill.push( rock );
                killRock( rock );
            } else {
                tmp.push( rock );
            }
        });
        CtlGame.rocks = tmp;
        kill.forEach( function( rock, index ) {
            CtlGame.explosions.push(new ParticleExplosion(rock.position.x, rock.position.y));
            if ( rock.type >= 2 ) {
                var inertia = rockInertia();
                createRock(
                    rock.type - 1,
                    rock.position.x,
                    rock.position.y,
                    rock.inertia.x + inertia.x,
                    rock.inertia.y + inertia.y,
                    [rock.inertia.rotation[0] + inertia.x*.1,
                    rock.inertia.rotation[1] + inertia.y*.1,
                    rock.inertia.rotation[2] + inertia.z*.1]
                );
                createRock(
                    rock.type - 1,
                    rock.position.x,
                    rock.position.y,
                    rock.inertia.x - inertia.x,
                    rock.inertia.y - inertia.y,
                    [rock.inertia.rotation[0] - inertia.x*.1,
                    rock.inertia.rotation[1] - inertia.y*.1,
                    rock.inertia.rotation[2] - inertia.z*.1]
                );
            }
        });
    }

    function rockInertia() {
        function rockInertiaRand() {
            return .002 * myRand( -80, 80);
        };
        return {
                x: rockInertiaRand(),
                y: rockInertiaRand(),
                z: rockInertiaRand()
            }
    }

    function killRock ( rock ) {
        switch( rock.type ) {
            case 1:
                myGlobals.sound.clip.BangSm.position = 0;
                myGlobals.sound.clip.BangSm.play();
                CtlGame.score += 100;
            case 2:
                myGlobals.sound.clip.BangMd.position = 0;
                myGlobals.sound.clip.BangMd.play();
                CtlGame.score += 50;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                myGlobals.sound.clip.BangLg.position = 0;
                myGlobals.sound.clip.BangLg.play();
                CtlGame.score += 20;
                break;
        }
        killObject( rock );
    }

    function killObject ( object ) {
        scene.remove( object );
    }

    function ParticleExplosion(x,y, color = 0xBBBBBB, totalObjects = 400, movementSpeed = .8, objectSize = .06, sizeRandomness = 10000, time = 2000)
    {
        var geometry = new THREE.Geometry();
        this.dirs = [];
      
        for (i = 0; i < totalObjects; i ++) { 
            var vertex = new THREE.Vector3();
            vertex.x = x;
            vertex.y = y;
            vertex.z = 0;
      
            geometry.vertices.push( vertex );
            this.dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
        }

        var material = new THREE.PointsMaterial( { size: objectSize,  color: color });
        var particles = new THREE.Points( geometry, material );
        this.lifetime = time;
        this.object = particles;
        this.status = true;
      
        this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
        this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
        this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
      
        scene.add( this.object  ); 
      
        this.update = function() {
            if (this.lifetime) {
                this.lifetime --;
            }
            if (this.status == true) {
                var pCount = totalObjects;
                while(pCount--) {
                    var particle =  this.object.geometry.vertices[pCount]
                    particle.y += this.dirs[pCount].y;
                    particle.x += this.dirs[pCount].x;
                    particle.z += this.dirs[pCount].z;
                }
                
                this.object.geometry.verticesNeedUpdate = true;
            }
        }
    }
}