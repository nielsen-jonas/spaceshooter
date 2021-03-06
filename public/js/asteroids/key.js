// Controls
var keypress = {
    pause: false,
    hyperspace: false,
    reset: function() {
        this.pause = false;
        this.hyperspace = false;
    }
}

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
    fire: false,
    calibrate: {
        forward: false,
        backward: false
    },
    hyperspace: false,
    test: false
}
var keys;

// KEYPRESS

// Pause
Mousetrap.bind('p', function() {
    keypress.pause = true;
    return false;
}, 'keydown')

// Hyperspace
Mousetrap.bind('enter', function() {
    keypress.hyperspace = true;
    return false;
}, 'keydown');

// KEY

// Thrust
keys = ['up', 'i', '8'];
Mousetrap.bind(keys, function() {
    key.thrust = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.thrust = false;
    return false;
}, 'keyup');

// Break
keys = ['down', 'k', '5'];
Mousetrap.bind(keys, function() {
    key.break = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.break = false;
    return false;
}, 'keyup');

// Stall
keys = 'w';
Mousetrap.bind(keys, function() {
    key.stall = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.stall = false;
    return false;
}, 'keyup');

// Yaw Left
keys = 's';
Mousetrap.bind(keys, function() {
    key.yaw.left = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.yaw.left = false;
    return false;
}, 'keyup');

// Yaw right
keys = 'f';
Mousetrap.bind(keys, function() {
    key.yaw.right = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.yaw.right = false;
    return false;
}, 'keyup');

// Strafe left
keys = ['j', 'left', '4'];
Mousetrap.bind(keys, function() {
    key.strafe.left = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.strafe.left = false;
    return false;
}, 'keyup');

// Strafe right
keys = ['l', 'right', '6'];
Mousetrap.bind(keys, function() {
    key.strafe.right = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.strafe.right = false;
    return false;
}, 'keyup');

// Calibrate forward
keys = 'e';
Mousetrap.bind(keys, function() {
    key.calibrate.forward = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.calibrate.forward = false;
    return false;
}, 'keyup');

// Calibrate backward
keys = 'd';
Mousetrap.bind(keys, function() {
    key.calibrate.backward = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.calibrate.backward = false;
    return false;
}, 'keyup');

// Fire
keys = 'space';
Mousetrap.bind(keys, function() {
    key.fire = true;
    return false;
}, 'keydown');
Mousetrap.bind(keys, function() {
    key.fire = false;
    return false;
}, 'keyup');