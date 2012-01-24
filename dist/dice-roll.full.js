/*!
  * Dice Roll - A javascript A/B library 
  * v0.0.3
  * https://github.com/jgallen23/dice-roll
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('dice-roll', function() {

/*!
  * Cookie Monster - A javascript cookie library 
  * v0.0.2
  * https://github.com/jgallen23/cookie-monster
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('monster', function() {

var monster = function() {
  return {
    set: function(name, value, days, path) {
      var date = new Date(),
          expires = '',
          type = typeof(value),
          valueToUse = '';
      path = path || "/";
      if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }
      if(type !== "string"  && type !== "undefined"){
          if(!("JSON" in window)) throw "Bummer, your browser doesn't support JSON parsing.";
          valueToUse = JSON.stringify({v:value});
      }
      else
        valueToUse = escape(value);
      
      document.cookie = name + "=" + valueToUse + expires + "; path=" + path;
    },
    get: function(name) {
      var nameEQ = name + "=",
          ca = document.cookie.split(';'),
          value = '',
          firstChar = '',
          parsed={};
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          value = c.substring(nameEQ.length, c.length);
          firstChar = value.substring(0, 1);
          if(firstChar=="{"){
            parsed = JSON.parse(value);
            if("v" in parsed) return parsed.v;
          }
          if(value=="undefined") return undefined;
          return unescape(value);
        }
      }
      return null;
    },
    remove: function(name) {
      this.set(name, "", -1);
    }
  };
}();

  return monster;
});

var max = 1000;
var monster = (typeof ender !== "undefined")?require("cookie-monster"):window.monster;

var DiceRoll = function(name, expires) {
  this.expires = expires || 7;
  this.key = "diceroll-"+name;
  this.cookieValue = (monster)?monster.get(this.key):false;
  this.tests = [];

};

DiceRoll.prototype.test = function(percentage, callback) {
  this.tests.push({
    percentage: percentage,
    callback: callback
  });

  return this;
};

DiceRoll.prototype.else = function(callback) {
  this.elseCb = callback;
  return this;
};

DiceRoll.prototype.run = function() {
  var rnd = Math.floor(Math.random() * max + 1);
  var start = 0;
  var pct, test, cookie, opt, val;

  for (var i = 0, c = this.tests.length; i<c; i++) {
    test = this.tests[i];
    val = test.percentage + ':' + i;
    
    if(!this.cookieValue) {
      pct = (test.percentage / 100) * max;

      if(rnd >= start && rnd <= (start+pct)) {
        if (monster) {
          monster.set(this.key, val, this.expires);
        }
        test.callback(test.percentage);
        opt = true;
      } else {
        opt = false;
      }

      start += pct + 1;
    } else if(val == this.cookieValue) {
      opt = true;
      test.callback(this.cookieValue);
    }

    if (opt) return;
  }

  //not tossed in a pool
  if (this.elseCb) 
    this.elseCb();
};

var diceRoll = function(name, expires) {
  return new DiceRoll(name, expires);
};

  return diceRoll;
});