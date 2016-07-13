// Controls
var key = {
    thrust: false,
    break: false,
    stall: false,
    yaw: {
        left: false,
        right: false
    }
}

// Thrust
Mousetrap.bind('up', function() {
    key.thrust = true;
}, 'keydown');
Mousetrap.bind('up', function() {
    key.thrust = false;
}, 'keyup');
Mousetrap.bind('i', function() {
    key.thrust = true;
}, 'keydown');
Mousetrap.bind('i', function() {
    key.thrust = false;
}, 'keyup');
Mousetrap.bind('8', function() {
    key.thrust = true;
}, 'keydown');
Mousetrap.bind('8', function() {
    key.thrust = false;
}, 'keyup');

// Break
Mousetrap.bind('down', function() {
    key.break = true;
}, 'keydown');
Mousetrap.bind('down', function() {
    key.break = false;
}, 'keyup');
Mousetrap.bind('k', function() {
    key.break = true;
}, 'keydown');
Mousetrap.bind('k', function() {
    key.break = false;
}, 'keyup');
Mousetrap.bind('5', function() {
    key.break = true;
}, 'keydown');
Mousetrap.bind('5', function() {
    key.break = false;
}, 'keyup');

// Stall
Mousetrap.bind('a', function() {
    key.stall = true;
}, 'keydown');
Mousetrap.bind('a', function() {
    key.stall = false;
}, 'keyup');

// Yaw Left
Mousetrap.bind('left', function() {
    key.yaw.left = true;
}, 'keydown');
Mousetrap.bind('left', function() {
    key.yaw.left = false;
}, 'keyup');
Mousetrap.bind('j', function() {
    key.yaw.left = true;
}, 'keydown');
Mousetrap.bind('j', function() {
    key.yaw.left = false;
}, 'keyup');
Mousetrap.bind('4', function() {
    key.yaw.left = true;
}, 'keydown');
Mousetrap.bind('4', function() {
    key.yaw.left = false;
}, 'keyup');

// Yaw right
Mousetrap.bind('right', function() {
    key.yaw.right = true;
}, 'keydown');
Mousetrap.bind('right', function() {
    key.yaw.right = false;
}, 'keyup');
Mousetrap.bind('l', function() {
    key.yaw.right = true;
}, 'keydown');
Mousetrap.bind('l', function() {
    key.yaw.right = false;
}, 'keyup');
Mousetrap.bind('6', function() {
    key.yaw.right = true;
}, 'keydown');
Mousetrap.bind('6', function() {
    key.yaw.right = false;
}, 'keyup');