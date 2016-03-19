var horizontal= require('./scripts/instruments/horizontal.js');
var analog = require('./scripts/analog.js');
var TIMEOUT = 1000;

//Oil Pressure
var OP = {
  "id": "op",
  'a_pin': '3',
  "min_disp": 0.0,
  "max_disp": 100.0,
  "min_raw": 0,
  "max_raw": 4000,
  "min": {
    "value": 20,
    "color": "red"
  },
  "max": {
    "value": 90,
    "color": "yellow"
  },
  "value": 0,
  "gauge": null,
  'dvalue': null
};

//Oil Temp
var OT = {
  "id": "ot",
  'a_pin': '5',
  "min_disp": 60.0,
  "max_disp": 260.0,
  "min_raw": 0,
  "max_raw": 4000,
  "min": {
    "value": 100,
    "color": "yellow"
  },
  "max": {
    "value": 220,
    "color": "red"
  },
  "value": 60,
  "gauge": null,
  'dvalue': null
};

var instruments = [OP,OT];


function readData(event){
    var data = JSON.parse(event.data);
    for(i in instruments){
      var instrument = instruments[i];
      horizontal.setInstVal(instrument, data[instrument.a_pin])
      horizontal.drawInst(instrument);
    }
}

function readAnalogData(data){
//    var data = JSON.parse(event.data);
    for(i in instruments){
      var instrument = instruments[i];
      horizontal.setInstVal(instrument, data[instrument.a_pin])
      horizontal.drawInst(instrument);
    }
}


function getData(){
  var data = analog.getData([OP.a_pin,OT.a_pin])
    readAnalogData(data);
  setTimeout(getData, TIMEOUT);
}

//OLD BONE VERSION
function XgetData(){
  $.ajax({
    url: 'analog_data/'+a_pins,
//    dataType: 'jsonp',
    success: function(data){
//      console.log(data);
      readAnalogData(data);
    },
    error: function(err){
      for(i in err)console.log(err[i]);
      console.log("ERR:"+err);
    }
  });
  setTimeout(getData, 1000);
}

var a_pins;


$(document).ready(function(){
  console.log("REALLY READY")
  var s = Snap("#ot");
  OT.gauge = s.rect(0,10,0,20).attr({fill: 'yellow', 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"min"),5,2,31).attr({fill: OT.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"max"),5,2,31).attr({fill: OT.max.color, 'opacity': 1.0 });
  Snap('#otl').text(5,25, 'Oil Temp').attr({'fill':'white'})
  OT.dvalue = Snap('#otv').text(5,25, '0').attr({'fill':'white'})

  var s = Snap("#op");
  OP.gauge = s.rect(0,10,0,20).attr({fill: 'green', 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"min"),5,2,31).attr({fill: OP.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"max"),5,2,31).attr({fill: OP.max.color, 'opacity': 1.0 });
  Snap('#opl').text(5,25, 'Oil Press').attr({'fill':'white'});
  OP.dvalue = Snap('#opv').text(5,25, '0').attr({'fill':'white'});


  Snap('#rpm').text(5,25, '3000').attr({'fill':'white'});


  a_pins=OP.a_pin+","+OT.a_pin


//==============================================================================

var last = 0;
var MAX_RPM = 4248;
var RPM_DIV = 5900;

var canvasSize = 200,
    centre = canvasSize/2,
    radius = canvasSize*0.8/2,
    s = Snap('#tach'),
    path = "",
    arc = s.path(path),
    startY = centre-radius,
    runBtn = document.getElementById('run'),
    percDiv = document.getElementById('percent'),
    input = document.getElementById('input');


/**
 * 0 = 0
 * 4536 rpm = 72
 *
 *
 */
function run(rpm) {
  if(rpm > MAX_RPM)rpm = MAX_RPM;
  var percent = rpm == 0 ? 0 : rpm/RPM_DIV
  start = last;
  var endpoint = percent*360;
  last = endpoint;
  Snap.animate(start, endpoint,   function (val) {
    arc.remove();

    //start at 220 degrees
    var startRadians = Math.PI*(-140)/180;
    var startx = centre+radius*Math.cos(startRadians);
    var starty = centre-radius*Math.sin(startRadians);
    //console.log("startRadians:"+startRadians+" X:"+startx+" Y:"+starty+" center:"+centre+" "+(radius * Math.sin(startRadians))+" D:"+val);

    var d = val
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
      strokeWidth: 10
    });
//    percDiv.innerHTML =    rpm;
  }, 500, mina.easeinout);
}

run(3000);
getData();
});
