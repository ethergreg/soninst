var config = require('../config.js');
var analog = require('../analog.js');
var WIDTH=360.0;
var FLAP_LIMIT = 2;


/*
 * raw is 0 - 1000
 * convert that to inst min_disp - max_disp
 *
 */
exports.setInstVal = function(inst, raw){
  var step = (inst.max_disp - inst.min_disp)/inst.max_raw;
  var value = Math.round(raw * step + inst.min_disp);
  if(Math.abs(inst.value-value)<FLAP_LIMIT)return false;
  inst.value = value;
  return true;
};


/**
 * horizontal location of min/max lines
 */
exports.bar = function(inst, pos){
  var scale = WIDTH/(inst.max_disp - inst.min_disp);
  return (inst[pos].value - inst.min_disp) * scale;
};

/**
 *  
 * 
 */
var drawInst = function(inst){
  var scale = WIDTH/(inst.max_disp - inst.min_disp);
  var w = (inst.value - inst.min_disp) * scale;
  var color = "green";
  if(inst.value <= inst.min.value)color = inst.min.color;
  if(inst.max != null && inst.value >= inst.max.value)color = inst.max.color;
//  inst.gauge.animate({width: w, fill: color}, config.ANIMATE_TIMEOUT);
  inst.gauge.attr({width: w, fill: color});
  inst.dvalue.attr({'text': inst.value});
};


exports.refresh = function(inst){
  var raw = analog.readPin(inst.a_pin);
  if(inst.id == "ot")console.log("RAW "+inst.id+" "+raw);
  var adj = raw - inst.ref_val;
  var value = Math.round(adj * inst.step + inst.ref_disp);
  //let's try an average to slow down changes
  value = Math.round((value + inst.value) / 2);
  if(inst.id == "ot")console.log("VAL "+inst.id+" "+value);
  //don't redraw if within flap limit
  if(Math.abs(inst.value-value)<FLAP_LIMIT)return;
  // until we have a fuel level transducer
  if(inst.id == 'fu')value = 9;
  inst.value = value;  
  drawInst(inst);
};