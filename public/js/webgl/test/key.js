// Controls
var key = {
    down: {
        w: false,
        a: false,
        s: false,
        d: false,
        q: false
    }
};

Mousetrap.bind('w', function() {
    key.down.w = true;
}, 'keydown');
Mousetrap.bind('w', function() {
    key.down.w = false;
}, 'keyup');

Mousetrap.bind('a', function() {
    key.down.a = true;
}, 'keydown');
Mousetrap.bind('a', function() {
    key.down.a = false;
}, 'keyup');

Mousetrap.bind('s', function() {
    key.down.s = true;
}, 'keydown');
Mousetrap.bind('s', function() {
    key.down.s = false;
}, 'keyup');

Mousetrap.bind('d', function() {
    key.down.d = true;
}, 'keydown');
Mousetrap.bind('d', function() {
    key.down.d = false;
}, 'keyup');

Mousetrap.bind('up', function() {
    key.down.up = true;
}, 'keydown');
Mousetrap.bind('up', function() {
    key.down.up = false;
}, 'keyup');

Mousetrap.bind('down', function() {
    key.down.down = true;
}, 'keydown');
Mousetrap.bind('down', function() {
    key.down.down = false;
}, 'keyup');

Mousetrap.bind('left', function() {
    key.down.left = true;
}, 'keydown');
Mousetrap.bind('left', function() {
    key.down.left = false;
}, 'keyup');

Mousetrap.bind('right', function() {
    key.down.right = true;
}, 'keydown');
Mousetrap.bind('right', function() {
    key.down.right = false;
}, 'keyup');

Mousetrap.bind('q', function() {
    key.down.q = true;
}, 'keydown');
Mousetrap.bind('q', function() {
    key.down.q = false;
}, 'keyup');