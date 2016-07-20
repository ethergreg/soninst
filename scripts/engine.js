var config = require('./config.js');
var analog = require('./analog.js');
var horizontal = require('./instruments/horizontal.js');
var arc = require('./instruments/arc.js');
var txxt = require('./instruments/text.js');

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
  'dvalue': null,
  'refresh': function(){horizontal.refresh(this);}
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
  'dvalue': null,
  'refresh': function(){horizontal.refresh(this);}
};

var FU = {
  "id": "fu",
  'a_pin': '5',
  "min_disp": 0.0,
  "max_disp": 16.0,
  "min_raw": 0,
  "max_raw": 4000,
  "min": {
    "value": 1.5,
    "color": "red"
  },
  "value": 12,
  "gauge": null,
  'dvalue': null,
  'refresh': function(){horizontal.refresh(this);}
};

var VO = {
  "id": "vo",
  "value": 0,
  'refresh': function(){txxt.refresh(this);}
};

var TACH = {
  "id": "tach",
  'a_pin': '3',
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

var instruments = [OP,OT,FU,VO];

function readAnalogData(data){
  for(var i in instruments){
    var instrument = instruments[i];
    if(horizontal.setInstVal(instrument, data[instrument.a_pin])){
      horizontal.drawInst(instrument);
    }
  }
  //horizontal.drawInst(FU);
  
}

function getData(){
  var data = analog.getData([OP.a_pin,OT.a_pin]);
  readAnalogData(data);
  setTimeout(getData, config.POLL_TIMEOUT);
}

function refresh(){
  for(var i in instruments){
    var inst = instruments[i];
    inst.refresh();
  }
  setTimeout(refresh, config.POLL_TIMEOUT);
}


exports.documentReady = function(){
  var snap = require('snapsvg');
//  var bs = require('bonescript');

  var s = snap("#ot");
  OT.gauge = s.rect(0,0,0,30).attr({fill: 'yellow', 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"min"),0,5,30).attr({fill: OT.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OT,"max"),0,5,30).attr({fill: OT.max.color, 'opacity': 1.0 });
  snap('#otl').text(5,25, 'Oil Temp').attr({'fill':'white'});
  OT.dvalue = snap('#otv').text(5,25, '0').attr({'fill':'white'});

  s = snap("#op");
  OP.gauge = s.rect(0,0,0,30).attr({fill: 'green', 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"min"),0,5,30).attr({fill: OP.min.color, 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"max"),0,5,30).attr({fill: OP.max.color, 'opacity': 1.0 });
  snap('#opl').text(5,25, 'Oil Press').attr({'fill':'white'});
  OP.dvalue = snap('#opv').text(25,25, '0').attr({'fill':'white'});

  s = snap("#fu");
  FU.gauge = s.rect(0,0,0,30).attr({fill: 'green', 'opacity': 1.0 });
  s.rect(horizontal.bar(OP,"min"),0,5,30).attr({fill: OP.min.color, 'opacity': 1.0 });
  snap('#ful').text(5,25, 'Fuel Gal').attr({'fill':'white'});
  FU.dvalue = snap('#fuv').text(25,25, '0').attr({'fill':'white'});
  
  snap('#vol').text(2,25, 'Volts').attr({'fill':'white'});
  snap('#vov').text(2,25, (analog.readPin('1')/206.81).toFixed(1)).attr({'fill':'white'});
  
  snap('#aml').text(2,25, 'Amps').attr({'fill':'white'});
  snap('#amv').text(2,25, '-2.3').attr({'fill':'red'});
  
  
  snap('#eg1').rect(0,60,25,100).attr({fill: 'green', 'opacity': 1.0 });
  snap('#eg2').rect(0,50,25,110).attr({fill: 'green', 'opacity': 1.0 });
  snap('#eg3').rect(0,0,25,160).attr({fill: 'red', 'opacity': 1.0 });
  snap('#eg4').rect(0,50,25,110).attr({fill: 'green', 'opacity': 1.0 });
  snap('#egl').text(2,25, 'EGT').attr({'fill':'white'});
  
  
  snap('#ch1').rect(0,70,25,90).attr({fill: 'green', 'opacity': 1.0 });
  snap('#ch2').rect(0,50,25,110).attr({fill: 'green', 'opacity': 1.0 });
  snap('#ch3').rect(0,5,25,155).attr({fill: 'red', 'opacity': 1.0 });
  snap('#ch4').rect(0,55,25,105).attr({fill: 'green', 'opacity': 1.0 });
  snap('#chl').text(2,25, 'CHT').attr({'fill':'white'});
  

  arc.drawInst(TACH);
//  getData();
  refresh();

};
