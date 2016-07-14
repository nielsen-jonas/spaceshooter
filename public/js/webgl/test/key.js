// Controls
var key = {
    thrust: false,
    break: false,
    stall: false,
    yaw: {
        left: false,
        right: false
    },
    strafe: {
        left: false,
        right: false
    },
    fire: false
}

// Thrust
Mousetrap.bind('up', function() {
    key.thrust = true;
    return false;
}, 'keydown');
Mousetrap.bind('up', function() {
    key.thrust = false;
    return false;
}, 'keyup');
Mousetrap.bind('i', function() {
    key.thrust = true;
    return false;
}, 'keydown');
Mousetrap.bind('i', function() {
    key.thrust = false;
    return false;
}, 'keyup');
Mousetrap.bind('8', function() {
    key.thrust = true;
    return false;
}, 'keydown');
Mousetrap.bind('8', function() {
    key.thrust = false;
    return false;
}, 'keyup');

// Break
Mousetrap.bind('down', function() {
    key.break = true;
    return false;
}, 'keydown');
Mousetrap.bind('down', function() {
    key.break = false;
    return false;
}, 'keyup');
Mousetrap.bind('k', function() {
    key.break = true;
    return false;
}, 'keydown');
Mousetrap.bind('k', function() {
    key.break = false;
    return false;
}, 'keyup');
Mousetrap.bind('5', function() {
    key.break = true;
    return false;
}, 'keydown');
Mousetrap.bind('5', function() {
    key.break = false;
    return false;
}, 'keyup');

// Stall
Mousetrap.bind('s', function() {
    key.stall = true;
    return false;
}, 'keydown');
Mousetrap.bind('s', function() {
    key.stall = false;
    return false;
}, 'keyup');

// Yaw Left
Mousetrap.bind('left', function() {
    key.yaw.left = true;
    return false;
}, 'keydown');
Mousetrap.bind('left', function() {
    key.yaw.left = false;
    return false;
}, 'keyup');
Mousetrap.bind('j', function() {
    key.yaw.left = true;
    return false;
}, 'keydown');
Mousetrap.bind('j', function() {
    key.yaw.left = false;
    return false;
}, 'keyup');
Mousetrap.bind('4', function() {
    key.yaw.left = true;
    return false;
}, 'keydown');
Mousetrap.bind('4', function() {
    key.yaw.left = false;
    return false;
}, 'keyup');

// Yaw right
Mousetrap.bind('right', function() {
    key.yaw.right = true;
    return false;
}, 'keydown');
Mousetrap.bind('right', function() {
    key.yaw.right = false;
    return false;
}, 'keyup');
Mousetrap.bind('l', function() {
    key.yaw.right = true;
    return false;
}, 'keydown');
Mousetrap.bind('l', function() {
    key.yaw.right = false;
    return false;
}, 'keyup');
Mousetrap.bind('6', function() {
    key.yaw.right = true;
    return false;
}, 'keydown');
Mousetrap.bind('6', function() {
    key.yaw.right = false;
    return false;
}, 'keyup');

// Strafe left
Mousetrap.bind('a', function() {
    key.strafe.left = true;
    return false;
}, 'keydown');
Mousetrap.bind('a', function() {
    key.strafe.left = false;
    return false;
}, 'keyup');

// Strafe right
Mousetrap.bind('d', function() {
    key.strafe.right = true;
    return false;
}, 'keydown');
Mousetrap.bind('d', function() {
    key.strafe.right = false;
    return false;
}, 'keyup');

// Fire
Mousetrap.bind('space', function() {
    key.fire = true;
    return false;
}, 'keydown');
Mousetrap.bind('space', function() {
    key.fire = false;
    return false;
}, 'keyup');