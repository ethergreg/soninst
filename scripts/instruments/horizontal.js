var horizontal = {};
horizontal.WIDTH=360.0;

/*
 * raw is 0 - 1000
 * convert that to inst min_disp - max_disp
 *
 */
horizontal.setInstVal = function(inst, raw){
  var step = (inst.max_disp - inst.min_disp)/inst.max_raw;
  var value = Math.round(raw * step + inst.min_disp);
  inst.value = value;
}


/**
 * horizontal location of min/max lines
 */
horizontal.bar = function(inst, pos){
  var scale = horizontal.WIDTH/(inst.max_disp - inst.min_disp);
  return (inst[pos].value - inst.min_disp) * scale;
}

/**
 *  
 * 
 */
horizontal.drawInst = function(inst){
  var scale = horizontal.WIDTH/(inst.max_disp - inst.min_disp);
  var w = (inst.value - inst.min_disp) * scale;
  var color = "green";
  if(inst.value <= inst.min.value)color = inst.min.color;
  if(inst.value >= inst.max.value)color = inst.max.color;
  //console.log("width:"+w+" G:"+inst.gauge+" COLOR:"+color);
  inst.gauge.animate({
    width: w,
    fill: color
  }, 100);
  inst.dvalue.attr({'text': inst.value});
  //  var labelFill = inst.value <= inst.min_disp ? 'red' : 'white';
  //  $('#'+inst.id+'l').css('fill', labelFill);
}