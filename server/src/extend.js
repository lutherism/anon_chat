function xtnd(orig) {
    console.log(orig);
    var args = Array.prototype.slice.call(arguments, 0);
    for (var i = 0; i < args.length; i++) {
        for (var j in args[i]) {
            orig[j] = args[i][j];
        }
    }
    return orig;
};
function extend(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    child = function(){ return parent.apply(this, arguments); };

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
        child.prototype = xtnd({}, parent.prototype, protoProps);
    }

    // Add static properties to the constructor function, if supplied.
    //console.log(xtnd(child, parent, staticProps));

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;
    child.extend = extend;

    return child;
  };
module.exports = extend;
