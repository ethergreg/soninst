//var config = require('../config.js');
var analog = require('../analog.js');
var FLAP_LIMIT = 0.1;

exports.refresh = function(inst){
  var snap = require('snapsvg');
  var raw = analog.readPin('1');
  var noise = 11;
  raw = raw - noise;
  var step = 0.0048891437;
  console.log("TEXT raw:"+raw)
//  var value = (analog.readPin('1')/206.81).toFixed(1);
  var value = (analog.readPin('1')*step).toFixed(1);
  if(value < 0.2) value = 0;
  //console.log("TEXT "+ value +":"+ inst.value);
  //don't redraw if within flap limit
  //console.log('redraw');
  if(Math.abs(inst.value-value)<FLAP_LIMIT)return;
//  console.log('redraw '+value);
  inst.value = value;  
//  snap('#'+inst.id+'v').attr({text: value});
//  snap('#vov').attr({text: "xx"});
  inst.dvalue.attr({'text': inst.value});
};
