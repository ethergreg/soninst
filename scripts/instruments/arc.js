var config = require('../config.js');

var last = 0;
var RPM_DIV = 5900;

var canvasSize = 200;
var centre = canvasSize/2;
var radius = canvasSize*0.8/2;

  /**
   * 0 = 0
   * 4536 rpm = 72
   *
   *
   */
exports.drawInst = function(inst) {
    var snap = require('snapsvg');
    var val = inst.value;
    if(val > inst.max_disp)val = inst.max_disp;
    var percent = val/RPM_DIV;
    var start = last;
    var endpoint = percent*360;
    last = endpoint;
    var s = snap('#'+inst.id);
    var path = "";
    var arc = s.path(path);
    snap.animate(start, endpoint,   function (val) {
      arc.remove();
  
      //start at 220 degrees
      var startRadians = Math.PI*(-140)/180;
      var startx = centre+radius*Math.cos(startRadians);
      var starty = centre-radius*Math.sin(startRadians);
      //console.log("startRadians:"+startRadians+" X:"+startx+" Y:"+starty+" center:"+centre+" "+(radius * Math.sin(startRadians))+" D:"+val);
  
      var d = val;
      var dr = 220-d;
      var radians = Math.PI*(dr)/180;
      var endx = centre + radius*Math.cos(radians);
      var endy = centre - radius * Math.sin(radians);
      var largeArc = d > 180 ? 1 : 0;
      var path = "M"+startx+","+starty+" A"+radius+","+radius+" 0 "+largeArc+",1 "+endx+","+endy;
      arc = s.path(path);
      arc.attr({
        stroke: 'green',
        fill: 'none',
        strokeWidth: 20
      });
      snap('#'+inst.id+'l').text(5,25, '3000').attr({'fill':'white'});
  //    percDiv.innerHTML =    rpm;
    }, config.ANIMATE_TIMEOUT);
  }
