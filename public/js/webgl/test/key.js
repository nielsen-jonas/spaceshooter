// Controls
var key = {
    down: {
        w: false,
        a: false,
        s: false,
        d: false
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