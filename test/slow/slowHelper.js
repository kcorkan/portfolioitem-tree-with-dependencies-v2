// nothing to do

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = ***REMOVED***

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) ***REMOVED***
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) ***REMOVED***

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) ***REMOVED***
            enc3 = enc4 = 64;
        ***REMOVED*** else if (isNaN(chr3)) ***REMOVED***
            enc4 = 64;
        ***REMOVED***

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    ***REMOVED***

    return output;
***REMOVED***,

// public method for decoding
decode : function (input) ***REMOVED***
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) ***REMOVED***

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) ***REMOVED***
            output = output + String.fromCharCode(chr2);
        ***REMOVED***
        if (enc4 != 64) ***REMOVED***
            output = output + String.fromCharCode(chr3);
        ***REMOVED***

    ***REMOVED***

    output = Base64._utf8_decode(output);

    return output;

***REMOVED***,

// private method for UTF-8 encoding
_utf8_encode : function (string) ***REMOVED***
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) ***REMOVED***

        var c = string.charCodeAt(n);

        if (c < 128) ***REMOVED***
            utftext += String.fromCharCode(c);
        ***REMOVED***
        else if((c > 127) && (c < 2048)) ***REMOVED***
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        ***REMOVED***
        else ***REMOVED***
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        ***REMOVED***

    ***REMOVED***

    return utftext;
***REMOVED***,

// private method for UTF-8 decoding
_utf8_decode : function (utftext) ***REMOVED***
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) ***REMOVED***

        c = utftext.charCodeAt(i);

        if (c < 128) ***REMOVED***
            string += String.fromCharCode(c);
            i++;
        ***REMOVED***
        else if((c > 191) && (c < 224)) ***REMOVED***
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        ***REMOVED***
        else ***REMOVED***
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        ***REMOVED***

    ***REMOVED***

    return string;
***REMOVED***

***REMOVED***