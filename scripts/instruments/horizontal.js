var config = require('../config.js');
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
exports.drawInst = function(inst){
  var scale = WIDTH/(inst.max_disp - inst.min_disp);
  var w = (inst.value - inst.min_disp) * scale;
  var color = "green";
  if(inst.value <= inst.min.value)color = inst.min.color;
  if(inst.value >= inst.max.value)color = inst.max.color;
  //console.log("width:"+w+" G:"+inst.gauge+" COLOR:"+color);
  inst.gauge.animate({width: w, fill: color}, config.ANIMATE_TIMEOUT);
  inst.dvalue.attr({'text': inst.value});
  //  var labelFill = inst.value <= inst.min_disp ? 'red' : 'white';
  //  $('#'+inst.id+'l').css('fill', labelFill);
};