// tools extending standard prototypes of String and Array with some extra function


String.prototype.toMorse = function(delimiter) {
	var alphabet = {
	    'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
	    'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
	    'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
	    'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
	    'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
	    'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
	    'y': '-.--',  'z': '--..',  ' ': '/',
	    '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
	    '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
	    '9': '----.', '0': '-----', 
	};
	return this.split('')
	    .map(function(e){
     	   return alphabet[e.toLowerCase()] || '';
	    })
	    .join(delimiter||'')
	    .replace(/ +/g, ' ');
};

String.prototype._atbash = function(voc) {
	var c = [];
	this.split("").forEach(function(e){
		if (voc.indexOf(e)>-1) {
			c.push(voc[voc.length-voc.indexOf(e)-1]);
		} else {
			c.push(e);
		}
	});
	return c.join("");
};

String.prototype.hexAtbash = function() {
	return this.toLowerCase()._atbash("0123456789abcdef");
};

String.prototype.decAtbashZ = function() {
	return this._atbash("0123456789");
};

String.prototype.decAtbashNZ = function() {
	return this._atbash("123456789");
};

String.prototype.strAtbash = function() {
	return this._atbash("abcdefghijklmnopqrstuvwxyz")._atbash("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
};

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

String.prototype.strSwap = function(a, b) {
	return this.replaceAll(a,"±").replaceAll(b,a).replaceAll("±",b);
};

String.prototype.reverse = function() {
	return this.split("").reverse().join("");
};

String.prototype.parseBraille = function(empty) {
	var alphabet = {
	    'a': '1',    'b': '12',  'c': '14',  'd': '145',
	    'e': '15',   'f': '124', 'g': '1245','h': '125',
	    'i': '24',   'j': '245', 'k': '13',  'l': '123',
	    'm': '134',  'n': '1345','o': '135', 'p': '1234',
	    'q': '12345','r': '1235','s': '234', 't': '2345',
	    'u': '136',  'v': '1236','w': '2456','x': '1346',
	    'y': '13456','z': '1356',
	    
	    '1': '2', '2': '23', '3': '25',  '4': '256', 
	    '5': '26','6': '235','7': '2356','8': '236', 
	    '9': '35','0': '356', 

	    '\'': '3',   ',': '6',    '=': '123456', '&': '12346',
	    '!': '2346', ')': '23456','(': '12345',  ']': '12456', 
	    '[': '246',  '<': '126',  '>': '345',    ':': '156', 
	    '\\': '1256','/': '34',   '*': '16',     '$': '1246', 
	    '%': '146',  '?': '1456', '+': '346',    '-': '36', 
	    '@': '4',    '^': '45',   '_': '456',    '"': 5, 
	    '.': '46',   ';': '56',   ' ': ''};
	var digits = {
	};
	return this.match(/.{1,6}/g).map(function(c) {
		return c.split("").map(function (currentValue, index, array) { 
    		if (currentValue!==empty) { 
    			return (index+1).toString(); 
    		} else { 
    			return ""; 
    		}
	    }).join("");
	}).map(function(e){
     	   return Object.keys(alphabet).find(function(ee){
     	   		return (alphabet[ee]==e.toString());
     	   }) || "";
	}).join("");
};

String.prototype.condense = function() {
	return this.replace(/ /g,'');
};

Array.prototype.reshape = function(rows, cols) {
  var copy = this.slice(0); // Copy all elements.
  this.length = 0; // Clear out existing array.

  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < cols; c++) {
      var i = r * cols + c;
      if (i < copy.length) {
        row.push(copy[i]);
      }
    }
    this.push(row);
  }
  return this;
};

Array.prototype.transpose = function transpose() { 
	var that = this;
    return Object.keys(this[0]).map(function (c) {
        return that.map(function (r) {
            return r[c];
        });
    });
};

String.prototype.skipN = function (step) { 
	var l = this.length;
	return this.split("")
		.reshape(step,l / step)
		.transpose()
		.reduce(function(prev, curr) {
			return prev.concat(curr);
		}).join("");
};

String.prototype.AtoN = function(offset) {
	return this.split("").map(function(el){return el.toLowerCase().charCodeAt(0) - "a".charCodeAt(0) + (offset||0);}).join(" ");
};

String.prototype.RLEtoBin = function(offset) {
	return this.split("").map(function(e,i){return "".padStart(parseInt(e),((i+(offset||0))%2).toString());}).join("");
};

String.prototype.binToRLE = function () {
	return this.match(/(?:((.)\2*))/g).map(function(e){return (e.length > 0 ? e.length : null);}).join("");
};

String.prototype.isRLE = function() {
	if (this.condense().match(/^[0-9]+$/)!==null && this.condense().split("").reduce(function(a,c){return parseInt(a)+parseInt(c);}) % 8 === 0) {
		return true;
	} else {
		return false;
	}
};

String.prototype.binToChar = function() {
	return this.match(/.{1,8}/g).map(function(e){return String.fromCharCode(parseInt(e,2));}).join("");
};

String.prototype.charToBin = function(delimiter) {
	return this.split("").map(function(e){
		var n = parseInt(e.charCodeAt(0)).toString(2); 
		return "00000000".substr(n.length) + n;
	}).join(delimiter || "");
};

String.prototype.parsePolybius = function(abc) {
	var a = abc || "abcdefghiklmnopqrstuvwxyz";
	return this.match(/.{1,2}/g)
		.map(function(e){ 
			return a[(parseInt(e[0])-1)*5+(parseInt(e[1])-1)];
		}).join("");
};

String.prototype.keyboardVMirror = function() {
	var ab = "1234567890qwertyuiopasdfghjkl;zxcvbnm,./";
	var bc = "0987654321poiuytrewq;lkjhgfdsa/.,mnbvcxz";
	return this.split("")
		.map(function(s){
			return ab[bc.indexOf(s.toLowerCase())];
		}).join("");
};

String.prototype.keyboardHMirror = function() {
	var ab = "1234567890qwertyuiopasdfghjkl;zxcvbnm,./";
	var bc = "zxcvbnm,./asdfghjkl;qwertyuiop1234567890";
	return this.split("")
		.map(function(s){
			return ab[bc.indexOf(s.toLowerCase())];
		}).join("");
};