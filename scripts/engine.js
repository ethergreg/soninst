
var config = require('./config.js');
var analog = require('./analog.js');
var horizontal = require('./instruments/horizontal.js');
var arc = require('./instruments/arc.js');

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

var TACH = {
  "id": "tach",
//  'a_pin': '3',
  "min_disp": 0.0,
  "max_disp": 4248.0,
  "min_raw": 0,
  "max_raw": 4248,
  "max": {
    "value": 3800,
    "color": "red"
  },
  "value": 3000,
  "gauge": null,
  'dvalue': null
};

var instruments = [OP,OT];

function readAnalogData(data){
  for(var i in instruments){
    var instrument = instruments[i];
    if(horizontal.setInstVal(instrument, data[instrument.a_pin])){
      horizontal.drawInst(instrument);
    }
  }
}

function getData(){
  var data = analog.getData([OP.a_pin,OT.a_pin]);
  readAnalogData(data);
  setTimeout(getData, config.POLL_TIMEOUT);
}

exports.documentReady = function(){
  var snap = require('snapsvg');

  var s = snap("#ot");
  OT.gauge = s.rect(0,10,0,20).attr({fill: 'yellow', 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"min"),5,2,31).attr({fill: OT.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"max"),5,2,31).attr({fill: OT.max.color, 'opacity': 1.0 });
  snap('#otl').text(5,25, 'Oil Temp').attr({'fill':'white'});
  OT.dvalue = snap('#otv').text(5,25, '0').attr({'fill':'white'});

  s = snap("#op");
  OP.gauge = s.rect(0,10,0,20).attr({fill: 'green', 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"min"),5,2,31).attr({fill: OP.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"max"),5,2,31).attr({fill: OP.max.color, 'opacity': 1.0 });
  snap('#opl').text(5,25, 'Oil Press').attr({'fill':'white'});
  OP.dvalue = snap('#opv').text(5,25, '0').attr({'fill':'white'});

  arc.drawInst(TACH);
  getData();
};
