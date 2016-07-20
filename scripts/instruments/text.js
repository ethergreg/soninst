//var config = require('../config.js');
var analog = require('../analog.js');
var FLAP_LIMIT = 0.2;

exports.refresh = function(inst){
  var snap = require('snapsvg');
  var value = (analog.readPin('1')/206.81).toFixed(1);
  //don't redraw if within flap limit
  console.log('redraw');
  if(Math.abs(inst.value-value)<FLAP_LIMIT)return;
  console.log('redraw '+value);
  inst.value = value;  
//  snap('#'+inst.id+'v').attr({text: value});
  snap('#vov').attr({text: "xx"});
};
