
///sys/bus/iio/devices/iio\:device0/in_voltage3_raw

/*
 * read analog pin
 * value not always available so try a few times
 */
exports.readPin = function(pin){
  var fs = require('fs');
  var tries = 0;
  var ret = -1
  while(tries < 5){
    ++tries;
    try{
  	  var raw = fs.readFileSync('/sys/bus/iio/devices/iio:device0/in_voltage'+pin+'_raw')+"";
      //console.log(pin+" pin value "+raw);
      return raw.trim();
    }catch(err){
      console.log(tries+" pin read err:"+err);
    }
  }
}

/**
 * read analog data on these pins
 * returns raw value
 */
exports.getData = function(pins){
  var vals = {};
  for(var i in pins){
    var pin = pins[i];
      vals[pin] = Math.round(exports.readPin(pin));
  }
  return vals;
};

