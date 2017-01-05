/*
 # once a bit has been evaluated remove, the former, when next another bit is evaluated
*/

var BITS = BITS || {};
var bits = bits || {};

/*
 * simple evaluator
 * `source`{string}, source code to evaluate
 * `serialize`{boolean}, if true, `source` is divided into lines for presentation purposes
 * use the native `bits.see` function to print results to bits' own console
 * returns an array of strings if `serialize` is true
*/
BITS.evaluator = function(source, serialize) {
  //a script is called a bit
  var doc = document;
  var last = doc.querySelector('script[src^="data:application/javascript"]');
  if(last) document.body.removeChild(last);
  var bit = doc.createElement('script');
  var src = 'data:application/javascript,';
  src += encodeURIComponent(source);
  bit.src = src;
  bit.addEventListener('load', function() {
    console.log('bit loaded, and evaluated');
  });
  document.body.appendChild(bit);
  if(serialize) {
    var serialized = source.split('\n');
    return serialized;
  }
};

/*
 * contains bits' native functions
 * these native functions are later mirrored by means of binding each with it's custom `this` value
*/
BITS.natives = {
  //needs a `append` method on it's `this` value to output results
  see: function() {
    var args = arguments;
    var tab = '<br>';
    var space = ' ';
    var keys = Object.keys(args);
    var output = '';
    keys.map(function(i) {
      //exempt `length` property
      if(i === 'length') return;

      var element = args[i];
      output += element + space;
    });
    output += tab;
    this.append(output);
  }
};

/*
 * `config` {object}, list of `this` value for each native function
*/
BITS.natives.mirror = function(config) {
  var natives = this;
  var newNatives = {};
  var keys = Object.keys(natives);
  keys.map(function(key) {
    //exempt `mirror`
    if(key === 'mirror') return;

    //create new native functions with specific `this` values
    var native = natives[key];
    var nativeBind = native.bind(config[key]);
    newNatives[key] = nativeBind;
  });

  //export native functions
  var expKeys = Object.keys(newNatives);
  expKeys.map(function(key) {
    bits[key] = newNatives[key];
  });
};

//new natives go here
