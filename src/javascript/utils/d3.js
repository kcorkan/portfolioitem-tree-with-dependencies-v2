// https://d3js.org Version 4.4.1. Copyright 2017 Mike Bostock.
(function (global, factory) ***REMOVED***
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.d3 = global.d3 || ***REMOVED******REMOVED***)));
  ***REMOVED***(this, (function (exports) ***REMOVED*** 'use strict';
  
  var version = "4.4.1";
  
  var ascending = function(a, b) ***REMOVED***
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  ***REMOVED***;
  
  var bisector = function(compare) ***REMOVED***
    if (compare.length === 1) compare = ascendingComparator(compare);
    return ***REMOVED***
      left: function(a, x, lo, hi) ***REMOVED***
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) ***REMOVED***
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        ***REMOVED***
        return lo;
      ***REMOVED***,
      right: function(a, x, lo, hi) ***REMOVED***
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) ***REMOVED***
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        ***REMOVED***
        return lo;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  function ascendingComparator(f) ***REMOVED***
    return function(d, x) ***REMOVED***
      return ascending(f(d), x);
    ***REMOVED***;
  ***REMOVED***
  
  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;
  var bisectLeft = ascendingBisect.left;
  
  var descending = function(a, b) ***REMOVED***
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  ***REMOVED***;
  
  var number = function(x) ***REMOVED***
    return x === null ? NaN : +x;
  ***REMOVED***;
  
  var variance = function(array, f) ***REMOVED***
    var n = array.length,
        m = 0,
        a,
        d,
        s = 0,
        i = -1,
        j = 0;
  
    if (f == null) ***REMOVED***
      while (++i < n) ***REMOVED***
        if (!isNaN(a = number(array[i]))) ***REMOVED***
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) ***REMOVED***
        if (!isNaN(a = number(f(array[i], i, array)))) ***REMOVED***
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    if (j > 1) return s / (j - 1);
  ***REMOVED***;
  
  var deviation = function(array, f) ***REMOVED***
    var v = variance(array, f);
    return v ? Math.sqrt(v) : v;
  ***REMOVED***;
  
  var extent = function(array, f) ***REMOVED***
    var i = -1,
        n = array.length,
        a,
        b,
        c;
  
    if (f == null) ***REMOVED***
      while (++i < n) if ((b = array[i]) != null && b >= b) ***REMOVED*** a = c = b; break; ***REMOVED***
      while (++i < n) if ((b = array[i]) != null) ***REMOVED***
        if (a > b) a = b;
        if (c < b) c = b;
      ***REMOVED***
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) ***REMOVED*** a = c = b; break; ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null) ***REMOVED***
        if (a > b) a = b;
        if (c < b) c = b;
      ***REMOVED***
    ***REMOVED***
  
    return [a, c];
  ***REMOVED***;
  
  var array = Array.prototype;
  
  var slice = array.slice;
  var map = array.map;
  
  var constant = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var identity = function(x) ***REMOVED***
    return x;
  ***REMOVED***;
  
  var range = function(start, stop, step) ***REMOVED***
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  
    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);
  
    while (++i < n) ***REMOVED***
      range[i] = start + i * step;
    ***REMOVED***
  
    return range;
  ***REMOVED***;
  
  var e10 = Math.sqrt(50);
  var e5 = Math.sqrt(10);
  var e2 = Math.sqrt(2);
  
  var ticks = function(start, stop, count) ***REMOVED***
    var step = tickStep(start, stop, count);
    return range(
      Math.ceil(start / step) * step,
      Math.floor(stop / step) * step + step / 2, // inclusive
      step
    );
  ***REMOVED***;
  
  function tickStep(start, stop, count) ***REMOVED***
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  ***REMOVED***
  
  var sturges = function(values) ***REMOVED***
    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
  ***REMOVED***;
  
  var histogram = function() ***REMOVED***
    var value = identity,
        domain = extent,
        threshold = sturges;
  
    function histogram(data) ***REMOVED***
      var i,
          n = data.length,
          x,
          values = new Array(n);
  
      for (i = 0; i < n; ++i) ***REMOVED***
        values[i] = value(data[i], i, data);
      ***REMOVED***
  
      var xz = domain(values),
          x0 = xz[0],
          x1 = xz[1],
          tz = threshold(values, x0, x1);
  
      // Convert number of thresholds into uniform thresholds.
      if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);
  
      // Remove any thresholds outside the domain.
      var m = tz.length;
      while (tz[0] <= x0) tz.shift(), --m;
      while (tz[m - 1] >= x1) tz.pop(), --m;
  
      var bins = new Array(m + 1),
          bin;
  
      // Initialize bins.
      for (i = 0; i <= m; ++i) ***REMOVED***
        bin = bins[i] = [];
        bin.x0 = i > 0 ? tz[i - 1] : x0;
        bin.x1 = i < m ? tz[i] : x1;
      ***REMOVED***
  
      // Assign data to bins by value, ignoring any outside the domain.
      for (i = 0; i < n; ++i) ***REMOVED***
        x = values[i];
        if (x0 <= x && x <= x1) ***REMOVED***
          bins[bisectRight(tz, x, 0, m)].push(data[i]);
        ***REMOVED***
      ***REMOVED***
  
      return bins;
    ***REMOVED***
  
    histogram.value = function(_) ***REMOVED***
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
    ***REMOVED***;
  
    histogram.domain = function(_) ***REMOVED***
      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
    ***REMOVED***;
  
    histogram.thresholds = function(_) ***REMOVED***
      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
    ***REMOVED***;
  
    return histogram;
  ***REMOVED***;
  
  var threshold = function(array, p, f) ***REMOVED***
    if (f == null) f = number;
    if (!(n = array.length)) return;
    if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
    if (p >= 1) return +f(array[n - 1], n - 1, array);
    var n,
        h = (n - 1) * p,
        i = Math.floor(h),
        a = +f(array[i], i, array),
        b = +f(array[i + 1], i + 1, array);
    return a + (b - a) * (h - i);
  ***REMOVED***;
  
  var freedmanDiaconis = function(values, min, max) ***REMOVED***
    values = map.call(values, number).sort(ascending);
    return Math.ceil((max - min) / (2 * (threshold(values, 0.75) - threshold(values, 0.25)) * Math.pow(values.length, -1 / 3)));
  ***REMOVED***;
  
  var scott = function(values, min, max) ***REMOVED***
    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
  ***REMOVED***;
  
  var max = function(array, f) ***REMOVED***
    var i = -1,
        n = array.length,
        a,
        b;
  
    if (f == null) ***REMOVED***
      while (++i < n) if ((b = array[i]) != null && b >= b) ***REMOVED*** a = b; break; ***REMOVED***
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) ***REMOVED*** a = b; break; ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
    ***REMOVED***
  
    return a;
  ***REMOVED***;
  
  var mean = function(array, f) ***REMOVED***
    var s = 0,
        n = array.length,
        a,
        i = -1,
        j = n;
  
    if (f == null) ***REMOVED***
      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
    ***REMOVED***
  
    if (j) return s / j;
  ***REMOVED***;
  
  var median = function(array, f) ***REMOVED***
    var numbers = [],
        n = array.length,
        a,
        i = -1;
  
    if (f == null) ***REMOVED***
      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
    ***REMOVED***
  
    return threshold(numbers.sort(ascending), 0.5);
  ***REMOVED***;
  
  var merge = function(arrays) ***REMOVED***
    var n = arrays.length,
        m,
        i = -1,
        j = 0,
        merged,
        array;
  
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
  
    while (--n >= 0) ***REMOVED***
      array = arrays[n];
      m = array.length;
      while (--m >= 0) ***REMOVED***
        merged[--j] = array[m];
      ***REMOVED***
    ***REMOVED***
  
    return merged;
  ***REMOVED***;
  
  var min = function(array, f) ***REMOVED***
    var i = -1,
        n = array.length,
        a,
        b;
  
    if (f == null) ***REMOVED***
      while (++i < n) if ((b = array[i]) != null && b >= b) ***REMOVED*** a = b; break; ***REMOVED***
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) ***REMOVED*** a = b; break; ***REMOVED***
      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
    ***REMOVED***
  
    return a;
  ***REMOVED***;
  
  var pairs = function(array) ***REMOVED***
    var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [p, p = array[++i]];
    return pairs;
  ***REMOVED***;
  
  var permute = function(array, indexes) ***REMOVED***
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  ***REMOVED***;
  
  var scan = function(array, compare) ***REMOVED***
    if (!(n = array.length)) return;
    var i = 0,
        n,
        j = 0,
        xi,
        xj = array[j];
  
    if (!compare) compare = ascending;
  
    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;
  
    if (compare(xj, xj) === 0) return j;
  ***REMOVED***;
  
  var shuffle = function(array, i0, i1) ***REMOVED***
    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
        t,
        i;
  
    while (m) ***REMOVED***
      i = Math.random() * m-- | 0;
      t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    ***REMOVED***
  
    return array;
  ***REMOVED***;
  
  var sum = function(array, f) ***REMOVED***
    var s = 0,
        n = array.length,
        a,
        i = -1;
  
    if (f == null) ***REMOVED***
      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
    ***REMOVED***
  
    else ***REMOVED***
      while (++i < n) if (a = +f(array[i], i, array)) s += a;
    ***REMOVED***
  
    return s;
  ***REMOVED***;
  
  var transpose = function(matrix) ***REMOVED***
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) ***REMOVED***
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) ***REMOVED***
        row[j] = matrix[j][i];
      ***REMOVED***
    ***REMOVED***
    return transpose;
  ***REMOVED***;
  
  function length(d) ***REMOVED***
    return d.length;
  ***REMOVED***
  
  var zip = function() ***REMOVED***
    return transpose(arguments);
  ***REMOVED***;
  
  var prefix = "$";
  
  function Map() ***REMOVED******REMOVED***
  
  Map.prototype = map$1.prototype = ***REMOVED***
    constructor: Map,
    has: function(key) ***REMOVED***
      return (prefix + key) in this;
    ***REMOVED***,
    get: function(key) ***REMOVED***
      return this[prefix + key];
    ***REMOVED***,
    set: function(key, value) ***REMOVED***
      this[prefix + key] = value;
      return this;
    ***REMOVED***,
    remove: function(key) ***REMOVED***
      var property = prefix + key;
      return property in this && delete this[property];
    ***REMOVED***,
    clear: function() ***REMOVED***
      for (var property in this) if (property[0] === prefix) delete this[property];
    ***REMOVED***,
    keys: function() ***REMOVED***
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    ***REMOVED***,
    values: function() ***REMOVED***
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    ***REMOVED***,
    entries: function() ***REMOVED***
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push(***REMOVED***key: property.slice(1), value: this[property]***REMOVED***);
      return entries;
    ***REMOVED***,
    size: function() ***REMOVED***
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    ***REMOVED***,
    empty: function() ***REMOVED***
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    ***REMOVED***,
    each: function(f) ***REMOVED***
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    ***REMOVED***
  ***REMOVED***;
  
  function map$1(object, f) ***REMOVED***
    var map = new Map;
  
    // Copy constructor.
    if (object instanceof Map) object.each(function(value, key) ***REMOVED*** map.set(key, value); ***REMOVED***);
  
    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) ***REMOVED***
      var i = -1,
          n = object.length,
          o;
  
      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    ***REMOVED***
  
    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);
  
    return map;
  ***REMOVED***
  
  var nest = function() ***REMOVED***
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;
  
    function apply(array, depth, createResult, setResult) ***REMOVED***
      if (depth >= keys.length) return rollup != null
          ? rollup(array) : (sortValues != null
          ? array.sort(sortValues)
          : array);
  
      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map$1(),
          values,
          result = createResult();
  
      while (++i < n) ***REMOVED***
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) ***REMOVED***
          values.push(value);
        ***REMOVED*** else ***REMOVED***
          valuesByKey.set(keyValue, [value]);
        ***REMOVED***
      ***REMOVED***
  
      valuesByKey.each(function(values, key) ***REMOVED***
        setResult(result, key, apply(values, depth, createResult, setResult));
      ***REMOVED***);
  
      return result;
    ***REMOVED***
  
    function entries(map, depth) ***REMOVED***
      if (++depth > keys.length) return map;
      var array, sortKey = sortKeys[depth - 1];
      if (rollup != null && depth >= keys.length) array = map.entries();
      else array = [], map.each(function(v, k) ***REMOVED*** array.push(***REMOVED***key: k, values: entries(v, depth)***REMOVED***); ***REMOVED***);
      return sortKey != null ? array.sort(function(a, b) ***REMOVED*** return sortKey(a.key, b.key); ***REMOVED***) : array;
    ***REMOVED***
  
    return nest = ***REMOVED***
      object: function(array) ***REMOVED*** return apply(array, 0, createObject, setObject); ***REMOVED***,
      map: function(array) ***REMOVED*** return apply(array, 0, createMap, setMap); ***REMOVED***,
      entries: function(array) ***REMOVED*** return entries(apply(array, 0, createMap, setMap), 0); ***REMOVED***,
      key: function(d) ***REMOVED*** keys.push(d); return nest; ***REMOVED***,
      sortKeys: function(order) ***REMOVED*** sortKeys[keys.length - 1] = order; return nest; ***REMOVED***,
      sortValues: function(order) ***REMOVED*** sortValues = order; return nest; ***REMOVED***,
      rollup: function(f) ***REMOVED*** rollup = f; return nest; ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  function createObject() ***REMOVED***
    return ***REMOVED******REMOVED***;
  ***REMOVED***
  
  function setObject(object, key, value) ***REMOVED***
    object[key] = value;
  ***REMOVED***
  
  function createMap() ***REMOVED***
    return map$1();
  ***REMOVED***
  
  function setMap(map, key, value) ***REMOVED***
    map.set(key, value);
  ***REMOVED***
  
  function Set() ***REMOVED******REMOVED***
  
  var proto = map$1.prototype;
  
  Set.prototype = set.prototype = ***REMOVED***
    constructor: Set,
    has: proto.has,
    add: function(value) ***REMOVED***
      value += "";
      this[prefix + value] = value;
      return this;
    ***REMOVED***,
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  ***REMOVED***;
  
  function set(object, f) ***REMOVED***
    var set = new Set;
  
    // Copy constructor.
    if (object instanceof Set) object.each(function(value) ***REMOVED*** set.add(value); ***REMOVED***);
  
    // Otherwise, assume it’s an array.
    else if (object) ***REMOVED***
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);
      else while (++i < n) set.add(f(object[i], i, object));
    ***REMOVED***
  
    return set;
  ***REMOVED***
  
  var keys = function(map) ***REMOVED***
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  ***REMOVED***;
  
  var values = function(map) ***REMOVED***
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  ***REMOVED***;
  
  var entries = function(map) ***REMOVED***
    var entries = [];
    for (var key in map) entries.push(***REMOVED***key: key, value: map[key]***REMOVED***);
    return entries;
  ***REMOVED***;
  
  var uniform = function(min, max) ***REMOVED***
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1) max = min, min = 0;
    else max -= min;
    return function() ***REMOVED***
      return Math.random() * max + min;
    ***REMOVED***;
  ***REMOVED***;
  
  var normal = function(mu, sigma) ***REMOVED***
    var x, r;
    mu = mu == null ? 0 : +mu;
    sigma = sigma == null ? 1 : +sigma;
    return function() ***REMOVED***
      var y;
  
      // If available, use the second previously-generated uniform random.
      if (x != null) y = x, x = null;
  
      // Otherwise, generate a new x and y.
      else do ***REMOVED***
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        r = x * x + y * y;
      ***REMOVED*** while (!r || r > 1);
  
      return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
    ***REMOVED***;
  ***REMOVED***;
  
  var logNormal = function() ***REMOVED***
    var randomNormal = normal.apply(this, arguments);
    return function() ***REMOVED***
      return Math.exp(randomNormal());
    ***REMOVED***;
  ***REMOVED***;
  
  var irwinHall = function(n) ***REMOVED***
    return function() ***REMOVED***
      for (var sum = 0, i = 0; i < n; ++i) sum += Math.random();
      return sum;
    ***REMOVED***;
  ***REMOVED***;
  
  var bates = function(n) ***REMOVED***
    var randomIrwinHall = irwinHall(n);
    return function() ***REMOVED***
      return randomIrwinHall() / n;
    ***REMOVED***;
  ***REMOVED***;
  
  var exponential = function(lambda) ***REMOVED***
    return function() ***REMOVED***
      return -Math.log(1 - Math.random()) / lambda;
    ***REMOVED***;
  ***REMOVED***;
  
  function linear(t) ***REMOVED***
    return +t;
  ***REMOVED***
  
  function quadIn(t) ***REMOVED***
    return t * t;
  ***REMOVED***
  
  function quadOut(t) ***REMOVED***
    return t * (2 - t);
  ***REMOVED***
  
  function quadInOut(t) ***REMOVED***
    return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
  ***REMOVED***
  
  function cubicIn(t) ***REMOVED***
    return t * t * t;
  ***REMOVED***
  
  function cubicOut(t) ***REMOVED***
    return --t * t * t + 1;
  ***REMOVED***
  
  function cubicInOut(t) ***REMOVED***
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  ***REMOVED***
  
  var exponent = 3;
  
  var polyIn = (function custom(e) ***REMOVED***
    e = +e;
  
    function polyIn(t) ***REMOVED***
      return Math.pow(t, e);
    ***REMOVED***
  
    polyIn.exponent = custom;
  
    return polyIn;
  ***REMOVED***)(exponent);
  
  var polyOut = (function custom(e) ***REMOVED***
    e = +e;
  
    function polyOut(t) ***REMOVED***
      return 1 - Math.pow(1 - t, e);
    ***REMOVED***
  
    polyOut.exponent = custom;
  
    return polyOut;
  ***REMOVED***)(exponent);
  
  var polyInOut = (function custom(e) ***REMOVED***
    e = +e;
  
    function polyInOut(t) ***REMOVED***
      return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    ***REMOVED***
  
    polyInOut.exponent = custom;
  
    return polyInOut;
  ***REMOVED***)(exponent);
  
  var pi = Math.PI;
  var halfPi = pi / 2;
  
  function sinIn(t) ***REMOVED***
    return 1 - Math.cos(t * halfPi);
  ***REMOVED***
  
  function sinOut(t) ***REMOVED***
    return Math.sin(t * halfPi);
  ***REMOVED***
  
  function sinInOut(t) ***REMOVED***
    return (1 - Math.cos(pi * t)) / 2;
  ***REMOVED***
  
  function expIn(t) ***REMOVED***
    return Math.pow(2, 10 * t - 10);
  ***REMOVED***
  
  function expOut(t) ***REMOVED***
    return 1 - Math.pow(2, -10 * t);
  ***REMOVED***
  
  function expInOut(t) ***REMOVED***
    return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
  ***REMOVED***
  
  function circleIn(t) ***REMOVED***
    return 1 - Math.sqrt(1 - t * t);
  ***REMOVED***
  
  function circleOut(t) ***REMOVED***
    return Math.sqrt(1 - --t * t);
  ***REMOVED***
  
  function circleInOut(t) ***REMOVED***
    return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
  ***REMOVED***
  
  var b1 = 4 / 11;
  var b2 = 6 / 11;
  var b3 = 8 / 11;
  var b4 = 3 / 4;
  var b5 = 9 / 11;
  var b6 = 10 / 11;
  var b7 = 15 / 16;
  var b8 = 21 / 22;
  var b9 = 63 / 64;
  var b0 = 1 / b1 / b1;
  
  function bounceIn(t) ***REMOVED***
    return 1 - bounceOut(1 - t);
  ***REMOVED***
  
  function bounceOut(t) ***REMOVED***
    return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
  ***REMOVED***
  
  function bounceInOut(t) ***REMOVED***
    return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
  ***REMOVED***
  
  var overshoot = 1.70158;
  
  var backIn = (function custom(s) ***REMOVED***
    s = +s;
  
    function backIn(t) ***REMOVED***
      return t * t * ((s + 1) * t - s);
    ***REMOVED***
  
    backIn.overshoot = custom;
  
    return backIn;
  ***REMOVED***)(overshoot);
  
  var backOut = (function custom(s) ***REMOVED***
    s = +s;
  
    function backOut(t) ***REMOVED***
      return --t * t * ((s + 1) * t + s) + 1;
    ***REMOVED***
  
    backOut.overshoot = custom;
  
    return backOut;
  ***REMOVED***)(overshoot);
  
  var backInOut = (function custom(s) ***REMOVED***
    s = +s;
  
    function backInOut(t) ***REMOVED***
      return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    ***REMOVED***
  
    backInOut.overshoot = custom;
  
    return backInOut;
  ***REMOVED***)(overshoot);
  
  var tau = 2 * Math.PI;
  var amplitude = 1;
  var period = 0.3;
  
  var elasticIn = (function custom(a, p) ***REMOVED***
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticIn(t) ***REMOVED***
      return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
    ***REMOVED***
  
    elasticIn.amplitude = function(a) ***REMOVED*** return custom(a, p * tau); ***REMOVED***;
    elasticIn.period = function(p) ***REMOVED*** return custom(a, p); ***REMOVED***;
  
    return elasticIn;
  ***REMOVED***)(amplitude, period);
  
  var elasticOut = (function custom(a, p) ***REMOVED***
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticOut(t) ***REMOVED***
      return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
    ***REMOVED***
  
    elasticOut.amplitude = function(a) ***REMOVED*** return custom(a, p * tau); ***REMOVED***;
    elasticOut.period = function(p) ***REMOVED*** return custom(a, p); ***REMOVED***;
  
    return elasticOut;
  ***REMOVED***)(amplitude, period);
  
  var elasticInOut = (function custom(a, p) ***REMOVED***
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  
    function elasticInOut(t) ***REMOVED***
      return ((t = t * 2 - 1) < 0
          ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
          : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
    ***REMOVED***
  
    elasticInOut.amplitude = function(a) ***REMOVED*** return custom(a, p * tau); ***REMOVED***;
    elasticInOut.period = function(p) ***REMOVED*** return custom(a, p); ***REMOVED***;
  
    return elasticInOut;
  ***REMOVED***)(amplitude, period);
  
  var area = function(polygon) ***REMOVED***
    var i = -1,
        n = polygon.length,
        a,
        b = polygon[n - 1],
        area = 0;
  
    while (++i < n) ***REMOVED***
      a = b;
      b = polygon[i];
      area += a[1] * b[0] - a[0] * b[1];
    ***REMOVED***
  
    return area / 2;
  ***REMOVED***;
  
  var centroid = function(polygon) ***REMOVED***
    var i = -1,
        n = polygon.length,
        x = 0,
        y = 0,
        a,
        b = polygon[n - 1],
        c,
        k = 0;
  
    while (++i < n) ***REMOVED***
      a = b;
      b = polygon[i];
      k += c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    ***REMOVED***
  
    return k *= 3, [x / k, y / k];
  ***REMOVED***;
  
  // Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
  // the 3D cross product in a quadrant I Cartesian coordinate system (+x is
  // right, +y is up). Returns a positive value if ABC is counter-clockwise,
  // negative if clockwise, and zero if the points are collinear.
  var cross = function(a, b, c) ***REMOVED***
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  ***REMOVED***;
  
  function lexicographicOrder(a, b) ***REMOVED***
    return a[0] - b[0] || a[1] - b[1];
  ***REMOVED***
  
  // Computes the upper convex hull per the monotone chain algorithm.
  // Assumes points.length >= 3, is sorted by x, unique in y.
  // Returns an array of indices into points in left-to-right order.
  function computeUpperHullIndexes(points) ***REMOVED***
    var n = points.length,
        indexes = [0, 1],
        size = 2;
  
    for (var i = 2; i < n; ++i) ***REMOVED***
      while (size > 1 && cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;
      indexes[size++] = i;
    ***REMOVED***
  
    return indexes.slice(0, size); // remove popped points
  ***REMOVED***
  
  var hull = function(points) ***REMOVED***
    if ((n = points.length) < 3) return null;
  
    var i,
        n,
        sortedPoints = new Array(n),
        flippedPoints = new Array(n);
  
    for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];
    sortedPoints.sort(lexicographicOrder);
    for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];
  
    var upperIndexes = computeUpperHullIndexes(sortedPoints),
        lowerIndexes = computeUpperHullIndexes(flippedPoints);
  
    // Construct the hull polygon, removing possible duplicate endpoints.
    var skipLeft = lowerIndexes[0] === upperIndexes[0],
        skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
        hull = [];
  
    // Add upper hull in right-to-l order.
    // Then add lower hull in left-to-right order.
    for (i = upperIndexes.length - 1; i >= 0; --i) hull.push(points[sortedPoints[upperIndexes[i]][2]]);
    for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) hull.push(points[sortedPoints[lowerIndexes[i]][2]]);
  
    return hull;
  ***REMOVED***;
  
  var contains = function(polygon, point) ***REMOVED***
    var n = polygon.length,
        p = polygon[n - 1],
        x = point[0], y = point[1],
        x0 = p[0], y0 = p[1],
        x1, y1,
        inside = false;
  
    for (var i = 0; i < n; ++i) ***REMOVED***
      p = polygon[i], x1 = p[0], y1 = p[1];
      if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
      x0 = x1, y0 = y1;
    ***REMOVED***
  
    return inside;
  ***REMOVED***;
  
  var length$1 = function(polygon) ***REMOVED***
    var i = -1,
        n = polygon.length,
        b = polygon[n - 1],
        xa,
        ya,
        xb = b[0],
        yb = b[1],
        perimeter = 0;
  
    while (++i < n) ***REMOVED***
      xa = xb;
      ya = yb;
      b = polygon[i];
      xb = b[0];
      yb = b[1];
      xa -= xb;
      ya -= yb;
      perimeter += Math.sqrt(xa * xa + ya * ya);
    ***REMOVED***
  
    return perimeter;
  ***REMOVED***;
  
  var pi$1 = Math.PI;
  var tau$1 = 2 * pi$1;
  var epsilon = 1e-6;
  var tauEpsilon = tau$1 - epsilon;
  
  function Path() ***REMOVED***
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  ***REMOVED***
  
  function path() ***REMOVED***
    return new Path;
  ***REMOVED***
  
  Path.prototype = path.prototype = ***REMOVED***
    constructor: Path,
    moveTo: function(x, y) ***REMOVED***
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    ***REMOVED***,
    closePath: function() ***REMOVED***
      if (this._x1 !== null) ***REMOVED***
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      ***REMOVED***
    ***REMOVED***,
    lineTo: function(x, y) ***REMOVED***
      this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    ***REMOVED***,
    quadraticCurveTo: function(x1, y1, x, y) ***REMOVED***
      this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    ***REMOVED***,
    bezierCurveTo: function(x1, y1, x2, y2, x, y) ***REMOVED***
      this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    ***REMOVED***,
    arcTo: function(x1, y1, x2, y2, r) ***REMOVED***
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;
  
      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);
  
      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) ***REMOVED***
        this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
      ***REMOVED***
  
      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon)) ***REMOVED******REMOVED***
  
      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) ***REMOVED***
        this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
      ***REMOVED***
  
      // Otherwise, draw an arc!
      else ***REMOVED***
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;
  
        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon) ***REMOVED***
          this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
        ***REMOVED***
  
        this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
      ***REMOVED***
    ***REMOVED***,
    arc: function(x, y, r, a0, a1, ccw) ***REMOVED***
      x = +x, y = +y, r = +r;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;
  
      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);
  
      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) ***REMOVED***
        this._ += "M" + x0 + "," + y0;
      ***REMOVED***
  
      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) ***REMOVED***
        this._ += "L" + x0 + "," + y0;
      ***REMOVED***
  
      // Is this arc empty? We’re done.
      if (!r) return;
  
      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) ***REMOVED***
        this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
      ***REMOVED***
  
      // Otherwise, draw an arc!
      else ***REMOVED***
        if (da < 0) da = da % tau$1 + tau$1;
        this._ += "A" + r + "," + r + ",0," + (+(da >= pi$1)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      ***REMOVED***
    ***REMOVED***,
    rect: function(x, y, w, h) ***REMOVED***
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
    ***REMOVED***,
    toString: function() ***REMOVED***
      return this._;
    ***REMOVED***
  ***REMOVED***;
  
  var tree_add = function(d) ***REMOVED***
    var x = +this._x.call(null, d),
        y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
  ***REMOVED***;
  
  function add(tree, x, y, d) ***REMOVED***
    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points
  
    var parent,
        node = tree._root,
        leaf = ***REMOVED***data: d***REMOVED***,
        x0 = tree._x0,
        y0 = tree._y0,
        x1 = tree._x1,
        y1 = tree._y1,
        xm,
        ym,
        xp,
        yp,
        right,
        bottom,
        i,
        j;
  
    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;
  
    // Find the existing leaf for the new point, or add it.
    while (node.length) ***REMOVED***
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    ***REMOVED***
  
    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  
    // Otherwise, split the leaf node until the old and new point are separated.
    do ***REMOVED***
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    ***REMOVED*** while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  ***REMOVED***
  
  function addAll(data) ***REMOVED***
    var d, i, n = data.length,
        x,
        y,
        xz = new Array(n),
        yz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;
  
    // Compute the points and their extent.
    for (i = 0; i < n; ++i) ***REMOVED***
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    ***REMOVED***
  
    // If there were no (valid) points, inherit the existing extent.
    if (x1 < x0) x0 = this._x0, x1 = this._x1;
    if (y1 < y0) y0 = this._y0, y1 = this._y1;
  
    // Expand the tree to cover the new points.
    this.cover(x0, y0).cover(x1, y1);
  
    // Add the new points.
    for (i = 0; i < n; ++i) ***REMOVED***
      add(this, xz[i], yz[i], data[i]);
    ***REMOVED***
  
    return this;
  ***REMOVED***
  
  var tree_cover = function(x, y) ***REMOVED***
    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points
  
    var x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1;
  
    // If the quadtree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing quadrant boundaries don’t change due to floating point error!
    if (isNaN(x0)) ***REMOVED***
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    ***REMOVED***
  
    // Otherwise, double repeatedly to cover.
    else if (x0 > x || x > x1 || y0 > y || y > y1) ***REMOVED***
      var z = x1 - x0,
          node = this._root,
          parent,
          i;
  
      switch (i = (y < (y0 + y1) / 2) << 1 | (x < (x0 + x1) / 2)) ***REMOVED***
        case 0: ***REMOVED***
          do parent = new Array(4), parent[i] = node, node = parent;
          while (z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1);
          break;
        ***REMOVED***
        case 1: ***REMOVED***
          do parent = new Array(4), parent[i] = node, node = parent;
          while (z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1);
          break;
        ***REMOVED***
        case 2: ***REMOVED***
          do parent = new Array(4), parent[i] = node, node = parent;
          while (z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y);
          break;
        ***REMOVED***
        case 3: ***REMOVED***
          do parent = new Array(4), parent[i] = node, node = parent;
          while (z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y);
          break;
        ***REMOVED***
      ***REMOVED***
  
      if (this._root && this._root.length) this._root = node;
    ***REMOVED***
  
    // If the quadtree covers the point already, just return.
    else return this;
  
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  ***REMOVED***;
  
  var tree_data = function() ***REMOVED***
    var data = [];
    this.visit(function(node) ***REMOVED***
      if (!node.length) do data.push(node.data); while (node = node.next)
    ***REMOVED***);
    return data;
  ***REMOVED***;
  
  var tree_extent = function(_) ***REMOVED***
    return arguments.length
        ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
        : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
  ***REMOVED***;
  
  var Quad = function(node, x0, y0, x1, y1) ***REMOVED***
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  ***REMOVED***;
  
  var tree_find = function(x, y, radius) ***REMOVED***
    var data,
        x0 = this._x0,
        y0 = this._y0,
        x1,
        y1,
        x2,
        y2,
        x3 = this._x1,
        y3 = this._y1,
        quads = [],
        node = this._root,
        q,
        i;
  
    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else ***REMOVED***
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    ***REMOVED***
  
    while (q = quads.pop()) ***REMOVED***
  
      // Stop searching if this quadrant can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (y1 = q.y0) > y3
          || (x2 = q.x1) < x0
          || (y2 = q.y1) < y0) continue;
  
      // Bisect the current quadrant.
      if (node.length) ***REMOVED***
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2;
  
        quads.push(
          new Quad(node[3], xm, ym, x2, y2),
          new Quad(node[2], x1, ym, xm, y2),
          new Quad(node[1], xm, y1, x2, ym),
          new Quad(node[0], x1, y1, xm, ym)
        );
  
        // Visit the closest quadrant first.
        if (i = (y >= ym) << 1 | (x >= xm)) ***REMOVED***
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        ***REMOVED***
      ***REMOVED***
  
      // Visit this point. (Visiting coincident points isn’t necessary!)
      else ***REMOVED***
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;
        if (d2 < radius) ***REMOVED***
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return data;
  ***REMOVED***;
  
  var tree_remove = function(d) ***REMOVED***
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points
  
    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1,
        x,
        y,
        xm,
        ym,
        right,
        bottom,
        i,
        j;
  
    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;
  
    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) ***REMOVED***
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
    ***REMOVED***
  
    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;
  
    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;
  
    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;
  
    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];
  
    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3])
        && node === (parent[3] || parent[2] || parent[1] || parent[0])
        && !node.length) ***REMOVED***
      if (retainer) retainer[j] = node;
      else this._root = node;
    ***REMOVED***
  
    return this;
  ***REMOVED***;
  
  function removeAll(data) ***REMOVED***
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  ***REMOVED***
  
  var tree_root = function() ***REMOVED***
    return this._root;
  ***REMOVED***;
  
  var tree_size = function() ***REMOVED***
    var size = 0;
    this.visit(function(node) ***REMOVED***
      if (!node.length) do ++size; while (node = node.next)
    ***REMOVED***);
    return size;
  ***REMOVED***;
  
  var tree_visit = function(callback) ***REMOVED***
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) ***REMOVED***
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) ***REMOVED***
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      ***REMOVED***
    ***REMOVED***
    return this;
  ***REMOVED***;
  
  var tree_visitAfter = function(callback) ***REMOVED***
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) ***REMOVED***
      var node = q.node;
      if (node.length) ***REMOVED***
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      ***REMOVED***
      next.push(q);
    ***REMOVED***
    while (q = next.pop()) ***REMOVED***
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    ***REMOVED***
    return this;
  ***REMOVED***;
  
  function defaultX(d) ***REMOVED***
    return d[0];
  ***REMOVED***
  
  var tree_x = function(_) ***REMOVED***
    return arguments.length ? (this._x = _, this) : this._x;
  ***REMOVED***;
  
  function defaultY(d) ***REMOVED***
    return d[1];
  ***REMOVED***
  
  var tree_y = function(_) ***REMOVED***
    return arguments.length ? (this._y = _, this) : this._y;
  ***REMOVED***;
  
  function quadtree(nodes, x, y) ***REMOVED***
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  ***REMOVED***
  
  function Quadtree(x, y, x0, y0, x1, y1) ***REMOVED***
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = undefined;
  ***REMOVED***
  
  function leaf_copy(leaf) ***REMOVED***
    var copy = ***REMOVED***data: leaf.data***REMOVED***, next = copy;
    while (leaf = leaf.next) next = next.next = ***REMOVED***data: leaf.data***REMOVED***;
    return copy;
  ***REMOVED***
  
  var treeProto = quadtree.prototype = Quadtree.prototype;
  
  treeProto.copy = function() ***REMOVED***
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
        node = this._root,
        nodes,
        child;
  
    if (!node) return copy;
  
    if (!node.length) return copy._root = leaf_copy(node), copy;
  
    nodes = [***REMOVED***source: node, target: copy._root = new Array(4)***REMOVED***];
    while (node = nodes.pop()) ***REMOVED***
      for (var i = 0; i < 4; ++i) ***REMOVED***
        if (child = node.source[i]) ***REMOVED***
          if (child.length) nodes.push(***REMOVED***source: child, target: node.target[i] = new Array(4)***REMOVED***);
          else node.target[i] = leaf_copy(child);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return copy;
  ***REMOVED***;
  
  treeProto.add = tree_add;
  treeProto.addAll = addAll;
  treeProto.cover = tree_cover;
  treeProto.data = tree_data;
  treeProto.extent = tree_extent;
  treeProto.find = tree_find;
  treeProto.remove = tree_remove;
  treeProto.removeAll = removeAll;
  treeProto.root = tree_root;
  treeProto.size = tree_size;
  treeProto.visit = tree_visit;
  treeProto.visitAfter = tree_visitAfter;
  treeProto.x = tree_x;
  treeProto.y = tree_y;
  
  var slice$1 = [].slice;
  
  var noabort = ***REMOVED******REMOVED***;
  
  function Queue(size) ***REMOVED***
    if (!(size >= 1)) throw new Error;
    this._size = size;
    this._call =
    this._error = null;
    this._tasks = [];
    this._data = [];
    this._waiting =
    this._active =
    this._ended =
    this._start = 0; // inside a synchronous task callback?
  ***REMOVED***
  
  Queue.prototype = queue.prototype = ***REMOVED***
    constructor: Queue,
    defer: function(callback) ***REMOVED***
      if (typeof callback !== "function" || this._call) throw new Error;
      if (this._error != null) return this;
      var t = slice$1.call(arguments, 1);
      t.push(callback);
      ++this._waiting, this._tasks.push(t);
      poke(this);
      return this;
    ***REMOVED***,
    abort: function() ***REMOVED***
      if (this._error == null) abort(this, new Error("abort"));
      return this;
    ***REMOVED***,
    await: function(callback) ***REMOVED***
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = function(error, results) ***REMOVED*** callback.apply(null, [error].concat(results)); ***REMOVED***;
      maybeNotify(this);
      return this;
    ***REMOVED***,
    awaitAll: function(callback) ***REMOVED***
      if (typeof callback !== "function" || this._call) throw new Error;
      this._call = callback;
      maybeNotify(this);
      return this;
    ***REMOVED***
  ***REMOVED***;
  
  function poke(q) ***REMOVED***
    if (!q._start) ***REMOVED***
      try ***REMOVED*** start(q); ***REMOVED*** // let the current task complete
      catch (e) ***REMOVED***
        if (q._tasks[q._ended + q._active - 1]) abort(q, e); // task errored synchronously
        else if (!q._data) throw e; // await callback errored synchronously
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  function start(q) ***REMOVED***
    while (q._start = q._waiting && q._active < q._size) ***REMOVED***
      var i = q._ended + q._active,
          t = q._tasks[i],
          j = t.length - 1,
          c = t[j];
      t[j] = end(q, i);
      --q._waiting, ++q._active;
      t = c.apply(null, t);
      if (!q._tasks[i]) continue; // task finished synchronously
      q._tasks[i] = t || noabort;
    ***REMOVED***
  ***REMOVED***
  
  function end(q, i) ***REMOVED***
    return function(e, r) ***REMOVED***
      if (!q._tasks[i]) return; // ignore multiple callbacks
      --q._active, ++q._ended;
      q._tasks[i] = null;
      if (q._error != null) return; // ignore secondary errors
      if (e != null) ***REMOVED***
        abort(q, e);
      ***REMOVED*** else ***REMOVED***
        q._data[i] = r;
        if (q._waiting) poke(q);
        else maybeNotify(q);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function abort(q, e) ***REMOVED***
    var i = q._tasks.length, t;
    q._error = e; // ignore active callbacks
    q._data = undefined; // allow gc
    q._waiting = NaN; // prevent starting
  
    while (--i >= 0) ***REMOVED***
      if (t = q._tasks[i]) ***REMOVED***
        q._tasks[i] = null;
        if (t.abort) ***REMOVED***
          try ***REMOVED*** t.abort(); ***REMOVED***
          catch (e) ***REMOVED*** /* ignore */ ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    q._active = NaN; // allow notification
    maybeNotify(q);
  ***REMOVED***
  
  function maybeNotify(q) ***REMOVED***
    if (!q._active && q._call) ***REMOVED***
      var d = q._data;
      q._data = undefined; // allow gc
      q._call(q._error, d);
    ***REMOVED***
  ***REMOVED***
  
  function queue(concurrency) ***REMOVED***
    return new Queue(arguments.length ? +concurrency : Infinity);
  ***REMOVED***
  
  var constant$1 = function(x) ***REMOVED***
    return function constant() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var epsilon$1 = 1e-12;
  var pi$2 = Math.PI;
  var halfPi$1 = pi$2 / 2;
  var tau$2 = 2 * pi$2;
  
  function arcInnerRadius(d) ***REMOVED***
    return d.innerRadius;
  ***REMOVED***
  
  function arcOuterRadius(d) ***REMOVED***
    return d.outerRadius;
  ***REMOVED***
  
  function arcStartAngle(d) ***REMOVED***
    return d.startAngle;
  ***REMOVED***
  
  function arcEndAngle(d) ***REMOVED***
    return d.endAngle;
  ***REMOVED***
  
  function arcPadAngle(d) ***REMOVED***
    return d && d.padAngle; // Note: optional!
  ***REMOVED***
  
  function asin(x) ***REMOVED***
    return x >= 1 ? halfPi$1 : x <= -1 ? -halfPi$1 : Math.asin(x);
  ***REMOVED***
  
  function intersect(x0, y0, x1, y1, x2, y2, x3, y3) ***REMOVED***
    var x10 = x1 - x0, y10 = y1 - y0,
        x32 = x3 - x2, y32 = y3 - y2,
        t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
    return [x0 + t * x10, y0 + t * y10];
  ***REMOVED***
  
  // Compute perpendicular offset line of length rc.
  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  function cornerTangents(x0, y0, x1, y1, r1, rc, cw) ***REMOVED***
    var x01 = x0 - x1,
        y01 = y0 - y1,
        lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
        ox = lo * y01,
        oy = -lo * x01,
        x11 = x0 + ox,
        y11 = y0 + oy,
        x10 = x1 + ox,
        y10 = y1 + oy,
        x00 = (x11 + x10) / 2,
        y00 = (y11 + y10) / 2,
        dx = x10 - x11,
        dy = y10 - y11,
        d2 = dx * dx + dy * dy,
        r = r1 - rc,
        D = x11 * y10 - x10 * y11,
        d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
        cx0 = (D * dy - dx * d) / d2,
        cy0 = (-D * dx - dy * d) / d2,
        cx1 = (D * dy + dx * d) / d2,
        cy1 = (-D * dx + dy * d) / d2,
        dx0 = cx0 - x00,
        dy0 = cy0 - y00,
        dx1 = cx1 - x00,
        dy1 = cy1 - y00;
  
    // Pick the closer of the two intersection points.
    // TODO Is there a faster way to determine which intersection to use?
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
  
    return ***REMOVED***
      cx: cx0,
      cy: cy0,
      x01: -ox,
      y01: -oy,
      x11: cx0 * (r1 / r - 1),
      y11: cy0 * (r1 / r - 1)
    ***REMOVED***;
  ***REMOVED***
  
  var arc = function() ***REMOVED***
    var innerRadius = arcInnerRadius,
        outerRadius = arcOuterRadius,
        cornerRadius = constant$1(0),
        padRadius = null,
        startAngle = arcStartAngle,
        endAngle = arcEndAngle,
        padAngle = arcPadAngle,
        context = null;
  
    function arc() ***REMOVED***
      var buffer,
          r,
          r0 = +innerRadius.apply(this, arguments),
          r1 = +outerRadius.apply(this, arguments),
          a0 = startAngle.apply(this, arguments) - halfPi$1,
          a1 = endAngle.apply(this, arguments) - halfPi$1,
          da = Math.abs(a1 - a0),
          cw = a1 > a0;
  
      if (!context) context = buffer = path();
  
      // Ensure that the outer radius is always larger than the inner radius.
      if (r1 < r0) r = r1, r1 = r0, r0 = r;
  
      // Is it a point?
      if (!(r1 > epsilon$1)) context.moveTo(0, 0);
  
      // Or is it a circle or annulus?
      else if (da > tau$2 - epsilon$1) ***REMOVED***
        context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon$1) ***REMOVED***
          context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        ***REMOVED***
      ***REMOVED***
  
      // Or is it a circular or annular sector?
      else ***REMOVED***
        var a01 = a0,
            a11 = a1,
            a00 = a0,
            a10 = a1,
            da0 = da,
            da1 = da,
            ap = padAngle.apply(this, arguments) / 2,
            rp = (ap > epsilon$1) && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
            rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
            rc0 = rc,
            rc1 = rc,
            t0,
            t1;
  
        // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
        if (rp > epsilon$1) ***REMOVED***
          var p0 = asin(rp / r0 * Math.sin(ap)),
              p1 = asin(rp / r1 * Math.sin(ap));
          if ((da0 -= p0 * 2) > epsilon$1) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
          else da0 = 0, a00 = a10 = (a0 + a1) / 2;
          if ((da1 -= p1 * 2) > epsilon$1) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
          else da1 = 0, a01 = a11 = (a0 + a1) / 2;
        ***REMOVED***
  
        var x01 = r1 * Math.cos(a01),
            y01 = r1 * Math.sin(a01),
            x10 = r0 * Math.cos(a10),
            y10 = r0 * Math.sin(a10);
  
        // Apply rounded corners?
        if (rc > epsilon$1) ***REMOVED***
          var x11 = r1 * Math.cos(a11),
              y11 = r1 * Math.sin(a11),
              x00 = r0 * Math.cos(a00),
              y00 = r0 * Math.sin(a00);
  
          // Restrict the corner radius according to the sector angle.
          if (da < pi$2) ***REMOVED***
            var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                ax = x01 - oc[0],
                ay = y01 - oc[1],
                bx = x11 - oc[0],
                by = y11 - oc[1],
                kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
            rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
          ***REMOVED***
        ***REMOVED***
  
        // Is the sector collapsed to a line?
        if (!(da1 > epsilon$1)) context.moveTo(x01, y01);
  
        // Does the sector’s outer ring have rounded corners?
        else if (rc1 > epsilon$1) ***REMOVED***
          t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
          t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
  
          context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);
  
          // Have the corners merged?
          if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);
  
          // Otherwise, draw the two corners and the ring.
          else ***REMOVED***
            context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
            context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
          ***REMOVED***
        ***REMOVED***
  
        // Or is the outer ring just a circular arc?
        else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);
  
        // Is there no inner ring, and it’s a circular sector?
        // Or perhaps it’s an annular sector collapsed due to padding?
        if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);
  
        // Does the sector’s inner ring (or point) have rounded corners?
        else if (rc0 > epsilon$1) ***REMOVED***
          t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
          t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
  
          context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);
  
          // Have the corners merged?
          if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);
  
          // Otherwise, draw the two corners and the ring.
          else ***REMOVED***
            context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
            context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
            context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
          ***REMOVED***
        ***REMOVED***
  
        // Or is the inner ring just a circular arc?
        else context.arc(0, 0, r0, a10, a00, cw);
      ***REMOVED***
  
      context.closePath();
  
      if (buffer) return context = null, buffer + "" || null;
    ***REMOVED***
  
    arc.centroid = function() ***REMOVED***
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
          a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$2 / 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    ***REMOVED***;
  
    arc.innerRadius = function(_) ***REMOVED***
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : innerRadius;
    ***REMOVED***;
  
    arc.outerRadius = function(_) ***REMOVED***
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : outerRadius;
    ***REMOVED***;
  
    arc.cornerRadius = function(_) ***REMOVED***
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : cornerRadius;
    ***REMOVED***;
  
    arc.padRadius = function(_) ***REMOVED***
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), arc) : padRadius;
    ***REMOVED***;
  
    arc.startAngle = function(_) ***REMOVED***
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : startAngle;
    ***REMOVED***;
  
    arc.endAngle = function(_) ***REMOVED***
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : endAngle;
    ***REMOVED***;
  
    arc.padAngle = function(_) ***REMOVED***
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : padAngle;
    ***REMOVED***;
  
    arc.context = function(_) ***REMOVED***
      return arguments.length ? ((context = _ == null ? null : _), arc) : context;
    ***REMOVED***;
  
    return arc;
  ***REMOVED***;
  
  function Linear(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  Linear.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: this._context.lineTo(x, y); break;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  
  var curveLinear = function(context) ***REMOVED***
    return new Linear(context);
  ***REMOVED***;
  
  function x(p) ***REMOVED***
    return p[0];
  ***REMOVED***
  
  function y(p) ***REMOVED***
    return p[1];
  ***REMOVED***
  
  var line = function() ***REMOVED***
    var x$$1 = x,
        y$$1 = y,
        defined = constant$1(true),
        context = null,
        curve = curveLinear,
        output = null;
  
    function line(data) ***REMOVED***
      var i,
          n = data.length,
          d,
          defined0 = false,
          buffer;
  
      if (context == null) output = curve(buffer = path());
  
      for (i = 0; i <= n; ++i) ***REMOVED***
        if (!(i < n && defined(d = data[i], i, data)) === defined0) ***REMOVED***
          if (defined0 = !defined0) output.lineStart();
          else output.lineEnd();
        ***REMOVED***
        if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
      ***REMOVED***
  
      if (buffer) return output = null, buffer + "" || null;
    ***REMOVED***
  
    line.x = function(_) ***REMOVED***
      return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$1(+_), line) : x$$1;
    ***REMOVED***;
  
    line.y = function(_) ***REMOVED***
      return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$1(+_), line) : y$$1;
    ***REMOVED***;
  
    line.defined = function(_) ***REMOVED***
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), line) : defined;
    ***REMOVED***;
  
    line.curve = function(_) ***REMOVED***
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    ***REMOVED***;
  
    line.context = function(_) ***REMOVED***
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    ***REMOVED***;
  
    return line;
  ***REMOVED***;
  
  var area$1 = function() ***REMOVED***
    var x0 = x,
        x1 = null,
        y0 = constant$1(0),
        y1 = y,
        defined = constant$1(true),
        context = null,
        curve = curveLinear,
        output = null;
  
    function area(data) ***REMOVED***
      var i,
          j,
          k,
          n = data.length,
          d,
          defined0 = false,
          buffer,
          x0z = new Array(n),
          y0z = new Array(n);
  
      if (context == null) output = curve(buffer = path());
  
      for (i = 0; i <= n; ++i) ***REMOVED***
        if (!(i < n && defined(d = data[i], i, data)) === defined0) ***REMOVED***
          if (defined0 = !defined0) ***REMOVED***
            j = i;
            output.areaStart();
            output.lineStart();
          ***REMOVED*** else ***REMOVED***
            output.lineEnd();
            output.lineStart();
            for (k = i - 1; k >= j; --k) ***REMOVED***
              output.point(x0z[k], y0z[k]);
            ***REMOVED***
            output.lineEnd();
            output.areaEnd();
          ***REMOVED***
        ***REMOVED***
        if (defined0) ***REMOVED***
          x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
          output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
        ***REMOVED***
      ***REMOVED***
  
      if (buffer) return output = null, buffer + "" || null;
    ***REMOVED***
  
    function arealine() ***REMOVED***
      return line().defined(defined).curve(curve).context(context);
    ***REMOVED***
  
    area.x = function(_) ***REMOVED***
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$1(+_), x1 = null, area) : x0;
    ***REMOVED***;
  
    area.x0 = function(_) ***REMOVED***
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$1(+_), area) : x0;
    ***REMOVED***;
  
    area.x1 = function(_) ***REMOVED***
      return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), area) : x1;
    ***REMOVED***;
  
    area.y = function(_) ***REMOVED***
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$1(+_), y1 = null, area) : y0;
    ***REMOVED***;
  
    area.y0 = function(_) ***REMOVED***
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$1(+_), area) : y0;
    ***REMOVED***;
  
    area.y1 = function(_) ***REMOVED***
      return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), area) : y1;
    ***REMOVED***;
  
    area.lineX0 =
    area.lineY0 = function() ***REMOVED***
      return arealine().x(x0).y(y0);
    ***REMOVED***;
  
    area.lineY1 = function() ***REMOVED***
      return arealine().x(x0).y(y1);
    ***REMOVED***;
  
    area.lineX1 = function() ***REMOVED***
      return arealine().x(x1).y(y0);
    ***REMOVED***;
  
    area.defined = function(_) ***REMOVED***
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), area) : defined;
    ***REMOVED***;
  
    area.curve = function(_) ***REMOVED***
      return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
    ***REMOVED***;
  
    area.context = function(_) ***REMOVED***
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
    ***REMOVED***;
  
    return area;
  ***REMOVED***;
  
  var descending$1 = function(a, b) ***REMOVED***
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  ***REMOVED***;
  
  var identity$1 = function(d) ***REMOVED***
    return d;
  ***REMOVED***;
  
  var pie = function() ***REMOVED***
    var value = identity$1,
        sortValues = descending$1,
        sort = null,
        startAngle = constant$1(0),
        endAngle = constant$1(tau$2),
        padAngle = constant$1(0);
  
    function pie(data) ***REMOVED***
      var i,
          n = data.length,
          j,
          k,
          sum = 0,
          index = new Array(n),
          arcs = new Array(n),
          a0 = +startAngle.apply(this, arguments),
          da = Math.min(tau$2, Math.max(-tau$2, endAngle.apply(this, arguments) - a0)),
          a1,
          p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
          pa = p * (da < 0 ? -1 : 1),
          v;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) ***REMOVED***
          sum += v;
        ***REMOVED***
      ***REMOVED***
  
      // Optionally sort the arcs by previously-computed values or by data.
      if (sortValues != null) index.sort(function(i, j) ***REMOVED*** return sortValues(arcs[i], arcs[j]); ***REMOVED***);
      else if (sort != null) index.sort(function(i, j) ***REMOVED*** return sort(data[i], data[j]); ***REMOVED***);
  
      // Compute the arcs! They are stored in the original data's order.
      for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) ***REMOVED***
        j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = ***REMOVED***
          data: data[j],
          index: i,
          value: v,
          startAngle: a0,
          endAngle: a1,
          padAngle: p
        ***REMOVED***;
      ***REMOVED***
  
      return arcs;
    ***REMOVED***
  
    pie.value = function(_) ***REMOVED***
      return arguments.length ? (value = typeof _ === "function" ? _ : constant$1(+_), pie) : value;
    ***REMOVED***;
  
    pie.sortValues = function(_) ***REMOVED***
      return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
    ***REMOVED***;
  
    pie.sort = function(_) ***REMOVED***
      return arguments.length ? (sort = _, sortValues = null, pie) : sort;
    ***REMOVED***;
  
    pie.startAngle = function(_) ***REMOVED***
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : startAngle;
    ***REMOVED***;
  
    pie.endAngle = function(_) ***REMOVED***
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : endAngle;
    ***REMOVED***;
  
    pie.padAngle = function(_) ***REMOVED***
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : padAngle;
    ***REMOVED***;
  
    return pie;
  ***REMOVED***;
  
  var curveRadialLinear = curveRadial(curveLinear);
  
  function Radial(curve) ***REMOVED***
    this._curve = curve;
  ***REMOVED***
  
  Radial.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._curve.areaStart();
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._curve.areaEnd();
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._curve.lineStart();
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      this._curve.lineEnd();
    ***REMOVED***,
    point: function(a, r) ***REMOVED***
      this._curve.point(r * Math.sin(a), r * -Math.cos(a));
    ***REMOVED***
  ***REMOVED***;
  
  function curveRadial(curve) ***REMOVED***
  
    function radial(context) ***REMOVED***
      return new Radial(curve(context));
    ***REMOVED***
  
    radial._curve = curve;
  
    return radial;
  ***REMOVED***
  
  function radialLine(l) ***REMOVED***
    var c = l.curve;
  
    l.angle = l.x, delete l.x;
    l.radius = l.y, delete l.y;
  
    l.curve = function(_) ***REMOVED***
      return arguments.length ? c(curveRadial(_)) : c()._curve;
    ***REMOVED***;
  
    return l;
  ***REMOVED***
  
  var radialLine$1 = function() ***REMOVED***
    return radialLine(line().curve(curveRadialLinear));
  ***REMOVED***;
  
  var radialArea = function() ***REMOVED***
    var a = area$1().curve(curveRadialLinear),
        c = a.curve,
        x0 = a.lineX0,
        x1 = a.lineX1,
        y0 = a.lineY0,
        y1 = a.lineY1;
  
    a.angle = a.x, delete a.x;
    a.startAngle = a.x0, delete a.x0;
    a.endAngle = a.x1, delete a.x1;
    a.radius = a.y, delete a.y;
    a.innerRadius = a.y0, delete a.y0;
    a.outerRadius = a.y1, delete a.y1;
    a.lineStartAngle = function() ***REMOVED*** return radialLine(x0()); ***REMOVED***, delete a.lineX0;
    a.lineEndAngle = function() ***REMOVED*** return radialLine(x1()); ***REMOVED***, delete a.lineX1;
    a.lineInnerRadius = function() ***REMOVED*** return radialLine(y0()); ***REMOVED***, delete a.lineY0;
    a.lineOuterRadius = function() ***REMOVED*** return radialLine(y1()); ***REMOVED***, delete a.lineY1;
  
    a.curve = function(_) ***REMOVED***
      return arguments.length ? c(curveRadial(_)) : c()._curve;
    ***REMOVED***;
  
    return a;
  ***REMOVED***;
  
  var circle = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var r = Math.sqrt(size / pi$2);
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau$2);
    ***REMOVED***
  ***REMOVED***;
  
  var cross$1 = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var r = Math.sqrt(size / 5) / 2;
      context.moveTo(-3 * r, -r);
      context.lineTo(-r, -r);
      context.lineTo(-r, -3 * r);
      context.lineTo(r, -3 * r);
      context.lineTo(r, -r);
      context.lineTo(3 * r, -r);
      context.lineTo(3 * r, r);
      context.lineTo(r, r);
      context.lineTo(r, 3 * r);
      context.lineTo(-r, 3 * r);
      context.lineTo(-r, r);
      context.lineTo(-3 * r, r);
      context.closePath();
    ***REMOVED***
  ***REMOVED***;
  
  var tan30 = Math.sqrt(1 / 3);
  var tan30_2 = tan30 * 2;
  
  var diamond = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var y = Math.sqrt(size / tan30_2),
          x = y * tan30;
      context.moveTo(0, -y);
      context.lineTo(x, 0);
      context.lineTo(0, y);
      context.lineTo(-x, 0);
      context.closePath();
    ***REMOVED***
  ***REMOVED***;
  
  var ka = 0.89081309152928522810;
  var kr = Math.sin(pi$2 / 10) / Math.sin(7 * pi$2 / 10);
  var kx = Math.sin(tau$2 / 10) * kr;
  var ky = -Math.cos(tau$2 / 10) * kr;
  
  var star = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var r = Math.sqrt(size * ka),
          x = kx * r,
          y = ky * r;
      context.moveTo(0, -r);
      context.lineTo(x, y);
      for (var i = 1; i < 5; ++i) ***REMOVED***
        var a = tau$2 * i / 5,
            c = Math.cos(a),
            s = Math.sin(a);
        context.lineTo(s * r, -c * r);
        context.lineTo(c * x - s * y, s * x + c * y);
      ***REMOVED***
      context.closePath();
    ***REMOVED***
  ***REMOVED***;
  
  var square = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var w = Math.sqrt(size),
          x = -w / 2;
      context.rect(x, x, w, w);
    ***REMOVED***
  ***REMOVED***;
  
  var sqrt3 = Math.sqrt(3);
  
  var triangle = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var y = -Math.sqrt(size / (sqrt3 * 3));
      context.moveTo(0, y * 2);
      context.lineTo(-sqrt3 * y, -y);
      context.lineTo(sqrt3 * y, -y);
      context.closePath();
    ***REMOVED***
  ***REMOVED***;
  
  var c = -0.5;
  var s = Math.sqrt(3) / 2;
  var k = 1 / Math.sqrt(12);
  var a = (k / 2 + 1) * 3;
  
  var wye = ***REMOVED***
    draw: function(context, size) ***REMOVED***
      var r = Math.sqrt(size / a),
          x0 = r / 2,
          y0 = r * k,
          x1 = x0,
          y1 = r * k + r,
          x2 = -x1,
          y2 = y1;
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
      context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
      context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
      context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
      context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
      context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
      context.closePath();
    ***REMOVED***
  ***REMOVED***;
  
  var symbols = [
    circle,
    cross$1,
    diamond,
    square,
    star,
    triangle,
    wye
  ];
  
  var symbol = function() ***REMOVED***
    var type = constant$1(circle),
        size = constant$1(64),
        context = null;
  
    function symbol() ***REMOVED***
      var buffer;
      if (!context) context = buffer = path();
      type.apply(this, arguments).draw(context, +size.apply(this, arguments));
      if (buffer) return context = null, buffer + "" || null;
    ***REMOVED***
  
    symbol.type = function(_) ***REMOVED***
      return arguments.length ? (type = typeof _ === "function" ? _ : constant$1(_), symbol) : type;
    ***REMOVED***;
  
    symbol.size = function(_) ***REMOVED***
      return arguments.length ? (size = typeof _ === "function" ? _ : constant$1(+_), symbol) : size;
    ***REMOVED***;
  
    symbol.context = function(_) ***REMOVED***
      return arguments.length ? (context = _ == null ? null : _, symbol) : context;
    ***REMOVED***;
  
    return symbol;
  ***REMOVED***;
  
  var noop = function() ***REMOVED******REMOVED***;
  
  function point(that, x, y) ***REMOVED***
    that._context.bezierCurveTo(
      (2 * that._x0 + that._x1) / 3,
      (2 * that._y0 + that._y1) / 3,
      (that._x0 + 2 * that._x1) / 3,
      (that._y0 + 2 * that._y1) / 3,
      (that._x0 + 4 * that._x1 + x) / 6,
      (that._y0 + 4 * that._y1 + y) / 6
    );
  ***REMOVED***
  
  function Basis(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  Basis.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 3: point(this, this._x1, this._y1); // proceed
        case 2: this._context.lineTo(this._x1, this._y1); break;
      ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
        default: point(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var basis = function(context) ***REMOVED***
    return new Basis(context);
  ***REMOVED***;
  
  function BasisClosed(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  BasisClosed.prototype = ***REMOVED***
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 1: ***REMOVED***
          this._context.moveTo(this._x2, this._y2);
          this._context.closePath();
          break;
        ***REMOVED***
        case 2: ***REMOVED***
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
          this._context.closePath();
          break;
        ***REMOVED***
        case 3: ***REMOVED***
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
        case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
        case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
        default: point(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var basisClosed = function(context) ***REMOVED***
    return new BasisClosed(context);
  ***REMOVED***;
  
  function BasisOpen(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  BasisOpen.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 =
      this._y0 = this._y1 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
        case 3: this._point = 4; // proceed
        default: point(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var basisOpen = function(context) ***REMOVED***
    return new BasisOpen(context);
  ***REMOVED***;
  
  function Bundle(context, beta) ***REMOVED***
    this._basis = new Basis(context);
    this._beta = beta;
  ***REMOVED***
  
  Bundle.prototype = ***REMOVED***
    lineStart: function() ***REMOVED***
      this._x = [];
      this._y = [];
      this._basis.lineStart();
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      var x = this._x,
          y = this._y,
          j = x.length - 1;
  
      if (j > 0) ***REMOVED***
        var x0 = x[0],
            y0 = y[0],
            dx = x[j] - x0,
            dy = y[j] - y0,
            i = -1,
            t;
  
        while (++i <= j) ***REMOVED***
          t = i / j;
          this._basis.point(
            this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
            this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
          );
        ***REMOVED***
      ***REMOVED***
  
      this._x = this._y = null;
      this._basis.lineEnd();
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      this._x.push(+x);
      this._y.push(+y);
    ***REMOVED***
  ***REMOVED***;
  
  var bundle = ((function custom(beta) ***REMOVED***
  
    function bundle(context) ***REMOVED***
      return beta === 1 ? new Basis(context) : new Bundle(context, beta);
    ***REMOVED***
  
    bundle.beta = function(beta) ***REMOVED***
      return custom(+beta);
    ***REMOVED***;
  
    return bundle;
  ***REMOVED***))(0.85);
  
  function point$1(that, x, y) ***REMOVED***
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x),
      that._y2 + that._k * (that._y1 - y),
      that._x2,
      that._y2
    );
  ***REMOVED***
  
  function Cardinal(context, tension) ***REMOVED***
    this._context = context;
    this._k = (1 - tension) / 6;
  ***REMOVED***
  
  Cardinal.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: point$1(this, this._x1, this._y1); break;
      ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
        case 2: this._point = 3; // proceed
        default: point$1(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var cardinal = ((function custom(tension) ***REMOVED***
  
    function cardinal(context) ***REMOVED***
      return new Cardinal(context, tension);
    ***REMOVED***
  
    cardinal.tension = function(tension) ***REMOVED***
      return custom(+tension);
    ***REMOVED***;
  
    return cardinal;
  ***REMOVED***))(0);
  
  function CardinalClosed(context, tension) ***REMOVED***
    this._context = context;
    this._k = (1 - tension) / 6;
  ***REMOVED***
  
  CardinalClosed.prototype = ***REMOVED***
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 1: ***REMOVED***
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        ***REMOVED***
        case 2: ***REMOVED***
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        ***REMOVED***
        case 3: ***REMOVED***
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$1(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var cardinalClosed = ((function custom(tension) ***REMOVED***
  
    function cardinal(context) ***REMOVED***
      return new CardinalClosed(context, tension);
    ***REMOVED***
  
    cardinal.tension = function(tension) ***REMOVED***
      return custom(+tension);
    ***REMOVED***;
  
    return cardinal;
  ***REMOVED***))(0);
  
  function CardinalOpen(context, tension) ***REMOVED***
    this._context = context;
    this._k = (1 - tension) / 6;
  ***REMOVED***
  
  CardinalOpen.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$1(this, x, y); break;
      ***REMOVED***
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var cardinalOpen = ((function custom(tension) ***REMOVED***
  
    function cardinal(context) ***REMOVED***
      return new CardinalOpen(context, tension);
    ***REMOVED***
  
    cardinal.tension = function(tension) ***REMOVED***
      return custom(+tension);
    ***REMOVED***;
  
    return cardinal;
  ***REMOVED***))(0);
  
  function point$2(that, x, y) ***REMOVED***
    var x1 = that._x1,
        y1 = that._y1,
        x2 = that._x2,
        y2 = that._y2;
  
    if (that._l01_a > epsilon$1) ***REMOVED***
      var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
          n = 3 * that._l01_a * (that._l01_a + that._l12_a);
      x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
      y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    ***REMOVED***
  
    if (that._l23_a > epsilon$1) ***REMOVED***
      var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
          m = 3 * that._l23_a * (that._l23_a + that._l12_a);
      x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
      y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
    ***REMOVED***
  
    that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
  ***REMOVED***
  
  function CatmullRom(context, alpha) ***REMOVED***
    this._context = context;
    this._alpha = alpha;
  ***REMOVED***
  
  CatmullRom.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 2: this._context.lineTo(this._x2, this._y2); break;
        case 3: this.point(this._x2, this._y2); break;
      ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
  
      if (this._point) ***REMOVED***
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      ***REMOVED***
  
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; // proceed
        default: point$2(this, x, y); break;
      ***REMOVED***
  
      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var catmullRom = ((function custom(alpha) ***REMOVED***
  
    function catmullRom(context) ***REMOVED***
      return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
    ***REMOVED***
  
    catmullRom.alpha = function(alpha) ***REMOVED***
      return custom(+alpha);
    ***REMOVED***;
  
    return catmullRom;
  ***REMOVED***))(0.5);
  
  function CatmullRomClosed(context, alpha) ***REMOVED***
    this._context = context;
    this._alpha = alpha;
  ***REMOVED***
  
  CatmullRomClosed.prototype = ***REMOVED***
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
      this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 1: ***REMOVED***
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        ***REMOVED***
        case 2: ***REMOVED***
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        ***REMOVED***
        case 3: ***REMOVED***
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
  
      if (this._point) ***REMOVED***
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      ***REMOVED***
  
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
        case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
        case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
        default: point$2(this, x, y); break;
      ***REMOVED***
  
      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var catmullRomClosed = ((function custom(alpha) ***REMOVED***
  
    function catmullRom(context) ***REMOVED***
      return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
    ***REMOVED***
  
    catmullRom.alpha = function(alpha) ***REMOVED***
      return custom(+alpha);
    ***REMOVED***;
  
    return catmullRom;
  ***REMOVED***))(0.5);
  
  function CatmullRomOpen(context, alpha) ***REMOVED***
    this._context = context;
    this._alpha = alpha;
  ***REMOVED***
  
  CatmullRomOpen.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 = this._x2 =
      this._y0 = this._y1 = this._y2 = NaN;
      this._l01_a = this._l12_a = this._l23_a =
      this._l01_2a = this._l12_2a = this._l23_2a =
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
  
      if (this._point) ***REMOVED***
        var x23 = this._x2 - x,
            y23 = this._y2 - y;
        this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
      ***REMOVED***
  
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
        case 3: this._point = 4; // proceed
        default: point$2(this, x, y); break;
      ***REMOVED***
  
      this._l01_a = this._l12_a, this._l12_a = this._l23_a;
      this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
      this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
      this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
    ***REMOVED***
  ***REMOVED***;
  
  var catmullRomOpen = ((function custom(alpha) ***REMOVED***
  
    function catmullRom(context) ***REMOVED***
      return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
    ***REMOVED***
  
    catmullRom.alpha = function(alpha) ***REMOVED***
      return custom(+alpha);
    ***REMOVED***;
  
    return catmullRom;
  ***REMOVED***))(0.5);
  
  function LinearClosed(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  LinearClosed.prototype = ***REMOVED***
    areaStart: noop,
    areaEnd: noop,
    lineStart: function() ***REMOVED***
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._point) this._context.closePath();
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      if (this._point) this._context.lineTo(x, y);
      else this._point = 1, this._context.moveTo(x, y);
    ***REMOVED***
  ***REMOVED***;
  
  var linearClosed = function(context) ***REMOVED***
    return new LinearClosed(context);
  ***REMOVED***;
  
  function sign(x) ***REMOVED***
    return x < 0 ? -1 : 1;
  ***REMOVED***
  
  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) ***REMOVED***
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  ***REMOVED***
  
  // Calculate a one-sided slope.
  function slope2(that, t) ***REMOVED***
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  ***REMOVED***
  
  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function point$3(that, t0, t1) ***REMOVED***
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  ***REMOVED***
  
  function MonotoneX(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  MonotoneX.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x0 = this._x1 =
      this._y0 = this._y1 =
      this._t0 = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      switch (this._point) ***REMOVED***
        case 2: this._context.lineTo(this._x1, this._y1); break;
        case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
      ***REMOVED***
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      var t1 = NaN;
  
      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; break;
        case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
        default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
      ***REMOVED***
  
      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    ***REMOVED***
  ***REMOVED***;
  
  function MonotoneY(context) ***REMOVED***
    this._context = new ReflectContext(context);
  ***REMOVED***
  
  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) ***REMOVED***
    MonotoneX.prototype.point.call(this, y, x);
  ***REMOVED***;
  
  function ReflectContext(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  ReflectContext.prototype = ***REMOVED***
    moveTo: function(x, y) ***REMOVED*** this._context.moveTo(y, x); ***REMOVED***,
    closePath: function() ***REMOVED*** this._context.closePath(); ***REMOVED***,
    lineTo: function(x, y) ***REMOVED*** this._context.lineTo(y, x); ***REMOVED***,
    bezierCurveTo: function(x1, y1, x2, y2, x, y) ***REMOVED*** this._context.bezierCurveTo(y1, x1, y2, x2, y, x); ***REMOVED***
  ***REMOVED***;
  
  function monotoneX(context) ***REMOVED***
    return new MonotoneX(context);
  ***REMOVED***
  
  function monotoneY(context) ***REMOVED***
    return new MonotoneY(context);
  ***REMOVED***
  
  function Natural(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  Natural.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x = [];
      this._y = [];
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      var x = this._x,
          y = this._y,
          n = x.length;
  
      if (n) ***REMOVED***
        this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
        if (n === 2) ***REMOVED***
          this._context.lineTo(x[1], y[1]);
        ***REMOVED*** else ***REMOVED***
          var px = controlPoints(x),
              py = controlPoints(y);
          for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) ***REMOVED***
            this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
  
      if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
      this._line = 1 - this._line;
      this._x = this._y = null;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      this._x.push(+x);
      this._y.push(+y);
    ***REMOVED***
  ***REMOVED***;
  
  // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
  function controlPoints(x) ***REMOVED***
    var i,
        n = x.length - 1,
        m,
        a = new Array(n),
        b = new Array(n),
        r = new Array(n);
    a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
    for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
    a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
    for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a[n - 1] = r[n - 1] / b[n - 1];
    for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
    b[n - 1] = (x[n] + a[n - 1]) / 2;
    for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
    return [a, b];
  ***REMOVED***
  
  var natural = function(context) ***REMOVED***
    return new Natural(context);
  ***REMOVED***;
  
  function Step(context, t) ***REMOVED***
    this._context = context;
    this._t = t;
  ***REMOVED***
  
  Step.prototype = ***REMOVED***
    areaStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    areaEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._x = this._y = NaN;
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
      if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
      if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      x = +x, y = +y;
      switch (this._point) ***REMOVED***
        case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
        case 1: this._point = 2; // proceed
        default: ***REMOVED***
          if (this._t <= 0) ***REMOVED***
            this._context.lineTo(this._x, y);
            this._context.lineTo(x, y);
          ***REMOVED*** else ***REMOVED***
            var x1 = this._x * (1 - this._t) + x * this._t;
            this._context.lineTo(x1, this._y);
            this._context.lineTo(x1, y);
          ***REMOVED***
          break;
        ***REMOVED***
      ***REMOVED***
      this._x = x, this._y = y;
    ***REMOVED***
  ***REMOVED***;
  
  var step = function(context) ***REMOVED***
    return new Step(context, 0.5);
  ***REMOVED***;
  
  function stepBefore(context) ***REMOVED***
    return new Step(context, 0);
  ***REMOVED***
  
  function stepAfter(context) ***REMOVED***
    return new Step(context, 1);
  ***REMOVED***
  
  var slice$2 = Array.prototype.slice;
  
  var none = function(series, order) ***REMOVED***
    if (!((n = series.length) > 1)) return;
    for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) ***REMOVED***
      s0 = s1, s1 = series[order[i]];
      for (var j = 0; j < m; ++j) ***REMOVED***
        s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  
  var none$1 = function(series) ***REMOVED***
    var n = series.length, o = new Array(n);
    while (--n >= 0) o[n] = n;
    return o;
  ***REMOVED***;
  
  function stackValue(d, key) ***REMOVED***
    return d[key];
  ***REMOVED***
  
  var stack = function() ***REMOVED***
    var keys = constant$1([]),
        order = none$1,
        offset = none,
        value = stackValue;
  
    function stack(data) ***REMOVED***
      var kz = keys.apply(this, arguments),
          i,
          m = data.length,
          n = kz.length,
          sz = new Array(n),
          oz;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) ***REMOVED***
          si[j] = sij = [0, +value(data[j], ki, j, data)];
          sij.data = data[j];
        ***REMOVED***
        si.key = ki;
      ***REMOVED***
  
      for (i = 0, oz = order(sz); i < n; ++i) ***REMOVED***
        sz[oz[i]].index = i;
      ***REMOVED***
  
      offset(sz, oz);
      return sz;
    ***REMOVED***
  
    stack.keys = function(_) ***REMOVED***
      return arguments.length ? (keys = typeof _ === "function" ? _ : constant$1(slice$2.call(_)), stack) : keys;
    ***REMOVED***;
  
    stack.value = function(_) ***REMOVED***
      return arguments.length ? (value = typeof _ === "function" ? _ : constant$1(+_), stack) : value;
    ***REMOVED***;
  
    stack.order = function(_) ***REMOVED***
      return arguments.length ? (order = _ == null ? none$1 : typeof _ === "function" ? _ : constant$1(slice$2.call(_)), stack) : order;
    ***REMOVED***;
  
    stack.offset = function(_) ***REMOVED***
      return arguments.length ? (offset = _ == null ? none : _, stack) : offset;
    ***REMOVED***;
  
    return stack;
  ***REMOVED***;
  
  var expand = function(series, order) ***REMOVED***
    if (!((n = series.length) > 0)) return;
    for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) ***REMOVED***
      for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
      if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
    ***REMOVED***
    none(series, order);
  ***REMOVED***;
  
  var silhouette = function(series, order) ***REMOVED***
    if (!((n = series.length) > 0)) return;
    for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) ***REMOVED***
      for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
      s0[j][1] += s0[j][0] = -y / 2;
    ***REMOVED***
    none(series, order);
  ***REMOVED***;
  
  var wiggle = function(series, order) ***REMOVED***
    if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
    for (var y = 0, j = 1, s0, m, n; j < m; ++j) ***REMOVED***
      for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) ***REMOVED***
        var si = series[order[i]],
            sij0 = si[j][1] || 0,
            sij1 = si[j - 1][1] || 0,
            s3 = (sij0 - sij1) / 2;
        for (var k = 0; k < i; ++k) ***REMOVED***
          var sk = series[order[k]],
              skj0 = sk[j][1] || 0,
              skj1 = sk[j - 1][1] || 0;
          s3 += skj0 - skj1;
        ***REMOVED***
        s1 += sij0, s2 += s3 * sij0;
      ***REMOVED***
      s0[j - 1][1] += s0[j - 1][0] = y;
      if (s1) y -= s2 / s1;
    ***REMOVED***
    s0[j - 1][1] += s0[j - 1][0] = y;
    none(series, order);
  ***REMOVED***;
  
  var ascending$1 = function(series) ***REMOVED***
    var sums = series.map(sum$1);
    return none$1(series).sort(function(a, b) ***REMOVED*** return sums[a] - sums[b]; ***REMOVED***);
  ***REMOVED***;
  
  function sum$1(series) ***REMOVED***
    var s = 0, i = -1, n = series.length, v;
    while (++i < n) if (v = +series[i][1]) s += v;
    return s;
  ***REMOVED***
  
  var descending$2 = function(series) ***REMOVED***
    return ascending$1(series).reverse();
  ***REMOVED***;
  
  var insideOut = function(series) ***REMOVED***
    var n = series.length,
        i,
        j,
        sums = series.map(sum$1),
        order = none$1(series).sort(function(a, b) ***REMOVED*** return sums[b] - sums[a]; ***REMOVED***),
        top = 0,
        bottom = 0,
        tops = [],
        bottoms = [];
  
    for (i = 0; i < n; ++i) ***REMOVED***
      j = order[i];
      if (top < bottom) ***REMOVED***
        top += sums[j];
        tops.push(j);
      ***REMOVED*** else ***REMOVED***
        bottom += sums[j];
        bottoms.push(j);
      ***REMOVED***
    ***REMOVED***
  
    return bottoms.reverse().concat(tops);
  ***REMOVED***;
  
  var reverse = function(series) ***REMOVED***
    return none$1(series).reverse();
  ***REMOVED***;
  
  var define = function(constructor, factory, prototype) ***REMOVED***
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  ***REMOVED***;
  
  function extend(parent, definition) ***REMOVED***
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  ***REMOVED***
  
  function Color() ***REMOVED******REMOVED***
  
  var darker = 0.7;
  var brighter = 1 / darker;
  
  var reI = "\\s*([+-]?\\d+)\\s*";
  var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
  var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
  var reHex3 = /^#([0-9a-f]***REMOVED***3***REMOVED***)$/;
  var reHex6 = /^#([0-9a-f]***REMOVED***6***REMOVED***)$/;
  var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
  var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
  var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
  var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
  var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
  var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
  
  var named = ***REMOVED***
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  ***REMOVED***;
  
  define(Color, color, ***REMOVED***
    displayable: function() ***REMOVED***
      return this.rgb().displayable();
    ***REMOVED***,
    toString: function() ***REMOVED***
      return this.rgb() + "";
    ***REMOVED***
  ***REMOVED***);
  
  function color(format) ***REMOVED***
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  ***REMOVED***
  
  function rgbn(n) ***REMOVED***
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  ***REMOVED***
  
  function rgba(r, g, b, a) ***REMOVED***
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  ***REMOVED***
  
  function rgbConvert(o) ***REMOVED***
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  ***REMOVED***
  
  function rgb(r, g, b, opacity) ***REMOVED***
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  ***REMOVED***
  
  function Rgb(r, g, b, opacity) ***REMOVED***
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  ***REMOVED***
  
  define(Rgb, rgb, extend(Color, ***REMOVED***
    brighter: function(k) ***REMOVED***
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    ***REMOVED***,
    darker: function(k) ***REMOVED***
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    ***REMOVED***,
    rgb: function() ***REMOVED***
      return this;
    ***REMOVED***,
    displayable: function() ***REMOVED***
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    ***REMOVED***,
    toString: function() ***REMOVED***
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    ***REMOVED***
  ***REMOVED***));
  
  function hsla(h, s, l, a) ***REMOVED***
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  ***REMOVED***
  
  function hslConvert(o) ***REMOVED***
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) ***REMOVED***
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    ***REMOVED*** else ***REMOVED***
      s = l > 0 && l < 1 ? 0 : h;
    ***REMOVED***
    return new Hsl(h, s, l, o.opacity);
  ***REMOVED***
  
  function hsl(h, s, l, opacity) ***REMOVED***
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  ***REMOVED***
  
  function Hsl(h, s, l, opacity) ***REMOVED***
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  ***REMOVED***
  
  define(Hsl, hsl, extend(Color, ***REMOVED***
    brighter: function(k) ***REMOVED***
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    ***REMOVED***,
    darker: function(k) ***REMOVED***
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    ***REMOVED***,
    rgb: function() ***REMOVED***
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    ***REMOVED***,
    displayable: function() ***REMOVED***
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    ***REMOVED***
  ***REMOVED***));
  
  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) ***REMOVED***
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  ***REMOVED***
  
  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;
  
  var Kn = 18;
  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;
  
  function labConvert(o) ***REMOVED***
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) ***REMOVED***
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    ***REMOVED***
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var b = rgb2xyz(o.r),
        a = rgb2xyz(o.g),
        l = rgb2xyz(o.b),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  ***REMOVED***
  
  function lab(l, a, b, opacity) ***REMOVED***
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  ***REMOVED***
  
  function Lab(l, a, b, opacity) ***REMOVED***
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  ***REMOVED***
  
  define(Lab, lab, extend(Color, ***REMOVED***
    brighter: function(k) ***REMOVED***
      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    ***REMOVED***,
    darker: function(k) ***REMOVED***
      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    ***REMOVED***,
    rgb: function() ***REMOVED***
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);
      return new Rgb(
        xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    ***REMOVED***
  ***REMOVED***));
  
  function xyz2lab(t) ***REMOVED***
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  ***REMOVED***
  
  function lab2xyz(t) ***REMOVED***
    return t > t1 ? t * t * t : t2 * (t - t0);
  ***REMOVED***
  
  function xyz2rgb(x) ***REMOVED***
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  ***REMOVED***
  
  function rgb2xyz(x) ***REMOVED***
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  ***REMOVED***
  
  function hclConvert(o) ***REMOVED***
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  ***REMOVED***
  
  function hcl(h, c, l, opacity) ***REMOVED***
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  ***REMOVED***
  
  function Hcl(h, c, l, opacity) ***REMOVED***
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  ***REMOVED***
  
  define(Hcl, hcl, extend(Color, ***REMOVED***
    brighter: function(k) ***REMOVED***
      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
    ***REMOVED***,
    darker: function(k) ***REMOVED***
      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
    ***REMOVED***,
    rgb: function() ***REMOVED***
      return labConvert(this).rgb();
    ***REMOVED***
  ***REMOVED***));
  
  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;
  
  function cubehelixConvert(o) ***REMOVED***
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  ***REMOVED***
  
  function cubehelix(h, s, l, opacity) ***REMOVED***
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  ***REMOVED***
  
  function Cubehelix(h, s, l, opacity) ***REMOVED***
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  ***REMOVED***
  
  define(Cubehelix, cubehelix, extend(Color, ***REMOVED***
    brighter: function(k) ***REMOVED***
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    ***REMOVED***,
    darker: function(k) ***REMOVED***
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    ***REMOVED***,
    rgb: function() ***REMOVED***
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    ***REMOVED***
  ***REMOVED***));
  
  function basis$1(t1, v0, v1, v2, v3) ***REMOVED***
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  ***REMOVED***
  
  var basis$2 = function(values) ***REMOVED***
    var n = values.length - 1;
    return function(t) ***REMOVED***
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis$1((t - i / n) * n, v0, v1, v2, v3);
    ***REMOVED***;
  ***REMOVED***;
  
  var basisClosed$1 = function(values) ***REMOVED***
    var n = values.length;
    return function(t) ***REMOVED***
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
          v0 = values[(i + n - 1) % n],
          v1 = values[i % n],
          v2 = values[(i + 1) % n],
          v3 = values[(i + 2) % n];
      return basis$1((t - i / n) * n, v0, v1, v2, v3);
    ***REMOVED***;
  ***REMOVED***;
  
  var constant$2 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function linear$1(a, d) ***REMOVED***
    return function(t) ***REMOVED***
      return a + t * d;
    ***REMOVED***;
  ***REMOVED***
  
  function exponential$1(a, b, y) ***REMOVED***
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) ***REMOVED***
      return Math.pow(a + t * b, y);
    ***REMOVED***;
  ***REMOVED***
  
  function hue(a, b) ***REMOVED***
    var d = b - a;
    return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
  ***REMOVED***
  
  function gamma(y) ***REMOVED***
    return (y = +y) === 1 ? nogamma : function(a, b) ***REMOVED***
      return b - a ? exponential$1(a, b, y) : constant$2(isNaN(a) ? b : a);
    ***REMOVED***;
  ***REMOVED***
  
  function nogamma(a, b) ***REMOVED***
    var d = b - a;
    return d ? linear$1(a, d) : constant$2(isNaN(a) ? b : a);
  ***REMOVED***
  
  var interpolateRgb = ((function rgbGamma(y) ***REMOVED***
    var color$$1 = gamma(y);
  
    function rgb$$1(start, end) ***REMOVED***
      var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
          g = color$$1(start.g, end.g),
          b = color$$1(start.b, end.b),
          opacity = color$$1(start.opacity, end.opacity);
      return function(t) ***REMOVED***
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      ***REMOVED***;
    ***REMOVED***
  
    rgb$$1.gamma = rgbGamma;
  
    return rgb$$1;
  ***REMOVED***))(1);
  
  function rgbSpline(spline) ***REMOVED***
    return function(colors) ***REMOVED***
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color$$1;
      for (i = 0; i < n; ++i) ***REMOVED***
        color$$1 = rgb(colors[i]);
        r[i] = color$$1.r || 0;
        g[i] = color$$1.g || 0;
        b[i] = color$$1.b || 0;
      ***REMOVED***
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color$$1.opacity = 1;
      return function(t) ***REMOVED***
        color$$1.r = r(t);
        color$$1.g = g(t);
        color$$1.b = b(t);
        return color$$1 + "";
      ***REMOVED***;
    ***REMOVED***;
  ***REMOVED***
  
  var rgbBasis = rgbSpline(basis$2);
  var rgbBasisClosed = rgbSpline(basisClosed$1);
  
  var array$1 = function(a, b) ***REMOVED***
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(nb),
        c = new Array(nb),
        i;
  
    for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];
  
    return function(t) ***REMOVED***
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    ***REMOVED***;
  ***REMOVED***;
  
  var date = function(a, b) ***REMOVED***
    var d = new Date;
    return a = +a, b -= a, function(t) ***REMOVED***
      return d.setTime(a + b * t), d;
    ***REMOVED***;
  ***REMOVED***;
  
  var interpolateNumber = function(a, b) ***REMOVED***
    return a = +a, b -= a, function(t) ***REMOVED***
      return a + b * t;
    ***REMOVED***;
  ***REMOVED***;
  
  var object = function(a, b) ***REMOVED***
    var i = ***REMOVED******REMOVED***,
        c = ***REMOVED******REMOVED***,
        k;
  
    if (a === null || typeof a !== "object") a = ***REMOVED******REMOVED***;
    if (b === null || typeof b !== "object") b = ***REMOVED******REMOVED***;
  
    for (k in b) ***REMOVED***
      if (k in a) ***REMOVED***
        i[k] = interpolate(a[k], b[k]);
      ***REMOVED*** else ***REMOVED***
        c[k] = b[k];
      ***REMOVED***
    ***REMOVED***
  
    return function(t) ***REMOVED***
      for (k in i) c[k] = i[k](t);
      return c;
    ***REMOVED***;
  ***REMOVED***;
  
  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  
  function zero(b) ***REMOVED***
    return function() ***REMOVED***
      return b;
    ***REMOVED***;
  ***REMOVED***
  
  function one(b) ***REMOVED***
    return function(t) ***REMOVED***
      return b(t) + "";
    ***REMOVED***;
  ***REMOVED***
  
  var interpolateString = function(a, b) ***REMOVED***
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators
  
    // Coerce inputs to strings.
    a = a + "", b = b + "";
  
    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) ***REMOVED***
      if ((bs = bm.index) > bi) ***REMOVED*** // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      ***REMOVED***
      if ((am = am[0]) === (bm = bm[0])) ***REMOVED*** // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      ***REMOVED*** else ***REMOVED*** // interpolate non-matching numbers
        s[++i] = null;
        q.push(***REMOVED***i: i, x: interpolateNumber(am, bm)***REMOVED***);
      ***REMOVED***
      bi = reB.lastIndex;
    ***REMOVED***
  
    // Add remains of b.
    if (bi < b.length) ***REMOVED***
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    ***REMOVED***
  
    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) ***REMOVED***
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          ***REMOVED***);
  ***REMOVED***;
  
  var interpolate = function(a, b) ***REMOVED***
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$2(b)
        : (t === "number" ? interpolateNumber
        : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
        : b instanceof color ? interpolateRgb
        : b instanceof Date ? date
        : Array.isArray(b) ? array$1
        : isNaN(b) ? object
        : interpolateNumber)(a, b);
  ***REMOVED***;
  
  var interpolateRound = function(a, b) ***REMOVED***
    return a = +a, b -= a, function(t) ***REMOVED***
      return Math.round(a + b * t);
    ***REMOVED***;
  ***REMOVED***;
  
  var degrees = 180 / Math.PI;
  
  var identity$2 = ***REMOVED***
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  ***REMOVED***;
  
  var decompose = function(a, b, c, d, e, f) ***REMOVED***
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return ***REMOVED***
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    ***REMOVED***;
  ***REMOVED***;
  
  var cssNode;
  var cssRoot;
  var cssView;
  var svgNode;
  
  function parseCss(value) ***REMOVED***
    if (value === "none") return identity$2;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  ***REMOVED***
  
  function parseSvg(value) ***REMOVED***
    if (value == null) return identity$2;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  ***REMOVED***
  
  function interpolateTransform(parse, pxComma, pxParen, degParen) ***REMOVED***
  
    function pop(s) ***REMOVED***
      return s.length ? s.pop() + " " : "";
    ***REMOVED***
  
    function translate(xa, ya, xb, yb, s, q) ***REMOVED***
      if (xa !== xb || ya !== yb) ***REMOVED***
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push(***REMOVED***i: i - 4, x: interpolateNumber(xa, xb)***REMOVED***, ***REMOVED***i: i - 2, x: interpolateNumber(ya, yb)***REMOVED***);
      ***REMOVED*** else if (xb || yb) ***REMOVED***
        s.push("translate(" + xb + pxComma + yb + pxParen);
      ***REMOVED***
    ***REMOVED***
  
    function rotate(a, b, s, q) ***REMOVED***
      if (a !== b) ***REMOVED***
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push(***REMOVED***i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)***REMOVED***);
      ***REMOVED*** else if (b) ***REMOVED***
        s.push(pop(s) + "rotate(" + b + degParen);
      ***REMOVED***
    ***REMOVED***
  
    function skewX(a, b, s, q) ***REMOVED***
      if (a !== b) ***REMOVED***
        q.push(***REMOVED***i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)***REMOVED***);
      ***REMOVED*** else if (b) ***REMOVED***
        s.push(pop(s) + "skewX(" + b + degParen);
      ***REMOVED***
    ***REMOVED***
  
    function scale(xa, ya, xb, yb, s, q) ***REMOVED***
      if (xa !== xb || ya !== yb) ***REMOVED***
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push(***REMOVED***i: i - 4, x: interpolateNumber(xa, xb)***REMOVED***, ***REMOVED***i: i - 2, x: interpolateNumber(ya, yb)***REMOVED***);
      ***REMOVED*** else if (xb !== 1 || yb !== 1) ***REMOVED***
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      ***REMOVED***
    ***REMOVED***
  
    return function(a, b) ***REMOVED***
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) ***REMOVED***
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      ***REMOVED***;
    ***REMOVED***;
  ***REMOVED***
  
  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
  
  var rho = Math.SQRT2;
  var rho2 = 2;
  var rho4 = 4;
  var epsilon2 = 1e-12;
  
  function cosh(x) ***REMOVED***
    return ((x = Math.exp(x)) + 1 / x) / 2;
  ***REMOVED***
  
  function sinh(x) ***REMOVED***
    return ((x = Math.exp(x)) - 1 / x) / 2;
  ***REMOVED***
  
  function tanh(x) ***REMOVED***
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  ***REMOVED***
  
  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  var interpolateZoom = function(p0, p1) ***REMOVED***
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;
  
    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) ***REMOVED***
      S = Math.log(w1 / w0) / rho;
      i = function(t) ***REMOVED***
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      ***REMOVED***;
    ***REMOVED***
  
    // General case.
    else ***REMOVED***
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) ***REMOVED***
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      ***REMOVED***;
    ***REMOVED***
  
    i.duration = S * 1000;
  
    return i;
  ***REMOVED***;
  
  function hsl$1(hue$$1) ***REMOVED***
    return function(start, end) ***REMOVED***
      var h = hue$$1((start = hsl(start)).h, (end = hsl(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) ***REMOVED***
        start.h = h(t);
        start.s = s(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***
  
  var hsl$2 = hsl$1(hue);
  var hslLong = hsl$1(nogamma);
  
  function lab$1(start, end) ***REMOVED***
    var l = nogamma((start = lab(start)).l, (end = lab(end)).l),
        a = nogamma(start.a, end.a),
        b = nogamma(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) ***REMOVED***
      start.l = l(t);
      start.a = a(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    ***REMOVED***;
  ***REMOVED***
  
  function hcl$1(hue$$1) ***REMOVED***
    return function(start, end) ***REMOVED***
      var h = hue$$1((start = hcl(start)).h, (end = hcl(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) ***REMOVED***
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***
  
  var hcl$2 = hcl$1(hue);
  var hclLong = hcl$1(nogamma);
  
  function cubehelix$1(hue$$1) ***REMOVED***
    return (function cubehelixGamma(y) ***REMOVED***
      y = +y;
  
      function cubehelix$$1(start, end) ***REMOVED***
        var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) ***REMOVED***
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        ***REMOVED***;
      ***REMOVED***
  
      cubehelix$$1.gamma = cubehelixGamma;
  
      return cubehelix$$1;
    ***REMOVED***)(1);
  ***REMOVED***
  
  var cubehelix$2 = cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);
  
  var quantize = function(interpolator, n) ***REMOVED***
    var samples = new Array(n);
    for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
    return samples;
  ***REMOVED***;
  
  var noop$1 = ***REMOVED***value: function() ***REMOVED******REMOVED******REMOVED***;
  
  function dispatch() ***REMOVED***
    for (var i = 0, n = arguments.length, _ = ***REMOVED******REMOVED***, t; i < n; ++i) ***REMOVED***
      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
      _[t] = [];
    ***REMOVED***
    return new Dispatch(_);
  ***REMOVED***
  
  function Dispatch(_) ***REMOVED***
    this._ = _;
  ***REMOVED***
  
  function parseTypenames(typenames, types) ***REMOVED***
    return typenames.trim().split(/^|\s+/).map(function(t) ***REMOVED***
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return ***REMOVED***type: t, name: name***REMOVED***;
    ***REMOVED***);
  ***REMOVED***
  
  Dispatch.prototype = dispatch.prototype = ***REMOVED***
    constructor: Dispatch,
    on: function(typename, callback) ***REMOVED***
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;
  
      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) ***REMOVED***
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      ***REMOVED***
  
      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) ***REMOVED***
        if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$2(_[t], typename.name, null);
      ***REMOVED***
  
      return this;
    ***REMOVED***,
    copy: function() ***REMOVED***
      var copy = ***REMOVED******REMOVED***, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    ***REMOVED***,
    call: function(type, that) ***REMOVED***
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    ***REMOVED***,
    apply: function(type, that, args) ***REMOVED***
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    ***REMOVED***
  ***REMOVED***;
  
  function get(type, name) ***REMOVED***
    for (var i = 0, n = type.length, c; i < n; ++i) ***REMOVED***
      if ((c = type[i]).name === name) ***REMOVED***
        return c.value;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  function set$2(type, name, callback) ***REMOVED***
    for (var i = 0, n = type.length; i < n; ++i) ***REMOVED***
      if (type[i].name === name) ***REMOVED***
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      ***REMOVED***
    ***REMOVED***
    if (callback != null) type.push(***REMOVED***name: name, value: callback***REMOVED***);
    return type;
  ***REMOVED***
  
  function objectConverter(columns) ***REMOVED***
    return new Function("d", "return ***REMOVED***" + columns.map(function(name, i) ***REMOVED***
      return JSON.stringify(name) + ": d[" + i + "]";
    ***REMOVED***).join(",") + "***REMOVED***");
  ***REMOVED***
  
  function customConverter(columns, f) ***REMOVED***
    var object = objectConverter(columns);
    return function(row, i) ***REMOVED***
      return f(object(row), i, columns);
    ***REMOVED***;
  ***REMOVED***
  
  // Compute unique columns in order of discovery.
  function inferColumns(rows) ***REMOVED***
    var columnSet = Object.create(null),
        columns = [];
  
    rows.forEach(function(row) ***REMOVED***
      for (var column in row) ***REMOVED***
        if (!(column in columnSet)) ***REMOVED***
          columns.push(columnSet[column] = column);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
  
    return columns;
  ***REMOVED***
  
  var dsv = function(delimiter) ***REMOVED***
    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
        delimiterCode = delimiter.charCodeAt(0);
  
    function parse(text, f) ***REMOVED***
      var convert, columns, rows = parseRows(text, function(row, i) ***REMOVED***
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      ***REMOVED***);
      rows.columns = columns;
      return rows;
    ***REMOVED***
  
    function parseRows(text, f) ***REMOVED***
      var EOL = ***REMOVED******REMOVED***, // sentinel value for end-of-line
          EOF = ***REMOVED******REMOVED***, // sentinel value for end-of-file
          rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // the current line number
          t, // the current token
          eol; // is the current token followed by EOL?
  
      function token() ***REMOVED***
        if (I >= N) return EOF; // special case: end of file
        if (eol) return eol = false, EOL; // special case: end of line
  
        // special case: quotes
        var j = I, c;
        if (text.charCodeAt(j) === 34) ***REMOVED***
          var i = j;
          while (i++ < N) ***REMOVED***
            if (text.charCodeAt(i) === 34) ***REMOVED***
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            ***REMOVED***
          ***REMOVED***
          I = i + 2;
          c = text.charCodeAt(i + 1);
          if (c === 13) ***REMOVED***
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          ***REMOVED*** else if (c === 10) ***REMOVED***
            eol = true;
          ***REMOVED***
          return text.slice(j + 1, i).replace(/""/g, "\"");
        ***REMOVED***
  
        // common case: find next delimiter or newline
        while (I < N) ***REMOVED***
          var k = 1;
          c = text.charCodeAt(I++);
          if (c === 10) eol = true; // \n
          else if (c === 13) ***REMOVED*** eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; ***REMOVED*** // \r|\r\n
          else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        ***REMOVED***
  
        // special case: last token before EOF
        return text.slice(j);
      ***REMOVED***
  
      while ((t = token()) !== EOF) ***REMOVED***
        var a = [];
        while (t !== EOL && t !== EOF) ***REMOVED***
          a.push(t);
          t = token();
        ***REMOVED***
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      ***REMOVED***
  
      return rows;
    ***REMOVED***
  
    function format(rows, columns) ***REMOVED***
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) ***REMOVED***
        return columns.map(function(column) ***REMOVED***
          return formatValue(row[column]);
        ***REMOVED***).join(delimiter);
      ***REMOVED***)).join("\n");
    ***REMOVED***
  
    function formatRows(rows) ***REMOVED***
      return rows.map(formatRow).join("\n");
    ***REMOVED***
  
    function formatRow(row) ***REMOVED***
      return row.map(formatValue).join(delimiter);
    ***REMOVED***
  
    function formatValue(text) ***REMOVED***
      return text == null ? ""
          : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
          : text;
    ***REMOVED***
  
    return ***REMOVED***
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatRows: formatRows
    ***REMOVED***;
  ***REMOVED***;
  
  var csv = dsv(",");
  
  var csvParse = csv.parse;
  var csvParseRows = csv.parseRows;
  var csvFormat = csv.format;
  var csvFormatRows = csv.formatRows;
  
  var tsv = dsv("\t");
  
  var tsvParse = tsv.parse;
  var tsvParseRows = tsv.parseRows;
  var tsvFormat = tsv.format;
  var tsvFormatRows = tsv.formatRows;
  
  var request = function(url, callback) ***REMOVED***
    var request,
        event = dispatch("beforesend", "progress", "load", "error"),
        mimeType,
        headers = map$1(),
        xhr = new XMLHttpRequest,
        user = null,
        password = null,
        response,
        responseType,
        timeout = 0;
  
    // If IE does not support CORS, use XDomainRequest.
    if (typeof XDomainRequest !== "undefined"
        && !("withCredentials" in xhr)
        && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;
  
    "onload" in xhr
        ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
        : xhr.onreadystatechange = function(o) ***REMOVED*** xhr.readyState > 3 && respond(o); ***REMOVED***;
  
    function respond(o) ***REMOVED***
      var status = xhr.status, result;
      if (!status && hasResponse(xhr)
          || status >= 200 && status < 300
          || status === 304) ***REMOVED***
        if (response) ***REMOVED***
          try ***REMOVED***
            result = response.call(request, xhr);
          ***REMOVED*** catch (e) ***REMOVED***
            event.call("error", request, e);
            return;
          ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          result = xhr;
        ***REMOVED***
        event.call("load", request, result);
      ***REMOVED*** else ***REMOVED***
        event.call("error", request, o);
      ***REMOVED***
    ***REMOVED***
  
    xhr.onprogress = function(e) ***REMOVED***
      event.call("progress", request, e);
    ***REMOVED***;
  
    request = ***REMOVED***
      header: function(name, value) ***REMOVED***
        name = (name + "").toLowerCase();
        if (arguments.length < 2) return headers.get(name);
        if (value == null) headers.remove(name);
        else headers.set(name, value + "");
        return request;
      ***REMOVED***,
  
      // If mimeType is non-null and no Accept header is set, a default is used.
      mimeType: function(value) ***REMOVED***
        if (!arguments.length) return mimeType;
        mimeType = value == null ? null : value + "";
        return request;
      ***REMOVED***,
  
      // Specifies what type the response value should take;
      // for instance, arraybuffer, blob, document, or text.
      responseType: function(value) ***REMOVED***
        if (!arguments.length) return responseType;
        responseType = value;
        return request;
      ***REMOVED***,
  
      timeout: function(value) ***REMOVED***
        if (!arguments.length) return timeout;
        timeout = +value;
        return request;
      ***REMOVED***,
  
      user: function(value) ***REMOVED***
        return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
      ***REMOVED***,
  
      password: function(value) ***REMOVED***
        return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
      ***REMOVED***,
  
      // Specify how to convert the response content to a specific type;
      // changes the callback value on "load" events.
      response: function(value) ***REMOVED***
        response = value;
        return request;
      ***REMOVED***,
  
      // Alias for send("GET", …).
      get: function(data, callback) ***REMOVED***
        return request.send("GET", data, callback);
      ***REMOVED***,
  
      // Alias for send("POST", …).
      post: function(data, callback) ***REMOVED***
        return request.send("POST", data, callback);
      ***REMOVED***,
  
      // If callback is non-null, it will be used for error and load events.
      send: function(method, data, callback) ***REMOVED***
        xhr.open(method, url, true, user, password);
        if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
        if (xhr.setRequestHeader) headers.each(function(value, name) ***REMOVED*** xhr.setRequestHeader(name, value); ***REMOVED***);
        if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
        if (responseType != null) xhr.responseType = responseType;
        if (timeout > 0) xhr.timeout = timeout;
        if (callback == null && typeof data === "function") callback = data, data = null;
        if (callback != null && callback.length === 1) callback = fixCallback(callback);
        if (callback != null) request.on("error", callback).on("load", function(xhr) ***REMOVED*** callback(null, xhr); ***REMOVED***);
        event.call("beforesend", request, xhr);
        xhr.send(data == null ? null : data);
        return request;
      ***REMOVED***,
  
      abort: function() ***REMOVED***
        xhr.abort();
        return request;
      ***REMOVED***,
  
      on: function() ***REMOVED***
        var value = event.on.apply(event, arguments);
        return value === event ? request : value;
      ***REMOVED***
    ***REMOVED***;
  
    if (callback != null) ***REMOVED***
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return request.get(callback);
    ***REMOVED***
  
    return request;
  ***REMOVED***;
  
  function fixCallback(callback) ***REMOVED***
    return function(error, xhr) ***REMOVED***
      callback(error == null ? xhr : null);
    ***REMOVED***;
  ***REMOVED***
  
  function hasResponse(xhr) ***REMOVED***
    var type = xhr.responseType;
    return type && type !== "text"
        ? xhr.response // null on error
        : xhr.responseText; // "" on error
  ***REMOVED***
  
  var type = function(defaultMimeType, response) ***REMOVED***
    return function(url, callback) ***REMOVED***
      var r = request(url).mimeType(defaultMimeType).response(response);
      if (callback != null) ***REMOVED***
        if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
        return r.get(callback);
      ***REMOVED***
      return r;
    ***REMOVED***;
  ***REMOVED***;
  
  var html = type("text/html", function(xhr) ***REMOVED***
    return document.createRange().createContextualFragment(xhr.responseText);
  ***REMOVED***);
  
  var json = type("application/json", function(xhr) ***REMOVED***
    return JSON.parse(xhr.responseText);
  ***REMOVED***);
  
  var text = type("text/plain", function(xhr) ***REMOVED***
    return xhr.responseText;
  ***REMOVED***);
  
  var xml = type("application/xml", function(xhr) ***REMOVED***
    var xml = xhr.responseXML;
    if (!xml) throw new Error("parse error");
    return xml;
  ***REMOVED***);
  
  var dsv$1 = function(defaultMimeType, parse) ***REMOVED***
    return function(url, row, callback) ***REMOVED***
      if (arguments.length < 3) callback = row, row = null;
      var r = request(url).mimeType(defaultMimeType);
      r.row = function(_) ***REMOVED*** return arguments.length ? r.response(responseOf(parse, row = _)) : row; ***REMOVED***;
      r.row(row);
      return callback ? r.get(callback) : r;
    ***REMOVED***;
  ***REMOVED***;
  
  function responseOf(parse, row) ***REMOVED***
    return function(request$$1) ***REMOVED***
      return parse(request$$1.responseText, row);
    ***REMOVED***;
  ***REMOVED***
  
  var csv$1 = dsv$1("text/csv", csvParse);
  
  var tsv$1 = dsv$1("text/tab-separated-values", tsvParse);
  
  var frame = 0;
  var timeout = 0;
  var interval = 0;
  var pokeDelay = 1000;
  var taskHead;
  var taskTail;
  var clockLast = 0;
  var clockNow = 0;
  var clockSkew = 0;
  var clock = typeof performance === "object" && performance.now ? performance : Date;
  var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) ***REMOVED*** setTimeout(f, 17); ***REMOVED***;
  
  function now() ***REMOVED***
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  ***REMOVED***
  
  function clearNow() ***REMOVED***
    clockNow = 0;
  ***REMOVED***
  
  function Timer() ***REMOVED***
    this._call =
    this._time =
    this._next = null;
  ***REMOVED***
  
  Timer.prototype = timer.prototype = ***REMOVED***
    constructor: Timer,
    restart: function(callback, delay, time) ***REMOVED***
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) ***REMOVED***
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      ***REMOVED***
      this._call = callback;
      this._time = time;
      sleep();
    ***REMOVED***,
    stop: function() ***REMOVED***
      if (this._call) ***REMOVED***
        this._call = null;
        this._time = Infinity;
        sleep();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  
  function timer(callback, delay, time) ***REMOVED***
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  ***REMOVED***
  
  function timerFlush() ***REMOVED***
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) ***REMOVED***
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    ***REMOVED***
    --frame;
  ***REMOVED***
  
  function wake() ***REMOVED***
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try ***REMOVED***
      timerFlush();
    ***REMOVED*** finally ***REMOVED***
      frame = 0;
      nap();
      clockNow = 0;
    ***REMOVED***
  ***REMOVED***
  
  function poke$1() ***REMOVED***
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  ***REMOVED***
  
  function nap() ***REMOVED***
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) ***REMOVED***
      if (t1._call) ***REMOVED***
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      ***REMOVED*** else ***REMOVED***
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      ***REMOVED***
    ***REMOVED***
    taskTail = t0;
    sleep(time);
  ***REMOVED***
  
  function sleep(time) ***REMOVED***
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) ***REMOVED***
      if (time < Infinity) timeout = setTimeout(wake, delay);
      if (interval) interval = clearInterval(interval);
    ***REMOVED*** else ***REMOVED***
      if (!interval) interval = setInterval(poke$1, pokeDelay);
      frame = 1, setFrame(wake);
    ***REMOVED***
  ***REMOVED***
  
  var timeout$1 = function(callback, delay, time) ***REMOVED***
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(function(elapsed) ***REMOVED***
      t.stop();
      callback(elapsed + delay);
    ***REMOVED***, delay, time);
    return t;
  ***REMOVED***;
  
  var interval$1 = function(callback, delay, time) ***REMOVED***
    var t = new Timer, total = delay;
    if (delay == null) return t.restart(callback, delay, time), t;
    delay = +delay, time = time == null ? now() : +time;
    t.restart(function tick(elapsed) ***REMOVED***
      elapsed += total;
      t.restart(tick, total += delay, time);
      callback(elapsed);
    ***REMOVED***, delay, time);
    return t;
  ***REMOVED***;
  
  var t0$1 = new Date;
  var t1$1 = new Date;
  
  function newInterval(floori, offseti, count, field) ***REMOVED***
  
    function interval(date) ***REMOVED***
      return floori(date = new Date(+date)), date;
    ***REMOVED***
  
    interval.floor = interval;
  
    interval.ceil = function(date) ***REMOVED***
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    ***REMOVED***;
  
    interval.round = function(date) ***REMOVED***
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    ***REMOVED***;
  
    interval.offset = function(date, step) ***REMOVED***
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    ***REMOVED***;
  
    interval.range = function(start, stop, step) ***REMOVED***
      var range = [];
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
      return range;
    ***REMOVED***;
  
    interval.filter = function(test) ***REMOVED***
      return newInterval(function(date) ***REMOVED***
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      ***REMOVED***, function(date, step) ***REMOVED***
        if (date >= date) while (--step >= 0) while (offseti(date, 1), !test(date)) ***REMOVED******REMOVED*** // eslint-disable-line no-empty
      ***REMOVED***);
    ***REMOVED***;
  
    if (count) ***REMOVED***
      interval.count = function(start, end) ***REMOVED***
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      ***REMOVED***;
  
      interval.every = function(step) ***REMOVED***
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) ***REMOVED*** return field(d) % step === 0; ***REMOVED***
                : function(d) ***REMOVED*** return interval.count(0, d) % step === 0; ***REMOVED***);
      ***REMOVED***;
    ***REMOVED***
  
    return interval;
  ***REMOVED***
  
  var millisecond = newInterval(function() ***REMOVED***
    // noop
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return end - start;
  ***REMOVED***);
  
  // An optimized implementation for this simple case.
  millisecond.every = function(k) ***REMOVED***
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) ***REMOVED***
      date.setTime(Math.floor(date / k) * k);
    ***REMOVED***, function(date, step) ***REMOVED***
      date.setTime(+date + step * k);
    ***REMOVED***, function(start, end) ***REMOVED***
      return (end - start) / k;
    ***REMOVED***);
  ***REMOVED***;
  
  var milliseconds = millisecond.range;
  
  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;
  
  var second = newInterval(function(date) ***REMOVED***
    date.setTime(Math.floor(date / durationSecond) * durationSecond);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step * durationSecond);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationSecond;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCSeconds();
  ***REMOVED***);
  
  var seconds = second.range;
  
  var minute = newInterval(function(date) ***REMOVED***
    date.setTime(Math.floor(date / durationMinute) * durationMinute);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step * durationMinute);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationMinute;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getMinutes();
  ***REMOVED***);
  
  var minutes = minute.range;
  
  var hour = newInterval(function(date) ***REMOVED***
    var offset = date.getTimezoneOffset() * durationMinute % durationHour;
    if (offset < 0) offset += durationHour;
    date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step * durationHour);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationHour;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getHours();
  ***REMOVED***);
  
  var hours = hour.range;
  
  var day = newInterval(function(date) ***REMOVED***
    date.setHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setDate(date.getDate() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getDate() - 1;
  ***REMOVED***);
  
  var days = day.range;
  
  function weekday(i) ***REMOVED***
    return newInterval(function(date) ***REMOVED***
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    ***REMOVED***, function(date, step) ***REMOVED***
      date.setDate(date.getDate() + step * 7);
    ***REMOVED***, function(start, end) ***REMOVED***
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    ***REMOVED***);
  ***REMOVED***
  
  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);
  
  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;
  
  var month = newInterval(function(date) ***REMOVED***
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setMonth(date.getMonth() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getMonth();
  ***REMOVED***);
  
  var months = month.range;
  
  var year = newInterval(function(date) ***REMOVED***
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setFullYear(date.getFullYear() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return end.getFullYear() - start.getFullYear();
  ***REMOVED***, function(date) ***REMOVED***
    return date.getFullYear();
  ***REMOVED***);
  
  // An optimized implementation for this simple case.
  year.every = function(k) ***REMOVED***
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) ***REMOVED***
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    ***REMOVED***, function(date, step) ***REMOVED***
      date.setFullYear(date.getFullYear() + step * k);
    ***REMOVED***);
  ***REMOVED***;
  
  var years = year.range;
  
  var utcMinute = newInterval(function(date) ***REMOVED***
    date.setUTCSeconds(0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step * durationMinute);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationMinute;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCMinutes();
  ***REMOVED***);
  
  var utcMinutes = utcMinute.range;
  
  var utcHour = newInterval(function(date) ***REMOVED***
    date.setUTCMinutes(0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setTime(+date + step * durationHour);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationHour;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCHours();
  ***REMOVED***);
  
  var utcHours = utcHour.range;
  
  var utcDay = newInterval(function(date) ***REMOVED***
    date.setUTCHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setUTCDate(date.getUTCDate() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return (end - start) / durationDay;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCDate() - 1;
  ***REMOVED***);
  
  var utcDays = utcDay.range;
  
  function utcWeekday(i) ***REMOVED***
    return newInterval(function(date) ***REMOVED***
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    ***REMOVED***, function(date, step) ***REMOVED***
      date.setUTCDate(date.getUTCDate() + step * 7);
    ***REMOVED***, function(start, end) ***REMOVED***
      return (end - start) / durationWeek;
    ***REMOVED***);
  ***REMOVED***
  
  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);
  
  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;
  
  var utcMonth = newInterval(function(date) ***REMOVED***
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setUTCMonth(date.getUTCMonth() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCMonth();
  ***REMOVED***);
  
  var utcMonths = utcMonth.range;
  
  var utcYear = newInterval(function(date) ***REMOVED***
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  ***REMOVED***, function(date, step) ***REMOVED***
    date.setUTCFullYear(date.getUTCFullYear() + step);
  ***REMOVED***, function(start, end) ***REMOVED***
    return end.getUTCFullYear() - start.getUTCFullYear();
  ***REMOVED***, function(date) ***REMOVED***
    return date.getUTCFullYear();
  ***REMOVED***);
  
  // An optimized implementation for this simple case.
  utcYear.every = function(k) ***REMOVED***
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) ***REMOVED***
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    ***REMOVED***, function(date, step) ***REMOVED***
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    ***REMOVED***);
  ***REMOVED***;
  
  var utcYears = utcYear.range;
  
  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  var formatDecimal = function(x, p) ***REMOVED***
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);
  
    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  ***REMOVED***;
  
  var exponent$1 = function(x) ***REMOVED***
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  ***REMOVED***;
  
  var formatGroup = function(grouping, thousands) ***REMOVED***
    return function(value, width) ***REMOVED***
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;
  
      while (i > 0 && g > 0) ***REMOVED***
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      ***REMOVED***
  
      return t.reverse().join(thousands);
    ***REMOVED***;
  ***REMOVED***;
  
  var formatDefault = function(x, p) ***REMOVED***
    x = x.toPrecision(p);
  
    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) ***REMOVED***
      switch (x[i]) ***REMOVED***
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      ***REMOVED***
    ***REMOVED***
  
    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  ***REMOVED***;
  
  var prefixExponent;
  
  var formatPrefixAuto = function(x, p) ***REMOVED***
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  ***REMOVED***;
  
  var formatRounded = function(x, p) ***REMOVED***
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  ***REMOVED***;
  
  var formatTypes = ***REMOVED***
    "": formatDefault,
    "%": function(x, p) ***REMOVED*** return (x * 100).toFixed(p); ***REMOVED***,
    "b": function(x) ***REMOVED*** return Math.round(x).toString(2); ***REMOVED***,
    "c": function(x) ***REMOVED*** return x + ""; ***REMOVED***,
    "d": function(x) ***REMOVED*** return Math.round(x).toString(10); ***REMOVED***,
    "e": function(x, p) ***REMOVED*** return x.toExponential(p); ***REMOVED***,
    "f": function(x, p) ***REMOVED*** return x.toFixed(p); ***REMOVED***,
    "g": function(x, p) ***REMOVED*** return x.toPrecision(p); ***REMOVED***,
    "o": function(x) ***REMOVED*** return Math.round(x).toString(8); ***REMOVED***,
    "p": function(x, p) ***REMOVED*** return formatRounded(x * 100, p); ***REMOVED***,
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) ***REMOVED*** return Math.round(x).toString(16).toUpperCase(); ***REMOVED***,
    "x": function(x) ***REMOVED*** return Math.round(x).toString(16); ***REMOVED***
  ***REMOVED***;
  
  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;
  
  var formatSpecifier = function(specifier) ***REMOVED***
    return new FormatSpecifier(specifier);
  ***REMOVED***;
  
  function FormatSpecifier(specifier) ***REMOVED***
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  
    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";
  
    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";
  
    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";
  
    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";
  
    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  ***REMOVED***
  
  FormatSpecifier.prototype.toString = function() ***REMOVED***
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  ***REMOVED***;
  
  var prefixes = ["y","z","a","f","p","n","\xB5","m","","k","M","G","T","P","E","Z","Y"];
  
  function identity$3(x) ***REMOVED***
    return x;
  ***REMOVED***
  
  var formatLocale = function(locale) ***REMOVED***
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
        currency = locale.currency,
        decimal = locale.decimal;
  
    function newFormat(specifier) ***REMOVED***
      specifier = formatSpecifier(specifier);
  
      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;
  
      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";
  
      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);
  
      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));
  
      function format(value) ***REMOVED***
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;
  
        if (type === "c") ***REMOVED***
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        ***REMOVED*** else ***REMOVED***
          value = +value;
  
          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);
  
          // Perform the initial formatting.
          value = formatType(value, precision);
  
          // If the original value was negative, it may be rounded to zero during
          // formatting; treat this as (positive) zero.
          if (valueNegative) ***REMOVED***
            i = -1, n = value.length;
            valueNegative = false;
            while (++i < n) ***REMOVED***
              if (c = value.charCodeAt(i), (48 < c && c < 58)
                  || (type === "x" && 96 < c && c < 103)
                  || (type === "X" && 64 < c && c < 71)) ***REMOVED***
                valueNegative = true;
                break;
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
  
          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");
  
          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) ***REMOVED***
            i = -1, n = value.length;
            while (++i < n) ***REMOVED***
              if (c = value.charCodeAt(i), 48 > c || c > 57) ***REMOVED***
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
  
        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);
  
        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";
  
        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
  
        // Reconstruct the final output based on the desired alignment.
        switch (align) ***REMOVED***
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        ***REMOVED***
        return padding + valuePrefix + value + valueSuffix;
      ***REMOVED***
  
      format.toString = function() ***REMOVED***
        return specifier + "";
      ***REMOVED***;
  
      return format;
    ***REMOVED***
  
    function formatPrefix(specifier, value) ***REMOVED***
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) ***REMOVED***
        return f(k * value) + prefix;
      ***REMOVED***;
    ***REMOVED***
  
    return ***REMOVED***
      format: newFormat,
      formatPrefix: formatPrefix
    ***REMOVED***;
  ***REMOVED***;
  
  var locale$1;
  
  
  
  defaultLocale(***REMOVED***
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  ***REMOVED***);
  
  function defaultLocale(definition) ***REMOVED***
    locale$1 = formatLocale(definition);
    exports.format = locale$1.format;
    exports.formatPrefix = locale$1.formatPrefix;
    return locale$1;
  ***REMOVED***
  
  var precisionFixed = function(step) ***REMOVED***
    return Math.max(0, -exponent$1(Math.abs(step)));
  ***REMOVED***;
  
  var precisionPrefix = function(step, value) ***REMOVED***
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
  ***REMOVED***;
  
  var precisionRound = function(step, max) ***REMOVED***
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
  ***REMOVED***;
  
  function localDate(d) ***REMOVED***
    if (0 <= d.y && d.y < 100) ***REMOVED***
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    ***REMOVED***
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  ***REMOVED***
  
  function utcDate(d) ***REMOVED***
    if (0 <= d.y && d.y < 100) ***REMOVED***
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    ***REMOVED***
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  ***REMOVED***
  
  function newYear(y) ***REMOVED***
    return ***REMOVED***y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0***REMOVED***;
  ***REMOVED***
  
  function formatLocale$1(locale) ***REMOVED***
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;
  
    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);
  
    var formats = ***REMOVED***
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    ***REMOVED***;
  
    var utcFormats = ***REMOVED***
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    ***REMOVED***;
  
    var parses = ***REMOVED***
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    ***REMOVED***;
  
    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);
  
    function newFormat(specifier, formats) ***REMOVED***
      return function(date) ***REMOVED***
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;
  
        if (!(date instanceof Date)) date = new Date(+date);
  
        while (++i < n) ***REMOVED***
          if (specifier.charCodeAt(i) === 37) ***REMOVED***
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          ***REMOVED***
        ***REMOVED***
  
        string.push(specifier.slice(j, i));
        return string.join("");
      ***REMOVED***;
    ***REMOVED***
  
    function newParse(specifier, newDate) ***REMOVED***
      return function(string) ***REMOVED***
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0);
        if (i != string.length) return null;
  
        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
  
        // Convert day-of-week and week-of-year to day-of-year.
        if ("W" in d || "U" in d) ***REMOVED***
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          var day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
        ***REMOVED***
  
        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) ***REMOVED***
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        ***REMOVED***
  
        // Otherwise, all fields are in local time.
        return newDate(d);
      ***REMOVED***;
    ***REMOVED***
  
    function parseSpecifier(d, specifier, string, j) ***REMOVED***
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;
  
      while (i < n) ***REMOVED***
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) ***REMOVED***
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        ***REMOVED*** else if (c != string.charCodeAt(j++)) ***REMOVED***
          return -1;
        ***REMOVED***
      ***REMOVED***
  
      return j;
    ***REMOVED***
  
    function parsePeriod(d, string, i) ***REMOVED***
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    ***REMOVED***
  
    function parseShortWeekday(d, string, i) ***REMOVED***
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    ***REMOVED***
  
    function parseWeekday(d, string, i) ***REMOVED***
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    ***REMOVED***
  
    function parseShortMonth(d, string, i) ***REMOVED***
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    ***REMOVED***
  
    function parseMonth(d, string, i) ***REMOVED***
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    ***REMOVED***
  
    function parseLocaleDateTime(d, string, i) ***REMOVED***
      return parseSpecifier(d, locale_dateTime, string, i);
    ***REMOVED***
  
    function parseLocaleDate(d, string, i) ***REMOVED***
      return parseSpecifier(d, locale_date, string, i);
    ***REMOVED***
  
    function parseLocaleTime(d, string, i) ***REMOVED***
      return parseSpecifier(d, locale_time, string, i);
    ***REMOVED***
  
    function formatShortWeekday(d) ***REMOVED***
      return locale_shortWeekdays[d.getDay()];
    ***REMOVED***
  
    function formatWeekday(d) ***REMOVED***
      return locale_weekdays[d.getDay()];
    ***REMOVED***
  
    function formatShortMonth(d) ***REMOVED***
      return locale_shortMonths[d.getMonth()];
    ***REMOVED***
  
    function formatMonth(d) ***REMOVED***
      return locale_months[d.getMonth()];
    ***REMOVED***
  
    function formatPeriod(d) ***REMOVED***
      return locale_periods[+(d.getHours() >= 12)];
    ***REMOVED***
  
    function formatUTCShortWeekday(d) ***REMOVED***
      return locale_shortWeekdays[d.getUTCDay()];
    ***REMOVED***
  
    function formatUTCWeekday(d) ***REMOVED***
      return locale_weekdays[d.getUTCDay()];
    ***REMOVED***
  
    function formatUTCShortMonth(d) ***REMOVED***
      return locale_shortMonths[d.getUTCMonth()];
    ***REMOVED***
  
    function formatUTCMonth(d) ***REMOVED***
      return locale_months[d.getUTCMonth()];
    ***REMOVED***
  
    function formatUTCPeriod(d) ***REMOVED***
      return locale_periods[+(d.getUTCHours() >= 12)];
    ***REMOVED***
  
    return ***REMOVED***
      format: function(specifier) ***REMOVED***
        var f = newFormat(specifier += "", formats);
        f.toString = function() ***REMOVED*** return specifier; ***REMOVED***;
        return f;
      ***REMOVED***,
      parse: function(specifier) ***REMOVED***
        var p = newParse(specifier += "", localDate);
        p.toString = function() ***REMOVED*** return specifier; ***REMOVED***;
        return p;
      ***REMOVED***,
      utcFormat: function(specifier) ***REMOVED***
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() ***REMOVED*** return specifier; ***REMOVED***;
        return f;
      ***REMOVED***,
      utcParse: function(specifier) ***REMOVED***
        var p = newParse(specifier, utcDate);
        p.toString = function() ***REMOVED*** return specifier; ***REMOVED***;
        return p;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  var pads = ***REMOVED***"-": "", "_": " ", "0": "0"***REMOVED***;
  var numberRe = /^\s*\d+/;
  var percentRe = /^%/;
  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\***REMOVED***\***REMOVED***]/g;
  
  function pad(value, fill, width) ***REMOVED***
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  ***REMOVED***
  
  function requote(s) ***REMOVED***
    return s.replace(requoteRe, "\\$&");
  ***REMOVED***
  
  function formatRe(names) ***REMOVED***
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  ***REMOVED***
  
  function formatLookup(names) ***REMOVED***
    var map = ***REMOVED******REMOVED***, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  ***REMOVED***
  
  function parseWeekdayNumber(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseWeekNumberSunday(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseWeekNumberMonday(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseFullYear(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseYear(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  ***REMOVED***
  
  function parseZone(d, string, i) ***REMOVED***
    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  ***REMOVED***
  
  function parseMonthNumber(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  ***REMOVED***
  
  function parseDayOfMonth(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseDayOfYear(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseHour24(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseMinutes(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseSeconds(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseMilliseconds(d, string, i) ***REMOVED***
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  ***REMOVED***
  
  function parseLiteralPercent(d, string, i) ***REMOVED***
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  ***REMOVED***
  
  function formatDayOfMonth(d, p) ***REMOVED***
    return pad(d.getDate(), p, 2);
  ***REMOVED***
  
  function formatHour24(d, p) ***REMOVED***
    return pad(d.getHours(), p, 2);
  ***REMOVED***
  
  function formatHour12(d, p) ***REMOVED***
    return pad(d.getHours() % 12 || 12, p, 2);
  ***REMOVED***
  
  function formatDayOfYear(d, p) ***REMOVED***
    return pad(1 + day.count(year(d), d), p, 3);
  ***REMOVED***
  
  function formatMilliseconds(d, p) ***REMOVED***
    return pad(d.getMilliseconds(), p, 3);
  ***REMOVED***
  
  function formatMonthNumber(d, p) ***REMOVED***
    return pad(d.getMonth() + 1, p, 2);
  ***REMOVED***
  
  function formatMinutes(d, p) ***REMOVED***
    return pad(d.getMinutes(), p, 2);
  ***REMOVED***
  
  function formatSeconds(d, p) ***REMOVED***
    return pad(d.getSeconds(), p, 2);
  ***REMOVED***
  
  function formatWeekNumberSunday(d, p) ***REMOVED***
    return pad(sunday.count(year(d), d), p, 2);
  ***REMOVED***
  
  function formatWeekdayNumber(d) ***REMOVED***
    return d.getDay();
  ***REMOVED***
  
  function formatWeekNumberMonday(d, p) ***REMOVED***
    return pad(monday.count(year(d), d), p, 2);
  ***REMOVED***
  
  function formatYear(d, p) ***REMOVED***
    return pad(d.getFullYear() % 100, p, 2);
  ***REMOVED***
  
  function formatFullYear(d, p) ***REMOVED***
    return pad(d.getFullYear() % 10000, p, 4);
  ***REMOVED***
  
  function formatZone(d) ***REMOVED***
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  ***REMOVED***
  
  function formatUTCDayOfMonth(d, p) ***REMOVED***
    return pad(d.getUTCDate(), p, 2);
  ***REMOVED***
  
  function formatUTCHour24(d, p) ***REMOVED***
    return pad(d.getUTCHours(), p, 2);
  ***REMOVED***
  
  function formatUTCHour12(d, p) ***REMOVED***
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  ***REMOVED***
  
  function formatUTCDayOfYear(d, p) ***REMOVED***
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  ***REMOVED***
  
  function formatUTCMilliseconds(d, p) ***REMOVED***
    return pad(d.getUTCMilliseconds(), p, 3);
  ***REMOVED***
  
  function formatUTCMonthNumber(d, p) ***REMOVED***
    return pad(d.getUTCMonth() + 1, p, 2);
  ***REMOVED***
  
  function formatUTCMinutes(d, p) ***REMOVED***
    return pad(d.getUTCMinutes(), p, 2);
  ***REMOVED***
  
  function formatUTCSeconds(d, p) ***REMOVED***
    return pad(d.getUTCSeconds(), p, 2);
  ***REMOVED***
  
  function formatUTCWeekNumberSunday(d, p) ***REMOVED***
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  ***REMOVED***
  
  function formatUTCWeekdayNumber(d) ***REMOVED***
    return d.getUTCDay();
  ***REMOVED***
  
  function formatUTCWeekNumberMonday(d, p) ***REMOVED***
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  ***REMOVED***
  
  function formatUTCYear(d, p) ***REMOVED***
    return pad(d.getUTCFullYear() % 100, p, 2);
  ***REMOVED***
  
  function formatUTCFullYear(d, p) ***REMOVED***
    return pad(d.getUTCFullYear() % 10000, p, 4);
  ***REMOVED***
  
  function formatUTCZone() ***REMOVED***
    return "+0000";
  ***REMOVED***
  
  function formatLiteralPercent() ***REMOVED***
    return "%";
  ***REMOVED***
  
  var locale$2;
  
  
  
  
  
  defaultLocale$1(***REMOVED***
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  ***REMOVED***);
  
  function defaultLocale$1(definition) ***REMOVED***
    locale$2 = formatLocale$1(definition);
    exports.timeFormat = locale$2.format;
    exports.timeParse = locale$2.parse;
    exports.utcFormat = locale$2.utcFormat;
    exports.utcParse = locale$2.utcParse;
    return locale$2;
  ***REMOVED***
  
  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
  
  function formatIsoNative(date) ***REMOVED***
    return date.toISOString();
  ***REMOVED***
  
  var formatIso = Date.prototype.toISOString
      ? formatIsoNative
      : exports.utcFormat(isoSpecifier);
  
  function parseIsoNative(string) ***REMOVED***
    var date = new Date(string);
    return isNaN(date) ? null : date;
  ***REMOVED***
  
  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
      ? parseIsoNative
      : exports.utcParse(isoSpecifier);
  
  var array$2 = Array.prototype;
  
  var map$3 = array$2.map;
  var slice$3 = array$2.slice;
  
  var implicit = ***REMOVED***name: "implicit"***REMOVED***;
  
  function ordinal(range) ***REMOVED***
    var index = map$1(),
        domain = [],
        unknown = implicit;
  
    range = range == null ? [] : slice$3.call(range);
  
    function scale(d) ***REMOVED***
      var key = d + "", i = index.get(key);
      if (!i) ***REMOVED***
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      ***REMOVED***
      return range[(i - 1) % range.length];
    ***REMOVED***
  
    scale.domain = function(_) ***REMOVED***
      if (!arguments.length) return domain.slice();
      domain = [], index = map$1();
      var i = -1, n = _.length, d, key;
      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      return scale;
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (range = slice$3.call(_), scale) : range.slice();
    ***REMOVED***;
  
    scale.unknown = function(_) ***REMOVED***
      return arguments.length ? (unknown = _, scale) : unknown;
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return ordinal()
          .domain(domain)
          .range(range)
          .unknown(unknown);
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  function band() ***REMOVED***
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        range$$1 = [0, 1],
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;
  
    delete scale.unknown;
  
    function rescale() ***REMOVED***
      var n = domain().length,
          reverse = range$$1[1] < range$$1[0],
          start = range$$1[reverse - 0],
          stop = range$$1[1 - reverse];
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = range(n).map(function(i) ***REMOVED*** return start + step * i; ***REMOVED***);
      return ordinalRange(reverse ? values.reverse() : values);
    ***REMOVED***
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (domain(_), rescale()) : domain();
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
    ***REMOVED***;
  
    scale.rangeRound = function(_) ***REMOVED***
      return range$$1 = [+_[0], +_[1]], round = true, rescale();
    ***REMOVED***;
  
    scale.bandwidth = function() ***REMOVED***
      return bandwidth;
    ***REMOVED***;
  
    scale.step = function() ***REMOVED***
      return step;
    ***REMOVED***;
  
    scale.round = function(_) ***REMOVED***
      return arguments.length ? (round = !!_, rescale()) : round;
    ***REMOVED***;
  
    scale.padding = function(_) ***REMOVED***
      return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    ***REMOVED***;
  
    scale.paddingInner = function(_) ***REMOVED***
      return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    ***REMOVED***;
  
    scale.paddingOuter = function(_) ***REMOVED***
      return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
    ***REMOVED***;
  
    scale.align = function(_) ***REMOVED***
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return band()
          .domain(domain())
          .range(range$$1)
          .round(round)
          .paddingInner(paddingInner)
          .paddingOuter(paddingOuter)
          .align(align);
    ***REMOVED***;
  
    return rescale();
  ***REMOVED***
  
  function pointish(scale) ***REMOVED***
    var copy = scale.copy;
  
    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;
  
    scale.copy = function() ***REMOVED***
      return pointish(copy());
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  function point$4() ***REMOVED***
    return pointish(band().paddingInner(1));
  ***REMOVED***
  
  var constant$3 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var number$1 = function(x) ***REMOVED***
    return +x;
  ***REMOVED***;
  
  var unit = [0, 1];
  
  function deinterpolateLinear(a, b) ***REMOVED***
    return (b -= (a = +a))
        ? function(x) ***REMOVED*** return (x - a) / b; ***REMOVED***
        : constant$3(b);
  ***REMOVED***
  
  function deinterpolateClamp(deinterpolate) ***REMOVED***
    return function(a, b) ***REMOVED***
      var d = deinterpolate(a = +a, b = +b);
      return function(x) ***REMOVED*** return x <= a ? 0 : x >= b ? 1 : d(x); ***REMOVED***;
    ***REMOVED***;
  ***REMOVED***
  
  function reinterpolateClamp(reinterpolate) ***REMOVED***
    return function(a, b) ***REMOVED***
      var r = reinterpolate(a = +a, b = +b);
      return function(t) ***REMOVED*** return t <= 0 ? a : t >= 1 ? b : r(t); ***REMOVED***;
    ***REMOVED***;
  ***REMOVED***
  
  function bimap(domain, range$$1, deinterpolate, reinterpolate) ***REMOVED***
    var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
    else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function(x) ***REMOVED*** return r0(d0(x)); ***REMOVED***;
  ***REMOVED***
  
  function polymap(domain, range$$1, deinterpolate, reinterpolate) ***REMOVED***
    var j = Math.min(domain.length, range$$1.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;
  
    // Reverse descending domains.
    if (domain[j] < domain[0]) ***REMOVED***
      domain = domain.slice().reverse();
      range$$1 = range$$1.slice().reverse();
    ***REMOVED***
  
    while (++i < j) ***REMOVED***
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
    ***REMOVED***
  
    return function(x) ***REMOVED***
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    ***REMOVED***;
  ***REMOVED***
  
  function copy(source, target) ***REMOVED***
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp());
  ***REMOVED***
  
  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
  function continuous(deinterpolate, reinterpolate) ***REMOVED***
    var domain = unit,
        range$$1 = unit,
        interpolate$$1 = interpolate,
        clamp = false,
        piecewise,
        output,
        input;
  
    function rescale() ***REMOVED***
      piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    ***REMOVED***
  
    function scale(x) ***REMOVED***
      return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
    ***REMOVED***
  
    scale.invert = function(y) ***REMOVED***
      return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    ***REMOVED***;
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (domain = map$3.call(_, number$1), rescale()) : domain.slice();
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (range$$1 = slice$3.call(_), rescale()) : range$$1.slice();
    ***REMOVED***;
  
    scale.rangeRound = function(_) ***REMOVED***
      return range$$1 = slice$3.call(_), interpolate$$1 = interpolateRound, rescale();
    ***REMOVED***;
  
    scale.clamp = function(_) ***REMOVED***
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    ***REMOVED***;
  
    scale.interpolate = function(_) ***REMOVED***
      return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
    ***REMOVED***;
  
    return rescale();
  ***REMOVED***
  
  var tickFormat = function(domain, count, specifier) ***REMOVED***
    var start = domain[0],
        stop = domain[domain.length - 1],
        step = tickStep(start, stop, count == null ? 10 : count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) ***REMOVED***
      case "s": ***REMOVED***
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return exports.formatPrefix(specifier, value);
      ***REMOVED***
      case "":
      case "e":
      case "g":
      case "p":
      case "r": ***REMOVED***
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      ***REMOVED***
      case "f":
      case "%": ***REMOVED***
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      ***REMOVED***
    ***REMOVED***
    return exports.format(specifier);
  ***REMOVED***;
  
  function linearish(scale) ***REMOVED***
    var domain = scale.domain;
  
    scale.ticks = function(count) ***REMOVED***
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    ***REMOVED***;
  
    scale.tickFormat = function(count, specifier) ***REMOVED***
      return tickFormat(domain(), count, specifier);
    ***REMOVED***;
  
    scale.nice = function(count) ***REMOVED***
      var d = domain(),
          i = d.length - 1,
          n = count == null ? 10 : count,
          start = d[0],
          stop = d[i],
          step = tickStep(start, stop, n);
  
      if (step) ***REMOVED***
        step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
        d[0] = Math.floor(start / step) * step;
        d[i] = Math.ceil(stop / step) * step;
        domain(d);
      ***REMOVED***
  
      return scale;
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  function linear$2() ***REMOVED***
    var scale = continuous(deinterpolateLinear, interpolateNumber);
  
    scale.copy = function() ***REMOVED***
      return copy(scale, linear$2());
    ***REMOVED***;
  
    return linearish(scale);
  ***REMOVED***
  
  function identity$4() ***REMOVED***
    var domain = [0, 1];
  
    function scale(x) ***REMOVED***
      return +x;
    ***REMOVED***
  
    scale.invert = scale;
  
    scale.domain = scale.range = function(_) ***REMOVED***
      return arguments.length ? (domain = map$3.call(_, number$1), scale) : domain.slice();
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return identity$4().domain(domain);
    ***REMOVED***;
  
    return linearish(scale);
  ***REMOVED***
  
  var nice = function(domain, interval) ***REMOVED***
    domain = domain.slice();
  
    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;
  
    if (x1 < x0) ***REMOVED***
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    ***REMOVED***
  
    domain[i0] = interval.floor(x0);
    domain[i1] = interval.ceil(x1);
    return domain;
  ***REMOVED***;
  
  function deinterpolate(a, b) ***REMOVED***
    return (b = Math.log(b / a))
        ? function(x) ***REMOVED*** return Math.log(x / a) / b; ***REMOVED***
        : constant$3(b);
  ***REMOVED***
  
  function reinterpolate(a, b) ***REMOVED***
    return a < 0
        ? function(t) ***REMOVED*** return -Math.pow(-b, t) * Math.pow(-a, 1 - t); ***REMOVED***
        : function(t) ***REMOVED*** return Math.pow(b, t) * Math.pow(a, 1 - t); ***REMOVED***;
  ***REMOVED***
  
  function pow10(x) ***REMOVED***
    return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
  ***REMOVED***
  
  function powp(base) ***REMOVED***
    return base === 10 ? pow10
        : base === Math.E ? Math.exp
        : function(x) ***REMOVED*** return Math.pow(base, x); ***REMOVED***;
  ***REMOVED***
  
  function logp(base) ***REMOVED***
    return base === Math.E ? Math.log
        : base === 10 && Math.log10
        || base === 2 && Math.log2
        || (base = Math.log(base), function(x) ***REMOVED*** return Math.log(x) / base; ***REMOVED***);
  ***REMOVED***
  
  function reflect(f) ***REMOVED***
    return function(x) ***REMOVED***
      return -f(-x);
    ***REMOVED***;
  ***REMOVED***
  
  function log() ***REMOVED***
    var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
        domain = scale.domain,
        base = 10,
        logs = logp(10),
        pows = powp(10);
  
    function rescale() ***REMOVED***
      logs = logp(base), pows = powp(base);
      if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
      return scale;
    ***REMOVED***
  
    scale.base = function(_) ***REMOVED***
      return arguments.length ? (base = +_, rescale()) : base;
    ***REMOVED***;
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (domain(_), rescale()) : domain();
    ***REMOVED***;
  
    scale.ticks = function(count) ***REMOVED***
      var d = domain(),
          u = d[0],
          v = d[d.length - 1],
          r;
  
      if (r = v < u) i = u, u = v, v = i;
  
      var i = logs(u),
          j = logs(v),
          p,
          k,
          t,
          n = count == null ? 10 : +count,
          z = [];
  
      if (!(base % 1) && j - i < n) ***REMOVED***
        i = Math.round(i) - 1, j = Math.round(j) + 1;
        if (u > 0) for (; i < j; ++i) ***REMOVED***
          for (k = 1, p = pows(i); k < base; ++k) ***REMOVED***
            t = p * k;
            if (t < u) continue;
            if (t > v) break;
            z.push(t);
          ***REMOVED***
        ***REMOVED*** else for (; i < j; ++i) ***REMOVED***
          for (k = base - 1, p = pows(i); k >= 1; --k) ***REMOVED***
            t = p * k;
            if (t < u) continue;
            if (t > v) break;
            z.push(t);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        z = ticks(i, j, Math.min(j - i, n)).map(pows);
      ***REMOVED***
  
      return r ? z.reverse() : z;
    ***REMOVED***;
  
    scale.tickFormat = function(count, specifier) ***REMOVED***
      if (specifier == null) specifier = base === 10 ? ".0e" : ",";
      if (typeof specifier !== "function") specifier = exports.format(specifier);
      if (count === Infinity) return specifier;
      if (count == null) count = 10;
      var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
      return function(d) ***REMOVED***
        var i = d / pows(Math.round(logs(d)));
        if (i * base < base - 0.5) i *= base;
        return i <= k ? specifier(d) : "";
      ***REMOVED***;
    ***REMOVED***;
  
    scale.nice = function() ***REMOVED***
      return domain(nice(domain(), ***REMOVED***
        floor: function(x) ***REMOVED*** return pows(Math.floor(logs(x))); ***REMOVED***,
        ceil: function(x) ***REMOVED*** return pows(Math.ceil(logs(x))); ***REMOVED***
      ***REMOVED***));
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return copy(scale, log().base(base));
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  function raise(x, exponent) ***REMOVED***
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  ***REMOVED***
  
  function pow() ***REMOVED***
    var exponent = 1,
        scale = continuous(deinterpolate, reinterpolate),
        domain = scale.domain;
  
    function deinterpolate(a, b) ***REMOVED***
      return (b = raise(b, exponent) - (a = raise(a, exponent)))
          ? function(x) ***REMOVED*** return (raise(x, exponent) - a) / b; ***REMOVED***
          : constant$3(b);
    ***REMOVED***
  
    function reinterpolate(a, b) ***REMOVED***
      b = raise(b, exponent) - (a = raise(a, exponent));
      return function(t) ***REMOVED*** return raise(a + b * t, 1 / exponent); ***REMOVED***;
    ***REMOVED***
  
    scale.exponent = function(_) ***REMOVED***
      return arguments.length ? (exponent = +_, domain(domain())) : exponent;
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return copy(scale, pow().exponent(exponent));
    ***REMOVED***;
  
    return linearish(scale);
  ***REMOVED***
  
  function sqrt() ***REMOVED***
    return pow().exponent(0.5);
  ***REMOVED***
  
  function quantile$$1() ***REMOVED***
    var domain = [],
        range$$1 = [],
        thresholds = [];
  
    function rescale() ***REMOVED***
      var i = 0, n = Math.max(1, range$$1.length);
      thresholds = new Array(n - 1);
      while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
      return scale;
    ***REMOVED***
  
    function scale(x) ***REMOVED***
      if (!isNaN(x = +x)) return range$$1[bisectRight(thresholds, x)];
    ***REMOVED***
  
    scale.invertExtent = function(y) ***REMOVED***
      var i = range$$1.indexOf(y);
      return i < 0 ? [NaN, NaN] : [
        i > 0 ? thresholds[i - 1] : domain[0],
        i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
      ];
    ***REMOVED***;
  
    scale.domain = function(_) ***REMOVED***
      if (!arguments.length) return domain.slice();
      domain = [];
      for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
      domain.sort(ascending);
      return rescale();
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (range$$1 = slice$3.call(_), rescale()) : range$$1.slice();
    ***REMOVED***;
  
    scale.quantiles = function() ***REMOVED***
      return thresholds.slice();
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return quantile$$1()
          .domain(domain)
          .range(range$$1);
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  function quantize$1() ***REMOVED***
    var x0 = 0,
        x1 = 1,
        n = 1,
        domain = [0.5],
        range$$1 = [0, 1];
  
    function scale(x) ***REMOVED***
      if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
    ***REMOVED***
  
    function rescale() ***REMOVED***
      var i = -1;
      domain = new Array(n);
      while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
      return scale;
    ***REMOVED***
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (n = (range$$1 = slice$3.call(_)).length - 1, rescale()) : range$$1.slice();
    ***REMOVED***;
  
    scale.invertExtent = function(y) ***REMOVED***
      var i = range$$1.indexOf(y);
      return i < 0 ? [NaN, NaN]
          : i < 1 ? [x0, domain[0]]
          : i >= n ? [domain[n - 1], x1]
          : [domain[i - 1], domain[i]];
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return quantize$1()
          .domain([x0, x1])
          .range(range$$1);
    ***REMOVED***;
  
    return linearish(scale);
  ***REMOVED***
  
  function threshold$1() ***REMOVED***
    var domain = [0.5],
        range$$1 = [0, 1],
        n = 1;
  
    function scale(x) ***REMOVED***
      if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
    ***REMOVED***
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (domain = slice$3.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : domain.slice();
    ***REMOVED***;
  
    scale.range = function(_) ***REMOVED***
      return arguments.length ? (range$$1 = slice$3.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : range$$1.slice();
    ***REMOVED***;
  
    scale.invertExtent = function(y) ***REMOVED***
      var i = range$$1.indexOf(y);
      return [domain[i - 1], domain[i]];
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return threshold$1()
          .domain(domain)
          .range(range$$1);
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  var durationSecond$1 = 1000;
  var durationMinute$1 = durationSecond$1 * 60;
  var durationHour$1 = durationMinute$1 * 60;
  var durationDay$1 = durationHour$1 * 24;
  var durationWeek$1 = durationDay$1 * 7;
  var durationMonth = durationDay$1 * 30;
  var durationYear = durationDay$1 * 365;
  
  function date$1(t) ***REMOVED***
    return new Date(t);
  ***REMOVED***
  
  function number$2(t) ***REMOVED***
    return t instanceof Date ? +t : +new Date(+t);
  ***REMOVED***
  
  function calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format) ***REMOVED***
    var scale = continuous(deinterpolateLinear, interpolateNumber),
        invert = scale.invert,
        domain = scale.domain;
  
    var formatMillisecond = format(".%L"),
        formatSecond = format(":%S"),
        formatMinute = format("%I:%M"),
        formatHour = format("%I %p"),
        formatDay = format("%a %d"),
        formatWeek = format("%b %d"),
        formatMonth = format("%B"),
        formatYear = format("%Y");
  
    var tickIntervals = [
      [second$$1,  1,      durationSecond$1],
      [second$$1,  5,  5 * durationSecond$1],
      [second$$1, 15, 15 * durationSecond$1],
      [second$$1, 30, 30 * durationSecond$1],
      [minute$$1,  1,      durationMinute$1],
      [minute$$1,  5,  5 * durationMinute$1],
      [minute$$1, 15, 15 * durationMinute$1],
      [minute$$1, 30, 30 * durationMinute$1],
      [  hour$$1,  1,      durationHour$1  ],
      [  hour$$1,  3,  3 * durationHour$1  ],
      [  hour$$1,  6,  6 * durationHour$1  ],
      [  hour$$1, 12, 12 * durationHour$1  ],
      [   day$$1,  1,      durationDay$1   ],
      [   day$$1,  2,  2 * durationDay$1   ],
      [  week,  1,      durationWeek$1  ],
      [ month$$1,  1,      durationMonth ],
      [ month$$1,  3,  3 * durationMonth ],
      [  year$$1,  1,      durationYear  ]
    ];
  
    function tickFormat(date) ***REMOVED***
      return (second$$1(date) < date ? formatMillisecond
          : minute$$1(date) < date ? formatSecond
          : hour$$1(date) < date ? formatMinute
          : day$$1(date) < date ? formatHour
          : month$$1(date) < date ? (week(date) < date ? formatDay : formatWeek)
          : year$$1(date) < date ? formatMonth
          : formatYear)(date);
    ***REMOVED***
  
    function tickInterval(interval, start, stop, step) ***REMOVED***
      if (interval == null) interval = 10;
  
      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // Otherwise, assume interval is already a time interval and use it.
      if (typeof interval === "number") ***REMOVED***
        var target = Math.abs(stop - start) / interval,
            i = bisector(function(i) ***REMOVED*** return i[2]; ***REMOVED***).right(tickIntervals, target);
        if (i === tickIntervals.length) ***REMOVED***
          step = tickStep(start / durationYear, stop / durationYear, interval);
          interval = year$$1;
        ***REMOVED*** else if (i) ***REMOVED***
          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
          step = i[1];
          interval = i[0];
        ***REMOVED*** else ***REMOVED***
          step = tickStep(start, stop, interval);
          interval = millisecond$$1;
        ***REMOVED***
      ***REMOVED***
  
      return step == null ? interval : interval.every(step);
    ***REMOVED***
  
    scale.invert = function(y) ***REMOVED***
      return new Date(invert(y));
    ***REMOVED***;
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? domain(map$3.call(_, number$2)) : domain().map(date$1);
    ***REMOVED***;
  
    scale.ticks = function(interval, step) ***REMOVED***
      var d = domain(),
          t0 = d[0],
          t1 = d[d.length - 1],
          r = t1 < t0,
          t;
      if (r) t = t0, t0 = t1, t1 = t;
      t = tickInterval(interval, t0, t1, step);
      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
      return r ? t.reverse() : t;
    ***REMOVED***;
  
    scale.tickFormat = function(count, specifier) ***REMOVED***
      return specifier == null ? tickFormat : format(specifier);
    ***REMOVED***;
  
    scale.nice = function(interval, step) ***REMOVED***
      var d = domain();
      return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
          ? domain(nice(d, interval))
          : scale;
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return copy(scale, calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format));
    ***REMOVED***;
  
    return scale;
  ***REMOVED***
  
  var time = function() ***REMOVED***
    return calendar(year, month, sunday, day, hour, minute, second, millisecond, exports.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
  ***REMOVED***;
  
  var utcTime = function() ***REMOVED***
    return calendar(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, millisecond, exports.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
  ***REMOVED***;
  
  var colors = function(s) ***REMOVED***
    return s.match(/.***REMOVED***6***REMOVED***/g).map(function(x) ***REMOVED***
      return "#" + x;
    ***REMOVED***);
  ***REMOVED***;
  
  var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
  
  var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");
  
  var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");
  
  var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");
  
  var cubehelix$3 = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));
  
  var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));
  
  var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));
  
  var rainbow = cubehelix();
  
  var rainbow$1 = function(t) ***REMOVED***
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    rainbow.h = 360 * t - 100;
    rainbow.s = 1.5 - 1.5 * ts;
    rainbow.l = 0.8 - 0.9 * ts;
    return rainbow + "";
  ***REMOVED***;
  
  function ramp(range) ***REMOVED***
    var n = range.length;
    return function(t) ***REMOVED***
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    ***REMOVED***;
  ***REMOVED***
  
  var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
  
  var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
  
  var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
  
  var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
  
  function sequential(interpolator) ***REMOVED***
    var x0 = 0,
        x1 = 1,
        clamp = false;
  
    function scale(x) ***REMOVED***
      var t = (x - x0) / (x1 - x0);
      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
    ***REMOVED***
  
    scale.domain = function(_) ***REMOVED***
      return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
    ***REMOVED***;
  
    scale.clamp = function(_) ***REMOVED***
      return arguments.length ? (clamp = !!_, scale) : clamp;
    ***REMOVED***;
  
    scale.interpolator = function(_) ***REMOVED***
      return arguments.length ? (interpolator = _, scale) : interpolator;
    ***REMOVED***;
  
    scale.copy = function() ***REMOVED***
      return sequential(interpolator).domain([x0, x1]).clamp(clamp);
    ***REMOVED***;
  
    return linearish(scale);
  ***REMOVED***
  
  var xhtml = "http://www.w3.org/1999/xhtml";
  
  var namespaces = ***REMOVED***
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  ***REMOVED***;
  
  var namespace = function(name) ***REMOVED***
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? ***REMOVED***space: namespaces[prefix], local: name***REMOVED*** : name;
  ***REMOVED***;
  
  function creatorInherit(name) ***REMOVED***
    return function() ***REMOVED***
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    ***REMOVED***;
  ***REMOVED***
  
  function creatorFixed(fullname) ***REMOVED***
    return function() ***REMOVED***
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    ***REMOVED***;
  ***REMOVED***
  
  var creator = function(name) ***REMOVED***
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  ***REMOVED***;
  
  var nextId = 0;
  
  function local() ***REMOVED***
    return new Local;
  ***REMOVED***
  
  function Local() ***REMOVED***
    this._ = "@" + (++nextId).toString(36);
  ***REMOVED***
  
  Local.prototype = local.prototype = ***REMOVED***
    constructor: Local,
    get: function(node) ***REMOVED***
      var id = this._;
      while (!(id in node)) if (!(node = node.parentNode)) return;
      return node[id];
    ***REMOVED***,
    set: function(node, value) ***REMOVED***
      return node[this._] = value;
    ***REMOVED***,
    remove: function(node) ***REMOVED***
      return this._ in node && delete node[this._];
    ***REMOVED***,
    toString: function() ***REMOVED***
      return this._;
    ***REMOVED***
  ***REMOVED***;
  
  var matcher = function(selector) ***REMOVED***
    return function() ***REMOVED***
      return this.matches(selector);
    ***REMOVED***;
  ***REMOVED***;
  
  if (typeof document !== "undefined") ***REMOVED***
    var element = document.documentElement;
    if (!element.matches) ***REMOVED***
      var vendorMatches = element.webkitMatchesSelector
          || element.msMatchesSelector
          || element.mozMatchesSelector
          || element.oMatchesSelector;
      matcher = function(selector) ***REMOVED***
        return function() ***REMOVED***
          return vendorMatches.call(this, selector);
        ***REMOVED***;
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***
  
  var matcher$1 = matcher;
  
  var filterEvents = ***REMOVED******REMOVED***;
  
  exports.event = null;
  
  if (typeof document !== "undefined") ***REMOVED***
    var element$1 = document.documentElement;
    if (!("onmouseenter" in element$1)) ***REMOVED***
      filterEvents = ***REMOVED***mouseenter: "mouseover", mouseleave: "mouseout"***REMOVED***;
    ***REMOVED***
  ***REMOVED***
  
  function filterContextListener(listener, index, group) ***REMOVED***
    listener = contextListener(listener, index, group);
    return function(event) ***REMOVED***
      var related = event.relatedTarget;
      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) ***REMOVED***
        listener.call(this, event);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function contextListener(listener, index, group) ***REMOVED***
    return function(event1) ***REMOVED***
      var event0 = exports.event; // Events can be reentrant (e.g., focus).
      exports.event = event1;
      try ***REMOVED***
        listener.call(this, this.__data__, index, group);
      ***REMOVED*** finally ***REMOVED***
        exports.event = event0;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function parseTypenames$1(typenames) ***REMOVED***
    return typenames.trim().split(/^|\s+/).map(function(t) ***REMOVED***
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return ***REMOVED***type: t, name: name***REMOVED***;
    ***REMOVED***);
  ***REMOVED***
  
  function onRemove(typename) ***REMOVED***
    return function() ***REMOVED***
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) ***REMOVED***
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) ***REMOVED***
          this.removeEventListener(o.type, o.listener, o.capture);
        ***REMOVED*** else ***REMOVED***
          on[++i] = o;
        ***REMOVED***
      ***REMOVED***
      if (++i) on.length = i;
      else delete this.__on;
    ***REMOVED***;
  ***REMOVED***
  
  function onAdd(typename, value, capture) ***REMOVED***
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) ***REMOVED***
      var on = this.__on, o, listener = wrap(value, i, group);
      if (on) for (var j = 0, m = on.length; j < m; ++j) ***REMOVED***
        if ((o = on[j]).type === typename.type && o.name === typename.name) ***REMOVED***
          this.removeEventListener(o.type, o.listener, o.capture);
          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
          o.value = value;
          return;
        ***REMOVED***
      ***REMOVED***
      this.addEventListener(typename.type, listener, capture);
      o = ***REMOVED***type: typename.type, name: typename.name, value: value, listener: listener, capture: capture***REMOVED***;
      if (!on) this.__on = [o];
      else on.push(o);
    ***REMOVED***;
  ***REMOVED***
  
  var selection_on = function(typename, value, capture) ***REMOVED***
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;
  
    if (arguments.length < 2) ***REMOVED***
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) ***REMOVED***
        for (i = 0, o = on[j]; i < n; ++i) ***REMOVED***
          if ((t = typenames[i]).type === o.type && t.name === o.name) ***REMOVED***
            return o.value;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
      return;
    ***REMOVED***
  
    on = value ? onAdd : onRemove;
    if (capture == null) capture = false;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
    return this;
  ***REMOVED***;
  
  function customEvent(event1, listener, that, args) ***REMOVED***
    var event0 = exports.event;
    event1.sourceEvent = exports.event;
    exports.event = event1;
    try ***REMOVED***
      return listener.apply(that, args);
    ***REMOVED*** finally ***REMOVED***
      exports.event = event0;
    ***REMOVED***
  ***REMOVED***
  
  var sourceEvent = function() ***REMOVED***
    var current = exports.event, source;
    while (source = current.sourceEvent) current = source;
    return current;
  ***REMOVED***;
  
  var point$5 = function(node, event) ***REMOVED***
    var svg = node.ownerSVGElement || node;
  
    if (svg.createSVGPoint) ***REMOVED***
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    ***REMOVED***
  
    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  ***REMOVED***;
  
  var mouse = function(node) ***REMOVED***
    var event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point$5(node, event);
  ***REMOVED***;
  
  function none$2() ***REMOVED******REMOVED***
  
  var selector = function(selector) ***REMOVED***
    return selector == null ? none$2 : function() ***REMOVED***
      return this.querySelector(selector);
    ***REMOVED***;
  ***REMOVED***;
  
  var selection_select = function(select) ***REMOVED***
    if (typeof select !== "function") select = selector(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) ***REMOVED***
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) ***REMOVED***
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Selection(subgroups, this._parents);
  ***REMOVED***;
  
  function empty() ***REMOVED***
    return [];
  ***REMOVED***
  
  var selectorAll = function(selector) ***REMOVED***
    return selector == null ? empty : function() ***REMOVED***
      return this.querySelectorAll(selector);
    ***REMOVED***;
  ***REMOVED***;
  
  var selection_selectAll = function(select) ***REMOVED***
    if (typeof select !== "function") select = selectorAll(select);
  
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Selection(subgroups, parents);
  ***REMOVED***;
  
  var selection_filter = function(match) ***REMOVED***
    if (typeof match !== "function") match = matcher$1(match);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) ***REMOVED***
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) ***REMOVED***
          subgroup.push(node);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Selection(subgroups, this._parents);
  ***REMOVED***;
  
  var sparse = function(update) ***REMOVED***
    return new Array(update.length);
  ***REMOVED***;
  
  var selection_enter = function() ***REMOVED***
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  ***REMOVED***;
  
  function EnterNode(parent, datum) ***REMOVED***
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  ***REMOVED***
  
  EnterNode.prototype = ***REMOVED***
    constructor: EnterNode,
    appendChild: function(child) ***REMOVED*** return this._parent.insertBefore(child, this._next); ***REMOVED***,
    insertBefore: function(child, next) ***REMOVED*** return this._parent.insertBefore(child, next); ***REMOVED***,
    querySelector: function(selector) ***REMOVED*** return this._parent.querySelector(selector); ***REMOVED***,
    querySelectorAll: function(selector) ***REMOVED*** return this._parent.querySelectorAll(selector); ***REMOVED***
  ***REMOVED***;
  
  var constant$4 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var keyPrefix = "$"; // Protect against keys like “__proto__”.
  
  function bindIndex(parent, group, enter, update, exit, data) ***REMOVED***
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;
  
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) ***REMOVED***
      if (node = group[i]) ***REMOVED***
        node.__data__ = data[i];
        update[i] = node;
      ***REMOVED*** else ***REMOVED***
        enter[i] = new EnterNode(parent, data[i]);
      ***REMOVED***
    ***REMOVED***
  
    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) ***REMOVED***
      if (node = group[i]) ***REMOVED***
        exit[i] = node;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  function bindKey(parent, group, enter, update, exit, data, key) ***REMOVED***
    var i,
        node,
        nodeByKeyValue = ***REMOVED******REMOVED***,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;
  
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) ***REMOVED***
      if (node = group[i]) ***REMOVED***
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) ***REMOVED***
          exit[i] = node;
        ***REMOVED*** else ***REMOVED***
          nodeByKeyValue[keyValue] = node;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) ***REMOVED***
      keyValue = keyPrefix + key.call(parent, data[i], i, data);
      if (node = nodeByKeyValue[keyValue]) ***REMOVED***
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue[keyValue] = null;
      ***REMOVED*** else ***REMOVED***
        enter[i] = new EnterNode(parent, data[i]);
      ***REMOVED***
    ***REMOVED***
  
    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) ***REMOVED***
      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) ***REMOVED***
        exit[i] = node;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  var selection_data = function(value, key) ***REMOVED***
    if (!value) ***REMOVED***
      data = new Array(this.size()), j = -1;
      this.each(function(d) ***REMOVED*** data[++j] = d; ***REMOVED***);
      return data;
    ***REMOVED***
  
    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;
  
    if (typeof value !== "function") value = constant$4(value);
  
    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = value.call(parent, parent && parent.__data__, j, parents),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);
  
      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
  
      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) ***REMOVED***
        if (previous = enterGroup[i0]) ***REMOVED***
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  ***REMOVED***;
  
  var selection_exit = function() ***REMOVED***
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  ***REMOVED***;
  
  var selection_merge = function(selection) ***REMOVED***
  
    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) ***REMOVED***
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group0[i] || group1[i]) ***REMOVED***
          merge[i] = node;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    for (; j < m0; ++j) ***REMOVED***
      merges[j] = groups0[j];
    ***REMOVED***
  
    return new Selection(merges, this._parents);
  ***REMOVED***;
  
  var selection_order = function() ***REMOVED***
  
    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) ***REMOVED***
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return this;
  ***REMOVED***;
  
  var selection_sort = function(compare) ***REMOVED***
    if (!compare) compare = ascending$2;
  
    function compareNode(a, b) ***REMOVED***
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    ***REMOVED***
  
    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          sortgroup[i] = node;
        ***REMOVED***
      ***REMOVED***
      sortgroup.sort(compareNode);
    ***REMOVED***
  
    return new Selection(sortgroups, this._parents).order();
  ***REMOVED***;
  
  function ascending$2(a, b) ***REMOVED***
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  ***REMOVED***
  
  var selection_call = function() ***REMOVED***
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  ***REMOVED***;
  
  var selection_nodes = function() ***REMOVED***
    var nodes = new Array(this.size()), i = -1;
    this.each(function() ***REMOVED*** nodes[++i] = this; ***REMOVED***);
    return nodes;
  ***REMOVED***;
  
  var selection_node = function() ***REMOVED***
  
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) ***REMOVED***
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) ***REMOVED***
        var node = group[i];
        if (node) return node;
      ***REMOVED***
    ***REMOVED***
  
    return null;
  ***REMOVED***;
  
  var selection_size = function() ***REMOVED***
    var size = 0;
    this.each(function() ***REMOVED*** ++size; ***REMOVED***);
    return size;
  ***REMOVED***;
  
  var selection_empty = function() ***REMOVED***
    return !this.node();
  ***REMOVED***;
  
  var selection_each = function(callback) ***REMOVED***
  
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) ***REMOVED***
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) ***REMOVED***
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      ***REMOVED***
    ***REMOVED***
  
    return this;
  ***REMOVED***;
  
  function attrRemove(name) ***REMOVED***
    return function() ***REMOVED***
      this.removeAttribute(name);
    ***REMOVED***;
  ***REMOVED***
  
  function attrRemoveNS(fullname) ***REMOVED***
    return function() ***REMOVED***
      this.removeAttributeNS(fullname.space, fullname.local);
    ***REMOVED***;
  ***REMOVED***
  
  function attrConstant(name, value) ***REMOVED***
    return function() ***REMOVED***
      this.setAttribute(name, value);
    ***REMOVED***;
  ***REMOVED***
  
  function attrConstantNS(fullname, value) ***REMOVED***
    return function() ***REMOVED***
      this.setAttributeNS(fullname.space, fullname.local, value);
    ***REMOVED***;
  ***REMOVED***
  
  function attrFunction(name, value) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    ***REMOVED***;
  ***REMOVED***
  
  function attrFunctionNS(fullname, value) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    ***REMOVED***;
  ***REMOVED***
  
  var selection_attr = function(name, value) ***REMOVED***
    var fullname = namespace(name);
  
    if (arguments.length < 2) ***REMOVED***
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    ***REMOVED***
  
    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  ***REMOVED***;
  
  var window = function(node) ***REMOVED***
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  ***REMOVED***;
  
  function styleRemove(name) ***REMOVED***
    return function() ***REMOVED***
      this.style.removeProperty(name);
    ***REMOVED***;
  ***REMOVED***
  
  function styleConstant(name, value, priority) ***REMOVED***
    return function() ***REMOVED***
      this.style.setProperty(name, value, priority);
    ***REMOVED***;
  ***REMOVED***
  
  function styleFunction(name, value, priority) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    ***REMOVED***;
  ***REMOVED***
  
  var selection_style = function(name, value, priority) ***REMOVED***
    var node;
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : window(node = this.node())
            .getComputedStyle(node, null)
            .getPropertyValue(name);
  ***REMOVED***;
  
  function propertyRemove(name) ***REMOVED***
    return function() ***REMOVED***
      delete this[name];
    ***REMOVED***;
  ***REMOVED***
  
  function propertyConstant(name, value) ***REMOVED***
    return function() ***REMOVED***
      this[name] = value;
    ***REMOVED***;
  ***REMOVED***
  
  function propertyFunction(name, value) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    ***REMOVED***;
  ***REMOVED***
  
  var selection_property = function(name, value) ***REMOVED***
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  ***REMOVED***;
  
  function classArray(string) ***REMOVED***
    return string.trim().split(/^|\s+/);
  ***REMOVED***
  
  function classList(node) ***REMOVED***
    return node.classList || new ClassList(node);
  ***REMOVED***
  
  function ClassList(node) ***REMOVED***
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  ***REMOVED***
  
  ClassList.prototype = ***REMOVED***
    add: function(name) ***REMOVED***
      var i = this._names.indexOf(name);
      if (i < 0) ***REMOVED***
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      ***REMOVED***
    ***REMOVED***,
    remove: function(name) ***REMOVED***
      var i = this._names.indexOf(name);
      if (i >= 0) ***REMOVED***
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      ***REMOVED***
    ***REMOVED***,
    contains: function(name) ***REMOVED***
      return this._names.indexOf(name) >= 0;
    ***REMOVED***
  ***REMOVED***;
  
  function classedAdd(node, names) ***REMOVED***
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  ***REMOVED***
  
  function classedRemove(node, names) ***REMOVED***
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  ***REMOVED***
  
  function classedTrue(names) ***REMOVED***
    return function() ***REMOVED***
      classedAdd(this, names);
    ***REMOVED***;
  ***REMOVED***
  
  function classedFalse(names) ***REMOVED***
    return function() ***REMOVED***
      classedRemove(this, names);
    ***REMOVED***;
  ***REMOVED***
  
  function classedFunction(names, value) ***REMOVED***
    return function() ***REMOVED***
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    ***REMOVED***;
  ***REMOVED***
  
  var selection_classed = function(name, value) ***REMOVED***
    var names = classArray(name + "");
  
    if (arguments.length < 2) ***REMOVED***
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    ***REMOVED***
  
    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  ***REMOVED***;
  
  function textRemove() ***REMOVED***
    this.textContent = "";
  ***REMOVED***
  
  function textConstant(value) ***REMOVED***
    return function() ***REMOVED***
      this.textContent = value;
    ***REMOVED***;
  ***REMOVED***
  
  function textFunction(value) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    ***REMOVED***;
  ***REMOVED***
  
  var selection_text = function(value) ***REMOVED***
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  ***REMOVED***;
  
  function htmlRemove() ***REMOVED***
    this.innerHTML = "";
  ***REMOVED***
  
  function htmlConstant(value) ***REMOVED***
    return function() ***REMOVED***
      this.innerHTML = value;
    ***REMOVED***;
  ***REMOVED***
  
  function htmlFunction(value) ***REMOVED***
    return function() ***REMOVED***
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    ***REMOVED***;
  ***REMOVED***
  
  var selection_html = function(value) ***REMOVED***
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  ***REMOVED***;
  
  function raise$1() ***REMOVED***
    if (this.nextSibling) this.parentNode.appendChild(this);
  ***REMOVED***
  
  var selection_raise = function() ***REMOVED***
    return this.each(raise$1);
  ***REMOVED***;
  
  function lower() ***REMOVED***
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  ***REMOVED***
  
  var selection_lower = function() ***REMOVED***
    return this.each(lower);
  ***REMOVED***;
  
  var selection_append = function(name) ***REMOVED***
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() ***REMOVED***
      return this.appendChild(create.apply(this, arguments));
    ***REMOVED***);
  ***REMOVED***;
  
  function constantNull() ***REMOVED***
    return null;
  ***REMOVED***
  
  var selection_insert = function(name, before) ***REMOVED***
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() ***REMOVED***
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    ***REMOVED***);
  ***REMOVED***;
  
  function remove() ***REMOVED***
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  ***REMOVED***
  
  var selection_remove = function() ***REMOVED***
    return this.each(remove);
  ***REMOVED***;
  
  var selection_datum = function(value) ***REMOVED***
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  ***REMOVED***;
  
  function dispatchEvent(node, type, params) ***REMOVED***
    var window$$1 = window(node),
        event = window$$1.CustomEvent;
  
    if (event) ***REMOVED***
      event = new event(type, params);
    ***REMOVED*** else ***REMOVED***
      event = window$$1.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    ***REMOVED***
  
    node.dispatchEvent(event);
  ***REMOVED***
  
  function dispatchConstant(type, params) ***REMOVED***
    return function() ***REMOVED***
      return dispatchEvent(this, type, params);
    ***REMOVED***;
  ***REMOVED***
  
  function dispatchFunction(type, params) ***REMOVED***
    return function() ***REMOVED***
      return dispatchEvent(this, type, params.apply(this, arguments));
    ***REMOVED***;
  ***REMOVED***
  
  var selection_dispatch = function(type, params) ***REMOVED***
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  ***REMOVED***;
  
  var root = [null];
  
  function Selection(groups, parents) ***REMOVED***
    this._groups = groups;
    this._parents = parents;
  ***REMOVED***
  
  function selection() ***REMOVED***
    return new Selection([[document.documentElement]], root);
  ***REMOVED***
  
  Selection.prototype = selection.prototype = ***REMOVED***
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
  ***REMOVED***;
  
  var select = function(selector) ***REMOVED***
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  ***REMOVED***;
  
  var selectAll = function(selector) ***REMOVED***
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([selector == null ? [] : selector], root);
  ***REMOVED***;
  
  var touch = function(node, touches, identifier) ***REMOVED***
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;
  
    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) ***REMOVED***
      if ((touch = touches[i]).identifier === identifier) ***REMOVED***
        return point$5(node, touch);
      ***REMOVED***
    ***REMOVED***
  
    return null;
  ***REMOVED***;
  
  var touches = function(node, touches) ***REMOVED***
    if (touches == null) touches = sourceEvent().touches;
  
    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) ***REMOVED***
      points[i] = point$5(node, touches[i]);
    ***REMOVED***
  
    return points;
  ***REMOVED***;
  
  var emptyOn = dispatch("start", "end", "interrupt");
  var emptyTween = [];
  
  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;
  
  var schedule = function(node, name, id, index, group, timing) ***REMOVED***
    var schedules = node.__transition;
    if (!schedules) node.__transition = ***REMOVED******REMOVED***;
    else if (id in schedules) return;
    create(node, id, ***REMOVED***
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    ***REMOVED***);
  ***REMOVED***;
  
  function init(node, id) ***REMOVED***
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
    return schedule;
  ***REMOVED***
  
  function set$3(node, id) ***REMOVED***
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
    return schedule;
  ***REMOVED***
  
  function get$1(node, id) ***REMOVED***
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
    return schedule;
  ***REMOVED***
  
  function create(node, id, self) ***REMOVED***
    var schedules = node.__transition,
        tween;
  
    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);
  
    function schedule(elapsed) ***REMOVED***
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);
  
      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    ***REMOVED***
  
    function start(elapsed) ***REMOVED***
      var i, j, n, o;
  
      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();
  
      for (i in schedules) ***REMOVED***
        o = schedules[i];
        if (o.name !== self.name) continue;
  
        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);
  
        // Interrupt the active transition, if any.
        // Dispatch the interrupt event.
        if (o.state === RUNNING) ***REMOVED***
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        ***REMOVED***
  
        // Cancel any pre-empted transitions. No interrupt event is dispatched
        // because the cancelled transitions never started. Note that this also
        // removes this transition from the pending list!
        else if (+i < id) ***REMOVED***
          o.state = ENDED;
          o.timer.stop();
          delete schedules[i];
        ***REMOVED***
      ***REMOVED***
  
      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() ***REMOVED***
        if (self.state === STARTED) ***REMOVED***
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        ***REMOVED***
      ***REMOVED***);
  
      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;
  
      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) ***REMOVED***
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) ***REMOVED***
          tween[++j] = o;
        ***REMOVED***
      ***REMOVED***
      tween.length = j + 1;
    ***REMOVED***
  
    function tick(elapsed) ***REMOVED***
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;
  
      while (++i < n) ***REMOVED***
        tween[i].call(null, t);
      ***REMOVED***
  
      // Dispatch the end event.
      if (self.state === ENDING) ***REMOVED***
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      ***REMOVED***
    ***REMOVED***
  
    function stop() ***REMOVED***
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    ***REMOVED***
  ***REMOVED***
  
  var interrupt = function(node, name) ***REMOVED***
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;
  
    if (!schedules) return;
  
    name = name == null ? null : name + "";
  
    for (i in schedules) ***REMOVED***
      if ((schedule = schedules[i]).name !== name) ***REMOVED*** empty = false; continue; ***REMOVED***
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    ***REMOVED***
  
    if (empty) delete node.__transition;
  ***REMOVED***;
  
  var selection_interrupt = function(name) ***REMOVED***
    return this.each(function() ***REMOVED***
      interrupt(this, name);
    ***REMOVED***);
  ***REMOVED***;
  
  function tweenRemove(id, name) ***REMOVED***
    var tween0, tween1;
    return function() ***REMOVED***
      var schedule = set$3(this, id),
          tween = schedule.tween;
  
      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) ***REMOVED***
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) ***REMOVED***
          if (tween1[i].name === name) ***REMOVED***
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
  
      schedule.tween = tween1;
    ***REMOVED***;
  ***REMOVED***
  
  function tweenFunction(id, name, value) ***REMOVED***
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() ***REMOVED***
      var schedule = set$3(this, id),
          tween = schedule.tween;
  
      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) ***REMOVED***
        tween1 = (tween0 = tween).slice();
        for (var t = ***REMOVED***name: name, value: value***REMOVED***, i = 0, n = tween1.length; i < n; ++i) ***REMOVED***
          if (tween1[i].name === name) ***REMOVED***
            tween1[i] = t;
            break;
          ***REMOVED***
        ***REMOVED***
        if (i === n) tween1.push(t);
      ***REMOVED***
  
      schedule.tween = tween1;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_tween = function(name, value) ***REMOVED***
    var id = this._id;
  
    name += "";
  
    if (arguments.length < 2) ***REMOVED***
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) ***REMOVED***
        if ((t = tween[i]).name === name) ***REMOVED***
          return t.value;
        ***REMOVED***
      ***REMOVED***
      return null;
    ***REMOVED***
  
    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  ***REMOVED***;
  
  function tweenValue(transition, name, value) ***REMOVED***
    var id = transition._id;
  
    transition.each(function() ***REMOVED***
      var schedule = set$3(this, id);
      (schedule.value || (schedule.value = ***REMOVED******REMOVED***))[name] = value.apply(this, arguments);
    ***REMOVED***);
  
    return function(node) ***REMOVED***
      return get$1(node, id).value[name];
    ***REMOVED***;
  ***REMOVED***
  
  var interpolate$1 = function(a, b) ***REMOVED***
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  ***REMOVED***;
  
  function attrRemove$1(name) ***REMOVED***
    return function() ***REMOVED***
      this.removeAttribute(name);
    ***REMOVED***;
  ***REMOVED***
  
  function attrRemoveNS$1(fullname) ***REMOVED***
    return function() ***REMOVED***
      this.removeAttributeNS(fullname.space, fullname.local);
    ***REMOVED***;
  ***REMOVED***
  
  function attrConstant$1(name, interpolate$$1, value1) ***REMOVED***
    var value00,
        interpolate0;
    return function() ***REMOVED***
      var value0 = this.getAttribute(name);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value1);
    ***REMOVED***;
  ***REMOVED***
  
  function attrConstantNS$1(fullname, interpolate$$1, value1) ***REMOVED***
    var value00,
        interpolate0;
    return function() ***REMOVED***
      var value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value1);
    ***REMOVED***;
  ***REMOVED***
  
  function attrFunction$1(name, interpolate$$1, value) ***REMOVED***
    var value00,
        value10,
        interpolate0;
    return function() ***REMOVED***
      var value0, value1 = value(this);
      if (value1 == null) return void this.removeAttribute(name);
      value0 = this.getAttribute(name);
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    ***REMOVED***;
  ***REMOVED***
  
  function attrFunctionNS$1(fullname, interpolate$$1, value) ***REMOVED***
    var value00,
        value10,
        interpolate0;
    return function() ***REMOVED***
      var value0, value1 = value(this);
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    ***REMOVED***;
  ***REMOVED***
  
  var transition_attr = function(name, value) ***REMOVED***
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
  ***REMOVED***;
  
  function attrTweenNS(fullname, value) ***REMOVED***
    function tween() ***REMOVED***
      var node = this, i = value.apply(node, arguments);
      return i && function(t) ***REMOVED***
        node.setAttributeNS(fullname.space, fullname.local, i(t));
      ***REMOVED***;
    ***REMOVED***
    tween._value = value;
    return tween;
  ***REMOVED***
  
  function attrTween(name, value) ***REMOVED***
    function tween() ***REMOVED***
      var node = this, i = value.apply(node, arguments);
      return i && function(t) ***REMOVED***
        node.setAttribute(name, i(t));
      ***REMOVED***;
    ***REMOVED***
    tween._value = value;
    return tween;
  ***REMOVED***
  
  var transition_attrTween = function(name, value) ***REMOVED***
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  ***REMOVED***;
  
  function delayFunction(id, value) ***REMOVED***
    return function() ***REMOVED***
      init(this, id).delay = +value.apply(this, arguments);
    ***REMOVED***;
  ***REMOVED***
  
  function delayConstant(id, value) ***REMOVED***
    return value = +value, function() ***REMOVED***
      init(this, id).delay = value;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_delay = function(value) ***REMOVED***
    var id = this._id;
  
    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  ***REMOVED***;
  
  function durationFunction(id, value) ***REMOVED***
    return function() ***REMOVED***
      set$3(this, id).duration = +value.apply(this, arguments);
    ***REMOVED***;
  ***REMOVED***
  
  function durationConstant(id, value) ***REMOVED***
    return value = +value, function() ***REMOVED***
      set$3(this, id).duration = value;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_duration = function(value) ***REMOVED***
    var id = this._id;
  
    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  ***REMOVED***;
  
  function easeConstant(id, value) ***REMOVED***
    if (typeof value !== "function") throw new Error;
    return function() ***REMOVED***
      set$3(this, id).ease = value;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_ease = function(value) ***REMOVED***
    var id = this._id;
  
    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  ***REMOVED***;
  
  var transition_filter = function(match) ***REMOVED***
    if (typeof match !== "function") match = matcher$1(match);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) ***REMOVED***
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) ***REMOVED***
          subgroup.push(node);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Transition(subgroups, this._parents, this._name, this._id);
  ***REMOVED***;
  
  var transition_merge = function(transition) ***REMOVED***
    if (transition._id !== this._id) throw new Error;
  
    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) ***REMOVED***
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group0[i] || group1[i]) ***REMOVED***
          merge[i] = node;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    for (; j < m0; ++j) ***REMOVED***
      merges[j] = groups0[j];
    ***REMOVED***
  
    return new Transition(merges, this._parents, this._name, this._id);
  ***REMOVED***;
  
  function start$1(name) ***REMOVED***
    return (name + "").trim().split(/^|\s+/).every(function(t) ***REMOVED***
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    ***REMOVED***);
  ***REMOVED***
  
  function onFunction(id, name, listener) ***REMOVED***
    var on0, on1, sit = start$1(name) ? init : set$3;
    return function() ***REMOVED***
      var schedule = sit(this, id),
          on = schedule.on;
  
      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
  
      schedule.on = on1;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_on = function(name, listener) ***REMOVED***
    var id = this._id;
  
    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  ***REMOVED***;
  
  function removeFunction(id) ***REMOVED***
    return function() ***REMOVED***
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    ***REMOVED***;
  ***REMOVED***
  
  var transition_remove = function() ***REMOVED***
    return this.on("end.remove", removeFunction(this._id));
  ***REMOVED***;
  
  var transition_select = function(select$$1) ***REMOVED***
    var name = this._name,
        id = this._id;
  
    if (typeof select$$1 !== "function") select$$1 = selector(select$$1);
  
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) ***REMOVED***
        if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) ***REMOVED***
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Transition(subgroups, this._parents, name, id);
  ***REMOVED***;
  
  var transition_selectAll = function(select$$1) ***REMOVED***
    var name = this._name,
        id = this._id;
  
    if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);
  
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) ***REMOVED***
            if (child = children[k]) ***REMOVED***
              schedule(child, name, id, k, children, inherit);
            ***REMOVED***
          ***REMOVED***
          subgroups.push(children);
          parents.push(node);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Transition(subgroups, parents, name, id);
  ***REMOVED***;
  
  var Selection$1 = selection.prototype.constructor;
  
  var transition_selection = function() ***REMOVED***
    return new Selection$1(this._groups, this._parents);
  ***REMOVED***;
  
  function styleRemove$1(name, interpolate$$1) ***REMOVED***
    var value00,
        value10,
        interpolate0;
    return function() ***REMOVED***
      var style = window(this).getComputedStyle(this, null),
          value0 = style.getPropertyValue(name),
          value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    ***REMOVED***;
  ***REMOVED***
  
  function styleRemoveEnd(name) ***REMOVED***
    return function() ***REMOVED***
      this.style.removeProperty(name);
    ***REMOVED***;
  ***REMOVED***
  
  function styleConstant$1(name, interpolate$$1, value1) ***REMOVED***
    var value00,
        interpolate0;
    return function() ***REMOVED***
      var value0 = window(this).getComputedStyle(this, null).getPropertyValue(name);
      return value0 === value1 ? null
          : value0 === value00 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value1);
    ***REMOVED***;
  ***REMOVED***
  
  function styleFunction$1(name, interpolate$$1, value) ***REMOVED***
    var value00,
        value10,
        interpolate0;
    return function() ***REMOVED***
      var style = window(this).getComputedStyle(this, null),
          value0 = style.getPropertyValue(name),
          value1 = value(this);
      if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
      return value0 === value1 ? null
          : value0 === value00 && value1 === value10 ? interpolate0
          : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    ***REMOVED***;
  ***REMOVED***
  
  var transition_style = function(name, value, priority) ***REMOVED***
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
    return value == null ? this
            .styleTween(name, styleRemove$1(name, i))
            .on("end.style." + name, styleRemoveEnd(name))
        : this.styleTween(name, typeof value === "function"
            ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
            : styleConstant$1(name, i, value), priority);
  ***REMOVED***;
  
  function styleTween(name, value, priority) ***REMOVED***
    function tween() ***REMOVED***
      var node = this, i = value.apply(node, arguments);
      return i && function(t) ***REMOVED***
        node.style.setProperty(name, i(t), priority);
      ***REMOVED***;
    ***REMOVED***
    tween._value = value;
    return tween;
  ***REMOVED***
  
  var transition_styleTween = function(name, value, priority) ***REMOVED***
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  ***REMOVED***;
  
  function textConstant$1(value) ***REMOVED***
    return function() ***REMOVED***
      this.textContent = value;
    ***REMOVED***;
  ***REMOVED***
  
  function textFunction$1(value) ***REMOVED***
    return function() ***REMOVED***
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    ***REMOVED***;
  ***REMOVED***
  
  var transition_text = function(value) ***REMOVED***
    return this.tween("text", typeof value === "function"
        ? textFunction$1(tweenValue(this, "text", value))
        : textConstant$1(value == null ? "" : value + ""));
  ***REMOVED***;
  
  var transition_transition = function() ***REMOVED***
    var name = this._name,
        id0 = this._id,
        id1 = newId();
  
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, ***REMOVED***
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Transition(groups, this._parents, name, id1);
  ***REMOVED***;
  
  var id = 0;
  
  function Transition(groups, parents, name, id) ***REMOVED***
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  ***REMOVED***
  
  function transition(name) ***REMOVED***
    return selection().transition(name);
  ***REMOVED***
  
  function newId() ***REMOVED***
    return ++id;
  ***REMOVED***
  
  var selection_prototype = selection.prototype;
  
  Transition.prototype = transition.prototype = ***REMOVED***
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease
  ***REMOVED***;
  
  var defaultTiming = ***REMOVED***
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  ***REMOVED***;
  
  function inherit(node, id) ***REMOVED***
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) ***REMOVED***
      if (!(node = node.parentNode)) ***REMOVED***
        return defaultTiming.time = now(), defaultTiming;
      ***REMOVED***
    ***REMOVED***
    return timing;
  ***REMOVED***
  
  var selection_transition = function(name) ***REMOVED***
    var id,
        timing;
  
    if (name instanceof Transition) ***REMOVED***
      id = name._id, name = name._name;
    ***REMOVED*** else ***REMOVED***
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    ***REMOVED***
  
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) ***REMOVED***
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) ***REMOVED***
        if (node = group[i]) ***REMOVED***
          schedule(node, name, id, i, group, timing || inherit(node, id));
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return new Transition(groups, this._parents, name, id);
  ***REMOVED***;
  
  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;
  
  var root$1 = [null];
  
  var active = function(node, name) ***REMOVED***
    var schedules = node.__transition,
        schedule,
        i;
  
    if (schedules) ***REMOVED***
      name = name == null ? null : name + "";
      for (i in schedules) ***REMOVED***
        if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) ***REMOVED***
          return new Transition([[node]], root$1, name, +i);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return null;
  ***REMOVED***;
  
  var slice$4 = Array.prototype.slice;
  
  var identity$5 = function(x) ***REMOVED***
    return x;
  ***REMOVED***;
  
  var top = 1;
  var right = 2;
  var bottom = 3;
  var left = 4;
  var epsilon$2 = 1e-6;
  
  function translateX(scale0, scale1, d) ***REMOVED***
    var x = scale0(d);
    return "translate(" + (isFinite(x) ? x : scale1(d)) + ",0)";
  ***REMOVED***
  
  function translateY(scale0, scale1, d) ***REMOVED***
    var y = scale0(d);
    return "translate(0," + (isFinite(y) ? y : scale1(d)) + ")";
  ***REMOVED***
  
  function center(scale) ***REMOVED***
    var offset = scale.bandwidth() / 2;
    if (scale.round()) offset = Math.round(offset);
    return function(d) ***REMOVED***
      return scale(d) + offset;
    ***REMOVED***;
  ***REMOVED***
  
  function entering() ***REMOVED***
    return !this.__axis;
  ***REMOVED***
  
  function axis(orient, scale) ***REMOVED***
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3;
  
    function axis(context) ***REMOVED***
      var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
          format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$5) : tickFormat,
          spacing = Math.max(tickSizeInner, 0) + tickPadding,
          transform = orient === top || orient === bottom ? translateX : translateY,
          range = scale.range(),
          range0 = range[0] + 0.5,
          range1 = range[range.length - 1] + 0.5,
          position = (scale.bandwidth ? center : identity$5)(scale.copy()),
          selection = context.selection ? context.selection() : context,
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text"),
          k = orient === top || orient === left ? -1 : 1,
          x, y = orient === left || orient === right ? (x = "x", "y") : (x = "y", "x");
  
      path = path.merge(path.enter().insert("path", ".tick")
          .attr("class", "domain")
          .attr("stroke", "#000"));
  
      tick = tick.merge(tickEnter);
  
      line = line.merge(tickEnter.append("line")
          .attr("stroke", "#000")
          .attr(x + "2", k * tickSizeInner)
          .attr(y + "1", 0.5)
          .attr(y + "2", 0.5));
  
      text = text.merge(tickEnter.append("text")
          .attr("fill", "#000")
          .attr(x, k * spacing)
          .attr(y, 0.5)
          .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));
  
      if (context !== selection) ***REMOVED***
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);
  
        tickExit = tickExit.transition(context)
            .attr("opacity", epsilon$2)
            .attr("transform", function(d) ***REMOVED*** return transform(position, this.parentNode.__axis || position, d); ***REMOVED***);
  
        tickEnter
            .attr("opacity", epsilon$2)
            .attr("transform", function(d) ***REMOVED*** return transform(this.parentNode.__axis || position, position, d); ***REMOVED***);
      ***REMOVED***
  
      tickExit.remove();
  
      path
          .attr("d", orient === left || orient == right
              ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
              : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);
  
      tick
          .attr("opacity", 1)
          .attr("transform", function(d) ***REMOVED*** return transform(position, position, d); ***REMOVED***);
  
      line
          .attr(x + "2", k * tickSizeInner);
  
      text
          .attr(x, k * spacing)
          .text(format);
  
      selection.filter(entering)
          .attr("fill", "none")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
  
      selection
          .each(function() ***REMOVED*** this.__axis = position; ***REMOVED***);
    ***REMOVED***
  
    axis.scale = function(_) ***REMOVED***
      return arguments.length ? (scale = _, axis) : scale;
    ***REMOVED***;
  
    axis.ticks = function() ***REMOVED***
      return tickArguments = slice$4.call(arguments), axis;
    ***REMOVED***;
  
    axis.tickArguments = function(_) ***REMOVED***
      return arguments.length ? (tickArguments = _ == null ? [] : slice$4.call(_), axis) : tickArguments.slice();
    ***REMOVED***;
  
    axis.tickValues = function(_) ***REMOVED***
      return arguments.length ? (tickValues = _ == null ? null : slice$4.call(_), axis) : tickValues && tickValues.slice();
    ***REMOVED***;
  
    axis.tickFormat = function(_) ***REMOVED***
      return arguments.length ? (tickFormat = _, axis) : tickFormat;
    ***REMOVED***;
  
    axis.tickSize = function(_) ***REMOVED***
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    ***REMOVED***;
  
    axis.tickSizeInner = function(_) ***REMOVED***
      return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    ***REMOVED***;
  
    axis.tickSizeOuter = function(_) ***REMOVED***
      return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    ***REMOVED***;
  
    axis.tickPadding = function(_) ***REMOVED***
      return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    ***REMOVED***;
  
    return axis;
  ***REMOVED***
  
  function axisTop(scale) ***REMOVED***
    return axis(top, scale);
  ***REMOVED***
  
  function axisRight(scale) ***REMOVED***
    return axis(right, scale);
  ***REMOVED***
  
  function axisBottom(scale) ***REMOVED***
    return axis(bottom, scale);
  ***REMOVED***
  
  function axisLeft(scale) ***REMOVED***
    return axis(left, scale);
  ***REMOVED***
  
  function defaultSeparation(a, b) ***REMOVED***
    return a.parent === b.parent ? 1 : 2;
  ***REMOVED***
  
  function meanX(children) ***REMOVED***
    return children.reduce(meanXReduce, 0) / children.length;
  ***REMOVED***
  
  function meanXReduce(x, c) ***REMOVED***
    return x + c.x;
  ***REMOVED***
  
  function maxY(children) ***REMOVED***
    return 1 + children.reduce(maxYReduce, 0);
  ***REMOVED***
  
  function maxYReduce(y, c) ***REMOVED***
    return Math.max(y, c.y);
  ***REMOVED***
  
  function leafLeft(node) ***REMOVED***
    var children;
    while (children = node.children) node = children[0];
    return node;
  ***REMOVED***
  
  function leafRight(node) ***REMOVED***
    var children;
    while (children = node.children) node = children[children.length - 1];
    return node;
  ***REMOVED***
  
  var cluster = function() ***REMOVED***
    var separation = defaultSeparation,
        dx = 1,
        dy = 1,
        nodeSize = false;
  
    function cluster(root) ***REMOVED***
      var previousNode,
          x = 0;
  
      // First walk, computing the initial x & y values.
      root.eachAfter(function(node) ***REMOVED***
        var children = node.children;
        if (children) ***REMOVED***
          node.x = meanX(children);
          node.y = maxY(children);
        ***REMOVED*** else ***REMOVED***
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        ***REMOVED***
      ***REMOVED***);
  
      var left = leafLeft(root),
          right = leafRight(root),
          x0 = left.x - separation(left, right) / 2,
          x1 = right.x + separation(right, left) / 2;
  
      // Second walk, normalizing x & y to the desired size.
      return root.eachAfter(nodeSize ? function(node) ***REMOVED***
        node.x = (node.x - root.x) * dx;
        node.y = (root.y - node.y) * dy;
      ***REMOVED*** : function(node) ***REMOVED***
        node.x = (node.x - x0) / (x1 - x0) * dx;
        node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
      ***REMOVED***);
    ***REMOVED***
  
    cluster.separation = function(x) ***REMOVED***
      return arguments.length ? (separation = x, cluster) : separation;
    ***REMOVED***;
  
    cluster.size = function(x) ***REMOVED***
      return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? null : [dx, dy]);
    ***REMOVED***;
  
    cluster.nodeSize = function(x) ***REMOVED***
      return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? [dx, dy] : null);
    ***REMOVED***;
  
    return cluster;
  ***REMOVED***;
  
  var node_each = function(callback) ***REMOVED***
    var node = this, current, next = [node], children, i, n;
    do ***REMOVED***
      current = next.reverse(), next = [];
      while (node = current.pop()) ***REMOVED***
        callback(node), children = node.children;
        if (children) for (i = 0, n = children.length; i < n; ++i) ***REMOVED***
          next.push(children[i]);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED*** while (next.length);
    return this;
  ***REMOVED***;
  
  var node_eachBefore = function(callback) ***REMOVED***
    var node = this, nodes = [node], children, i;
    while (node = nodes.pop()) ***REMOVED***
      callback(node), children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) ***REMOVED***
        nodes.push(children[i]);
      ***REMOVED***
    ***REMOVED***
    return this;
  ***REMOVED***;
  
  var node_eachAfter = function(callback) ***REMOVED***
    var node = this, nodes = [node], next = [], children, i, n;
    while (node = nodes.pop()) ***REMOVED***
      next.push(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) ***REMOVED***
        nodes.push(children[i]);
      ***REMOVED***
    ***REMOVED***
    while (node = next.pop()) ***REMOVED***
      callback(node);
    ***REMOVED***
    return this;
  ***REMOVED***;
  
  var node_sum = function(value) ***REMOVED***
    return this.eachAfter(function(node) ***REMOVED***
      var sum = +value(node.data) || 0,
          children = node.children,
          i = children && children.length;
      while (--i >= 0) sum += children[i].value;
      node.value = sum;
    ***REMOVED***);
  ***REMOVED***;
  
  var node_sort = function(compare) ***REMOVED***
    return this.eachBefore(function(node) ***REMOVED***
      if (node.children) ***REMOVED***
        node.children.sort(compare);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***;
  
  var node_path = function(end) ***REMOVED***
    var start = this,
        ancestor = leastCommonAncestor(start, end),
        nodes = [start];
    while (start !== ancestor) ***REMOVED***
      start = start.parent;
      nodes.push(start);
    ***REMOVED***
    var k = nodes.length;
    while (end !== ancestor) ***REMOVED***
      nodes.splice(k, 0, end);
      end = end.parent;
    ***REMOVED***
    return nodes;
  ***REMOVED***;
  
  function leastCommonAncestor(a, b) ***REMOVED***
    if (a === b) return a;
    var aNodes = a.ancestors(),
        bNodes = b.ancestors(),
        c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) ***REMOVED***
      c = a;
      a = aNodes.pop();
      b = bNodes.pop();
    ***REMOVED***
    return c;
  ***REMOVED***
  
  var node_ancestors = function() ***REMOVED***
    var node = this, nodes = [node];
    while (node = node.parent) ***REMOVED***
      nodes.push(node);
    ***REMOVED***
    return nodes;
  ***REMOVED***;
  
  var node_descendants = function() ***REMOVED***
    var nodes = [];
    this.each(function(node) ***REMOVED***
      nodes.push(node);
    ***REMOVED***);
    return nodes;
  ***REMOVED***;
  
  var node_leaves = function() ***REMOVED***
    var leaves = [];
    this.eachBefore(function(node) ***REMOVED***
      if (!node.children) ***REMOVED***
        leaves.push(node);
      ***REMOVED***
    ***REMOVED***);
    return leaves;
  ***REMOVED***;
  
  var node_links = function() ***REMOVED***
    var root = this, links = [];
    root.each(function(node) ***REMOVED***
      if (node !== root) ***REMOVED*** // Don’t include the root’s parent, if any.
        links.push(***REMOVED***source: node.parent, target: node***REMOVED***);
      ***REMOVED***
    ***REMOVED***);
    return links;
  ***REMOVED***;
  
  function hierarchy(data, children) ***REMOVED***
    var root = new Node(data),
        valued = +data.value && (root.value = data.value),
        node,
        nodes = [root],
        child,
        childs,
        i,
        n;
  
    if (children == null) children = defaultChildren;
  
    while (node = nodes.pop()) ***REMOVED***
      if (valued) node.value = +node.data.value;
      if ((childs = children(node.data)) && (n = childs.length)) ***REMOVED***
        node.children = new Array(n);
        for (i = n - 1; i >= 0; --i) ***REMOVED***
          nodes.push(child = node.children[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    return root.eachBefore(computeHeight);
  ***REMOVED***
  
  function node_copy() ***REMOVED***
    return hierarchy(this).eachBefore(copyData);
  ***REMOVED***
  
  function defaultChildren(d) ***REMOVED***
    return d.children;
  ***REMOVED***
  
  function copyData(node) ***REMOVED***
    node.data = node.data.data;
  ***REMOVED***
  
  function computeHeight(node) ***REMOVED***
    var height = 0;
    do node.height = height;
    while ((node = node.parent) && (node.height < ++height));
  ***REMOVED***
  
  function Node(data) ***REMOVED***
    this.data = data;
    this.depth =
    this.height = 0;
    this.parent = null;
  ***REMOVED***
  
  Node.prototype = hierarchy.prototype = ***REMOVED***
    constructor: Node,
    each: node_each,
    eachAfter: node_eachAfter,
    eachBefore: node_eachBefore,
    sum: node_sum,
    sort: node_sort,
    path: node_path,
    ancestors: node_ancestors,
    descendants: node_descendants,
    leaves: node_leaves,
    links: node_links,
    copy: node_copy
  ***REMOVED***;
  
  function Node$2(value) ***REMOVED***
    this._ = value;
    this.next = null;
  ***REMOVED***
  
  var shuffle$1 = function(array) ***REMOVED***
    var i,
        n = (array = array.slice()).length,
        head = null,
        node = head;
  
    while (n) ***REMOVED***
      var next = new Node$2(array[n - 1]);
      if (node) node = node.next = next;
      else node = head = next;
      array[i] = array[--n];
    ***REMOVED***
  
    return ***REMOVED***
      head: head,
      tail: node
    ***REMOVED***;
  ***REMOVED***;
  
  var enclose = function(circles) ***REMOVED***
    return encloseN(shuffle$1(circles), []);
  ***REMOVED***;
  
  function encloses(a, b) ***REMOVED***
    var dx = b.x - a.x,
        dy = b.y - a.y,
        dr = a.r - b.r;
    return dr * dr + 1e-6 > dx * dx + dy * dy;
  ***REMOVED***
  
  // Returns the smallest circle that contains circles L and intersects circles B.
  function encloseN(L, B) ***REMOVED***
    var circle,
        l0 = null,
        l1 = L.head,
        l2,
        p1;
  
    switch (B.length) ***REMOVED***
      case 1: circle = enclose1(B[0]); break;
      case 2: circle = enclose2(B[0], B[1]); break;
      case 3: circle = enclose3(B[0], B[1], B[2]); break;
    ***REMOVED***
  
    while (l1) ***REMOVED***
      p1 = l1._, l2 = l1.next;
      if (!circle || !encloses(circle, p1)) ***REMOVED***
  
        // Temporarily truncate L before l1.
        if (l0) L.tail = l0, l0.next = null;
        else L.head = L.tail = null;
  
        B.push(p1);
        circle = encloseN(L, B); // Note: reorders L!
        B.pop();
  
        // Move l1 to the front of L and reconnect the truncated list L.
        if (L.head) l1.next = L.head, L.head = l1;
        else l1.next = null, L.head = L.tail = l1;
        l0 = L.tail, l0.next = l2;
  
      ***REMOVED*** else ***REMOVED***
        l0 = l1;
      ***REMOVED***
      l1 = l2;
    ***REMOVED***
  
    L.tail = l0;
    return circle;
  ***REMOVED***
  
  function enclose1(a) ***REMOVED***
    return ***REMOVED***
      x: a.x,
      y: a.y,
      r: a.r
    ***REMOVED***;
  ***REMOVED***
  
  function enclose2(a, b) ***REMOVED***
    var x1 = a.x, y1 = a.y, r1 = a.r,
        x2 = b.x, y2 = b.y, r2 = b.r,
        x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1,
        l = Math.sqrt(x21 * x21 + y21 * y21);
    return ***REMOVED***
      x: (x1 + x2 + x21 / l * r21) / 2,
      y: (y1 + y2 + y21 / l * r21) / 2,
      r: (l + r1 + r2) / 2
    ***REMOVED***;
  ***REMOVED***
  
  function enclose3(a, b, c) ***REMOVED***
    var x1 = a.x, y1 = a.y, r1 = a.r,
        x2 = b.x, y2 = b.y, r2 = b.r,
        x3 = c.x, y3 = c.y, r3 = c.r,
        a2 = 2 * (x1 - x2),
        b2 = 2 * (y1 - y2),
        c2 = 2 * (r2 - r1),
        d2 = x1 * x1 + y1 * y1 - r1 * r1 - x2 * x2 - y2 * y2 + r2 * r2,
        a3 = 2 * (x1 - x3),
        b3 = 2 * (y1 - y3),
        c3 = 2 * (r3 - r1),
        d3 = x1 * x1 + y1 * y1 - r1 * r1 - x3 * x3 - y3 * y3 + r3 * r3,
        ab = a3 * b2 - a2 * b3,
        xa = (b2 * d3 - b3 * d2) / ab - x1,
        xb = (b3 * c2 - b2 * c3) / ab,
        ya = (a3 * d2 - a2 * d3) / ab - y1,
        yb = (a2 * c3 - a3 * c2) / ab,
        A = xb * xb + yb * yb - 1,
        B = 2 * (xa * xb + ya * yb + r1),
        C = xa * xa + ya * ya - r1 * r1,
        r = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    return ***REMOVED***
      x: xa + xb * r + x1,
      y: ya + yb * r + y1,
      r: r
    ***REMOVED***;
  ***REMOVED***
  
  function place(a, b, c) ***REMOVED***
    var ax = a.x,
        ay = a.y,
        da = b.r + c.r,
        db = a.r + c.r,
        dx = b.x - ax,
        dy = b.y - ay,
        dc = dx * dx + dy * dy;
    if (dc) ***REMOVED***
      var x = 0.5 + ((db *= db) - (da *= da)) / (2 * dc),
          y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = ax + x * dx + y * dy;
      c.y = ay + x * dy - y * dx;
    ***REMOVED*** else ***REMOVED***
      c.x = ax + db;
      c.y = ay;
    ***REMOVED***
  ***REMOVED***
  
  function intersects(a, b) ***REMOVED***
    var dx = b.x - a.x,
        dy = b.y - a.y,
        dr = a.r + b.r;
    return dr * dr > dx * dx + dy * dy;
  ***REMOVED***
  
  function distance2(circle, x, y) ***REMOVED***
    var dx = circle.x - x,
        dy = circle.y - y;
    return dx * dx + dy * dy;
  ***REMOVED***
  
  function Node$1(circle) ***REMOVED***
    this._ = circle;
    this.next = null;
    this.previous = null;
  ***REMOVED***
  
  function packEnclose(circles) ***REMOVED***
    if (!(n = circles.length)) return 0;
  
    var a, b, c, n;
  
    // Place the first circle.
    a = circles[0], a.x = 0, a.y = 0;
    if (!(n > 1)) return a.r;
  
    // Place the second circle.
    b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
    if (!(n > 2)) return a.r + b.r;
  
    // Place the third circle.
    place(b, a, c = circles[2]);
  
    // Initialize the weighted centroid.
    var aa = a.r * a.r,
        ba = b.r * b.r,
        ca = c.r * c.r,
        oa = aa + ba + ca,
        ox = aa * a.x + ba * b.x + ca * c.x,
        oy = aa * a.y + ba * b.y + ca * c.y,
        cx, cy, i, j, k, sj, sk;
  
    // Initialize the front-chain using the first three circles a, b and c.
    a = new Node$1(a), b = new Node$1(b), c = new Node$1(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;
  
    // Attempt to place each remaining circle…
    pack: for (i = 3; i < n; ++i) ***REMOVED***
      place(a._, b._, c = circles[i]), c = new Node$1(c);
  
      // If there are only three elements in the front-chain…
      if ((k = a.previous) === (j = b.next)) ***REMOVED***
        // If the new circle intersects the third circle,
        // rotate the front chain to try the next position.
        if (intersects(j._, c._)) ***REMOVED***
          a = b, b = j, --i;
          continue pack;
        ***REMOVED***
      ***REMOVED***
  
      // Find the closest intersecting circle on the front-chain, if any.
      else ***REMOVED***
        sj = j._.r, sk = k._.r;
        do ***REMOVED***
          if (sj <= sk) ***REMOVED***
            if (intersects(j._, c._)) ***REMOVED***
              b = j, a.next = b, b.previous = a, --i;
              continue pack;
            ***REMOVED***
            j = j.next, sj += j._.r;
          ***REMOVED*** else ***REMOVED***
            if (intersects(k._, c._)) ***REMOVED***
              a = k, a.next = b, b.previous = a, --i;
              continue pack;
            ***REMOVED***
            k = k.previous, sk += k._.r;
          ***REMOVED***
        ***REMOVED*** while (j !== k.next);
      ***REMOVED***
  
      // Success! Insert the new circle c between a and b.
      c.previous = a, c.next = b, a.next = b.previous = b = c;
  
      // Update the weighted centroid.
      oa += ca = c._.r * c._.r;
      ox += ca * c._.x;
      oy += ca * c._.y;
  
      // Compute the new closest circle a to centroid.
      aa = distance2(a._, cx = ox / oa, cy = oy / oa);
      while ((c = c.next) !== b) ***REMOVED***
        if ((ca = distance2(c._, cx, cy)) < aa) ***REMOVED***
          a = c, aa = ca;
        ***REMOVED***
      ***REMOVED***
      b = a.next;
    ***REMOVED***
  
    // Compute the enclosing circle of the front chain.
    a = [b._], c = b; while ((c = c.next) !== b) a.push(c._); c = enclose(a);
  
    // Translate the circles to put the enclosing circle around the origin.
    for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;
  
    return c.r;
  ***REMOVED***
  
  var siblings = function(circles) ***REMOVED***
    packEnclose(circles);
    return circles;
  ***REMOVED***;
  
  function optional(f) ***REMOVED***
    return f == null ? null : required(f);
  ***REMOVED***
  
  function required(f) ***REMOVED***
    if (typeof f !== "function") throw new Error;
    return f;
  ***REMOVED***
  
  function constantZero() ***REMOVED***
    return 0;
  ***REMOVED***
  
  var constant$5 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function defaultRadius(d) ***REMOVED***
    return Math.sqrt(d.value);
  ***REMOVED***
  
  var index = function() ***REMOVED***
    var radius = null,
        dx = 1,
        dy = 1,
        padding = constantZero;
  
    function pack(root) ***REMOVED***
      root.x = dx / 2, root.y = dy / 2;
      if (radius) ***REMOVED***
        root.eachBefore(radiusLeaf(radius))
            .eachAfter(packChildren(padding, 0.5))
            .eachBefore(translateChild(1));
      ***REMOVED*** else ***REMOVED***
        root.eachBefore(radiusLeaf(defaultRadius))
            .eachAfter(packChildren(constantZero, 1))
            .eachAfter(packChildren(padding, root.r / Math.min(dx, dy)))
            .eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
      ***REMOVED***
      return root;
    ***REMOVED***
  
    pack.radius = function(x) ***REMOVED***
      return arguments.length ? (radius = optional(x), pack) : radius;
    ***REMOVED***;
  
    pack.size = function(x) ***REMOVED***
      return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
    ***REMOVED***;
  
    pack.padding = function(x) ***REMOVED***
      return arguments.length ? (padding = typeof x === "function" ? x : constant$5(+x), pack) : padding;
    ***REMOVED***;
  
    return pack;
  ***REMOVED***;
  
  function radiusLeaf(radius) ***REMOVED***
    return function(node) ***REMOVED***
      if (!node.children) ***REMOVED***
        node.r = Math.max(0, +radius(node) || 0);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function packChildren(padding, k) ***REMOVED***
    return function(node) ***REMOVED***
      if (children = node.children) ***REMOVED***
        var children,
            i,
            n = children.length,
            r = padding(node) * k || 0,
            e;
  
        if (r) for (i = 0; i < n; ++i) children[i].r += r;
        e = packEnclose(children);
        if (r) for (i = 0; i < n; ++i) children[i].r -= r;
        node.r = e + r;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function translateChild(k) ***REMOVED***
    return function(node) ***REMOVED***
      var parent = node.parent;
      node.r *= k;
      if (parent) ***REMOVED***
        node.x = parent.x + k * node.x;
        node.y = parent.y + k * node.y;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  var roundNode = function(node) ***REMOVED***
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
  ***REMOVED***;
  
  var treemapDice = function(parent, x0, y0, x1, y1) ***REMOVED***
    var nodes = parent.children,
        node,
        i = -1,
        n = nodes.length,
        k = parent.value && (x1 - x0) / parent.value;
  
    while (++i < n) ***REMOVED***
      node = nodes[i], node.y0 = y0, node.y1 = y1;
      node.x0 = x0, node.x1 = x0 += node.value * k;
    ***REMOVED***
  ***REMOVED***;
  
  var partition = function() ***REMOVED***
    var dx = 1,
        dy = 1,
        padding = 0,
        round = false;
  
    function partition(root) ***REMOVED***
      var n = root.height + 1;
      root.x0 =
      root.y0 = padding;
      root.x1 = dx;
      root.y1 = dy / n;
      root.eachBefore(positionNode(dy, n));
      if (round) root.eachBefore(roundNode);
      return root;
    ***REMOVED***
  
    function positionNode(dy, n) ***REMOVED***
      return function(node) ***REMOVED***
        if (node.children) ***REMOVED***
          treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
        ***REMOVED***
        var x0 = node.x0,
            y0 = node.y0,
            x1 = node.x1 - padding,
            y1 = node.y1 - padding;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
      ***REMOVED***;
    ***REMOVED***
  
    partition.round = function(x) ***REMOVED***
      return arguments.length ? (round = !!x, partition) : round;
    ***REMOVED***;
  
    partition.size = function(x) ***REMOVED***
      return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
    ***REMOVED***;
  
    partition.padding = function(x) ***REMOVED***
      return arguments.length ? (padding = +x, partition) : padding;
    ***REMOVED***;
  
    return partition;
  ***REMOVED***;
  
  var keyPrefix$1 = "$";
  var preroot = ***REMOVED***depth: -1***REMOVED***;
  var ambiguous = ***REMOVED******REMOVED***;
  
  function defaultId(d) ***REMOVED***
    return d.id;
  ***REMOVED***
  
  function defaultParentId(d) ***REMOVED***
    return d.parentId;
  ***REMOVED***
  
  var stratify = function() ***REMOVED***
    var id = defaultId,
        parentId = defaultParentId;
  
    function stratify(data) ***REMOVED***
      var d,
          i,
          n = data.length,
          root,
          parent,
          node,
          nodes = new Array(n),
          nodeId,
          nodeKey,
          nodeByKey = ***REMOVED******REMOVED***;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        d = data[i], node = nodes[i] = new Node(d);
        if ((nodeId = id(d, i, data)) != null && (nodeId += "")) ***REMOVED***
          nodeKey = keyPrefix$1 + (node.id = nodeId);
          nodeByKey[nodeKey] = nodeKey in nodeByKey ? ambiguous : node;
        ***REMOVED***
      ***REMOVED***
  
      for (i = 0; i < n; ++i) ***REMOVED***
        node = nodes[i], nodeId = parentId(data[i], i, data);
        if (nodeId == null || !(nodeId += "")) ***REMOVED***
          if (root) throw new Error("multiple roots");
          root = node;
        ***REMOVED*** else ***REMOVED***
          parent = nodeByKey[keyPrefix$1 + nodeId];
          if (!parent) throw new Error("missing: " + nodeId);
          if (parent === ambiguous) throw new Error("ambiguous: " + nodeId);
          if (parent.children) parent.children.push(node);
          else parent.children = [node];
          node.parent = parent;
        ***REMOVED***
      ***REMOVED***
  
      if (!root) throw new Error("no root");
      root.parent = preroot;
      root.eachBefore(function(node) ***REMOVED*** node.depth = node.parent.depth + 1; --n; ***REMOVED***).eachBefore(computeHeight);
      root.parent = null;
      if (n > 0) throw new Error("cycle");
  
      return root;
    ***REMOVED***
  
    stratify.id = function(x) ***REMOVED***
      return arguments.length ? (id = required(x), stratify) : id;
    ***REMOVED***;
  
    stratify.parentId = function(x) ***REMOVED***
      return arguments.length ? (parentId = required(x), stratify) : parentId;
    ***REMOVED***;
  
    return stratify;
  ***REMOVED***;
  
  function defaultSeparation$1(a, b) ***REMOVED***
    return a.parent === b.parent ? 1 : 2;
  ***REMOVED***
  
  // function radialSeparation(a, b) ***REMOVED***
  //   return (a.parent === b.parent ? 1 : 2) / a.depth;
  // ***REMOVED***
  
  // This function is used to traverse the left contour of a subtree (or
  // subforest). It returns the successor of v on this contour. This successor is
  // either given by the leftmost child of v or by the thread of v. The function
  // returns null if and only if v is on the highest level of its subtree.
  function nextLeft(v) ***REMOVED***
    var children = v.children;
    return children ? children[0] : v.t;
  ***REMOVED***
  
  // This function works analogously to nextLeft.
  function nextRight(v) ***REMOVED***
    var children = v.children;
    return children ? children[children.length - 1] : v.t;
  ***REMOVED***
  
  // Shifts the current subtree rooted at w+. This is done by increasing
  // prelim(w+) and mod(w+) by shift.
  function moveSubtree(wm, wp, shift) ***REMOVED***
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  ***REMOVED***
  
  // All other shifts, applied to the smaller subtrees between w- and w+, are
  // performed by this function. To prepare the shifts, we have to adjust
  // change(w+), shift(w+), and change(w-).
  function executeShifts(v) ***REMOVED***
    var shift = 0,
        change = 0,
        children = v.children,
        i = children.length,
        w;
    while (--i >= 0) ***REMOVED***
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    ***REMOVED***
  ***REMOVED***
  
  // If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
  // returns the specified (default) ancestor.
  function nextAncestor(vim, v, ancestor) ***REMOVED***
    return vim.a.parent === v.parent ? vim.a : ancestor;
  ***REMOVED***
  
  function TreeNode(node, i) ***REMOVED***
    this._ = node;
    this.parent = null;
    this.children = null;
    this.A = null; // default ancestor
    this.a = this; // ancestor
    this.z = 0; // prelim
    this.m = 0; // mod
    this.c = 0; // change
    this.s = 0; // shift
    this.t = null; // thread
    this.i = i; // number
  ***REMOVED***
  
  TreeNode.prototype = Object.create(Node.prototype);
  
  function treeRoot(root) ***REMOVED***
    var tree = new TreeNode(root, 0),
        node,
        nodes = [tree],
        child,
        children,
        i,
        n;
  
    while (node = nodes.pop()) ***REMOVED***
      if (children = node._.children) ***REMOVED***
        node.children = new Array(n = children.length);
        for (i = n - 1; i >= 0; --i) ***REMOVED***
          nodes.push(child = node.children[i] = new TreeNode(children[i], i));
          child.parent = node;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    (tree.parent = new TreeNode(null, 0)).children = [tree];
    return tree;
  ***REMOVED***
  
  // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
  var tree = function() ***REMOVED***
    var separation = defaultSeparation$1,
        dx = 1,
        dy = 1,
        nodeSize = null;
  
    function tree(root) ***REMOVED***
      var t = treeRoot(root);
  
      // Compute the layout using Buchheim et al.’s algorithm.
      t.eachAfter(firstWalk), t.parent.m = -t.z;
      t.eachBefore(secondWalk);
  
      // If a fixed node size is specified, scale x and y.
      if (nodeSize) root.eachBefore(sizeNode);
  
      // If a fixed tree size is specified, scale x and y based on the extent.
      // Compute the left-most, right-most, and depth-most nodes for extents.
      else ***REMOVED***
        var left = root,
            right = root,
            bottom = root;
        root.eachBefore(function(node) ***REMOVED***
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        ***REMOVED***);
        var s = left === right ? 1 : separation(left, right) / 2,
            tx = s - left.x,
            kx = dx / (right.x + s + tx),
            ky = dy / (bottom.depth || 1);
        root.eachBefore(function(node) ***REMOVED***
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        ***REMOVED***);
      ***REMOVED***
  
      return root;
    ***REMOVED***
  
    // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
    // applied recursively to the children of v, as well as the function
    // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
    // node v is placed to the midpoint of its outermost children.
    function firstWalk(v) ***REMOVED***
      var children = v.children,
          siblings = v.parent.children,
          w = v.i ? siblings[v.i - 1] : null;
      if (children) ***REMOVED***
        executeShifts(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) ***REMOVED***
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        ***REMOVED*** else ***REMOVED***
          v.z = midpoint;
        ***REMOVED***
      ***REMOVED*** else if (w) ***REMOVED***
        v.z = w.z + separation(v._, w._);
      ***REMOVED***
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    ***REMOVED***
  
    // Computes all real x-coordinates by summing up the modifiers recursively.
    function secondWalk(v) ***REMOVED***
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    ***REMOVED***
  
    // The core of the algorithm. Here, a new subtree is combined with the
    // previous subtrees. Threads are used to traverse the inside and outside
    // contours of the left and right subtree up to the highest common level. The
    // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
    // superscript o means outside and i means inside, the subscript - means left
    // subtree and + means right subtree. For summing up the modifiers along the
    // contour, we use respective variables si+, si-, so-, and so+. Whenever two
    // nodes of the inside contours conflict, we compute the left one of the
    // greatest uncommon ancestors using the function ANCESTOR and call MOVE
    // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
    // Finally, we add a new thread (if necessary).
    function apportion(v, w, ancestor) ***REMOVED***
      if (w) ***REMOVED***
        var vip = v,
            vop = v,
            vim = w,
            vom = vip.parent.children[0],
            sip = vip.m,
            sop = vop.m,
            sim = vim.m,
            som = vom.m,
            shift;
        while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) ***REMOVED***
          vom = nextLeft(vom);
          vop = nextRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) ***REMOVED***
            moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          ***REMOVED***
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        ***REMOVED***
        if (vim && !nextRight(vop)) ***REMOVED***
          vop.t = vim;
          vop.m += sim - sop;
        ***REMOVED***
        if (vip && !nextLeft(vom)) ***REMOVED***
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        ***REMOVED***
      ***REMOVED***
      return ancestor;
    ***REMOVED***
  
    function sizeNode(node) ***REMOVED***
      node.x *= dx;
      node.y = node.depth * dy;
    ***REMOVED***
  
    tree.separation = function(x) ***REMOVED***
      return arguments.length ? (separation = x, tree) : separation;
    ***REMOVED***;
  
    tree.size = function(x) ***REMOVED***
      return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : (nodeSize ? null : [dx, dy]);
    ***REMOVED***;
  
    tree.nodeSize = function(x) ***REMOVED***
      return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : (nodeSize ? [dx, dy] : null);
    ***REMOVED***;
  
    return tree;
  ***REMOVED***;
  
  var treemapSlice = function(parent, x0, y0, x1, y1) ***REMOVED***
    var nodes = parent.children,
        node,
        i = -1,
        n = nodes.length,
        k = parent.value && (y1 - y0) / parent.value;
  
    while (++i < n) ***REMOVED***
      node = nodes[i], node.x0 = x0, node.x1 = x1;
      node.y0 = y0, node.y1 = y0 += node.value * k;
    ***REMOVED***
  ***REMOVED***;
  
  var phi = (1 + Math.sqrt(5)) / 2;
  
  function squarifyRatio(ratio, parent, x0, y0, x1, y1) ***REMOVED***
    var rows = [],
        nodes = parent.children,
        row,
        nodeValue,
        i0 = 0,
        i1 = 0,
        n = nodes.length,
        dx, dy,
        value = parent.value,
        sumValue,
        minValue,
        maxValue,
        newRatio,
        minRatio,
        alpha,
        beta;
  
    while (i0 < n) ***REMOVED***
      dx = x1 - x0, dy = y1 - y0;
  
      // Find the next non-empty node.
      do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
      minValue = maxValue = sumValue;
      alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
      beta = sumValue * sumValue * alpha;
      minRatio = Math.max(maxValue / beta, beta / minValue);
  
      // Keep adding nodes while the aspect ratio maintains or improves.
      for (; i1 < n; ++i1) ***REMOVED***
        sumValue += nodeValue = nodes[i1].value;
        if (nodeValue < minValue) minValue = nodeValue;
        if (nodeValue > maxValue) maxValue = nodeValue;
        beta = sumValue * sumValue * alpha;
        newRatio = Math.max(maxValue / beta, beta / minValue);
        if (newRatio > minRatio) ***REMOVED*** sumValue -= nodeValue; break; ***REMOVED***
        minRatio = newRatio;
      ***REMOVED***
  
      // Position and record the row orientation.
      rows.push(row = ***REMOVED***value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)***REMOVED***);
      if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
      else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
      value -= sumValue, i0 = i1;
    ***REMOVED***
  
    return rows;
  ***REMOVED***
  
  var squarify = ((function custom(ratio) ***REMOVED***
  
    function squarify(parent, x0, y0, x1, y1) ***REMOVED***
      squarifyRatio(ratio, parent, x0, y0, x1, y1);
    ***REMOVED***
  
    squarify.ratio = function(x) ***REMOVED***
      return custom((x = +x) > 1 ? x : 1);
    ***REMOVED***;
  
    return squarify;
  ***REMOVED***))(phi);
  
  var index$1 = function() ***REMOVED***
    var tile = squarify,
        round = false,
        dx = 1,
        dy = 1,
        paddingStack = [0],
        paddingInner = constantZero,
        paddingTop = constantZero,
        paddingRight = constantZero,
        paddingBottom = constantZero,
        paddingLeft = constantZero;
  
    function treemap(root) ***REMOVED***
      root.x0 =
      root.y0 = 0;
      root.x1 = dx;
      root.y1 = dy;
      root.eachBefore(positionNode);
      paddingStack = [0];
      if (round) root.eachBefore(roundNode);
      return root;
    ***REMOVED***
  
    function positionNode(node) ***REMOVED***
      var p = paddingStack[node.depth],
          x0 = node.x0 + p,
          y0 = node.y0 + p,
          x1 = node.x1 - p,
          y1 = node.y1 - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
      if (node.children) ***REMOVED***
        p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
        x0 += paddingLeft(node) - p;
        y0 += paddingTop(node) - p;
        x1 -= paddingRight(node) - p;
        y1 -= paddingBottom(node) - p;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        tile(node, x0, y0, x1, y1);
      ***REMOVED***
    ***REMOVED***
  
    treemap.round = function(x) ***REMOVED***
      return arguments.length ? (round = !!x, treemap) : round;
    ***REMOVED***;
  
    treemap.size = function(x) ***REMOVED***
      return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
    ***REMOVED***;
  
    treemap.tile = function(x) ***REMOVED***
      return arguments.length ? (tile = required(x), treemap) : tile;
    ***REMOVED***;
  
    treemap.padding = function(x) ***REMOVED***
      return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
    ***REMOVED***;
  
    treemap.paddingInner = function(x) ***REMOVED***
      return arguments.length ? (paddingInner = typeof x === "function" ? x : constant$5(+x), treemap) : paddingInner;
    ***REMOVED***;
  
    treemap.paddingOuter = function(x) ***REMOVED***
      return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
    ***REMOVED***;
  
    treemap.paddingTop = function(x) ***REMOVED***
      return arguments.length ? (paddingTop = typeof x === "function" ? x : constant$5(+x), treemap) : paddingTop;
    ***REMOVED***;
  
    treemap.paddingRight = function(x) ***REMOVED***
      return arguments.length ? (paddingRight = typeof x === "function" ? x : constant$5(+x), treemap) : paddingRight;
    ***REMOVED***;
  
    treemap.paddingBottom = function(x) ***REMOVED***
      return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant$5(+x), treemap) : paddingBottom;
    ***REMOVED***;
  
    treemap.paddingLeft = function(x) ***REMOVED***
      return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant$5(+x), treemap) : paddingLeft;
    ***REMOVED***;
  
    return treemap;
  ***REMOVED***;
  
  var binary = function(parent, x0, y0, x1, y1) ***REMOVED***
    var nodes = parent.children,
        i, n = nodes.length,
        sum, sums = new Array(n + 1);
  
    for (sums[0] = sum = i = 0; i < n; ++i) ***REMOVED***
      sums[i + 1] = sum += nodes[i].value;
    ***REMOVED***
  
    partition(0, n, parent.value, x0, y0, x1, y1);
  
    function partition(i, j, value, x0, y0, x1, y1) ***REMOVED***
      if (i >= j - 1) ***REMOVED***
        var node = nodes[i];
        node.x0 = x0, node.y0 = y0;
        node.x1 = x1, node.y1 = y1;
        return;
      ***REMOVED***
  
      var valueOffset = sums[i],
          valueTarget = (value / 2) + valueOffset,
          k = i + 1,
          hi = j - 1;
  
      while (k < hi) ***REMOVED***
        var mid = k + hi >>> 1;
        if (sums[mid] < valueTarget) k = mid + 1;
        else hi = mid;
      ***REMOVED***
  
      var valueLeft = sums[k] - valueOffset,
          valueRight = value - valueLeft;
  
      if ((y1 - y0) > (x1 - x0)) ***REMOVED***
        var yk = (y0 * valueRight + y1 * valueLeft) / value;
        partition(i, k, valueLeft, x0, y0, x1, yk);
        partition(k, j, valueRight, x0, yk, x1, y1);
      ***REMOVED*** else ***REMOVED***
        var xk = (x0 * valueRight + x1 * valueLeft) / value;
        partition(i, k, valueLeft, x0, y0, xk, y1);
        partition(k, j, valueRight, xk, y0, x1, y1);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  
  var sliceDice = function(parent, x0, y0, x1, y1) ***REMOVED***
    (parent.depth & 1 ? treemapSlice : treemapDice)(parent, x0, y0, x1, y1);
  ***REMOVED***;
  
  var resquarify = ((function custom(ratio) ***REMOVED***
  
    function resquarify(parent, x0, y0, x1, y1) ***REMOVED***
      if ((rows = parent._squarify) && (rows.ratio === ratio)) ***REMOVED***
        var rows,
            row,
            nodes,
            i,
            j = -1,
            n,
            m = rows.length,
            value = parent.value;
  
        while (++j < m) ***REMOVED***
          row = rows[j], nodes = row.children;
          for (i = row.value = 0, n = nodes.length; i < n; ++i) row.value += nodes[i].value;
          if (row.dice) treemapDice(row, x0, y0, x1, y0 += (y1 - y0) * row.value / value);
          else treemapSlice(row, x0, y0, x0 += (x1 - x0) * row.value / value, y1);
          value -= row.value;
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        parent._squarify = rows = squarifyRatio(ratio, parent, x0, y0, x1, y1);
        rows.ratio = ratio;
      ***REMOVED***
    ***REMOVED***
  
    resquarify.ratio = function(x) ***REMOVED***
      return custom((x = +x) > 1 ? x : 1);
    ***REMOVED***;
  
    return resquarify;
  ***REMOVED***))(phi);
  
  var center$1 = function(x, y) ***REMOVED***
    var nodes;
  
    if (x == null) x = 0;
    if (y == null) y = 0;
  
    function force() ***REMOVED***
      var i,
          n = nodes.length,
          node,
          sx = 0,
          sy = 0;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        node = nodes[i], sx += node.x, sy += node.y;
      ***REMOVED***
  
      for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) ***REMOVED***
        node = nodes[i], node.x -= sx, node.y -= sy;
      ***REMOVED***
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
    ***REMOVED***;
  
    force.x = function(_) ***REMOVED***
      return arguments.length ? (x = +_, force) : x;
    ***REMOVED***;
  
    force.y = function(_) ***REMOVED***
      return arguments.length ? (y = +_, force) : y;
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  var constant$6 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var jiggle = function() ***REMOVED***
    return (Math.random() - 0.5) * 1e-6;
  ***REMOVED***;
  
  function x$1(d) ***REMOVED***
    return d.x + d.vx;
  ***REMOVED***
  
  function y$1(d) ***REMOVED***
    return d.y + d.vy;
  ***REMOVED***
  
  var collide = function(radius) ***REMOVED***
    var nodes,
        radii,
        strength = 1,
        iterations = 1;
  
    if (typeof radius !== "function") radius = constant$6(radius == null ? 1 : +radius);
  
    function force() ***REMOVED***
      var i, n = nodes.length,
          tree,
          node,
          xi,
          yi,
          ri,
          ri2;
  
      for (var k = 0; k < iterations; ++k) ***REMOVED***
        tree = quadtree(nodes, x$1, y$1).visitAfter(prepare);
        for (i = 0; i < n; ++i) ***REMOVED***
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          yi = node.y + node.vy;
          tree.visit(apply);
        ***REMOVED***
      ***REMOVED***
  
      function apply(quad, x0, y0, x1, y1) ***REMOVED***
        var data = quad.data, rj = quad.r, r = ri + rj;
        if (data) ***REMOVED***
          if (data.index > node.index) ***REMOVED***
            var x = xi - data.x - data.vx,
                y = yi - data.y - data.vy,
                l = x * x + y * y;
            if (l < r * r) ***REMOVED***
              if (x === 0) x = jiggle(), l += x * x;
              if (y === 0) y = jiggle(), l += y * y;
              l = (r - (l = Math.sqrt(l))) / l * strength;
              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
              node.vy += (y *= l) * r;
              data.vx -= x * (r = 1 - r);
              data.vy -= y * r;
            ***REMOVED***
          ***REMOVED***
          return;
        ***REMOVED***
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      ***REMOVED***
    ***REMOVED***
  
    function prepare(quad) ***REMOVED***
      if (quad.data) return quad.r = radii[quad.data.index];
      for (var i = quad.r = 0; i < 4; ++i) ***REMOVED***
        if (quad[i] && quad[i].r > quad.r) ***REMOVED***
          quad.r = quad[i].r;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function initialize() ***REMOVED***
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
      initialize();
    ***REMOVED***;
  
    force.iterations = function(_) ***REMOVED***
      return arguments.length ? (iterations = +_, force) : iterations;
    ***REMOVED***;
  
    force.strength = function(_) ***REMOVED***
      return arguments.length ? (strength = +_, force) : strength;
    ***REMOVED***;
  
    force.radius = function(_) ***REMOVED***
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : radius;
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  function index$2(d) ***REMOVED***
    return d.index;
  ***REMOVED***
  
  function find(nodeById, nodeId) ***REMOVED***
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("missing: " + nodeId);
    return node;
  ***REMOVED***
  
  var link = function(links) ***REMOVED***
    var id = index$2,
        strength = defaultStrength,
        strengths,
        distance = constant$6(30),
        distances,
        nodes,
        count,
        bias,
        iterations = 1;
  
    if (links == null) links = [];
  
    function defaultStrength(link) ***REMOVED***
      return 1 / Math.min(count[link.source.index], count[link.target.index]);
    ***REMOVED***
  
    function force(alpha) ***REMOVED***
      for (var k = 0, n = links.length; k < iterations; ++k) ***REMOVED***
        for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) ***REMOVED***
          link = links[i], source = link.source, target = link.target;
          x = target.x + target.vx - source.x - source.vx || jiggle();
          y = target.y + target.vy - source.y - source.vy || jiggle();
          l = Math.sqrt(x * x + y * y);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x *= l, y *= l;
          target.vx -= x * (b = bias[i]);
          target.vy -= y * b;
          source.vx += x * (b = 1 - b);
          source.vy += y * b;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function initialize() ***REMOVED***
      if (!nodes) return;
  
      var i,
          n = nodes.length,
          m = links.length,
          nodeById = map$1(nodes, id),
          link;
  
      for (i = 0, count = new Array(n); i < m; ++i) ***REMOVED***
        link = links[i], link.index = i;
        if (typeof link.source !== "object") link.source = find(nodeById, link.source);
        if (typeof link.target !== "object") link.target = find(nodeById, link.target);
        count[link.source.index] = (count[link.source.index] || 0) + 1;
        count[link.target.index] = (count[link.target.index] || 0) + 1;
      ***REMOVED***
  
      for (i = 0, bias = new Array(m); i < m; ++i) ***REMOVED***
        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
      ***REMOVED***
  
      strengths = new Array(m), initializeStrength();
      distances = new Array(m), initializeDistance();
    ***REMOVED***
  
    function initializeStrength() ***REMOVED***
      if (!nodes) return;
  
      for (var i = 0, n = links.length; i < n; ++i) ***REMOVED***
        strengths[i] = +strength(links[i], i, links);
      ***REMOVED***
    ***REMOVED***
  
    function initializeDistance() ***REMOVED***
      if (!nodes) return;
  
      for (var i = 0, n = links.length; i < n; ++i) ***REMOVED***
        distances[i] = +distance(links[i], i, links);
      ***REMOVED***
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
      initialize();
    ***REMOVED***;
  
    force.links = function(_) ***REMOVED***
      return arguments.length ? (links = _, initialize(), force) : links;
    ***REMOVED***;
  
    force.id = function(_) ***REMOVED***
      return arguments.length ? (id = _, force) : id;
    ***REMOVED***;
  
    force.iterations = function(_) ***REMOVED***
      return arguments.length ? (iterations = +_, force) : iterations;
    ***REMOVED***;
  
    force.strength = function(_) ***REMOVED***
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$6(+_), initializeStrength(), force) : strength;
    ***REMOVED***;
  
    force.distance = function(_) ***REMOVED***
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant$6(+_), initializeDistance(), force) : distance;
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  function x$2(d) ***REMOVED***
    return d.x;
  ***REMOVED***
  
  function y$2(d) ***REMOVED***
    return d.y;
  ***REMOVED***
  
  var initialRadius = 10;
  var initialAngle = Math.PI * (3 - Math.sqrt(5));
  
  var simulation = function(nodes) ***REMOVED***
    var simulation,
        alpha = 1,
        alphaMin = 0.001,
        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
        alphaTarget = 0,
        velocityDecay = 0.6,
        forces = map$1(),
        stepper = timer(step),
        event = dispatch("tick", "end");
  
    if (nodes == null) nodes = [];
  
    function step() ***REMOVED***
      tick();
      event.call("tick", simulation);
      if (alpha < alphaMin) ***REMOVED***
        stepper.stop();
        event.call("end", simulation);
      ***REMOVED***
    ***REMOVED***
  
    function tick() ***REMOVED***
      var i, n = nodes.length, node;
  
      alpha += (alphaTarget - alpha) * alphaDecay;
  
      forces.each(function(force) ***REMOVED***
        force(alpha);
      ***REMOVED***);
  
      for (i = 0; i < n; ++i) ***REMOVED***
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;
        else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;
        else node.y = node.fy, node.vy = 0;
      ***REMOVED***
    ***REMOVED***
  
    function initializeNodes() ***REMOVED***
      for (var i = 0, n = nodes.length, node; i < n; ++i) ***REMOVED***
        node = nodes[i], node.index = i;
        if (isNaN(node.x) || isNaN(node.y)) ***REMOVED***
          var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
          node.x = radius * Math.cos(angle);
          node.y = radius * Math.sin(angle);
        ***REMOVED***
        if (isNaN(node.vx) || isNaN(node.vy)) ***REMOVED***
          node.vx = node.vy = 0;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function initializeForce(force) ***REMOVED***
      if (force.initialize) force.initialize(nodes);
      return force;
    ***REMOVED***
  
    initializeNodes();
  
    return simulation = ***REMOVED***
      tick: tick,
  
      restart: function() ***REMOVED***
        return stepper.restart(step), simulation;
      ***REMOVED***,
  
      stop: function() ***REMOVED***
        return stepper.stop(), simulation;
      ***REMOVED***,
  
      nodes: function(_) ***REMOVED***
        return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
      ***REMOVED***,
  
      alpha: function(_) ***REMOVED***
        return arguments.length ? (alpha = +_, simulation) : alpha;
      ***REMOVED***,
  
      alphaMin: function(_) ***REMOVED***
        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
      ***REMOVED***,
  
      alphaDecay: function(_) ***REMOVED***
        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
      ***REMOVED***,
  
      alphaTarget: function(_) ***REMOVED***
        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
      ***REMOVED***,
  
      velocityDecay: function(_) ***REMOVED***
        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
      ***REMOVED***,
  
      force: function(name, _) ***REMOVED***
        return arguments.length > 1 ? ((_ == null ? forces.remove(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
      ***REMOVED***,
  
      find: function(x, y, radius) ***REMOVED***
        var i = 0,
            n = nodes.length,
            dx,
            dy,
            d2,
            node,
            closest;
  
        if (radius == null) radius = Infinity;
        else radius *= radius;
  
        for (i = 0; i < n; ++i) ***REMOVED***
          node = nodes[i];
          dx = x - node.x;
          dy = y - node.y;
          d2 = dx * dx + dy * dy;
          if (d2 < radius) closest = node, radius = d2;
        ***REMOVED***
  
        return closest;
      ***REMOVED***,
  
      on: function(name, _) ***REMOVED***
        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  var manyBody = function() ***REMOVED***
    var nodes,
        node,
        alpha,
        strength = constant$6(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;
  
    function force(_) ***REMOVED***
      var i, n = nodes.length, tree = quadtree(nodes, x$2, y$2).visitAfter(accumulate);
      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    ***REMOVED***
  
    function initialize() ***REMOVED***
      if (!nodes) return;
      var i, n = nodes.length, node;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    ***REMOVED***
  
    function accumulate(quad) ***REMOVED***
      var strength = 0, q, c, x$$1, y$$1, i;
  
      // For internal nodes, accumulate forces from child quadrants.
      if (quad.length) ***REMOVED***
        for (x$$1 = y$$1 = i = 0; i < 4; ++i) ***REMOVED***
          if ((q = quad[i]) && (c = q.value)) ***REMOVED***
            strength += c, x$$1 += c * q.x, y$$1 += c * q.y;
          ***REMOVED***
        ***REMOVED***
        quad.x = x$$1 / strength;
        quad.y = y$$1 / strength;
      ***REMOVED***
  
      // For leaf nodes, accumulate forces from coincident quadrants.
      else ***REMOVED***
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;
        do strength += strengths[q.data.index];
        while (q = q.next);
      ***REMOVED***
  
      quad.value = strength;
    ***REMOVED***
  
    function apply(quad, x1, _, x2) ***REMOVED***
      if (!quad.value) return true;
  
      var x$$1 = quad.x - node.x,
          y$$1 = quad.y - node.y,
          w = x2 - x1,
          l = x$$1 * x$$1 + y$$1 * y$$1;
  
      // Apply the Barnes-Hut approximation if possible.
      // Limit forces for very close nodes; randomize direction if coincident.
      if (w * w / theta2 < l) ***REMOVED***
        if (l < distanceMax2) ***REMOVED***
          if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
          if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x$$1 * quad.value * alpha / l;
          node.vy += y$$1 * quad.value * alpha / l;
        ***REMOVED***
        return true;
      ***REMOVED***
  
      // Otherwise, process points directly.
      else if (quad.length || l >= distanceMax2) return;
  
      // Limit forces for very close nodes; randomize direction if coincident.
      if (quad.data !== node || quad.next) ***REMOVED***
        if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
        if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      ***REMOVED***
  
      do if (quad.data !== node) ***REMOVED***
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x$$1 * w;
        node.vy += y$$1 * w;
      ***REMOVED*** while (quad = quad.next);
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
      initialize();
    ***REMOVED***;
  
    force.strength = function(_) ***REMOVED***
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : strength;
    ***REMOVED***;
  
    force.distanceMin = function(_) ***REMOVED***
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    ***REMOVED***;
  
    force.distanceMax = function(_) ***REMOVED***
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    ***REMOVED***;
  
    force.theta = function(_) ***REMOVED***
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  var x$3 = function(x) ***REMOVED***
    var strength = constant$6(0.1),
        nodes,
        strengths,
        xz;
  
    if (typeof x !== "function") x = constant$6(x == null ? 0 : +x);
  
    function force(alpha) ***REMOVED***
      for (var i = 0, n = nodes.length, node; i < n; ++i) ***REMOVED***
        node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
      ***REMOVED***
    ***REMOVED***
  
    function initialize() ***REMOVED***
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      xz = new Array(n);
      for (i = 0; i < n; ++i) ***REMOVED***
        strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      ***REMOVED***
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
      initialize();
    ***REMOVED***;
  
    force.strength = function(_) ***REMOVED***
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : strength;
    ***REMOVED***;
  
    force.x = function(_) ***REMOVED***
      return arguments.length ? (x = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : x;
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  var y$3 = function(y) ***REMOVED***
    var strength = constant$6(0.1),
        nodes,
        strengths,
        yz;
  
    if (typeof y !== "function") y = constant$6(y == null ? 0 : +y);
  
    function force(alpha) ***REMOVED***
      for (var i = 0, n = nodes.length, node; i < n; ++i) ***REMOVED***
        node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
      ***REMOVED***
    ***REMOVED***
  
    function initialize() ***REMOVED***
      if (!nodes) return;
      var i, n = nodes.length;
      strengths = new Array(n);
      yz = new Array(n);
      for (i = 0; i < n; ++i) ***REMOVED***
        strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
      ***REMOVED***
    ***REMOVED***
  
    force.initialize = function(_) ***REMOVED***
      nodes = _;
      initialize();
    ***REMOVED***;
  
    force.strength = function(_) ***REMOVED***
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : strength;
    ***REMOVED***;
  
    force.y = function(_) ***REMOVED***
      return arguments.length ? (y = typeof _ === "function" ? _ : constant$6(+_), initialize(), force) : y;
    ***REMOVED***;
  
    return force;
  ***REMOVED***;
  
  function nopropagation() ***REMOVED***
    exports.event.stopImmediatePropagation();
  ***REMOVED***
  
  var noevent = function() ***REMOVED***
    exports.event.preventDefault();
    exports.event.stopImmediatePropagation();
  ***REMOVED***;
  
  var dragDisable = function(view) ***REMOVED***
    var root = view.document.documentElement,
        selection$$1 = select(view).on("dragstart.drag", noevent, true);
    if ("onselectstart" in root) ***REMOVED***
      selection$$1.on("selectstart.drag", noevent, true);
    ***REMOVED*** else ***REMOVED***
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    ***REMOVED***
  ***REMOVED***;
  
  function yesdrag(view, noclick) ***REMOVED***
    var root = view.document.documentElement,
        selection$$1 = select(view).on("dragstart.drag", null);
    if (noclick) ***REMOVED***
      selection$$1.on("click.drag", noevent, true);
      setTimeout(function() ***REMOVED*** selection$$1.on("click.drag", null); ***REMOVED***, 0);
    ***REMOVED***
    if ("onselectstart" in root) ***REMOVED***
      selection$$1.on("selectstart.drag", null);
    ***REMOVED*** else ***REMOVED***
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    ***REMOVED***
  ***REMOVED***
  
  var constant$7 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) ***REMOVED***
    this.target = target;
    this.type = type;
    this.subject = subject;
    this.identifier = id;
    this.active = active;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this._ = dispatch;
  ***REMOVED***
  
  DragEvent.prototype.on = function() ***REMOVED***
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  ***REMOVED***;
  
  // Ignore right-click, since that should open the context menu.
  function defaultFilter() ***REMOVED***
    return !exports.event.button;
  ***REMOVED***
  
  function defaultContainer() ***REMOVED***
    return this.parentNode;
  ***REMOVED***
  
  function defaultSubject(d) ***REMOVED***
    return d == null ? ***REMOVED***x: exports.event.x, y: exports.event.y***REMOVED*** : d;
  ***REMOVED***
  
  var drag = function() ***REMOVED***
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        gestures = ***REMOVED******REMOVED***,
        listeners = dispatch("start", "drag", "end"),
        active = 0,
        mousemoving,
        touchending;
  
    function drag(selection$$1) ***REMOVED***
      selection$$1
          .on("mousedown.drag", mousedowned)
          .on("touchstart.drag", touchstarted)
          .on("touchmove.drag", touchmoved)
          .on("touchend.drag touchcancel.drag", touchended)
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    ***REMOVED***
  
    function mousedowned() ***REMOVED***
      if (touchending || !filter.apply(this, arguments)) return;
      var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
      if (!gesture) return;
      select(exports.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
      dragDisable(exports.event.view);
      nopropagation();
      mousemoving = false;
      gesture("start");
    ***REMOVED***
  
    function mousemoved() ***REMOVED***
      noevent();
      mousemoving = true;
      gestures.mouse("drag");
    ***REMOVED***
  
    function mouseupped() ***REMOVED***
      select(exports.event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(exports.event.view, mousemoving);
      noevent();
      gestures.mouse("end");
    ***REMOVED***
  
    function touchstarted() ***REMOVED***
      if (!filter.apply(this, arguments)) return;
      var touches$$1 = exports.event.changedTouches,
          c = container.apply(this, arguments),
          n = touches$$1.length, i, gesture;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        if (gesture = beforestart(touches$$1[i].identifier, c, touch, this, arguments)) ***REMOVED***
          nopropagation();
          gesture("start");
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function touchmoved() ***REMOVED***
      var touches$$1 = exports.event.changedTouches,
          n = touches$$1.length, i, gesture;
  
      for (i = 0; i < n; ++i) ***REMOVED***
        if (gesture = gestures[touches$$1[i].identifier]) ***REMOVED***
          noevent();
          gesture("drag");
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function touchended() ***REMOVED***
      var touches$$1 = exports.event.changedTouches,
          n = touches$$1.length, i, gesture;
  
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() ***REMOVED*** touchending = null; ***REMOVED***, 500); // Ghost clicks are delayed!
      for (i = 0; i < n; ++i) ***REMOVED***
        if (gesture = gestures[touches$$1[i].identifier]) ***REMOVED***
          nopropagation();
          gesture("end");
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    function beforestart(id, container, point, that, args) ***REMOVED***
      var p = point(container, id), s, dx, dy,
          sublisteners = listeners.copy();
  
      if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() ***REMOVED***
        if ((exports.event.subject = s = subject.apply(that, args)) == null) return false;
        dx = s.x - p[0] || 0;
        dy = s.y - p[1] || 0;
        return true;
      ***REMOVED***)) return;
  
      return function gesture(type) ***REMOVED***
        var p0 = p, n;
        switch (type) ***REMOVED***
          case "start": gestures[id] = gesture, n = active++; break;
          case "end": delete gestures[id], --active; // nobreak
          case "drag": p = point(container, id), n = active; break;
        ***REMOVED***
        customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
      ***REMOVED***;
    ***REMOVED***
  
    drag.filter = function(_) ***REMOVED***
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$7(!!_), drag) : filter;
    ***REMOVED***;
  
    drag.container = function(_) ***REMOVED***
      return arguments.length ? (container = typeof _ === "function" ? _ : constant$7(_), drag) : container;
    ***REMOVED***;
  
    drag.subject = function(_) ***REMOVED***
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant$7(_), drag) : subject;
    ***REMOVED***;
  
    drag.on = function() ***REMOVED***
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    ***REMOVED***;
  
    return drag;
  ***REMOVED***;
  
  var constant$8 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function x$4(d) ***REMOVED***
    return d[0];
  ***REMOVED***
  
  function y$4(d) ***REMOVED***
    return d[1];
  ***REMOVED***
  
  function RedBlackTree() ***REMOVED***
    this._ = null; // root node
  ***REMOVED***
  
  function RedBlackNode(node) ***REMOVED***
    node.U = // parent node
    node.C = // color - true for red, false for black
    node.L = // left node
    node.R = // right node
    node.P = // previous node
    node.N = null; // next node
  ***REMOVED***
  
  RedBlackTree.prototype = ***REMOVED***
    constructor: RedBlackTree,
  
    insert: function(after, node) ***REMOVED***
      var parent, grandpa, uncle;
  
      if (after) ***REMOVED***
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) ***REMOVED***
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        ***REMOVED*** else ***REMOVED***
          after.R = node;
        ***REMOVED***
        parent = after;
      ***REMOVED*** else if (this._) ***REMOVED***
        after = RedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      ***REMOVED*** else ***REMOVED***
        node.P = node.N = null;
        this._ = node;
        parent = null;
      ***REMOVED***
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
  
      after = node;
      while (parent && parent.C) ***REMOVED***
        grandpa = parent.U;
        if (parent === grandpa.L) ***REMOVED***
          uncle = grandpa.R;
          if (uncle && uncle.C) ***REMOVED***
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          ***REMOVED*** else ***REMOVED***
            if (after === parent.R) ***REMOVED***
              RedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            ***REMOVED***
            parent.C = false;
            grandpa.C = true;
            RedBlackRotateRight(this, grandpa);
          ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          uncle = grandpa.L;
          if (uncle && uncle.C) ***REMOVED***
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          ***REMOVED*** else ***REMOVED***
            if (after === parent.L) ***REMOVED***
              RedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            ***REMOVED***
            parent.C = false;
            grandpa.C = true;
            RedBlackRotateLeft(this, grandpa);
          ***REMOVED***
        ***REMOVED***
        parent = after.U;
      ***REMOVED***
      this._.C = false;
    ***REMOVED***,
  
    remove: function(node) ***REMOVED***
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
  
      var parent = node.U,
          sibling,
          left = node.L,
          right = node.R,
          next,
          red;
  
      if (!left) next = right;
      else if (!right) next = left;
      else next = RedBlackFirst(right);
  
      if (parent) ***REMOVED***
        if (parent.L === node) parent.L = next;
        else parent.R = next;
      ***REMOVED*** else ***REMOVED***
        this._ = next;
      ***REMOVED***
  
      if (left && right) ***REMOVED***
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) ***REMOVED***
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        ***REMOVED*** else ***REMOVED***
          next.U = parent;
          parent = next;
          node = next.R;
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        red = node.C;
        node = next;
      ***REMOVED***
  
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) ***REMOVED*** node.C = false; return; ***REMOVED***
  
      do ***REMOVED***
        if (node === this._) break;
        if (node === parent.L) ***REMOVED***
          sibling = parent.R;
          if (sibling.C) ***REMOVED***
            sibling.C = false;
            parent.C = true;
            RedBlackRotateLeft(this, parent);
            sibling = parent.R;
          ***REMOVED***
          if ((sibling.L && sibling.L.C)
              || (sibling.R && sibling.R.C)) ***REMOVED***
            if (!sibling.R || !sibling.R.C) ***REMOVED***
              sibling.L.C = false;
              sibling.C = true;
              RedBlackRotateRight(this, sibling);
              sibling = parent.R;
            ***REMOVED***
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            RedBlackRotateLeft(this, parent);
            node = this._;
            break;
          ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          sibling = parent.L;
          if (sibling.C) ***REMOVED***
            sibling.C = false;
            parent.C = true;
            RedBlackRotateRight(this, parent);
            sibling = parent.L;
          ***REMOVED***
          if ((sibling.L && sibling.L.C)
            || (sibling.R && sibling.R.C)) ***REMOVED***
            if (!sibling.L || !sibling.L.C) ***REMOVED***
              sibling.R.C = false;
              sibling.C = true;
              RedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            ***REMOVED***
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            RedBlackRotateRight(this, parent);
            node = this._;
            break;
          ***REMOVED***
        ***REMOVED***
        sibling.C = true;
        node = parent;
        parent = parent.U;
      ***REMOVED*** while (!node.C);
  
      if (node) node.C = false;
    ***REMOVED***
  ***REMOVED***;
  
  function RedBlackRotateLeft(tree, node) ***REMOVED***
    var p = node,
        q = node.R,
        parent = p.U;
  
    if (parent) ***REMOVED***
      if (parent.L === p) parent.L = q;
      else parent.R = q;
    ***REMOVED*** else ***REMOVED***
      tree._ = q;
    ***REMOVED***
  
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  ***REMOVED***
  
  function RedBlackRotateRight(tree, node) ***REMOVED***
    var p = node,
        q = node.L,
        parent = p.U;
  
    if (parent) ***REMOVED***
      if (parent.L === p) parent.L = q;
      else parent.R = q;
    ***REMOVED*** else ***REMOVED***
      tree._ = q;
    ***REMOVED***
  
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  ***REMOVED***
  
  function RedBlackFirst(node) ***REMOVED***
    while (node.L) node = node.L;
    return node;
  ***REMOVED***
  
  function createEdge(left, right, v0, v1) ***REMOVED***
    var edge = [null, null],
        index = edges.push(edge) - 1;
    edge.left = left;
    edge.right = right;
    if (v0) setEdgeEnd(edge, left, right, v0);
    if (v1) setEdgeEnd(edge, right, left, v1);
    cells[left.index].halfedges.push(index);
    cells[right.index].halfedges.push(index);
    return edge;
  ***REMOVED***
  
  function createBorderEdge(left, v0, v1) ***REMOVED***
    var edge = [v0, v1];
    edge.left = left;
    return edge;
  ***REMOVED***
  
  function setEdgeEnd(edge, left, right, vertex) ***REMOVED***
    if (!edge[0] && !edge[1]) ***REMOVED***
      edge[0] = vertex;
      edge.left = left;
      edge.right = right;
    ***REMOVED*** else if (edge.left === right) ***REMOVED***
      edge[1] = vertex;
    ***REMOVED*** else ***REMOVED***
      edge[0] = vertex;
    ***REMOVED***
  ***REMOVED***
  
  // Liang–Barsky line clipping.
  function clipEdge(edge, x0, y0, x1, y1) ***REMOVED***
    var a = edge[0],
        b = edge[1],
        ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1],
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay,
        r;
  
    r = x0 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED*** else if (dx > 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED***
  
    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED*** else if (dx > 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED***
  
    r = y0 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED*** else if (dy > 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED***
  
    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED*** else if (dy > 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED***
  
    if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?
  
    if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
    if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
    return true;
  ***REMOVED***
  
  function connectEdge(edge, x0, y0, x1, y1) ***REMOVED***
    var v1 = edge[1];
    if (v1) return true;
  
    var v0 = edge[0],
        left = edge.left,
        right = edge.right,
        lx = left[0],
        ly = left[1],
        rx = right[0],
        ry = right[1],
        fx = (lx + rx) / 2,
        fy = (ly + ry) / 2,
        fm,
        fb;
  
    if (ry === ly) ***REMOVED***
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) ***REMOVED***
        if (!v0) v0 = [fx, y0];
        else if (v0[1] >= y1) return;
        v1 = [fx, y1];
      ***REMOVED*** else ***REMOVED***
        if (!v0) v0 = [fx, y1];
        else if (v0[1] < y0) return;
        v1 = [fx, y0];
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) ***REMOVED***
        if (lx > rx) ***REMOVED***
          if (!v0) v0 = [(y0 - fb) / fm, y0];
          else if (v0[1] >= y1) return;
          v1 = [(y1 - fb) / fm, y1];
        ***REMOVED*** else ***REMOVED***
          if (!v0) v0 = [(y1 - fb) / fm, y1];
          else if (v0[1] < y0) return;
          v1 = [(y0 - fb) / fm, y0];
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (ly < ry) ***REMOVED***
          if (!v0) v0 = [x0, fm * x0 + fb];
          else if (v0[0] >= x1) return;
          v1 = [x1, fm * x1 + fb];
        ***REMOVED*** else ***REMOVED***
          if (!v0) v0 = [x1, fm * x1 + fb];
          else if (v0[0] < x0) return;
          v1 = [x0, fm * x0 + fb];
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    edge[0] = v0;
    edge[1] = v1;
    return true;
  ***REMOVED***
  
  function clipEdges(x0, y0, x1, y1) ***REMOVED***
    var i = edges.length,
        edge;
  
    while (i--) ***REMOVED***
      if (!connectEdge(edge = edges[i], x0, y0, x1, y1)
          || !clipEdge(edge, x0, y0, x1, y1)
          || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon$3
              || Math.abs(edge[0][1] - edge[1][1]) > epsilon$3)) ***REMOVED***
        delete edges[i];
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  function createCell(site) ***REMOVED***
    return cells[site.index] = ***REMOVED***
      site: site,
      halfedges: []
    ***REMOVED***;
  ***REMOVED***
  
  function cellHalfedgeAngle(cell, edge) ***REMOVED***
    var site = cell.site,
        va = edge.left,
        vb = edge.right;
    if (site === vb) vb = va, va = site;
    if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
    if (site === va) va = edge[1], vb = edge[0];
    else va = edge[0], vb = edge[1];
    return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
  ***REMOVED***
  
  function cellHalfedgeStart(cell, edge) ***REMOVED***
    return edge[+(edge.left !== cell.site)];
  ***REMOVED***
  
  function cellHalfedgeEnd(cell, edge) ***REMOVED***
    return edge[+(edge.left === cell.site)];
  ***REMOVED***
  
  function sortCellHalfedges() ***REMOVED***
    for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) ***REMOVED***
      if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) ***REMOVED***
        var index = new Array(m),
            array = new Array(m);
        for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
        index.sort(function(i, j) ***REMOVED*** return array[j] - array[i]; ***REMOVED***);
        for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];
        for (j = 0; j < m; ++j) halfedges[j] = array[j];
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  function clipCells(x0, y0, x1, y1) ***REMOVED***
    var nCells = cells.length,
        iCell,
        cell,
        site,
        iHalfedge,
        halfedges,
        nHalfedges,
        start,
        startX,
        startY,
        end,
        endX,
        endY,
        cover = true;
  
    for (iCell = 0; iCell < nCells; ++iCell) ***REMOVED***
      if (cell = cells[iCell]) ***REMOVED***
        site = cell.site;
        halfedges = cell.halfedges;
        iHalfedge = halfedges.length;
  
        // Remove any dangling clipped edges.
        while (iHalfedge--) ***REMOVED***
          if (!edges[halfedges[iHalfedge]]) ***REMOVED***
            halfedges.splice(iHalfedge, 1);
          ***REMOVED***
        ***REMOVED***
  
        // Insert any border edges as necessary.
        iHalfedge = 0, nHalfedges = halfedges.length;
        while (iHalfedge < nHalfedges) ***REMOVED***
          end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
          start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
          if (Math.abs(endX - startX) > epsilon$3 || Math.abs(endY - startY) > epsilon$3) ***REMOVED***
            halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end,
                Math.abs(endX - x0) < epsilon$3 && y1 - endY > epsilon$3 ? [x0, Math.abs(startX - x0) < epsilon$3 ? startY : y1]
                : Math.abs(endY - y1) < epsilon$3 && x1 - endX > epsilon$3 ? [Math.abs(startY - y1) < epsilon$3 ? startX : x1, y1]
                : Math.abs(endX - x1) < epsilon$3 && endY - y0 > epsilon$3 ? [x1, Math.abs(startX - x1) < epsilon$3 ? startY : y0]
                : Math.abs(endY - y0) < epsilon$3 && endX - x0 > epsilon$3 ? [Math.abs(startY - y0) < epsilon$3 ? startX : x0, y0]
                : null)) - 1);
            ++nHalfedges;
          ***REMOVED***
        ***REMOVED***
  
        if (nHalfedges) cover = false;
      ***REMOVED***
    ***REMOVED***
  
    // If there weren’t any edges, have the closest site cover the extent.
    // It doesn’t matter which corner of the extent we measure!
    if (cover) ***REMOVED***
      var dx, dy, d2, dc = Infinity;
  
      for (iCell = 0, cover = null; iCell < nCells; ++iCell) ***REMOVED***
        if (cell = cells[iCell]) ***REMOVED***
          site = cell.site;
          dx = site[0] - x0;
          dy = site[1] - y0;
          d2 = dx * dx + dy * dy;
          if (d2 < dc) dc = d2, cover = cell;
        ***REMOVED***
      ***REMOVED***
  
      if (cover) ***REMOVED***
        var v00 = [x0, y0], v01 = [x0, y1], v11 = [x1, y1], v10 = [x1, y0];
        cover.halfedges.push(
          edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1,
          edges.push(createBorderEdge(site, v01, v11)) - 1,
          edges.push(createBorderEdge(site, v11, v10)) - 1,
          edges.push(createBorderEdge(site, v10, v00)) - 1
        );
      ***REMOVED***
    ***REMOVED***
  
    // Lastly delete any cells with no edges; these were entirely clipped.
    for (iCell = 0; iCell < nCells; ++iCell) ***REMOVED***
      if (cell = cells[iCell]) ***REMOVED***
        if (!cell.halfedges.length) ***REMOVED***
          delete cells[iCell];
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  
  var circlePool = [];
  
  var firstCircle;
  
  function Circle() ***REMOVED***
    RedBlackNode(this);
    this.x =
    this.y =
    this.arc =
    this.site =
    this.cy = null;
  ***REMOVED***
  
  function attachCircle(arc) ***REMOVED***
    var lArc = arc.P,
        rArc = arc.N;
  
    if (!lArc || !rArc) return;
  
    var lSite = lArc.site,
        cSite = arc.site,
        rSite = rArc.site;
  
    if (lSite === rSite) return;
  
    var bx = cSite[0],
        by = cSite[1],
        ax = lSite[0] - bx,
        ay = lSite[1] - by,
        cx = rSite[0] - bx,
        cy = rSite[1] - by;
  
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -epsilon2$1) return;
  
    var ha = ax * ax + ay * ay,
        hc = cx * cx + cy * cy,
        x = (cy * ha - ay * hc) / d,
        y = (ax * hc - cx * ha) / d;
  
    var circle = circlePool.pop() || new Circle;
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom
  
    arc.circle = circle;
  
    var before = null,
        node = circles._;
  
    while (node) ***REMOVED***
      if (circle.y < node.y || (circle.y === node.y && circle.x <= node.x)) ***REMOVED***
        if (node.L) node = node.L;
        else ***REMOVED*** before = node.P; break; ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (node.R) node = node.R;
        else ***REMOVED*** before = node; break; ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    circles.insert(before, circle);
    if (!before) firstCircle = circle;
  ***REMOVED***
  
  function detachCircle(arc) ***REMOVED***
    var circle = arc.circle;
    if (circle) ***REMOVED***
      if (!circle.P) firstCircle = circle.N;
      circles.remove(circle);
      circlePool.push(circle);
      RedBlackNode(circle);
      arc.circle = null;
    ***REMOVED***
  ***REMOVED***
  
  var beachPool = [];
  
  function Beach() ***REMOVED***
    RedBlackNode(this);
    this.edge =
    this.site =
    this.circle = null;
  ***REMOVED***
  
  function createBeach(site) ***REMOVED***
    var beach = beachPool.pop() || new Beach;
    beach.site = site;
    return beach;
  ***REMOVED***
  
  function detachBeach(beach) ***REMOVED***
    detachCircle(beach);
    beaches.remove(beach);
    beachPool.push(beach);
    RedBlackNode(beach);
  ***REMOVED***
  
  function removeBeach(beach) ***REMOVED***
    var circle = beach.circle,
        x = circle.x,
        y = circle.cy,
        vertex = [x, y],
        previous = beach.P,
        next = beach.N,
        disappearing = [beach];
  
    detachBeach(beach);
  
    var lArc = previous;
    while (lArc.circle
        && Math.abs(x - lArc.circle.x) < epsilon$3
        && Math.abs(y - lArc.circle.cy) < epsilon$3) ***REMOVED***
      previous = lArc.P;
      disappearing.unshift(lArc);
      detachBeach(lArc);
      lArc = previous;
    ***REMOVED***
  
    disappearing.unshift(lArc);
    detachCircle(lArc);
  
    var rArc = next;
    while (rArc.circle
        && Math.abs(x - rArc.circle.x) < epsilon$3
        && Math.abs(y - rArc.circle.cy) < epsilon$3) ***REMOVED***
      next = rArc.N;
      disappearing.push(rArc);
      detachBeach(rArc);
      rArc = next;
    ***REMOVED***
  
    disappearing.push(rArc);
    detachCircle(rArc);
  
    var nArcs = disappearing.length,
        iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) ***REMOVED***
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    ***REMOVED***
  
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);
  
    attachCircle(lArc);
    attachCircle(rArc);
  ***REMOVED***
  
  function addBeach(site) ***REMOVED***
    var x = site[0],
        directrix = site[1],
        lArc,
        rArc,
        dxl,
        dxr,
        node = beaches._;
  
    while (node) ***REMOVED***
      dxl = leftBreakPoint(node, directrix) - x;
      if (dxl > epsilon$3) node = node.L; else ***REMOVED***
        dxr = x - rightBreakPoint(node, directrix);
        if (dxr > epsilon$3) ***REMOVED***
          if (!node.R) ***REMOVED***
            lArc = node;
            break;
          ***REMOVED***
          node = node.R;
        ***REMOVED*** else ***REMOVED***
          if (dxl > -epsilon$3) ***REMOVED***
            lArc = node.P;
            rArc = node;
          ***REMOVED*** else if (dxr > -epsilon$3) ***REMOVED***
            lArc = node;
            rArc = node.N;
          ***REMOVED*** else ***REMOVED***
            lArc = rArc = node;
          ***REMOVED***
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    createCell(site);
    var newArc = createBeach(site);
    beaches.insert(lArc, newArc);
  
    if (!lArc && !rArc) return;
  
    if (lArc === rArc) ***REMOVED***
      detachCircle(lArc);
      rArc = createBeach(lArc.site);
      beaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
      attachCircle(lArc);
      attachCircle(rArc);
      return;
    ***REMOVED***
  
    if (!rArc) ***REMOVED*** // && lArc
      newArc.edge = createEdge(lArc.site, newArc.site);
      return;
    ***REMOVED***
  
    // else lArc !== rArc
    detachCircle(lArc);
    detachCircle(rArc);
  
    var lSite = lArc.site,
        ax = lSite[0],
        ay = lSite[1],
        bx = site[0] - ax,
        by = site[1] - ay,
        rSite = rArc.site,
        cx = rSite[0] - ax,
        cy = rSite[1] - ay,
        d = 2 * (bx * cy - by * cx),
        hb = bx * bx + by * by,
        hc = cx * cx + cy * cy,
        vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];
  
    setEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = createEdge(lSite, site, null, vertex);
    rArc.edge = createEdge(site, rSite, null, vertex);
    attachCircle(lArc);
    attachCircle(rArc);
  ***REMOVED***
  
  function leftBreakPoint(arc, directrix) ***REMOVED***
    var site = arc.site,
        rfocx = site[0],
        rfocy = site[1],
        pby2 = rfocy - directrix;
  
    if (!pby2) return rfocx;
  
    var lArc = arc.P;
    if (!lArc) return -Infinity;
  
    site = lArc.site;
    var lfocx = site[0],
        lfocy = site[1],
        plby2 = lfocy - directrix;
  
    if (!plby2) return lfocx;
  
    var hl = lfocx - rfocx,
        aby2 = 1 / pby2 - 1 / plby2,
        b = hl / plby2;
  
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
  
    return (rfocx + lfocx) / 2;
  ***REMOVED***
  
  function rightBreakPoint(arc, directrix) ***REMOVED***
    var rArc = arc.N;
    if (rArc) return leftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site[1] === directrix ? site[0] : Infinity;
  ***REMOVED***
  
  var epsilon$3 = 1e-6;
  var epsilon2$1 = 1e-12;
  var beaches;
  var cells;
  var circles;
  var edges;
  
  function triangleArea(a, b, c) ***REMOVED***
    return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
  ***REMOVED***
  
  function lexicographic(a, b) ***REMOVED***
    return b[1] - a[1]
        || b[0] - a[0];
  ***REMOVED***
  
  function Diagram(sites, extent) ***REMOVED***
    var site = sites.sort(lexicographic).pop(),
        x,
        y,
        circle;
  
    edges = [];
    cells = new Array(sites.length);
    beaches = new RedBlackTree;
    circles = new RedBlackTree;
  
    while (true) ***REMOVED***
      circle = firstCircle;
      if (site && (!circle || site[1] < circle.y || (site[1] === circle.y && site[0] < circle.x))) ***REMOVED***
        if (site[0] !== x || site[1] !== y) ***REMOVED***
          addBeach(site);
          x = site[0], y = site[1];
        ***REMOVED***
        site = sites.pop();
      ***REMOVED*** else if (circle) ***REMOVED***
        removeBeach(circle.arc);
      ***REMOVED*** else ***REMOVED***
        break;
      ***REMOVED***
    ***REMOVED***
  
    sortCellHalfedges();
  
    if (extent) ***REMOVED***
      var x0 = +extent[0][0],
          y0 = +extent[0][1],
          x1 = +extent[1][0],
          y1 = +extent[1][1];
      clipEdges(x0, y0, x1, y1);
      clipCells(x0, y0, x1, y1);
    ***REMOVED***
  
    this.edges = edges;
    this.cells = cells;
  
    beaches =
    circles =
    edges =
    cells = null;
  ***REMOVED***
  
  Diagram.prototype = ***REMOVED***
    constructor: Diagram,
  
    polygons: function() ***REMOVED***
      var edges = this.edges;
  
      return this.cells.map(function(cell) ***REMOVED***
        var polygon = cell.halfedges.map(function(i) ***REMOVED*** return cellHalfedgeStart(cell, edges[i]); ***REMOVED***);
        polygon.data = cell.site.data;
        return polygon;
      ***REMOVED***);
    ***REMOVED***,
  
    triangles: function() ***REMOVED***
      var triangles = [],
          edges = this.edges;
  
      this.cells.forEach(function(cell, i) ***REMOVED***
        if (!(m = (halfedges = cell.halfedges).length)) return;
        var site = cell.site,
            halfedges,
            j = -1,
            m,
            s0,
            e1 = edges[halfedges[m - 1]],
            s1 = e1.left === site ? e1.right : e1.left;
  
        while (++j < m) ***REMOVED***
          s0 = s1;
          e1 = edges[halfedges[j]];
          s1 = e1.left === site ? e1.right : e1.left;
          if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) ***REMOVED***
            triangles.push([site.data, s0.data, s1.data]);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***);
  
      return triangles;
    ***REMOVED***,
  
    links: function() ***REMOVED***
      return this.edges.filter(function(edge) ***REMOVED***
        return edge.right;
      ***REMOVED***).map(function(edge) ***REMOVED***
        return ***REMOVED***
          source: edge.left.data,
          target: edge.right.data
        ***REMOVED***;
      ***REMOVED***);
    ***REMOVED***,
  
    find: function(x, y, radius) ***REMOVED***
      var that = this, i0, i1 = that._found || 0, n = that.cells.length, cell;
  
      // Use the previously-found cell, or start with an arbitrary one.
      while (!(cell = that.cells[i1])) if (++i1 >= n) return null;
      var dx = x - cell.site[0], dy = y - cell.site[1], d2 = dx * dx + dy * dy;
  
      // Traverse the half-edges to find a closer cell, if any.
      do ***REMOVED***
        cell = that.cells[i0 = i1], i1 = null;
        cell.halfedges.forEach(function(e) ***REMOVED***
          var edge = that.edges[e], v = edge.left;
          if ((v === cell.site || !v) && !(v = edge.right)) return;
          var vx = x - v[0], vy = y - v[1], v2 = vx * vx + vy * vy;
          if (v2 < d2) d2 = v2, i1 = v.index;
        ***REMOVED***);
      ***REMOVED*** while (i1 !== null);
  
      that._found = i0;
  
      return radius == null || d2 <= radius * radius ? cell.site : null;
    ***REMOVED***
  ***REMOVED***;
  
  var voronoi = function() ***REMOVED***
    var x$$1 = x$4,
        y$$1 = y$4,
        extent = null;
  
    function voronoi(data) ***REMOVED***
      return new Diagram(data.map(function(d, i) ***REMOVED***
        var s = [Math.round(x$$1(d, i, data) / epsilon$3) * epsilon$3, Math.round(y$$1(d, i, data) / epsilon$3) * epsilon$3];
        s.index = i;
        s.data = d;
        return s;
      ***REMOVED***), extent);
    ***REMOVED***
  
    voronoi.polygons = function(data) ***REMOVED***
      return voronoi(data).polygons();
    ***REMOVED***;
  
    voronoi.links = function(data) ***REMOVED***
      return voronoi(data).links();
    ***REMOVED***;
  
    voronoi.triangles = function(data) ***REMOVED***
      return voronoi(data).triangles();
    ***REMOVED***;
  
    voronoi.x = function(_) ***REMOVED***
      return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$8(+_), voronoi) : x$$1;
    ***REMOVED***;
  
    voronoi.y = function(_) ***REMOVED***
      return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$8(+_), voronoi) : y$$1;
    ***REMOVED***;
  
    voronoi.extent = function(_) ***REMOVED***
      return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
    ***REMOVED***;
  
    voronoi.size = function(_) ***REMOVED***
      return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
    ***REMOVED***;
  
    return voronoi;
  ***REMOVED***;
  
  var constant$9 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function ZoomEvent(target, type, transform) ***REMOVED***
    this.target = target;
    this.type = type;
    this.transform = transform;
  ***REMOVED***
  
  function Transform(k, x, y) ***REMOVED***
    this.k = k;
    this.x = x;
    this.y = y;
  ***REMOVED***
  
  Transform.prototype = ***REMOVED***
    constructor: Transform,
    scale: function(k) ***REMOVED***
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    ***REMOVED***,
    translate: function(x, y) ***REMOVED***
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    ***REMOVED***,
    apply: function(point) ***REMOVED***
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    ***REMOVED***,
    applyX: function(x) ***REMOVED***
      return x * this.k + this.x;
    ***REMOVED***,
    applyY: function(y) ***REMOVED***
      return y * this.k + this.y;
    ***REMOVED***,
    invert: function(location) ***REMOVED***
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    ***REMOVED***,
    invertX: function(x) ***REMOVED***
      return (x - this.x) / this.k;
    ***REMOVED***,
    invertY: function(y) ***REMOVED***
      return (y - this.y) / this.k;
    ***REMOVED***,
    rescaleX: function(x) ***REMOVED***
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    ***REMOVED***,
    rescaleY: function(y) ***REMOVED***
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    ***REMOVED***,
    toString: function() ***REMOVED***
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    ***REMOVED***
  ***REMOVED***;
  
  var identity$6 = new Transform(1, 0, 0);
  
  transform.prototype = Transform.prototype;
  
  function transform(node) ***REMOVED***
    return node.__zoom || identity$6;
  ***REMOVED***
  
  function nopropagation$1() ***REMOVED***
    exports.event.stopImmediatePropagation();
  ***REMOVED***
  
  var noevent$1 = function() ***REMOVED***
    exports.event.preventDefault();
    exports.event.stopImmediatePropagation();
  ***REMOVED***;
  
  // Ignore right-click, since that should open the context menu.
  function defaultFilter$1() ***REMOVED***
    return !exports.event.button;
  ***REMOVED***
  
  function defaultExtent() ***REMOVED***
    var e = this, w, h;
    if (e instanceof SVGElement) ***REMOVED***
      e = e.ownerSVGElement || e;
      w = e.width.baseVal.value;
      h = e.height.baseVal.value;
    ***REMOVED*** else ***REMOVED***
      w = e.clientWidth;
      h = e.clientHeight;
    ***REMOVED***
    return [[0, 0], [w, h]];
  ***REMOVED***
  
  function defaultTransform() ***REMOVED***
    return this.__zoom || identity$6;
  ***REMOVED***
  
  var zoom = function() ***REMOVED***
    var filter = defaultFilter$1,
        extent = defaultExtent,
        k0 = 0,
        k1 = Infinity,
        x0 = -k1,
        x1 = k1,
        y0 = x0,
        y1 = x1,
        duration = 250,
        interpolate$$1 = interpolateZoom,
        gestures = [],
        listeners = dispatch("start", "zoom", "end"),
        touchstarting,
        touchending,
        touchDelay = 500,
        wheelDelay = 150;
  
    function zoom(selection$$1) ***REMOVED***
      selection$$1
          .on("wheel.zoom", wheeled)
          .on("mousedown.zoom", mousedowned)
          .on("dblclick.zoom", dblclicked)
          .on("touchstart.zoom", touchstarted)
          .on("touchmove.zoom", touchmoved)
          .on("touchend.zoom touchcancel.zoom", touchended)
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
          .property("__zoom", defaultTransform);
    ***REMOVED***
  
    zoom.transform = function(collection, transform) ***REMOVED***
      var selection$$1 = collection.selection ? collection.selection() : collection;
      selection$$1.property("__zoom", defaultTransform);
      if (collection !== selection$$1) ***REMOVED***
        schedule(collection, transform);
      ***REMOVED*** else ***REMOVED***
        selection$$1.interrupt().each(function() ***REMOVED***
          gesture(this, arguments)
              .start()
              .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
              .end();
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***;
  
    zoom.scaleBy = function(selection$$1, k) ***REMOVED***
      zoom.scaleTo(selection$$1, function() ***REMOVED***
        var k0 = this.__zoom.k,
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return k0 * k1;
      ***REMOVED***);
    ***REMOVED***;
  
    zoom.scaleTo = function(selection$$1, k) ***REMOVED***
      zoom.transform(selection$$1, function() ***REMOVED***
        var e = extent.apply(this, arguments),
            t0 = this.__zoom,
            p0 = centroid(e),
            p1 = t0.invert(p0),
            k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return constrain(translate(scale(t0, k1), p0, p1), e);
      ***REMOVED***);
    ***REMOVED***;
  
    zoom.translateBy = function(selection$$1, x, y) ***REMOVED***
      zoom.transform(selection$$1, function() ***REMOVED***
        return constrain(this.__zoom.translate(
          typeof x === "function" ? x.apply(this, arguments) : x,
          typeof y === "function" ? y.apply(this, arguments) : y
        ), extent.apply(this, arguments));
      ***REMOVED***);
    ***REMOVED***;
  
    function scale(transform, k) ***REMOVED***
      k = Math.max(k0, Math.min(k1, k));
      return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
    ***REMOVED***
  
    function translate(transform, p0, p1) ***REMOVED***
      var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
      return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
    ***REMOVED***
  
    function constrain(transform, extent) ***REMOVED***
      var dx0 = transform.invertX(extent[0][0]) - x0,
          dx1 = transform.invertX(extent[1][0]) - x1,
          dy0 = transform.invertY(extent[0][1]) - y0,
          dy1 = transform.invertY(extent[1][1]) - y1;
      return transform.translate(
        dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
        dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
      );
    ***REMOVED***
  
    function centroid(extent) ***REMOVED***
      return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
    ***REMOVED***
  
    function schedule(transition$$1, transform, center) ***REMOVED***
      transition$$1
          .on("start.zoom", function() ***REMOVED*** gesture(this, arguments).start(); ***REMOVED***)
          .on("interrupt.zoom end.zoom", function() ***REMOVED*** gesture(this, arguments).end(); ***REMOVED***)
          .tween("zoom", function() ***REMOVED***
            var that = this,
                args = arguments,
                g = gesture(that, args),
                e = extent.apply(that, args),
                p = center || centroid(e),
                w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
                a = that.__zoom,
                b = typeof transform === "function" ? transform.apply(that, args) : transform,
                i = interpolate$$1(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) ***REMOVED***
              if (t === 1) t = b; // Avoid rounding error on end.
              else ***REMOVED*** var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); ***REMOVED***
              g.zoom(null, t);
            ***REMOVED***;
          ***REMOVED***);
    ***REMOVED***
  
    function gesture(that, args) ***REMOVED***
      for (var i = 0, n = gestures.length, g; i < n; ++i) ***REMOVED***
        if ((g = gestures[i]).that === that) ***REMOVED***
          return g;
        ***REMOVED***
      ***REMOVED***
      return new Gesture(that, args);
    ***REMOVED***
  
    function Gesture(that, args) ***REMOVED***
      this.that = that;
      this.args = args;
      this.index = -1;
      this.active = 0;
      this.extent = extent.apply(that, args);
    ***REMOVED***
  
    Gesture.prototype = ***REMOVED***
      start: function() ***REMOVED***
        if (++this.active === 1) ***REMOVED***
          this.index = gestures.push(this) - 1;
          this.emit("start");
        ***REMOVED***
        return this;
      ***REMOVED***,
      zoom: function(key, transform) ***REMOVED***
        if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
        if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
        if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
        this.that.__zoom = transform;
        this.emit("zoom");
        return this;
      ***REMOVED***,
      end: function() ***REMOVED***
        if (--this.active === 0) ***REMOVED***
          gestures.splice(this.index, 1);
          this.index = -1;
          this.emit("end");
        ***REMOVED***
        return this;
      ***REMOVED***,
      emit: function(type) ***REMOVED***
        customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
      ***REMOVED***
    ***REMOVED***;
  
    function wheeled() ***REMOVED***
      if (!filter.apply(this, arguments)) return;
      var g = gesture(this, arguments),
          t = this.__zoom,
          k = Math.max(k0, Math.min(k1, t.k * Math.pow(2, -exports.event.deltaY * (exports.event.deltaMode ? 120 : 1) / 500))),
          p = mouse(this);
  
      // If the mouse is in the same location as before, reuse it.
      // If there were recent wheel events, reset the wheel idle timeout.
      if (g.wheel) ***REMOVED***
        if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) ***REMOVED***
          g.mouse[1] = t.invert(g.mouse[0] = p);
        ***REMOVED***
        clearTimeout(g.wheel);
      ***REMOVED***
  
      // If this wheel event won’t trigger a transform change, ignore it.
      else if (t.k === k) return;
  
      // Otherwise, capture the mouse point and location at the start.
      else ***REMOVED***
        g.mouse = [p, t.invert(p)];
        interrupt(this);
        g.start();
      ***REMOVED***
  
      noevent$1();
      g.wheel = setTimeout(wheelidled, wheelDelay);
      g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent));
  
      function wheelidled() ***REMOVED***
        g.wheel = null;
        g.end();
      ***REMOVED***
    ***REMOVED***
  
    function mousedowned() ***REMOVED***
      if (touchending || !filter.apply(this, arguments)) return;
      var g = gesture(this, arguments),
          v = select(exports.event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
          p = mouse(this);
  
      dragDisable(exports.event.view);
      nopropagation$1();
      g.mouse = [p, this.__zoom.invert(p)];
      interrupt(this);
      g.start();
  
      function mousemoved() ***REMOVED***
        noevent$1();
        g.moved = true;
        g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent));
      ***REMOVED***
  
      function mouseupped() ***REMOVED***
        v.on("mousemove.zoom mouseup.zoom", null);
        yesdrag(exports.event.view, g.moved);
        noevent$1();
        g.end();
      ***REMOVED***
    ***REMOVED***
  
    function dblclicked() ***REMOVED***
      if (!filter.apply(this, arguments)) return;
      var t0 = this.__zoom,
          p0 = mouse(this),
          p1 = t0.invert(p0),
          k1 = t0.k * (exports.event.shiftKey ? 0.5 : 2),
          t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments));
  
      noevent$1();
      if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);
      else select(this).call(zoom.transform, t1);
    ***REMOVED***
  
    function touchstarted() ***REMOVED***
      if (!filter.apply(this, arguments)) return;
      var g = gesture(this, arguments),
          touches$$1 = exports.event.changedTouches,
          started,
          n = touches$$1.length, i, t, p;
  
      nopropagation$1();
      for (i = 0; i < n; ++i) ***REMOVED***
        t = touches$$1[i], p = touch(this, touches$$1, t.identifier);
        p = [p, this.__zoom.invert(p), t.identifier];
        if (!g.touch0) g.touch0 = p, started = true;
        else if (!g.touch1) g.touch1 = p;
      ***REMOVED***
  
      // If this is a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (touchstarting) ***REMOVED***
        touchstarting = clearTimeout(touchstarting);
        if (!g.touch1) ***REMOVED***
          g.end();
          p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
          return;
        ***REMOVED***
      ***REMOVED***
  
      if (started) ***REMOVED***
        touchstarting = setTimeout(function() ***REMOVED*** touchstarting = null; ***REMOVED***, touchDelay);
        interrupt(this);
        g.start();
      ***REMOVED***
    ***REMOVED***
  
    function touchmoved() ***REMOVED***
      var g = gesture(this, arguments),
          touches$$1 = exports.event.changedTouches,
          n = touches$$1.length, i, t, p, l;
  
      noevent$1();
      if (touchstarting) touchstarting = clearTimeout(touchstarting);
      for (i = 0; i < n; ++i) ***REMOVED***
        t = touches$$1[i], p = touch(this, touches$$1, t.identifier);
        if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
        else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
      ***REMOVED***
      t = g.that.__zoom;
      if (g.touch1) ***REMOVED***
        var p0 = g.touch0[0], l0 = g.touch0[1],
            p1 = g.touch1[0], l1 = g.touch1[1],
            dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
            dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
        t = scale(t, Math.sqrt(dp / dl));
        p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      ***REMOVED***
      else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
      else return;
      g.zoom("touch", constrain(translate(t, p, l), g.extent));
    ***REMOVED***
  
    function touchended() ***REMOVED***
      var g = gesture(this, arguments),
          touches$$1 = exports.event.changedTouches,
          n = touches$$1.length, i, t;
  
      nopropagation$1();
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() ***REMOVED*** touchending = null; ***REMOVED***, touchDelay);
      for (i = 0; i < n; ++i) ***REMOVED***
        t = touches$$1[i];
        if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
        else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
      ***REMOVED***
      if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
      if (!g.touch0) g.end();
    ***REMOVED***
  
    zoom.filter = function(_) ***REMOVED***
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$9(!!_), zoom) : filter;
    ***REMOVED***;
  
    zoom.extent = function(_) ***REMOVED***
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant$9([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
    ***REMOVED***;
  
    zoom.scaleExtent = function(_) ***REMOVED***
      return arguments.length ? (k0 = +_[0], k1 = +_[1], zoom) : [k0, k1];
    ***REMOVED***;
  
    zoom.translateExtent = function(_) ***REMOVED***
      return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], zoom) : [[x0, y0], [x1, y1]];
    ***REMOVED***;
  
    zoom.duration = function(_) ***REMOVED***
      return arguments.length ? (duration = +_, zoom) : duration;
    ***REMOVED***;
  
    zoom.interpolate = function(_) ***REMOVED***
      return arguments.length ? (interpolate$$1 = _, zoom) : interpolate$$1;
    ***REMOVED***;
  
    zoom.on = function() ***REMOVED***
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? zoom : value;
    ***REMOVED***;
  
    return zoom;
  ***REMOVED***;
  
  var constant$10 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var BrushEvent = function(target, type, selection) ***REMOVED***
    this.target = target;
    this.type = type;
    this.selection = selection;
  ***REMOVED***;
  
  function nopropagation$2() ***REMOVED***
    exports.event.stopImmediatePropagation();
  ***REMOVED***
  
  var noevent$2 = function() ***REMOVED***
    exports.event.preventDefault();
    exports.event.stopImmediatePropagation();
  ***REMOVED***;
  
  var MODE_DRAG = ***REMOVED***name: "drag"***REMOVED***;
  var MODE_SPACE = ***REMOVED***name: "space"***REMOVED***;
  var MODE_HANDLE = ***REMOVED***name: "handle"***REMOVED***;
  var MODE_CENTER = ***REMOVED***name: "center"***REMOVED***;
  
  var X = ***REMOVED***
    name: "x",
    handles: ["e", "w"].map(type$1),
    input: function(x, e) ***REMOVED*** return x && [[x[0], e[0][1]], [x[1], e[1][1]]]; ***REMOVED***,
    output: function(xy) ***REMOVED*** return xy && [xy[0][0], xy[1][0]]; ***REMOVED***
  ***REMOVED***;
  
  var Y = ***REMOVED***
    name: "y",
    handles: ["n", "s"].map(type$1),
    input: function(y, e) ***REMOVED*** return y && [[e[0][0], y[0]], [e[1][0], y[1]]]; ***REMOVED***,
    output: function(xy) ***REMOVED*** return xy && [xy[0][1], xy[1][1]]; ***REMOVED***
  ***REMOVED***;
  
  var XY = ***REMOVED***
    name: "xy",
    handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(type$1),
    input: function(xy) ***REMOVED*** return xy; ***REMOVED***,
    output: function(xy) ***REMOVED*** return xy; ***REMOVED***
  ***REMOVED***;
  
  var cursors = ***REMOVED***
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  ***REMOVED***;
  
  var flipX = ***REMOVED***
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
  ***REMOVED***;
  
  var flipY = ***REMOVED***
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
  ***REMOVED***;
  
  var signsX = ***REMOVED***
    overlay: +1,
    selection: +1,
    n: null,
    e: +1,
    s: null,
    w: -1,
    nw: -1,
    ne: +1,
    se: +1,
    sw: -1
  ***REMOVED***;
  
  var signsY = ***REMOVED***
    overlay: +1,
    selection: +1,
    n: -1,
    e: null,
    s: +1,
    w: null,
    nw: -1,
    ne: -1,
    se: +1,
    sw: +1
  ***REMOVED***;
  
  function type$1(t) ***REMOVED***
    return ***REMOVED***type: t***REMOVED***;
  ***REMOVED***
  
  // Ignore right-click, since that should open the context menu.
  function defaultFilter$2() ***REMOVED***
    return !exports.event.button;
  ***REMOVED***
  
  function defaultExtent$1() ***REMOVED***
    var svg = this.ownerSVGElement || this;
    return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
  ***REMOVED***
  
  // Like d3.local, but with the name “__brush” rather than auto-generated.
  function local$1(node) ***REMOVED***
    while (!node.__brush) if (!(node = node.parentNode)) return;
    return node.__brush;
  ***REMOVED***
  
  function empty$1(extent) ***REMOVED***
    return extent[0][0] === extent[1][0]
        || extent[0][1] === extent[1][1];
  ***REMOVED***
  
  function brushSelection(node) ***REMOVED***
    var state = node.__brush;
    return state ? state.dim.output(state.selection) : null;
  ***REMOVED***
  
  function brushX() ***REMOVED***
    return brush$1(X);
  ***REMOVED***
  
  function brushY() ***REMOVED***
    return brush$1(Y);
  ***REMOVED***
  
  var brush = function() ***REMOVED***
    return brush$1(XY);
  ***REMOVED***;
  
  function brush$1(dim) ***REMOVED***
    var extent = defaultExtent$1,
        filter = defaultFilter$2,
        listeners = dispatch(brush, "start", "brush", "end"),
        handleSize = 6,
        touchending;
  
    function brush(group) ***REMOVED***
      var overlay = group
          .property("__brush", initialize)
        .selectAll(".overlay")
        .data([type$1("overlay")]);
  
      overlay.enter().append("rect")
          .attr("class", "overlay")
          .attr("pointer-events", "all")
          .attr("cursor", cursors.overlay)
        .merge(overlay)
          .each(function() ***REMOVED***
            var extent = local$1(this).extent;
            select(this)
                .attr("x", extent[0][0])
                .attr("y", extent[0][1])
                .attr("width", extent[1][0] - extent[0][0])
                .attr("height", extent[1][1] - extent[0][1]);
          ***REMOVED***);
  
      group.selectAll(".selection")
        .data([type$1("selection")])
        .enter().append("rect")
          .attr("class", "selection")
          .attr("cursor", cursors.selection)
          .attr("fill", "#777")
          .attr("fill-opacity", 0.3)
          .attr("stroke", "#fff")
          .attr("shape-rendering", "crispEdges");
  
      var handle = group.selectAll(".handle")
        .data(dim.handles, function(d) ***REMOVED*** return d.type; ***REMOVED***);
  
      handle.exit().remove();
  
      handle.enter().append("rect")
          .attr("class", function(d) ***REMOVED*** return "handle handle--" + d.type; ***REMOVED***)
          .attr("cursor", function(d) ***REMOVED*** return cursors[d.type]; ***REMOVED***);
  
      group
          .each(redraw)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
          .on("mousedown.brush touchstart.brush", started);
    ***REMOVED***
  
    brush.move = function(group, selection$$1) ***REMOVED***
      if (group.selection) ***REMOVED***
        group
            .on("start.brush", function() ***REMOVED*** emitter(this, arguments).beforestart().start(); ***REMOVED***)
            .on("interrupt.brush end.brush", function() ***REMOVED*** emitter(this, arguments).end(); ***REMOVED***)
            .tween("brush", function() ***REMOVED***
              var that = this,
                  state = that.__brush,
                  emit = emitter(that, arguments),
                  selection0 = state.selection,
                  selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(this, arguments) : selection$$1, state.extent),
                  i = interpolate(selection0, selection1);
  
              function tween(t) ***REMOVED***
                state.selection = t === 1 && empty$1(selection1) ? null : i(t);
                redraw.call(that);
                emit.brush();
              ***REMOVED***
  
              return selection0 && selection1 ? tween : tween(1);
            ***REMOVED***);
      ***REMOVED*** else ***REMOVED***
        group
            .each(function() ***REMOVED***
              var that = this,
                  args = arguments,
                  state = that.__brush,
                  selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(that, args) : selection$$1, state.extent),
                  emit = emitter(that, args).beforestart();
  
              interrupt(that);
              state.selection = selection1 == null || empty$1(selection1) ? null : selection1;
              redraw.call(that);
              emit.start().brush().end();
            ***REMOVED***);
      ***REMOVED***
    ***REMOVED***;
  
    function redraw() ***REMOVED***
      var group = select(this),
          selection$$1 = local$1(this).selection;
  
      if (selection$$1) ***REMOVED***
        group.selectAll(".selection")
            .style("display", null)
            .attr("x", selection$$1[0][0])
            .attr("y", selection$$1[0][1])
            .attr("width", selection$$1[1][0] - selection$$1[0][0])
            .attr("height", selection$$1[1][1] - selection$$1[0][1]);
  
        group.selectAll(".handle")
            .style("display", null)
            .attr("x", function(d) ***REMOVED*** return d.type[d.type.length - 1] === "e" ? selection$$1[1][0] - handleSize / 2 : selection$$1[0][0] - handleSize / 2; ***REMOVED***)
            .attr("y", function(d) ***REMOVED*** return d.type[0] === "s" ? selection$$1[1][1] - handleSize / 2 : selection$$1[0][1] - handleSize / 2; ***REMOVED***)
            .attr("width", function(d) ***REMOVED*** return d.type === "n" || d.type === "s" ? selection$$1[1][0] - selection$$1[0][0] + handleSize : handleSize; ***REMOVED***)
            .attr("height", function(d) ***REMOVED*** return d.type === "e" || d.type === "w" ? selection$$1[1][1] - selection$$1[0][1] + handleSize : handleSize; ***REMOVED***);
      ***REMOVED***
  
      else ***REMOVED***
        group.selectAll(".selection,.handle")
            .style("display", "none")
            .attr("x", null)
            .attr("y", null)
            .attr("width", null)
            .attr("height", null);
      ***REMOVED***
    ***REMOVED***
  
    function emitter(that, args) ***REMOVED***
      return that.__brush.emitter || new Emitter(that, args);
    ***REMOVED***
  
    function Emitter(that, args) ***REMOVED***
      this.that = that;
      this.args = args;
      this.state = that.__brush;
      this.active = 0;
    ***REMOVED***
  
    Emitter.prototype = ***REMOVED***
      beforestart: function() ***REMOVED***
        if (++this.active === 1) this.state.emitter = this, this.starting = true;
        return this;
      ***REMOVED***,
      start: function() ***REMOVED***
        if (this.starting) this.starting = false, this.emit("start");
        return this;
      ***REMOVED***,
      brush: function() ***REMOVED***
        this.emit("brush");
        return this;
      ***REMOVED***,
      end: function() ***REMOVED***
        if (--this.active === 0) delete this.state.emitter, this.emit("end");
        return this;
      ***REMOVED***,
      emit: function(type) ***REMOVED***
        customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
      ***REMOVED***
    ***REMOVED***;
  
    function started() ***REMOVED***
      if (exports.event.touches) ***REMOVED*** if (exports.event.changedTouches.length < exports.event.touches.length) return noevent$2(); ***REMOVED***
      else if (touchending) return;
      if (!filter.apply(this, arguments)) return;
  
      var that = this,
          type = exports.event.target.__data__.type,
          mode = (exports.event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (exports.event.altKey ? MODE_CENTER : MODE_HANDLE),
          signX = dim === Y ? null : signsX[type],
          signY = dim === X ? null : signsY[type],
          state = local$1(that),
          extent = state.extent,
          selection$$1 = state.selection,
          W = extent[0][0], w0, w1,
          N = extent[0][1], n0, n1,
          E = extent[1][0], e0, e1,
          S = extent[1][1], s0, s1,
          dx,
          dy,
          moving,
          shifting = signX && signY && exports.event.shiftKey,
          lockX,
          lockY,
          point0 = mouse(that),
          point = point0,
          emit = emitter(that, arguments).beforestart();
  
      if (type === "overlay") ***REMOVED***
        state.selection = selection$$1 = [
          [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
          [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
        ];
      ***REMOVED*** else ***REMOVED***
        w0 = selection$$1[0][0];
        n0 = selection$$1[0][1];
        e0 = selection$$1[1][0];
        s0 = selection$$1[1][1];
      ***REMOVED***
  
      w1 = w0;
      n1 = n0;
      e1 = e0;
      s1 = s0;
  
      var group = select(that)
          .attr("pointer-events", "none");
  
      var overlay = group.selectAll(".overlay")
          .attr("cursor", cursors[type]);
  
      if (exports.event.touches) ***REMOVED***
        group
            .on("touchmove.brush", moved, true)
            .on("touchend.brush touchcancel.brush", ended, true);
      ***REMOVED*** else ***REMOVED***
        var view = select(exports.event.view)
            .on("keydown.brush", keydowned, true)
            .on("keyup.brush", keyupped, true)
            .on("mousemove.brush", moved, true)
            .on("mouseup.brush", ended, true);
  
        dragDisable(exports.event.view);
      ***REMOVED***
  
      nopropagation$2();
      interrupt(that);
      redraw.call(that);
      emit.start();
  
      function moved() ***REMOVED***
        var point1 = mouse(that);
        if (shifting && !lockX && !lockY) ***REMOVED***
          if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
          else lockX = true;
        ***REMOVED***
        point = point1;
        moving = true;
        noevent$2();
        move();
      ***REMOVED***
  
      function move() ***REMOVED***
        var t;
  
        dx = point[0] - point0[0];
        dy = point[1] - point0[1];
  
        switch (mode) ***REMOVED***
          case MODE_SPACE:
          case MODE_DRAG: ***REMOVED***
            if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
            if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
            break;
          ***REMOVED***
          case MODE_HANDLE: ***REMOVED***
            if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
            else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
            if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
            else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
            break;
          ***REMOVED***
          case MODE_CENTER: ***REMOVED***
            if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
            if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
            break;
          ***REMOVED***
        ***REMOVED***
  
        if (e1 < w1) ***REMOVED***
          signX *= -1;
          t = w0, w0 = e0, e0 = t;
          t = w1, w1 = e1, e1 = t;
          if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
        ***REMOVED***
  
        if (s1 < n1) ***REMOVED***
          signY *= -1;
          t = n0, n0 = s0, s0 = t;
          t = n1, n1 = s1, s1 = t;
          if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
        ***REMOVED***
  
        if (state.selection) selection$$1 = state.selection; // May be set by brush.move!
        if (lockX) w1 = selection$$1[0][0], e1 = selection$$1[1][0];
        if (lockY) n1 = selection$$1[0][1], s1 = selection$$1[1][1];
  
        if (selection$$1[0][0] !== w1
            || selection$$1[0][1] !== n1
            || selection$$1[1][0] !== e1
            || selection$$1[1][1] !== s1) ***REMOVED***
          state.selection = [[w1, n1], [e1, s1]];
          redraw.call(that);
          emit.brush();
        ***REMOVED***
      ***REMOVED***
  
      function ended() ***REMOVED***
        nopropagation$2();
        if (exports.event.touches) ***REMOVED***
          if (exports.event.touches.length) return;
          if (touchending) clearTimeout(touchending);
          touchending = setTimeout(function() ***REMOVED*** touchending = null; ***REMOVED***, 500); // Ghost clicks are delayed!
          group.on("touchmove.brush touchend.brush touchcancel.brush", null);
        ***REMOVED*** else ***REMOVED***
          yesdrag(exports.event.view, moving);
          view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
        ***REMOVED***
        group.attr("pointer-events", "all");
        overlay.attr("cursor", cursors.overlay);
        if (state.selection) selection$$1 = state.selection; // May be set by brush.move (on start)!
        if (empty$1(selection$$1)) state.selection = null, redraw.call(that);
        emit.end();
      ***REMOVED***
  
      function keydowned() ***REMOVED***
        switch (exports.event.keyCode) ***REMOVED***
          case 16: ***REMOVED*** // SHIFT
            shifting = signX && signY;
            break;
          ***REMOVED***
          case 18: ***REMOVED*** // ALT
            if (mode === MODE_HANDLE) ***REMOVED***
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
              move();
            ***REMOVED***
            break;
          ***REMOVED***
          case 32: ***REMOVED*** // SPACE; takes priority over ALT
            if (mode === MODE_HANDLE || mode === MODE_CENTER) ***REMOVED***
              if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
              if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
              mode = MODE_SPACE;
              overlay.attr("cursor", cursors.selection);
              move();
            ***REMOVED***
            break;
          ***REMOVED***
          default: return;
        ***REMOVED***
        noevent$2();
      ***REMOVED***
  
      function keyupped() ***REMOVED***
        switch (exports.event.keyCode) ***REMOVED***
          case 16: ***REMOVED*** // SHIFT
            if (shifting) ***REMOVED***
              lockX = lockY = shifting = false;
              move();
            ***REMOVED***
            break;
          ***REMOVED***
          case 18: ***REMOVED*** // ALT
            if (mode === MODE_CENTER) ***REMOVED***
              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
              move();
            ***REMOVED***
            break;
          ***REMOVED***
          case 32: ***REMOVED*** // SPACE
            if (mode === MODE_SPACE) ***REMOVED***
              if (exports.event.altKey) ***REMOVED***
                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                mode = MODE_CENTER;
              ***REMOVED*** else ***REMOVED***
                if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
                if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
                mode = MODE_HANDLE;
              ***REMOVED***
              overlay.attr("cursor", cursors[type]);
              move();
            ***REMOVED***
            break;
          ***REMOVED***
          default: return;
        ***REMOVED***
        noevent$2();
      ***REMOVED***
    ***REMOVED***
  
    function initialize() ***REMOVED***
      var state = this.__brush || ***REMOVED***selection: null***REMOVED***;
      state.extent = extent.apply(this, arguments);
      state.dim = dim;
      return state;
    ***REMOVED***
  
    brush.extent = function(_) ***REMOVED***
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant$10([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
    ***REMOVED***;
  
    brush.filter = function(_) ***REMOVED***
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$10(!!_), brush) : filter;
    ***REMOVED***;
  
    brush.handleSize = function(_) ***REMOVED***
      return arguments.length ? (handleSize = +_, brush) : handleSize;
    ***REMOVED***;
  
    brush.on = function() ***REMOVED***
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? brush : value;
    ***REMOVED***;
  
    return brush;
  ***REMOVED***
  
  var cos = Math.cos;
  var sin = Math.sin;
  var pi$3 = Math.PI;
  var halfPi$2 = pi$3 / 2;
  var tau$3 = pi$3 * 2;
  var max$1 = Math.max;
  
  function compareValue(compare) ***REMOVED***
    return function(a, b) ***REMOVED***
      return compare(
        a.source.value + a.target.value,
        b.source.value + b.target.value
      );
    ***REMOVED***;
  ***REMOVED***
  
  var chord = function() ***REMOVED***
    var padAngle = 0,
        sortGroups = null,
        sortSubgroups = null,
        sortChords = null;
  
    function chord(matrix) ***REMOVED***
      var n = matrix.length,
          groupSums = [],
          groupIndex = range(n),
          subgroupIndex = [],
          chords = [],
          groups = chords.groups = new Array(n),
          subgroups = new Array(n * n),
          k,
          x,
          x0,
          dx,
          i,
          j;
  
      // Compute the sum.
      k = 0, i = -1; while (++i < n) ***REMOVED***
        x = 0, j = -1; while (++j < n) ***REMOVED***
          x += matrix[i][j];
        ***REMOVED***
        groupSums.push(x);
        subgroupIndex.push(range(n));
        k += x;
      ***REMOVED***
  
      // Sort groups…
      if (sortGroups) groupIndex.sort(function(a, b) ***REMOVED***
        return sortGroups(groupSums[a], groupSums[b]);
      ***REMOVED***);
  
      // Sort subgroups…
      if (sortSubgroups) subgroupIndex.forEach(function(d, i) ***REMOVED***
        d.sort(function(a, b) ***REMOVED***
          return sortSubgroups(matrix[i][a], matrix[i][b]);
        ***REMOVED***);
      ***REMOVED***);
  
      // Convert the sum to scaling factor for [0, 2pi].
      // TODO Allow start and end angle to be specified?
      // TODO Allow padding to be specified as percentage?
      k = max$1(0, tau$3 - padAngle * n) / k;
      dx = k ? padAngle : tau$3 / n;
  
      // Compute the start and end angle for each group and subgroup.
      // Note: Opera has a bug reordering object literal properties!
      x = 0, i = -1; while (++i < n) ***REMOVED***
        x0 = x, j = -1; while (++j < n) ***REMOVED***
          var di = groupIndex[i],
              dj = subgroupIndex[di][j],
              v = matrix[di][dj],
              a0 = x,
              a1 = x += v * k;
          subgroups[dj * n + di] = ***REMOVED***
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          ***REMOVED***;
        ***REMOVED***
        groups[di] = ***REMOVED***
          index: di,
          startAngle: x0,
          endAngle: x,
          value: groupSums[di]
        ***REMOVED***;
        x += dx;
      ***REMOVED***
  
      // Generate chords for each (non-empty) subgroup-subgroup link.
      i = -1; while (++i < n) ***REMOVED***
        j = i - 1; while (++j < n) ***REMOVED***
          var source = subgroups[j * n + i],
              target = subgroups[i * n + j];
          if (source.value || target.value) ***REMOVED***
            chords.push(source.value < target.value
                ? ***REMOVED***source: target, target: source***REMOVED***
                : ***REMOVED***source: source, target: target***REMOVED***);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
  
      return sortChords ? chords.sort(sortChords) : chords;
    ***REMOVED***
  
    chord.padAngle = function(_) ***REMOVED***
      return arguments.length ? (padAngle = max$1(0, _), chord) : padAngle;
    ***REMOVED***;
  
    chord.sortGroups = function(_) ***REMOVED***
      return arguments.length ? (sortGroups = _, chord) : sortGroups;
    ***REMOVED***;
  
    chord.sortSubgroups = function(_) ***REMOVED***
      return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
    ***REMOVED***;
  
    chord.sortChords = function(_) ***REMOVED***
      return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
    ***REMOVED***;
  
    return chord;
  ***REMOVED***;
  
  var slice$5 = Array.prototype.slice;
  
  var constant$11 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  function defaultSource(d) ***REMOVED***
    return d.source;
  ***REMOVED***
  
  function defaultTarget(d) ***REMOVED***
    return d.target;
  ***REMOVED***
  
  function defaultRadius$1(d) ***REMOVED***
    return d.radius;
  ***REMOVED***
  
  function defaultStartAngle(d) ***REMOVED***
    return d.startAngle;
  ***REMOVED***
  
  function defaultEndAngle(d) ***REMOVED***
    return d.endAngle;
  ***REMOVED***
  
  var ribbon = function() ***REMOVED***
    var source = defaultSource,
        target = defaultTarget,
        radius = defaultRadius$1,
        startAngle = defaultStartAngle,
        endAngle = defaultEndAngle,
        context = null;
  
    function ribbon() ***REMOVED***
      var buffer,
          argv = slice$5.call(arguments),
          s = source.apply(this, argv),
          t = target.apply(this, argv),
          sr = +radius.apply(this, (argv[0] = s, argv)),
          sa0 = startAngle.apply(this, argv) - halfPi$2,
          sa1 = endAngle.apply(this, argv) - halfPi$2,
          sx0 = sr * cos(sa0),
          sy0 = sr * sin(sa0),
          tr = +radius.apply(this, (argv[0] = t, argv)),
          ta0 = startAngle.apply(this, argv) - halfPi$2,
          ta1 = endAngle.apply(this, argv) - halfPi$2;
  
      if (!context) context = buffer = path();
  
      context.moveTo(sx0, sy0);
      context.arc(0, 0, sr, sa0, sa1);
      if (sa0 !== ta0 || sa1 !== ta1) ***REMOVED*** // TODO sr !== tr?
        context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
        context.arc(0, 0, tr, ta0, ta1);
      ***REMOVED***
      context.quadraticCurveTo(0, 0, sx0, sy0);
      context.closePath();
  
      if (buffer) return context = null, buffer + "" || null;
    ***REMOVED***
  
    ribbon.radius = function(_) ***REMOVED***
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$11(+_), ribbon) : radius;
    ***REMOVED***;
  
    ribbon.startAngle = function(_) ***REMOVED***
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$11(+_), ribbon) : startAngle;
    ***REMOVED***;
  
    ribbon.endAngle = function(_) ***REMOVED***
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$11(+_), ribbon) : endAngle;
    ***REMOVED***;
  
    ribbon.source = function(_) ***REMOVED***
      return arguments.length ? (source = _, ribbon) : source;
    ***REMOVED***;
  
    ribbon.target = function(_) ***REMOVED***
      return arguments.length ? (target = _, ribbon) : target;
    ***REMOVED***;
  
    ribbon.context = function(_) ***REMOVED***
      return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
    ***REMOVED***;
  
    return ribbon;
  ***REMOVED***;
  
  // Adds floating point numbers with twice the normal precision.
  // Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
  // Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
  // 305–363 (1997).
  // Code adapted from GeographicLib by Charles F. F. Karney,
  // http://geographiclib.sourceforge.net/
  
  var adder = function() ***REMOVED***
    return new Adder;
  ***REMOVED***;
  
  function Adder() ***REMOVED***
    this.reset();
  ***REMOVED***
  
  Adder.prototype = ***REMOVED***
    constructor: Adder,
    reset: function() ***REMOVED***
      this.s = // rounded value
      this.t = 0; // exact error
    ***REMOVED***,
    add: function(y) ***REMOVED***
      add$1(temp, y, this.t);
      add$1(this, temp.s, this.s);
      if (this.s) this.t += temp.t;
      else this.s = temp.t;
    ***REMOVED***,
    valueOf: function() ***REMOVED***
      return this.s;
    ***REMOVED***
  ***REMOVED***;
  
  var temp = new Adder;
  
  function add$1(adder, a, b) ***REMOVED***
    var x = adder.s = a + b,
        bv = x - a,
        av = x - bv;
    adder.t = (a - av) + (b - bv);
  ***REMOVED***
  
  var epsilon$4 = 1e-6;
  var epsilon2$2 = 1e-12;
  var pi$4 = Math.PI;
  var halfPi$3 = pi$4 / 2;
  var quarterPi = pi$4 / 4;
  var tau$4 = pi$4 * 2;
  
  var degrees$1 = 180 / pi$4;
  var radians = pi$4 / 180;
  
  var abs = Math.abs;
  var atan = Math.atan;
  var atan2 = Math.atan2;
  var cos$1 = Math.cos;
  var ceil = Math.ceil;
  var exp = Math.exp;
  
  var log$1 = Math.log;
  var pow$1 = Math.pow;
  var sin$1 = Math.sin;
  var sign$1 = Math.sign || function(x) ***REMOVED*** return x > 0 ? 1 : x < 0 ? -1 : 0; ***REMOVED***;
  var sqrt$1 = Math.sqrt;
  var tan = Math.tan;
  
  function acos(x) ***REMOVED***
    return x > 1 ? 0 : x < -1 ? pi$4 : Math.acos(x);
  ***REMOVED***
  
  function asin$1(x) ***REMOVED***
    return x > 1 ? halfPi$3 : x < -1 ? -halfPi$3 : Math.asin(x);
  ***REMOVED***
  
  function haversin(x) ***REMOVED***
    return (x = sin$1(x / 2)) * x;
  ***REMOVED***
  
  function noop$2() ***REMOVED******REMOVED***
  
  function streamGeometry(geometry, stream) ***REMOVED***
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) ***REMOVED***
      streamGeometryType[geometry.type](geometry, stream);
    ***REMOVED***
  ***REMOVED***
  
  var streamObjectType = ***REMOVED***
    Feature: function(feature, stream) ***REMOVED***
      streamGeometry(feature.geometry, stream);
    ***REMOVED***,
    FeatureCollection: function(object, stream) ***REMOVED***
      var features = object.features, i = -1, n = features.length;
      while (++i < n) streamGeometry(features[i].geometry, stream);
    ***REMOVED***
  ***REMOVED***;
  
  var streamGeometryType = ***REMOVED***
    Sphere: function(object, stream) ***REMOVED***
      stream.sphere();
    ***REMOVED***,
    Point: function(object, stream) ***REMOVED***
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    ***REMOVED***,
    MultiPoint: function(object, stream) ***REMOVED***
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
    ***REMOVED***,
    LineString: function(object, stream) ***REMOVED***
      streamLine(object.coordinates, stream, 0);
    ***REMOVED***,
    MultiLineString: function(object, stream) ***REMOVED***
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamLine(coordinates[i], stream, 0);
    ***REMOVED***,
    Polygon: function(object, stream) ***REMOVED***
      streamPolygon(object.coordinates, stream);
    ***REMOVED***,
    MultiPolygon: function(object, stream) ***REMOVED***
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamPolygon(coordinates[i], stream);
    ***REMOVED***,
    GeometryCollection: function(object, stream) ***REMOVED***
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) streamGeometry(geometries[i], stream);
    ***REMOVED***
  ***REMOVED***;
  
  function streamLine(coordinates, stream, closed) ***REMOVED***
    var i = -1, n = coordinates.length - closed, coordinate;
    stream.lineStart();
    while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    stream.lineEnd();
  ***REMOVED***
  
  function streamPolygon(coordinates, stream) ***REMOVED***
    var i = -1, n = coordinates.length;
    stream.polygonStart();
    while (++i < n) streamLine(coordinates[i], stream, 1);
    stream.polygonEnd();
  ***REMOVED***
  
  var geoStream = function(object, stream) ***REMOVED***
    if (object && streamObjectType.hasOwnProperty(object.type)) ***REMOVED***
      streamObjectType[object.type](object, stream);
    ***REMOVED*** else ***REMOVED***
      streamGeometry(object, stream);
    ***REMOVED***
  ***REMOVED***;
  
  var areaRingSum = adder();
  
  var areaSum = adder();
  var lambda00;
  var phi00;
  var lambda0;
  var cosPhi0;
  var sinPhi0;
  
  var areaStream = ***REMOVED***
    point: noop$2,
    lineStart: noop$2,
    lineEnd: noop$2,
    polygonStart: function() ***REMOVED***
      areaRingSum.reset();
      areaStream.lineStart = areaRingStart;
      areaStream.lineEnd = areaRingEnd;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      var areaRing = +areaRingSum;
      areaSum.add(areaRing < 0 ? tau$4 + areaRing : areaRing);
      this.lineStart = this.lineEnd = this.point = noop$2;
    ***REMOVED***,
    sphere: function() ***REMOVED***
      areaSum.add(tau$4);
    ***REMOVED***
  ***REMOVED***;
  
  function areaRingStart() ***REMOVED***
    areaStream.point = areaPointFirst;
  ***REMOVED***
  
  function areaRingEnd() ***REMOVED***
    areaPoint(lambda00, phi00);
  ***REMOVED***
  
  function areaPointFirst(lambda, phi) ***REMOVED***
    areaStream.point = areaPoint;
    lambda00 = lambda, phi00 = phi;
    lambda *= radians, phi *= radians;
    lambda0 = lambda, cosPhi0 = cos$1(phi = phi / 2 + quarterPi), sinPhi0 = sin$1(phi);
  ***REMOVED***
  
  function areaPoint(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    phi = phi / 2 + quarterPi; // half the angular distance from south pole
  
    // Spherical excess E for a spherical triangle with vertices: south pole,
    // previous point, current point.  Uses a formula derived from Cagnoli’s
    // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
    var dLambda = lambda - lambda0,
        sdLambda = dLambda >= 0 ? 1 : -1,
        adLambda = sdLambda * dLambda,
        cosPhi = cos$1(phi),
        sinPhi = sin$1(phi),
        k = sinPhi0 * sinPhi,
        u = cosPhi0 * cosPhi + k * cos$1(adLambda),
        v = k * sdLambda * sin$1(adLambda);
    areaRingSum.add(atan2(v, u));
  
    // Advance the previous points.
    lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
  ***REMOVED***
  
  var area$2 = function(object) ***REMOVED***
    areaSum.reset();
    geoStream(object, areaStream);
    return areaSum * 2;
  ***REMOVED***;
  
  function spherical(cartesian) ***REMOVED***
    return [atan2(cartesian[1], cartesian[0]), asin$1(cartesian[2])];
  ***REMOVED***
  
  function cartesian(spherical) ***REMOVED***
    var lambda = spherical[0], phi = spherical[1], cosPhi = cos$1(phi);
    return [cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi)];
  ***REMOVED***
  
  function cartesianDot(a, b) ***REMOVED***
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  ***REMOVED***
  
  function cartesianCross(a, b) ***REMOVED***
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  ***REMOVED***
  
  // TODO return a
  function cartesianAddInPlace(a, b) ***REMOVED***
    a[0] += b[0], a[1] += b[1], a[2] += b[2];
  ***REMOVED***
  
  function cartesianScale(vector, k) ***REMOVED***
    return [vector[0] * k, vector[1] * k, vector[2] * k];
  ***REMOVED***
  
  // TODO return d
  function cartesianNormalizeInPlace(d) ***REMOVED***
    var l = sqrt$1(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l, d[1] /= l, d[2] /= l;
  ***REMOVED***
  
  var lambda0$1;
  var phi0;
  var lambda1;
  var phi1;
  var lambda2;
  var lambda00$1;
  var phi00$1;
  var p0;
  var deltaSum = adder();
  var ranges;
  var range$1;
  
  var boundsStream = ***REMOVED***
    point: boundsPoint,
    lineStart: boundsLineStart,
    lineEnd: boundsLineEnd,
    polygonStart: function() ***REMOVED***
      boundsStream.point = boundsRingPoint;
      boundsStream.lineStart = boundsRingStart;
      boundsStream.lineEnd = boundsRingEnd;
      deltaSum.reset();
      areaStream.polygonStart();
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      areaStream.polygonEnd();
      boundsStream.point = boundsPoint;
      boundsStream.lineStart = boundsLineStart;
      boundsStream.lineEnd = boundsLineEnd;
      if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
      else if (deltaSum > epsilon$4) phi1 = 90;
      else if (deltaSum < -epsilon$4) phi0 = -90;
      range$1[0] = lambda0$1, range$1[1] = lambda1;
    ***REMOVED***
  ***REMOVED***;
  
  function boundsPoint(lambda, phi) ***REMOVED***
    ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
    if (phi < phi0) phi0 = phi;
    if (phi > phi1) phi1 = phi;
  ***REMOVED***
  
  function linePoint(lambda, phi) ***REMOVED***
    var p = cartesian([lambda * radians, phi * radians]);
    if (p0) ***REMOVED***
      var normal = cartesianCross(p0, p),
          equatorial = [normal[1], -normal[0], 0],
          inflection = cartesianCross(equatorial, normal);
      cartesianNormalizeInPlace(inflection);
      inflection = spherical(inflection);
      var delta = lambda - lambda2,
          sign$$1 = delta > 0 ? 1 : -1,
          lambdai = inflection[0] * degrees$1 * sign$$1,
          phii,
          antimeridian = abs(delta) > 180;
      if (antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) ***REMOVED***
        phii = inflection[1] * degrees$1;
        if (phii > phi1) phi1 = phii;
      ***REMOVED*** else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) ***REMOVED***
        phii = -inflection[1] * degrees$1;
        if (phii < phi0) phi0 = phii;
      ***REMOVED*** else ***REMOVED***
        if (phi < phi0) phi0 = phi;
        if (phi > phi1) phi1 = phi;
      ***REMOVED***
      if (antimeridian) ***REMOVED***
        if (lambda < lambda2) ***REMOVED***
          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
        ***REMOVED*** else ***REMOVED***
          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        if (lambda1 >= lambda0$1) ***REMOVED***
          if (lambda < lambda0$1) lambda0$1 = lambda;
          if (lambda > lambda1) lambda1 = lambda;
        ***REMOVED*** else ***REMOVED***
          if (lambda > lambda2) ***REMOVED***
            if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
          ***REMOVED*** else ***REMOVED***
            if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      boundsPoint(lambda, phi);
    ***REMOVED***
    p0 = p, lambda2 = lambda;
  ***REMOVED***
  
  function boundsLineStart() ***REMOVED***
    boundsStream.point = linePoint;
  ***REMOVED***
  
  function boundsLineEnd() ***REMOVED***
    range$1[0] = lambda0$1, range$1[1] = lambda1;
    boundsStream.point = boundsPoint;
    p0 = null;
  ***REMOVED***
  
  function boundsRingPoint(lambda, phi) ***REMOVED***
    if (p0) ***REMOVED***
      var delta = lambda - lambda2;
      deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
    ***REMOVED*** else ***REMOVED***
      lambda00$1 = lambda, phi00$1 = phi;
    ***REMOVED***
    areaStream.point(lambda, phi);
    linePoint(lambda, phi);
  ***REMOVED***
  
  function boundsRingStart() ***REMOVED***
    areaStream.lineStart();
  ***REMOVED***
  
  function boundsRingEnd() ***REMOVED***
    boundsRingPoint(lambda00$1, phi00$1);
    areaStream.lineEnd();
    if (abs(deltaSum) > epsilon$4) lambda0$1 = -(lambda1 = 180);
    range$1[0] = lambda0$1, range$1[1] = lambda1;
    p0 = null;
  ***REMOVED***
  
  // Finds the left-right distance between two longitudes.
  // This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
  // the distance between ±180° to be 360°.
  function angle(lambda0, lambda1) ***REMOVED***
    return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
  ***REMOVED***
  
  function rangeCompare(a, b) ***REMOVED***
    return a[0] - b[0];
  ***REMOVED***
  
  function rangeContains(range, x) ***REMOVED***
    return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
  ***REMOVED***
  
  var bounds = function(feature) ***REMOVED***
    var i, n, a, b, merged, deltaMax, delta;
  
    phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
    ranges = [];
    geoStream(feature, boundsStream);
  
    // First, sort ranges by their minimum longitudes.
    if (n = ranges.length) ***REMOVED***
      ranges.sort(rangeCompare);
  
      // Then, merge any ranges that overlap.
      for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) ***REMOVED***
        b = ranges[i];
        if (rangeContains(a, b[0]) || rangeContains(a, b[1])) ***REMOVED***
          if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
          if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
        ***REMOVED*** else ***REMOVED***
          merged.push(a = b);
        ***REMOVED***
      ***REMOVED***
  
      // Finally, find the largest gap between the merged ranges.
      // The final bounding box will be the inverse of this gap.
      for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) ***REMOVED***
        b = merged[i];
        if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
      ***REMOVED***
    ***REMOVED***
  
    ranges = range$1 = null;
  
    return lambda0$1 === Infinity || phi0 === Infinity
        ? [[NaN, NaN], [NaN, NaN]]
        : [[lambda0$1, phi0], [lambda1, phi1]];
  ***REMOVED***;
  
  var W0;
  var W1;
  var X0;
  var Y0;
  var Z0;
  var X1;
  var Y1;
  var Z1;
  var X2;
  var Y2;
  var Z2;
  var lambda00$2;
  var phi00$2;
  var x0;
  var y0;
  var z0; // previous point
  
  var centroidStream = ***REMOVED***
    sphere: noop$2,
    point: centroidPoint,
    lineStart: centroidLineStart,
    lineEnd: centroidLineEnd,
    polygonStart: function() ***REMOVED***
      centroidStream.lineStart = centroidRingStart;
      centroidStream.lineEnd = centroidRingEnd;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      centroidStream.lineStart = centroidLineStart;
      centroidStream.lineEnd = centroidLineEnd;
    ***REMOVED***
  ***REMOVED***;
  
  // Arithmetic mean of Cartesian vectors.
  function centroidPoint(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    var cosPhi = cos$1(phi);
    centroidPointCartesian(cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi));
  ***REMOVED***
  
  function centroidPointCartesian(x, y, z) ***REMOVED***
    ++W0;
    X0 += (x - X0) / W0;
    Y0 += (y - Y0) / W0;
    Z0 += (z - Z0) / W0;
  ***REMOVED***
  
  function centroidLineStart() ***REMOVED***
    centroidStream.point = centroidLinePointFirst;
  ***REMOVED***
  
  function centroidLinePointFirst(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    var cosPhi = cos$1(phi);
    x0 = cosPhi * cos$1(lambda);
    y0 = cosPhi * sin$1(lambda);
    z0 = sin$1(phi);
    centroidStream.point = centroidLinePoint;
    centroidPointCartesian(x0, y0, z0);
  ***REMOVED***
  
  function centroidLinePoint(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    var cosPhi = cos$1(phi),
        x = cosPhi * cos$1(lambda),
        y = cosPhi * sin$1(lambda),
        z = sin$1(phi),
        w = atan2(sqrt$1((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
  ***REMOVED***
  
  function centroidLineEnd() ***REMOVED***
    centroidStream.point = centroidPoint;
  ***REMOVED***
  
  // See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
  // J. Applied Mechanics 42, 239 (1975).
  function centroidRingStart() ***REMOVED***
    centroidStream.point = centroidRingPointFirst;
  ***REMOVED***
  
  function centroidRingEnd() ***REMOVED***
    centroidRingPoint(lambda00$2, phi00$2);
    centroidStream.point = centroidPoint;
  ***REMOVED***
  
  function centroidRingPointFirst(lambda, phi) ***REMOVED***
    lambda00$2 = lambda, phi00$2 = phi;
    lambda *= radians, phi *= radians;
    centroidStream.point = centroidRingPoint;
    var cosPhi = cos$1(phi);
    x0 = cosPhi * cos$1(lambda);
    y0 = cosPhi * sin$1(lambda);
    z0 = sin$1(phi);
    centroidPointCartesian(x0, y0, z0);
  ***REMOVED***
  
  function centroidRingPoint(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    var cosPhi = cos$1(phi),
        x = cosPhi * cos$1(lambda),
        y = cosPhi * sin$1(lambda),
        z = sin$1(phi),
        cx = y0 * z - z0 * y,
        cy = z0 * x - x0 * z,
        cz = x0 * y - y0 * x,
        m = sqrt$1(cx * cx + cy * cy + cz * cz),
        u = x0 * x + y0 * y + z0 * z,
        v = m && -acos(u) / m, // area weight
        w = atan2(m, u); // line weight
    X2 += v * cx;
    Y2 += v * cy;
    Z2 += v * cz;
    W1 += w;
    X1 += w * (x0 + (x0 = x));
    Y1 += w * (y0 + (y0 = y));
    Z1 += w * (z0 + (z0 = z));
    centroidPointCartesian(x0, y0, z0);
  ***REMOVED***
  
  var centroid$1 = function(object) ***REMOVED***
    W0 = W1 =
    X0 = Y0 = Z0 =
    X1 = Y1 = Z1 =
    X2 = Y2 = Z2 = 0;
    geoStream(object, centroidStream);
  
    var x = X2,
        y = Y2,
        z = Z2,
        m = x * x + y * y + z * z;
  
    // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
    if (m < epsilon2$2) ***REMOVED***
      x = X1, y = Y1, z = Z1;
      // If the feature has zero length, fall back to arithmetic mean of point vectors.
      if (W1 < epsilon$4) x = X0, y = Y0, z = Z0;
      m = x * x + y * y + z * z;
      // If the feature still has an undefined ccentroid, then return.
      if (m < epsilon2$2) return [NaN, NaN];
    ***REMOVED***
  
    return [atan2(y, x) * degrees$1, asin$1(z / sqrt$1(m)) * degrees$1];
  ***REMOVED***;
  
  var constant$12 = function(x) ***REMOVED***
    return function() ***REMOVED***
      return x;
    ***REMOVED***;
  ***REMOVED***;
  
  var compose = function(a, b) ***REMOVED***
  
    function compose(x, y) ***REMOVED***
      return x = a(x, y), b(x[0], x[1]);
    ***REMOVED***
  
    if (a.invert && b.invert) compose.invert = function(x, y) ***REMOVED***
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    ***REMOVED***;
  
    return compose;
  ***REMOVED***;
  
  function rotationIdentity(lambda, phi) ***REMOVED***
    return [lambda > pi$4 ? lambda - tau$4 : lambda < -pi$4 ? lambda + tau$4 : lambda, phi];
  ***REMOVED***
  
  rotationIdentity.invert = rotationIdentity;
  
  function rotateRadians(deltaLambda, deltaPhi, deltaGamma) ***REMOVED***
    return (deltaLambda %= tau$4) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
      : rotationLambda(deltaLambda))
      : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
      : rotationIdentity);
  ***REMOVED***
  
  function forwardRotationLambda(deltaLambda) ***REMOVED***
    return function(lambda, phi) ***REMOVED***
      return lambda += deltaLambda, [lambda > pi$4 ? lambda - tau$4 : lambda < -pi$4 ? lambda + tau$4 : lambda, phi];
    ***REMOVED***;
  ***REMOVED***
  
  function rotationLambda(deltaLambda) ***REMOVED***
    var rotation = forwardRotationLambda(deltaLambda);
    rotation.invert = forwardRotationLambda(-deltaLambda);
    return rotation;
  ***REMOVED***
  
  function rotationPhiGamma(deltaPhi, deltaGamma) ***REMOVED***
    var cosDeltaPhi = cos$1(deltaPhi),
        sinDeltaPhi = sin$1(deltaPhi),
        cosDeltaGamma = cos$1(deltaGamma),
        sinDeltaGamma = sin$1(deltaGamma);
  
    function rotation(lambda, phi) ***REMOVED***
      var cosPhi = cos$1(phi),
          x = cos$1(lambda) * cosPhi,
          y = sin$1(lambda) * cosPhi,
          z = sin$1(phi),
          k = z * cosDeltaPhi + x * sinDeltaPhi;
      return [
        atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
        asin$1(k * cosDeltaGamma + y * sinDeltaGamma)
      ];
    ***REMOVED***
  
    rotation.invert = function(lambda, phi) ***REMOVED***
      var cosPhi = cos$1(phi),
          x = cos$1(lambda) * cosPhi,
          y = sin$1(lambda) * cosPhi,
          z = sin$1(phi),
          k = z * cosDeltaGamma - y * sinDeltaGamma;
      return [
        atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
        asin$1(k * cosDeltaPhi - x * sinDeltaPhi)
      ];
    ***REMOVED***;
  
    return rotation;
  ***REMOVED***
  
  var rotation = function(rotate) ***REMOVED***
    rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);
  
    function forward(coordinates) ***REMOVED***
      coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
      return coordinates[0] *= degrees$1, coordinates[1] *= degrees$1, coordinates;
    ***REMOVED***
  
    forward.invert = function(coordinates) ***REMOVED***
      coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
      return coordinates[0] *= degrees$1, coordinates[1] *= degrees$1, coordinates;
    ***REMOVED***;
  
    return forward;
  ***REMOVED***;
  
  // Generates a circle centered at [0°, 0°], with a given radius and precision.
  function circleStream(stream, radius, delta, direction, t0, t1) ***REMOVED***
    if (!delta) return;
    var cosRadius = cos$1(radius),
        sinRadius = sin$1(radius),
        step = direction * delta;
    if (t0 == null) ***REMOVED***
      t0 = radius + direction * tau$4;
      t1 = radius - step / 2;
    ***REMOVED*** else ***REMOVED***
      t0 = circleRadius(cosRadius, t0);
      t1 = circleRadius(cosRadius, t1);
      if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau$4;
    ***REMOVED***
    for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) ***REMOVED***
      point = spherical([cosRadius, -sinRadius * cos$1(t), -sinRadius * sin$1(t)]);
      stream.point(point[0], point[1]);
    ***REMOVED***
  ***REMOVED***
  
  // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
  function circleRadius(cosRadius, point) ***REMOVED***
    point = cartesian(point), point[0] -= cosRadius;
    cartesianNormalizeInPlace(point);
    var radius = acos(-point[1]);
    return ((-point[2] < 0 ? -radius : radius) + tau$4 - epsilon$4) % tau$4;
  ***REMOVED***
  
  var circle$1 = function() ***REMOVED***
    var center = constant$12([0, 0]),
        radius = constant$12(90),
        precision = constant$12(6),
        ring,
        rotate,
        stream = ***REMOVED***point: point***REMOVED***;
  
    function point(x, y) ***REMOVED***
      ring.push(x = rotate(x, y));
      x[0] *= degrees$1, x[1] *= degrees$1;
    ***REMOVED***
  
    function circle() ***REMOVED***
      var c = center.apply(this, arguments),
          r = radius.apply(this, arguments) * radians,
          p = precision.apply(this, arguments) * radians;
      ring = [];
      rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
      circleStream(stream, r, p, 1);
      c = ***REMOVED***type: "Polygon", coordinates: [ring]***REMOVED***;
      ring = rotate = null;
      return c;
    ***REMOVED***
  
    circle.center = function(_) ***REMOVED***
      return arguments.length ? (center = typeof _ === "function" ? _ : constant$12([+_[0], +_[1]]), circle) : center;
    ***REMOVED***;
  
    circle.radius = function(_) ***REMOVED***
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$12(+_), circle) : radius;
    ***REMOVED***;
  
    circle.precision = function(_) ***REMOVED***
      return arguments.length ? (precision = typeof _ === "function" ? _ : constant$12(+_), circle) : precision;
    ***REMOVED***;
  
    return circle;
  ***REMOVED***;
  
  var clipBuffer = function() ***REMOVED***
    var lines = [],
        line;
    return ***REMOVED***
      point: function(x, y) ***REMOVED***
        line.push([x, y]);
      ***REMOVED***,
      lineStart: function() ***REMOVED***
        lines.push(line = []);
      ***REMOVED***,
      lineEnd: noop$2,
      rejoin: function() ***REMOVED***
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      ***REMOVED***,
      result: function() ***REMOVED***
        var result = lines;
        lines = [];
        line = null;
        return result;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  var clipLine = function(a, b, x0, y0, x1, y1) ***REMOVED***
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1],
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay,
        r;
  
    r = x0 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED*** else if (dx > 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED***
  
    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED*** else if (dx > 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED***
  
    r = y0 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED*** else if (dy > 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED***
  
    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) ***REMOVED***
      if (r > t1) return;
      if (r > t0) t0 = r;
    ***REMOVED*** else if (dy > 0) ***REMOVED***
      if (r < t0) return;
      if (r < t1) t1 = r;
    ***REMOVED***
  
    if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
    if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
    return true;
  ***REMOVED***;
  
  var pointEqual = function(a, b) ***REMOVED***
    return abs(a[0] - b[0]) < epsilon$4 && abs(a[1] - b[1]) < epsilon$4;
  ***REMOVED***;
  
  function Intersection(point, points, other, entry) ***REMOVED***
    this.x = point;
    this.z = points;
    this.o = other; // another intersection
    this.e = entry; // is an entry?
    this.v = false; // visited
    this.n = this.p = null; // next & previous
  ***REMOVED***
  
  // A generalized polygon clipping algorithm: given a polygon that has been cut
  // into its visible line segments, and rejoins the segments by interpolating
  // along the clip edge.
  var clipPolygon = function(segments, compareIntersection, startInside, interpolate, stream) ***REMOVED***
    var subject = [],
        clip = [],
        i,
        n;
  
    segments.forEach(function(segment) ***REMOVED***
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n], x;
  
      // If the first and last points of a segment are coincident, then treat as a
      // closed ring. TODO if all rings are closed, then the winding order of the
      // exterior ring should be checked.
      if (pointEqual(p0, p1)) ***REMOVED***
        stream.lineStart();
        for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
        stream.lineEnd();
        return;
      ***REMOVED***
  
      subject.push(x = new Intersection(p0, segment, null, true));
      clip.push(x.o = new Intersection(p0, null, x, false));
      subject.push(x = new Intersection(p1, segment, null, false));
      clip.push(x.o = new Intersection(p1, null, x, true));
    ***REMOVED***);
  
    if (!subject.length) return;
  
    clip.sort(compareIntersection);
    link$1(subject);
    link$1(clip);
  
    for (i = 0, n = clip.length; i < n; ++i) ***REMOVED***
      clip[i].e = startInside = !startInside;
    ***REMOVED***
  
    var start = subject[0],
        points,
        point;
  
    while (1) ***REMOVED***
      // Find first unvisited intersection.
      var current = start,
          isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      stream.lineStart();
      do ***REMOVED***
        current.v = current.o.v = true;
        if (current.e) ***REMOVED***
          if (isSubject) ***REMOVED***
            for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
          ***REMOVED*** else ***REMOVED***
            interpolate(current.x, current.n.x, 1, stream);
          ***REMOVED***
          current = current.n;
        ***REMOVED*** else ***REMOVED***
          if (isSubject) ***REMOVED***
            points = current.p.z;
            for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
          ***REMOVED*** else ***REMOVED***
            interpolate(current.x, current.p.x, -1, stream);
          ***REMOVED***
          current = current.p;
        ***REMOVED***
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      ***REMOVED*** while (!current.v);
      stream.lineEnd();
    ***REMOVED***
  ***REMOVED***;
  
  function link$1(array) ***REMOVED***
    if (!(n = array.length)) return;
    var n,
        i = 0,
        a = array[0],
        b;
    while (++i < n) ***REMOVED***
      a.n = b = array[i];
      b.p = a;
      a = b;
    ***REMOVED***
    a.n = b = array[0];
    b.p = a;
  ***REMOVED***
  
  var clipMax = 1e9;
  var clipMin = -clipMax;
  
  // TODO Use d3-polygon’s polygonContains here for the ring check?
  // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?
  
  function clipExtent(x0, y0, x1, y1) ***REMOVED***
  
    function visible(x, y) ***REMOVED***
      return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    ***REMOVED***
  
    function interpolate(from, to, direction, stream) ***REMOVED***
      var a = 0, a1 = 0;
      if (from == null
          || (a = corner(from, direction)) !== (a1 = corner(to, direction))
          || comparePoint(from, to) < 0 ^ direction > 0) ***REMOVED***
        do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
        while ((a = (a + direction + 4) % 4) !== a1);
      ***REMOVED*** else ***REMOVED***
        stream.point(to[0], to[1]);
      ***REMOVED***
    ***REMOVED***
  
    function corner(p, direction) ***REMOVED***
      return abs(p[0] - x0) < epsilon$4 ? direction > 0 ? 0 : 3
          : abs(p[0] - x1) < epsilon$4 ? direction > 0 ? 2 : 1
          : abs(p[1] - y0) < epsilon$4 ? direction > 0 ? 1 : 0
          : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
    ***REMOVED***
  
    function compareIntersection(a, b) ***REMOVED***
      return comparePoint(a.x, b.x);
    ***REMOVED***
  
    function comparePoint(a, b) ***REMOVED***
      var ca = corner(a, 1),
          cb = corner(b, 1);
      return ca !== cb ? ca - cb
          : ca === 0 ? b[1] - a[1]
          : ca === 1 ? a[0] - b[0]
          : ca === 2 ? a[1] - b[1]
          : b[0] - a[0];
    ***REMOVED***
  
    return function(stream) ***REMOVED***
      var activeStream = stream,
          bufferStream = clipBuffer(),
          segments,
          polygon,
          ring,
          x__, y__, v__, // first point
          x_, y_, v_, // previous point
          first,
          clean;
  
      var clipStream = ***REMOVED***
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: polygonStart,
        polygonEnd: polygonEnd
      ***REMOVED***;
  
      function point(x, y) ***REMOVED***
        if (visible(x, y)) activeStream.point(x, y);
      ***REMOVED***
  
      function polygonInside() ***REMOVED***
        var winding = 0;
  
        for (var i = 0, n = polygon.length; i < n; ++i) ***REMOVED***
          for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) ***REMOVED***
            a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
            if (a1 <= y1) ***REMOVED*** if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; ***REMOVED***
            else ***REMOVED*** if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; ***REMOVED***
          ***REMOVED***
        ***REMOVED***
  
        return winding;
      ***REMOVED***
  
      // Buffer geometry within a polygon and then clip it en masse.
      function polygonStart() ***REMOVED***
        activeStream = bufferStream, segments = [], polygon = [], clean = true;
      ***REMOVED***
  
      function polygonEnd() ***REMOVED***
        var startInside = polygonInside(),
            cleanInside = clean && startInside,
            visible = (segments = merge(segments)).length;
        if (cleanInside || visible) ***REMOVED***
          stream.polygonStart();
          if (cleanInside) ***REMOVED***
            stream.lineStart();
            interpolate(null, null, 1, stream);
            stream.lineEnd();
          ***REMOVED***
          if (visible) ***REMOVED***
            clipPolygon(segments, compareIntersection, startInside, interpolate, stream);
          ***REMOVED***
          stream.polygonEnd();
        ***REMOVED***
        activeStream = stream, segments = polygon = ring = null;
      ***REMOVED***
  
      function lineStart() ***REMOVED***
        clipStream.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      ***REMOVED***
  
      // TODO rather than special-case polygons, simply handle them separately.
      // Ideally, coincident intersection points should be jittered to avoid
      // clipping issues.
      function lineEnd() ***REMOVED***
        if (segments) ***REMOVED***
          linePoint(x__, y__);
          if (v__ && v_) bufferStream.rejoin();
          segments.push(bufferStream.result());
        ***REMOVED***
        clipStream.point = point;
        if (v_) activeStream.lineEnd();
      ***REMOVED***
  
      function linePoint(x, y) ***REMOVED***
        var v = visible(x, y);
        if (polygon) ring.push([x, y]);
        if (first) ***REMOVED***
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) ***REMOVED***
            activeStream.lineStart();
            activeStream.point(x, y);
          ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          if (v && v_) activeStream.point(x, y);
          else ***REMOVED***
            var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
                b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
            if (clipLine(a, b, x0, y0, x1, y1)) ***REMOVED***
              if (!v_) ***REMOVED***
                activeStream.lineStart();
                activeStream.point(a[0], a[1]);
              ***REMOVED***
              activeStream.point(b[0], b[1]);
              if (!v) activeStream.lineEnd();
              clean = false;
            ***REMOVED*** else if (v) ***REMOVED***
              activeStream.lineStart();
              activeStream.point(x, y);
              clean = false;
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
        x_ = x, y_ = y, v_ = v;
      ***REMOVED***
  
      return clipStream;
    ***REMOVED***;
  ***REMOVED***
  
  var extent$1 = function() ***REMOVED***
    var x0 = 0,
        y0 = 0,
        x1 = 960,
        y1 = 500,
        cache,
        cacheStream,
        clip;
  
    return clip = ***REMOVED***
      stream: function(stream) ***REMOVED***
        return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
      ***REMOVED***,
      extent: function(_) ***REMOVED***
        return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  var lengthSum = adder();
  var lambda0$2;
  var sinPhi0$1;
  var cosPhi0$1;
  
  var lengthStream = ***REMOVED***
    sphere: noop$2,
    point: noop$2,
    lineStart: lengthLineStart,
    lineEnd: noop$2,
    polygonStart: noop$2,
    polygonEnd: noop$2
  ***REMOVED***;
  
  function lengthLineStart() ***REMOVED***
    lengthStream.point = lengthPointFirst;
    lengthStream.lineEnd = lengthLineEnd;
  ***REMOVED***
  
  function lengthLineEnd() ***REMOVED***
    lengthStream.point = lengthStream.lineEnd = noop$2;
  ***REMOVED***
  
  function lengthPointFirst(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    lambda0$2 = lambda, sinPhi0$1 = sin$1(phi), cosPhi0$1 = cos$1(phi);
    lengthStream.point = lengthPoint;
  ***REMOVED***
  
  function lengthPoint(lambda, phi) ***REMOVED***
    lambda *= radians, phi *= radians;
    var sinPhi = sin$1(phi),
        cosPhi = cos$1(phi),
        delta = abs(lambda - lambda0$2),
        cosDelta = cos$1(delta),
        sinDelta = sin$1(delta),
        x = cosPhi * sinDelta,
        y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
        z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
    lengthSum.add(atan2(sqrt$1(x * x + y * y), z));
    lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
  ***REMOVED***
  
  var length$2 = function(object) ***REMOVED***
    lengthSum.reset();
    geoStream(object, lengthStream);
    return +lengthSum;
  ***REMOVED***;
  
  var coordinates = [null, null];
  var object$1 = ***REMOVED***type: "LineString", coordinates: coordinates***REMOVED***;
  
  var distance = function(a, b) ***REMOVED***
    coordinates[0] = a;
    coordinates[1] = b;
    return length$2(object$1);
  ***REMOVED***;
  
  function graticuleX(y0, y1, dy) ***REMOVED***
    var y = range(y0, y1 - epsilon$4, dy).concat(y1);
    return function(x) ***REMOVED*** return y.map(function(y) ***REMOVED*** return [x, y]; ***REMOVED***); ***REMOVED***;
  ***REMOVED***
  
  function graticuleY(x0, x1, dx) ***REMOVED***
    var x = range(x0, x1 - epsilon$4, dx).concat(x1);
    return function(y) ***REMOVED*** return x.map(function(x) ***REMOVED*** return [x, y]; ***REMOVED***); ***REMOVED***;
  ***REMOVED***
  
  function graticule() ***REMOVED***
    var x1, x0, X1, X0,
        y1, y0, Y1, Y0,
        dx = 10, dy = dx, DX = 90, DY = 360,
        x, y, X, Y,
        precision = 2.5;
  
    function graticule() ***REMOVED***
      return ***REMOVED***type: "MultiLineString", coordinates: lines()***REMOVED***;
    ***REMOVED***
  
    function lines() ***REMOVED***
      return range(ceil(X0 / DX) * DX, X1, DX).map(X)
          .concat(range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
          .concat(range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) ***REMOVED*** return abs(x % DX) > epsilon$4; ***REMOVED***).map(x))
          .concat(range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) ***REMOVED*** return abs(y % DY) > epsilon$4; ***REMOVED***).map(y));
    ***REMOVED***
  
    graticule.lines = function() ***REMOVED***
      return lines().map(function(coordinates) ***REMOVED*** return ***REMOVED***type: "LineString", coordinates: coordinates***REMOVED***; ***REMOVED***);
    ***REMOVED***;
  
    graticule.outline = function() ***REMOVED***
      return ***REMOVED***
        type: "Polygon",
        coordinates: [
          X(X0).concat(
          Y(Y1).slice(1),
          X(X1).reverse().slice(1),
          Y(Y0).reverse().slice(1))
        ]
      ***REMOVED***;
    ***REMOVED***;
  
    graticule.extent = function(_) ***REMOVED***
      if (!arguments.length) return graticule.extentMinor();
      return graticule.extentMajor(_).extentMinor(_);
    ***REMOVED***;
  
    graticule.extentMajor = function(_) ***REMOVED***
      if (!arguments.length) return [[X0, Y0], [X1, Y1]];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    ***REMOVED***;
  
    graticule.extentMinor = function(_) ***REMOVED***
      if (!arguments.length) return [[x0, y0], [x1, y1]];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    ***REMOVED***;
  
    graticule.step = function(_) ***REMOVED***
      if (!arguments.length) return graticule.stepMinor();
      return graticule.stepMajor(_).stepMinor(_);
    ***REMOVED***;
  
    graticule.stepMajor = function(_) ***REMOVED***
      if (!arguments.length) return [DX, DY];
      DX = +_[0], DY = +_[1];
      return graticule;
    ***REMOVED***;
  
    graticule.stepMinor = function(_) ***REMOVED***
      if (!arguments.length) return [dx, dy];
      dx = +_[0], dy = +_[1];
      return graticule;
    ***REMOVED***;
  
    graticule.precision = function(_) ***REMOVED***
      if (!arguments.length) return precision;
      precision = +_;
      x = graticuleX(y0, y1, 90);
      y = graticuleY(x0, x1, precision);
      X = graticuleX(Y0, Y1, 90);
      Y = graticuleY(X0, X1, precision);
      return graticule;
    ***REMOVED***;
  
    return graticule
        .extentMajor([[-180, -90 + epsilon$4], [180, 90 - epsilon$4]])
        .extentMinor([[-180, -80 - epsilon$4], [180, 80 + epsilon$4]]);
  ***REMOVED***
  
  function graticule10() ***REMOVED***
    return graticule()();
  ***REMOVED***
  
  var interpolate$2 = function(a, b) ***REMOVED***
    var x0 = a[0] * radians,
        y0 = a[1] * radians,
        x1 = b[0] * radians,
        y1 = b[1] * radians,
        cy0 = cos$1(y0),
        sy0 = sin$1(y0),
        cy1 = cos$1(y1),
        sy1 = sin$1(y1),
        kx0 = cy0 * cos$1(x0),
        ky0 = cy0 * sin$1(x0),
        kx1 = cy1 * cos$1(x1),
        ky1 = cy1 * sin$1(x1),
        d = 2 * asin$1(sqrt$1(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
        k = sin$1(d);
  
    var interpolate = d ? function(t) ***REMOVED***
      var B = sin$1(t *= d) / k,
          A = sin$1(d - t) / k,
          x = A * kx0 + B * kx1,
          y = A * ky0 + B * ky1,
          z = A * sy0 + B * sy1;
      return [
        atan2(y, x) * degrees$1,
        atan2(z, sqrt$1(x * x + y * y)) * degrees$1
      ];
    ***REMOVED*** : function() ***REMOVED***
      return [x0 * degrees$1, y0 * degrees$1];
    ***REMOVED***;
  
    interpolate.distance = d;
  
    return interpolate;
  ***REMOVED***;
  
  var identity$7 = function(x) ***REMOVED***
    return x;
  ***REMOVED***;
  
  var areaSum$1 = adder();
  var areaRingSum$1 = adder();
  var x00;
  var y00;
  var x0$1;
  var y0$1;
  
  var areaStream$1 = ***REMOVED***
    point: noop$2,
    lineStart: noop$2,
    lineEnd: noop$2,
    polygonStart: function() ***REMOVED***
      areaStream$1.lineStart = areaRingStart$1;
      areaStream$1.lineEnd = areaRingEnd$1;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop$2;
      areaSum$1.add(abs(areaRingSum$1));
      areaRingSum$1.reset();
    ***REMOVED***,
    result: function() ***REMOVED***
      var area = areaSum$1 / 2;
      areaSum$1.reset();
      return area;
    ***REMOVED***
  ***REMOVED***;
  
  function areaRingStart$1() ***REMOVED***
    areaStream$1.point = areaPointFirst$1;
  ***REMOVED***
  
  function areaPointFirst$1(x, y) ***REMOVED***
    areaStream$1.point = areaPoint$1;
    x00 = x0$1 = x, y00 = y0$1 = y;
  ***REMOVED***
  
  function areaPoint$1(x, y) ***REMOVED***
    areaRingSum$1.add(y0$1 * x - x0$1 * y);
    x0$1 = x, y0$1 = y;
  ***REMOVED***
  
  function areaRingEnd$1() ***REMOVED***
    areaPoint$1(x00, y00);
  ***REMOVED***
  
  var x0$2 = Infinity;
  var y0$2 = x0$2;
  var x1 = -x0$2;
  var y1 = x1;
  
  var boundsStream$1 = ***REMOVED***
    point: boundsPoint$1,
    lineStart: noop$2,
    lineEnd: noop$2,
    polygonStart: noop$2,
    polygonEnd: noop$2,
    result: function() ***REMOVED***
      var bounds = [[x0$2, y0$2], [x1, y1]];
      x1 = y1 = -(y0$2 = x0$2 = Infinity);
      return bounds;
    ***REMOVED***
  ***REMOVED***;
  
  function boundsPoint$1(x, y) ***REMOVED***
    if (x < x0$2) x0$2 = x;
    if (x > x1) x1 = x;
    if (y < y0$2) y0$2 = y;
    if (y > y1) y1 = y;
  ***REMOVED***
  
  // TODO Enforce positive area for exterior, negative area for interior?
  
  var X0$1 = 0;
  var Y0$1 = 0;
  var Z0$1 = 0;
  var X1$1 = 0;
  var Y1$1 = 0;
  var Z1$1 = 0;
  var X2$1 = 0;
  var Y2$1 = 0;
  var Z2$1 = 0;
  var x00$1;
  var y00$1;
  var x0$3;
  var y0$3;
  
  var centroidStream$1 = ***REMOVED***
    point: centroidPoint$1,
    lineStart: centroidLineStart$1,
    lineEnd: centroidLineEnd$1,
    polygonStart: function() ***REMOVED***
      centroidStream$1.lineStart = centroidRingStart$1;
      centroidStream$1.lineEnd = centroidRingEnd$1;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      centroidStream$1.point = centroidPoint$1;
      centroidStream$1.lineStart = centroidLineStart$1;
      centroidStream$1.lineEnd = centroidLineEnd$1;
    ***REMOVED***,
    result: function() ***REMOVED***
      var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
          : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
          : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
          : [NaN, NaN];
      X0$1 = Y0$1 = Z0$1 =
      X1$1 = Y1$1 = Z1$1 =
      X2$1 = Y2$1 = Z2$1 = 0;
      return centroid;
    ***REMOVED***
  ***REMOVED***;
  
  function centroidPoint$1(x, y) ***REMOVED***
    X0$1 += x;
    Y0$1 += y;
    ++Z0$1;
  ***REMOVED***
  
  function centroidLineStart$1() ***REMOVED***
    centroidStream$1.point = centroidPointFirstLine;
  ***REMOVED***
  
  function centroidPointFirstLine(x, y) ***REMOVED***
    centroidStream$1.point = centroidPointLine;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  ***REMOVED***
  
  function centroidPointLine(x, y) ***REMOVED***
    var dx = x - x0$3, dy = y - y0$3, z = sqrt$1(dx * dx + dy * dy);
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  ***REMOVED***
  
  function centroidLineEnd$1() ***REMOVED***
    centroidStream$1.point = centroidPoint$1;
  ***REMOVED***
  
  function centroidRingStart$1() ***REMOVED***
    centroidStream$1.point = centroidPointFirstRing;
  ***REMOVED***
  
  function centroidRingEnd$1() ***REMOVED***
    centroidPointRing(x00$1, y00$1);
  ***REMOVED***
  
  function centroidPointFirstRing(x, y) ***REMOVED***
    centroidStream$1.point = centroidPointRing;
    centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
  ***REMOVED***
  
  function centroidPointRing(x, y) ***REMOVED***
    var dx = x - x0$3,
        dy = y - y0$3,
        z = sqrt$1(dx * dx + dy * dy);
  
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
  
    z = y0$3 * x - x0$3 * y;
    X2$1 += z * (x0$3 + x);
    Y2$1 += z * (y0$3 + y);
    Z2$1 += z * 3;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  ***REMOVED***
  
  function PathContext(context) ***REMOVED***
    this._context = context;
  ***REMOVED***
  
  PathContext.prototype = ***REMOVED***
    _radius: 4.5,
    pointRadius: function(_) ***REMOVED***
      return this._radius = _, this;
    ***REMOVED***,
    polygonStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line === 0) this._context.closePath();
      this._point = NaN;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      switch (this._point) ***REMOVED***
        case 0: ***REMOVED***
          this._context.moveTo(x, y);
          this._point = 1;
          break;
        ***REMOVED***
        case 1: ***REMOVED***
          this._context.lineTo(x, y);
          break;
        ***REMOVED***
        default: ***REMOVED***
          this._context.moveTo(x + this._radius, y);
          this._context.arc(x, y, this._radius, 0, tau$4);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    result: noop$2
  ***REMOVED***;
  
  function PathString() ***REMOVED***
    this._string = [];
  ***REMOVED***
  
  PathString.prototype = ***REMOVED***
    _circle: circle$2(4.5),
    pointRadius: function(_) ***REMOVED***
      return this._circle = circle$2(_), this;
    ***REMOVED***,
    polygonStart: function() ***REMOVED***
      this._line = 0;
    ***REMOVED***,
    polygonEnd: function() ***REMOVED***
      this._line = NaN;
    ***REMOVED***,
    lineStart: function() ***REMOVED***
      this._point = 0;
    ***REMOVED***,
    lineEnd: function() ***REMOVED***
      if (this._line === 0) this._string.push("Z");
      this._point = NaN;
    ***REMOVED***,
    point: function(x, y) ***REMOVED***
      switch (this._point) ***REMOVED***
        case 0: ***REMOVED***
          this._string.push("M", x, ",", y);
          this._point = 1;
          break;
        ***REMOVED***
        case 1: ***REMOVED***
          this._string.push("L", x, ",", y);
          break;
        ***REMOVED***
        default: ***REMOVED***
          this._string.push("M", x, ",", y, this._circle);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    result: function() ***REMOVED***
      if (this._string.length) ***REMOVED***
        var result = this._string.join("");
        this._string = [];
        return result;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;
  
  function circle$2(radius) ***REMOVED***
    return "m0," + radius
        + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
        + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
        + "z";
  ***REMOVED***
  
  var index$3 = function(projection, context) ***REMOVED***
    var pointRadius = 4.5,
        projectionStream,
        contextStream;
  
    function path(object) ***REMOVED***
      if (object) ***REMOVED***
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        geoStream(object, projectionStream(contextStream));
      ***REMOVED***
      return contextStream.result();
    ***REMOVED***
  
    path.area = function(object) ***REMOVED***
      geoStream(object, projectionStream(areaStream$1));
      return areaStream$1.result();
    ***REMOVED***;
  
    path.bounds = function(object) ***REMOVED***
      geoStream(object, projectionStream(boundsStream$1));
      return boundsStream$1.result();
    ***REMOVED***;
  
    path.centroid = function(object) ***REMOVED***
      geoStream(object, projectionStream(centroidStream$1));
      return centroidStream$1.result();
    ***REMOVED***;
  
    path.projection = function(_) ***REMOVED***
      return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$7) : (projection = _).stream, path) : projection;
    ***REMOVED***;
  
    path.context = function(_) ***REMOVED***
      if (!arguments.length) return context;
      contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return path;
    ***REMOVED***;
  
    path.pointRadius = function(_) ***REMOVED***
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    ***REMOVED***;
  
    return path.projection(projection).context(context);
  ***REMOVED***;
  
  var sum$2 = adder();
  
  var polygonContains = function(polygon, point) ***REMOVED***
    var lambda = point[0],
        phi = point[1],
        normal = [sin$1(lambda), -cos$1(lambda), 0],
        angle = 0,
        winding = 0;
  
    sum$2.reset();
  
    for (var i = 0, n = polygon.length; i < n; ++i) ***REMOVED***
      if (!(m = (ring = polygon[i]).length)) continue;
      var ring,
          m,
          point0 = ring[m - 1],
          lambda0 = point0[0],
          phi0 = point0[1] / 2 + quarterPi,
          sinPhi0 = sin$1(phi0),
          cosPhi0 = cos$1(phi0);
  
      for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) ***REMOVED***
        var point1 = ring[j],
            lambda1 = point1[0],
            phi1 = point1[1] / 2 + quarterPi,
            sinPhi1 = sin$1(phi1),
            cosPhi1 = cos$1(phi1),
            delta = lambda1 - lambda0,
            sign$$1 = delta >= 0 ? 1 : -1,
            absDelta = sign$$1 * delta,
            antimeridian = absDelta > pi$4,
            k = sinPhi0 * sinPhi1;
  
        sum$2.add(atan2(k * sign$$1 * sin$1(absDelta), cosPhi0 * cosPhi1 + k * cos$1(absDelta)));
        angle += antimeridian ? delta + sign$$1 * tau$4 : delta;
  
        // Are the longitudes either side of the point’s meridian (lambda),
        // and are the latitudes smaller than the parallel (phi)?
        if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) ***REMOVED***
          var arc = cartesianCross(cartesian(point0), cartesian(point1));
          cartesianNormalizeInPlace(arc);
          var intersection = cartesianCross(normal, arc);
          cartesianNormalizeInPlace(intersection);
          var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin$1(intersection[2]);
          if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) ***REMOVED***
            winding += antimeridian ^ delta >= 0 ? 1 : -1;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  
    // First, determine whether the South pole is inside or outside:
    //
    // It is inside if:
    // * the polygon winds around it in a clockwise direction.
    // * the polygon does not (cumulatively) wind around it, but has a negative
    //   (counter-clockwise) area.
    //
    // Second, count the (signed) number of times a segment crosses a lambda
    // from the point to the South pole.  If it is zero, then the point is the
    // same side as the South pole.
  
    return (angle < -epsilon$4 || angle < epsilon$4 && sum$2 < -epsilon$4) ^ (winding & 1);
  ***REMOVED***;
  
  var clip = function(pointVisible, clipLine, interpolate, start) ***REMOVED***
    return function(rotate, sink) ***REMOVED***
      var line = clipLine(sink),
          rotatedStart = rotate.invert(start[0], start[1]),
          ringBuffer = clipBuffer(),
          ringSink = clipLine(ringBuffer),
          polygonStarted = false,
          polygon,
          segments,
          ring;
  
      var clip = ***REMOVED***
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() ***REMOVED***
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        ***REMOVED***,
        polygonEnd: function() ***REMOVED***
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = merge(segments);
          var startInside = polygonContains(polygon, rotatedStart);
          if (segments.length) ***REMOVED***
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
          ***REMOVED*** else if (startInside) ***REMOVED***
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            interpolate(null, null, 1, sink);
            sink.lineEnd();
          ***REMOVED***
          if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        ***REMOVED***,
        sphere: function() ***REMOVED***
          sink.polygonStart();
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
          sink.polygonEnd();
        ***REMOVED***
      ***REMOVED***;
  
      function point(lambda, phi) ***REMOVED***
        var point = rotate(lambda, phi);
        if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
      ***REMOVED***
  
      function pointLine(lambda, phi) ***REMOVED***
        var point = rotate(lambda, phi);
        line.point(point[0], point[1]);
      ***REMOVED***
  
      function lineStart() ***REMOVED***
        clip.point = pointLine;
        line.lineStart();
      ***REMOVED***
  
      function lineEnd() ***REMOVED***
        clip.point = point;
        line.lineEnd();
      ***REMOVED***
  
      function pointRing(lambda, phi) ***REMOVED***
        ring.push([lambda, phi]);
        var point = rotate(lambda, phi);
        ringSink.point(point[0], point[1]);
      ***REMOVED***
  
      function ringStart() ***REMOVED***
        ringSink.lineStart();
        ring = [];
      ***REMOVED***
  
      function ringEnd() ***REMOVED***
        pointRing(ring[0][0], ring[0][1]);
        ringSink.lineEnd();
  
        var clean = ringSink.clean(),
            ringSegments = ringBuffer.result(),
            i, n = ringSegments.length, m,
            segment,
            point;
  
        ring.pop();
        polygon.push(ring);
        ring = null;
  
        if (!n) return;
  
        // No intersections.
        if (clean & 1) ***REMOVED***
          segment = ringSegments[0];
          if ((m = segment.length - 1) > 0) ***REMOVED***
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
            sink.lineEnd();
          ***REMOVED***
          return;
        ***REMOVED***
  
        // Rejoin connected segments.
        // TODO reuse ringBuffer.rejoin()?
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
  
        segments.push(ringSegments.filter(validSegment));
      ***REMOVED***
  
      return clip;
    ***REMOVED***;
  ***REMOVED***;
  
  function validSegment(segment) ***REMOVED***
    return segment.length > 1;
  ***REMOVED***
  
  // Intersections are sorted along the clip edge. For both antimeridian cutting
  // and circle clipping, the same comparison is used.
  function compareIntersection(a, b) ***REMOVED***
    return ((a = a.x)[0] < 0 ? a[1] - halfPi$3 - epsilon$4 : halfPi$3 - a[1])
         - ((b = b.x)[0] < 0 ? b[1] - halfPi$3 - epsilon$4 : halfPi$3 - b[1]);
  ***REMOVED***
  
  var clipAntimeridian = clip(
    function() ***REMOVED*** return true; ***REMOVED***,
    clipAntimeridianLine,
    clipAntimeridianInterpolate,
    [-pi$4, -halfPi$3]
  );
  
  // Takes a line and cuts into visible segments. Return values: 0 - there were
  // intersections or the line was empty; 1 - no intersections; 2 - there were
  // intersections, and the first and last segments should be rejoined.
  function clipAntimeridianLine(stream) ***REMOVED***
    var lambda0 = NaN,
        phi0 = NaN,
        sign0 = NaN,
        clean; // no intersections
  
    return ***REMOVED***
      lineStart: function() ***REMOVED***
        stream.lineStart();
        clean = 1;
      ***REMOVED***,
      point: function(lambda1, phi1) ***REMOVED***
        var sign1 = lambda1 > 0 ? pi$4 : -pi$4,
            delta = abs(lambda1 - lambda0);
        if (abs(delta - pi$4) < epsilon$4) ***REMOVED*** // line crosses a pole
          stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi$3 : -halfPi$3);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          stream.point(lambda1, phi0);
          clean = 0;
        ***REMOVED*** else if (sign0 !== sign1 && delta >= pi$4) ***REMOVED*** // line crosses antimeridian
          if (abs(lambda0 - sign0) < epsilon$4) lambda0 -= sign0 * epsilon$4; // handle degeneracies
          if (abs(lambda1 - sign1) < epsilon$4) lambda1 -= sign1 * epsilon$4;
          phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          clean = 0;
        ***REMOVED***
        stream.point(lambda0 = lambda1, phi0 = phi1);
        sign0 = sign1;
      ***REMOVED***,
      lineEnd: function() ***REMOVED***
        stream.lineEnd();
        lambda0 = phi0 = NaN;
      ***REMOVED***,
      clean: function() ***REMOVED***
        return 2 - clean; // if intersections, rejoin first and last segments
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) ***REMOVED***
    var cosPhi0,
        cosPhi1,
        sinLambda0Lambda1 = sin$1(lambda0 - lambda1);
    return abs(sinLambda0Lambda1) > epsilon$4
        ? atan((sin$1(phi0) * (cosPhi1 = cos$1(phi1)) * sin$1(lambda1)
            - sin$1(phi1) * (cosPhi0 = cos$1(phi0)) * sin$1(lambda0))
            / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
        : (phi0 + phi1) / 2;
  ***REMOVED***
  
  function clipAntimeridianInterpolate(from, to, direction, stream) ***REMOVED***
    var phi;
    if (from == null) ***REMOVED***
      phi = direction * halfPi$3;
      stream.point(-pi$4, phi);
      stream.point(0, phi);
      stream.point(pi$4, phi);
      stream.point(pi$4, 0);
      stream.point(pi$4, -phi);
      stream.point(0, -phi);
      stream.point(-pi$4, -phi);
      stream.point(-pi$4, 0);
      stream.point(-pi$4, phi);
    ***REMOVED*** else if (abs(from[0] - to[0]) > epsilon$4) ***REMOVED***
      var lambda = from[0] < to[0] ? pi$4 : -pi$4;
      phi = direction * lambda / 2;
      stream.point(-lambda, phi);
      stream.point(0, phi);
      stream.point(lambda, phi);
    ***REMOVED*** else ***REMOVED***
      stream.point(to[0], to[1]);
    ***REMOVED***
  ***REMOVED***
  
  var clipCircle = function(radius, delta) ***REMOVED***
    var cr = cos$1(radius),
        smallRadius = cr > 0,
        notHemisphere = abs(cr) > epsilon$4; // TODO optimise for this common case
  
    function interpolate(from, to, direction, stream) ***REMOVED***
      circleStream(stream, radius, delta, direction, from, to);
    ***REMOVED***
  
    function visible(lambda, phi) ***REMOVED***
      return cos$1(lambda) * cos$1(phi) > cr;
    ***REMOVED***
  
    // Takes a line and cuts into visible segments. Return values used for polygon
    // clipping: 0 - there were intersections or the line was empty; 1 - no
    // intersections 2 - there were intersections, and the first and last segments
    // should be rejoined.
    function clipLine(stream) ***REMOVED***
      var point0, // previous point
          c0, // code for previous point
          v0, // visibility of previous point
          v00, // visibility of first point
          clean; // no intersections
      return ***REMOVED***
        lineStart: function() ***REMOVED***
          v00 = v0 = false;
          clean = 1;
        ***REMOVED***,
        point: function(lambda, phi) ***REMOVED***
          var point1 = [lambda, phi],
              point2,
              v = visible(lambda, phi),
              c = smallRadius
                ? v ? 0 : code(lambda, phi)
                : v ? code(lambda + (lambda < 0 ? pi$4 : -pi$4), phi) : 0;
          if (!point0 && (v00 = v0 = v)) stream.lineStart();
          // Handle degeneracies.
          // TODO ignore if not clipping polygons.
          if (v !== v0) ***REMOVED***
            point2 = intersect(point0, point1);
            if (pointEqual(point0, point2) || pointEqual(point1, point2)) ***REMOVED***
              point1[0] += epsilon$4;
              point1[1] += epsilon$4;
              v = visible(point1[0], point1[1]);
            ***REMOVED***
          ***REMOVED***
          if (v !== v0) ***REMOVED***
            clean = 0;
            if (v) ***REMOVED***
              // outside going in
              stream.lineStart();
              point2 = intersect(point1, point0);
              stream.point(point2[0], point2[1]);
            ***REMOVED*** else ***REMOVED***
              // inside going out
              point2 = intersect(point0, point1);
              stream.point(point2[0], point2[1]);
              stream.lineEnd();
            ***REMOVED***
            point0 = point2;
          ***REMOVED*** else if (notHemisphere && point0 && smallRadius ^ v) ***REMOVED***
            var t;
            // If the codes for two points are different, or are both zero,
            // and there this segment intersects with the small circle.
            if (!(c & c0) && (t = intersect(point1, point0, true))) ***REMOVED***
              clean = 0;
              if (smallRadius) ***REMOVED***
                stream.lineStart();
                stream.point(t[0][0], t[0][1]);
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
              ***REMOVED*** else ***REMOVED***
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
                stream.lineStart();
                stream.point(t[0][0], t[0][1]);
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
          if (v && (!point0 || !pointEqual(point0, point1))) ***REMOVED***
            stream.point(point1[0], point1[1]);
          ***REMOVED***
          point0 = point1, v0 = v, c0 = c;
        ***REMOVED***,
        lineEnd: function() ***REMOVED***
          if (v0) stream.lineEnd();
          point0 = null;
        ***REMOVED***,
        // Rejoin first and last segments if there were intersections and the first
        // and last points were visible.
        clean: function() ***REMOVED***
          return clean | ((v00 && v0) << 1);
        ***REMOVED***
      ***REMOVED***;
    ***REMOVED***
  
    // Intersects the great circle between a and b with the clip circle.
    function intersect(a, b, two) ***REMOVED***
      var pa = cartesian(a),
          pb = cartesian(b);
  
      // We have two planes, n1.p = d1 and n2.p = d2.
      // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
      var n1 = [1, 0, 0], // normal
          n2 = cartesianCross(pa, pb),
          n2n2 = cartesianDot(n2, n2),
          n1n2 = n2[0], // cartesianDot(n1, n2),
          determinant = n2n2 - n1n2 * n1n2;
  
      // Two polar points.
      if (!determinant) return !two && a;
  
      var c1 =  cr * n2n2 / determinant,
          c2 = -cr * n1n2 / determinant,
          n1xn2 = cartesianCross(n1, n2),
          A = cartesianScale(n1, c1),
          B = cartesianScale(n2, c2);
      cartesianAddInPlace(A, B);
  
      // Solve |p(t)|^2 = 1.
      var u = n1xn2,
          w = cartesianDot(A, u),
          uu = cartesianDot(u, u),
          t2 = w * w - uu * (cartesianDot(A, A) - 1);
  
      if (t2 < 0) return;
  
      var t = sqrt$1(t2),
          q = cartesianScale(u, (-w - t) / uu);
      cartesianAddInPlace(q, A);
      q = spherical(q);
  
      if (!two) return q;
  
      // Two intersection points.
      var lambda0 = a[0],
          lambda1 = b[0],
          phi0 = a[1],
          phi1 = b[1],
          z;
  
      if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;
  
      var delta = lambda1 - lambda0,
          polar = abs(delta - pi$4) < epsilon$4,
          meridian = polar || delta < epsilon$4;
  
      if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;
  
      // Check that the first point is between a and b.
      if (meridian
          ? polar
            ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon$4 ? phi0 : phi1)
            : phi0 <= q[1] && q[1] <= phi1
          : delta > pi$4 ^ (lambda0 <= q[0] && q[0] <= lambda1)) ***REMOVED***
        var q1 = cartesianScale(u, (-w + t) / uu);
        cartesianAddInPlace(q1, A);
        return [q, spherical(q1)];
      ***REMOVED***
    ***REMOVED***
  
    // Generates a 4-bit vector representing the location of a point relative to
    // the small circle's bounding box.
    function code(lambda, phi) ***REMOVED***
      var r = smallRadius ? radius : pi$4 - radius,
          code = 0;
      if (lambda < -r) code |= 1; // left
      else if (lambda > r) code |= 2; // right
      if (phi < -r) code |= 4; // below
      else if (phi > r) code |= 8; // above
      return code;
    ***REMOVED***
  
    return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi$4, radius - pi$4]);
  ***REMOVED***;
  
  var transform$1 = function(methods) ***REMOVED***
    return ***REMOVED***
      stream: transformer(methods)
    ***REMOVED***;
  ***REMOVED***;
  
  function transformer(methods) ***REMOVED***
    return function(stream) ***REMOVED***
      var s = new TransformStream;
      for (var key in methods) s[key] = methods[key];
      s.stream = stream;
      return s;
    ***REMOVED***;
  ***REMOVED***
  
  function TransformStream() ***REMOVED******REMOVED***
  
  TransformStream.prototype = ***REMOVED***
    constructor: TransformStream,
    point: function(x, y) ***REMOVED*** this.stream.point(x, y); ***REMOVED***,
    sphere: function() ***REMOVED*** this.stream.sphere(); ***REMOVED***,
    lineStart: function() ***REMOVED*** this.stream.lineStart(); ***REMOVED***,
    lineEnd: function() ***REMOVED*** this.stream.lineEnd(); ***REMOVED***,
    polygonStart: function() ***REMOVED*** this.stream.polygonStart(); ***REMOVED***,
    polygonEnd: function() ***REMOVED*** this.stream.polygonEnd(); ***REMOVED***
  ***REMOVED***;
  
  function fitExtent(projection, extent, object) ***REMOVED***
    var w = extent[1][0] - extent[0][0],
        h = extent[1][1] - extent[0][1],
        clip = projection.clipExtent && projection.clipExtent();
  
    projection
        .scale(150)
        .translate([0, 0]);
  
    if (clip != null) projection.clipExtent(null);
  
    geoStream(object, projection.stream(boundsStream$1));
  
    var b = boundsStream$1.result(),
        k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
        x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
        y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
  
    if (clip != null) projection.clipExtent(clip);
  
    return projection
        .scale(k * 150)
        .translate([x, y]);
  ***REMOVED***
  
  function fitSize(projection, size, object) ***REMOVED***
    return fitExtent(projection, [[0, 0], size], object);
  ***REMOVED***
  
  var maxDepth = 16;
  var cosMinDistance = cos$1(30 * radians); // cos(minimum angular distance)
  
  var resample = function(project, delta2) ***REMOVED***
    return +delta2 ? resample$1(project, delta2) : resampleNone(project);
  ***REMOVED***;
  
  function resampleNone(project) ***REMOVED***
    return transformer(***REMOVED***
      point: function(x, y) ***REMOVED***
        x = project(x, y);
        this.stream.point(x[0], x[1]);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
  
  function resample$1(project, delta2) ***REMOVED***
  
    function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) ***REMOVED***
      var dx = x1 - x0,
          dy = y1 - y0,
          d2 = dx * dx + dy * dy;
      if (d2 > 4 * delta2 && depth--) ***REMOVED***
        var a = a0 + a1,
            b = b0 + b1,
            c = c0 + c1,
            m = sqrt$1(a * a + b * b + c * c),
            phi2 = asin$1(c /= m),
            lambda2 = abs(abs(c) - 1) < epsilon$4 || abs(lambda0 - lambda1) < epsilon$4 ? (lambda0 + lambda1) / 2 : atan2(b, a),
            p = project(lambda2, phi2),
            x2 = p[0],
            y2 = p[1],
            dx2 = x2 - x0,
            dy2 = y2 - y0,
            dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > delta2 // perpendicular projected distance
            || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
            || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) ***REMOVED*** // angular distance
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
    return function(stream) ***REMOVED***
      var lambda00, x00, y00, a00, b00, c00, // first point
          lambda0, x0, y0, a0, b0, c0; // previous point
  
      var resampleStream = ***REMOVED***
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() ***REMOVED*** stream.polygonStart(); resampleStream.lineStart = ringStart; ***REMOVED***,
        polygonEnd: function() ***REMOVED*** stream.polygonEnd(); resampleStream.lineStart = lineStart; ***REMOVED***
      ***REMOVED***;
  
      function point(x, y) ***REMOVED***
        x = project(x, y);
        stream.point(x[0], x[1]);
      ***REMOVED***
  
      function lineStart() ***REMOVED***
        x0 = NaN;
        resampleStream.point = linePoint;
        stream.lineStart();
      ***REMOVED***
  
      function linePoint(lambda, phi) ***REMOVED***
        var c = cartesian([lambda, phi]), p = project(lambda, phi);
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      ***REMOVED***
  
      function lineEnd() ***REMOVED***
        resampleStream.point = point;
        stream.lineEnd();
      ***REMOVED***
  
      function ringStart() ***REMOVED***
        lineStart();
        resampleStream.point = ringPoint;
        resampleStream.lineEnd = ringEnd;
      ***REMOVED***
  
      function ringPoint(lambda, phi) ***REMOVED***
        linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resampleStream.point = linePoint;
      ***REMOVED***
  
      function ringEnd() ***REMOVED***
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
        resampleStream.lineEnd = lineEnd;
        lineEnd();
      ***REMOVED***
  
      return resampleStream;
    ***REMOVED***;
  ***REMOVED***
  
  var transformRadians = transformer(***REMOVED***
    point: function(x, y) ***REMOVED***
      this.stream.point(x * radians, y * radians);
    ***REMOVED***
  ***REMOVED***);
  
  function projection(project) ***REMOVED***
    return projectionMutator(function() ***REMOVED*** return project; ***REMOVED***)();
  ***REMOVED***
  
  function projectionMutator(projectAt) ***REMOVED***
    var project,
        k = 150, // scale
        x = 480, y = 250, // translate
        dx, dy, lambda = 0, phi = 0, // center
        deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
        theta = null, preclip = clipAntimeridian, // clip angle
        x0 = null, y0, x1, y1, postclip = identity$7, // clip extent
        delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
        cache,
        cacheStream;
  
    function projection(point) ***REMOVED***
      point = projectRotate(point[0] * radians, point[1] * radians);
      return [point[0] * k + dx, dy - point[1] * k];
    ***REMOVED***
  
    function invert(point) ***REMOVED***
      point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
      return point && [point[0] * degrees$1, point[1] * degrees$1];
    ***REMOVED***
  
    function projectTransform(x, y) ***REMOVED***
      return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
    ***REMOVED***
  
    projection.stream = function(stream) ***REMOVED***
      return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
    ***REMOVED***;
  
    projection.clipAngle = function(_) ***REMOVED***
      return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians, 6 * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees$1;
    ***REMOVED***;
  
    projection.clipExtent = function(_) ***REMOVED***
      return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$7) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    ***REMOVED***;
  
    projection.scale = function(_) ***REMOVED***
      return arguments.length ? (k = +_, recenter()) : k;
    ***REMOVED***;
  
    projection.translate = function(_) ***REMOVED***
      return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
    ***REMOVED***;
  
    projection.center = function(_) ***REMOVED***
      return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees$1, phi * degrees$1];
    ***REMOVED***;
  
    projection.rotate = function(_) ***REMOVED***
      return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees$1, deltaPhi * degrees$1, deltaGamma * degrees$1];
    ***REMOVED***;
  
    projection.precision = function(_) ***REMOVED***
      return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt$1(delta2);
    ***REMOVED***;
  
    projection.fitExtent = function(extent, object) ***REMOVED***
      return fitExtent(projection, extent, object);
    ***REMOVED***;
  
    projection.fitSize = function(size, object) ***REMOVED***
      return fitSize(projection, size, object);
    ***REMOVED***;
  
    function recenter() ***REMOVED***
      projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
      var center = project(lambda, phi);
      dx = x - center[0] * k;
      dy = y + center[1] * k;
      return reset();
    ***REMOVED***
  
    function reset() ***REMOVED***
      cache = cacheStream = null;
      return projection;
    ***REMOVED***
  
    return function() ***REMOVED***
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return recenter();
    ***REMOVED***;
  ***REMOVED***
  
  function conicProjection(projectAt) ***REMOVED***
    var phi0 = 0,
        phi1 = pi$4 / 3,
        m = projectionMutator(projectAt),
        p = m(phi0, phi1);
  
    p.parallels = function(_) ***REMOVED***
      return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees$1, phi1 * degrees$1];
    ***REMOVED***;
  
    return p;
  ***REMOVED***
  
  function cylindricalEqualAreaRaw(phi0) ***REMOVED***
    var cosPhi0 = cos$1(phi0);
  
    function forward(lambda, phi) ***REMOVED***
      return [lambda * cosPhi0, sin$1(phi) / cosPhi0];
    ***REMOVED***
  
    forward.invert = function(x, y) ***REMOVED***
      return [x / cosPhi0, asin$1(y * cosPhi0)];
    ***REMOVED***;
  
    return forward;
  ***REMOVED***
  
  function conicEqualAreaRaw(y0, y1) ***REMOVED***
    var sy0 = sin$1(y0), n = (sy0 + sin$1(y1)) / 2;
  
    // Are the parallels symmetrical around the Equator?
    if (abs(n) < epsilon$4) return cylindricalEqualAreaRaw(y0);
  
    var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt$1(c) / n;
  
    function project(x, y) ***REMOVED***
      var r = sqrt$1(c - 2 * n * sin$1(y)) / n;
      return [r * sin$1(x *= n), r0 - r * cos$1(x)];
    ***REMOVED***
  
    project.invert = function(x, y) ***REMOVED***
      var r0y = r0 - y;
      return [atan2(x, abs(r0y)) / n * sign$1(r0y), asin$1((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
    ***REMOVED***;
  
    return project;
  ***REMOVED***
  
  var conicEqualArea = function() ***REMOVED***
    return conicProjection(conicEqualAreaRaw)
        .scale(155.424)
        .center([0, 33.6442]);
  ***REMOVED***;
  
  var albers = function() ***REMOVED***
    return conicEqualArea()
        .parallels([29.5, 45.5])
        .scale(1070)
        .translate([480, 250])
        .rotate([96, 0])
        .center([-0.6, 38.7]);
  ***REMOVED***;
  
  // The projections must have mutually exclusive clip regions on the sphere,
  // as this will avoid emitting interleaving lines and polygons.
  function multiplex(streams) ***REMOVED***
    var n = streams.length;
    return ***REMOVED***
      point: function(x, y) ***REMOVED*** var i = -1; while (++i < n) streams[i].point(x, y); ***REMOVED***,
      sphere: function() ***REMOVED*** var i = -1; while (++i < n) streams[i].sphere(); ***REMOVED***,
      lineStart: function() ***REMOVED*** var i = -1; while (++i < n) streams[i].lineStart(); ***REMOVED***,
      lineEnd: function() ***REMOVED*** var i = -1; while (++i < n) streams[i].lineEnd(); ***REMOVED***,
      polygonStart: function() ***REMOVED*** var i = -1; while (++i < n) streams[i].polygonStart(); ***REMOVED***,
      polygonEnd: function() ***REMOVED*** var i = -1; while (++i < n) streams[i].polygonEnd(); ***REMOVED***
    ***REMOVED***;
  ***REMOVED***
  
  // A composite projection for the United States, configured by default for
  // 960×500. The projection also works quite well at 960×600 if you change the
  // scale to 1285 and adjust the translate accordingly. The set of standard
  // parallels for each region comes from USGS, which is published here:
  // http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
  var albersUsa = function() ***REMOVED***
    var cache,
        cacheStream,
        lower48 = albers(), lower48Point,
        alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
        hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
        point, pointStream = ***REMOVED***point: function(x, y) ***REMOVED*** point = [x, y]; ***REMOVED******REMOVED***;
  
    function albersUsa(coordinates) ***REMOVED***
      var x = coordinates[0], y = coordinates[1];
      return point = null,
          (lower48Point.point(x, y), point)
          || (alaskaPoint.point(x, y), point)
          || (hawaiiPoint.point(x, y), point);
    ***REMOVED***
  
    albersUsa.invert = function(coordinates) ***REMOVED***
      var k = lower48.scale(),
          t = lower48.translate(),
          x = (coordinates[0] - t[0]) / k,
          y = (coordinates[1] - t[1]) / k;
      return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
          : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
          : lower48).invert(coordinates);
    ***REMOVED***;
  
    albersUsa.stream = function(stream) ***REMOVED***
      return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
    ***REMOVED***;
  
    albersUsa.precision = function(_) ***REMOVED***
      if (!arguments.length) return lower48.precision();
      lower48.precision(_), alaska.precision(_), hawaii.precision(_);
      return reset();
    ***REMOVED***;
  
    albersUsa.scale = function(_) ***REMOVED***
      if (!arguments.length) return lower48.scale();
      lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    ***REMOVED***;
  
    albersUsa.translate = function(_) ***REMOVED***
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
  
      lower48Point = lower48
          .translate(_)
          .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
          .stream(pointStream);
  
      alaskaPoint = alaska
          .translate([x - 0.307 * k, y + 0.201 * k])
          .clipExtent([[x - 0.425 * k + epsilon$4, y + 0.120 * k + epsilon$4], [x - 0.214 * k - epsilon$4, y + 0.234 * k - epsilon$4]])
          .stream(pointStream);
  
      hawaiiPoint = hawaii
          .translate([x - 0.205 * k, y + 0.212 * k])
          .clipExtent([[x - 0.214 * k + epsilon$4, y + 0.166 * k + epsilon$4], [x - 0.115 * k - epsilon$4, y + 0.234 * k - epsilon$4]])
          .stream(pointStream);
  
      return reset();
    ***REMOVED***;
  
    albersUsa.fitExtent = function(extent, object) ***REMOVED***
      return fitExtent(albersUsa, extent, object);
    ***REMOVED***;
  
    albersUsa.fitSize = function(size, object) ***REMOVED***
      return fitSize(albersUsa, size, object);
    ***REMOVED***;
  
    function reset() ***REMOVED***
      cache = cacheStream = null;
      return albersUsa;
    ***REMOVED***
  
    return albersUsa.scale(1070);
  ***REMOVED***;
  
  function azimuthalRaw(scale) ***REMOVED***
    return function(x, y) ***REMOVED***
      var cx = cos$1(x),
          cy = cos$1(y),
          k = scale(cx * cy);
      return [
        k * cy * sin$1(x),
        k * sin$1(y)
      ];
    ***REMOVED***
  ***REMOVED***
  
  function azimuthalInvert(angle) ***REMOVED***
    return function(x, y) ***REMOVED***
      var z = sqrt$1(x * x + y * y),
          c = angle(z),
          sc = sin$1(c),
          cc = cos$1(c);
      return [
        atan2(x * sc, z * cc),
        asin$1(z && y * sc / z)
      ];
    ***REMOVED***
  ***REMOVED***
  
  var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) ***REMOVED***
    return sqrt$1(2 / (1 + cxcy));
  ***REMOVED***);
  
  azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) ***REMOVED***
    return 2 * asin$1(z / 2);
  ***REMOVED***);
  
  var azimuthalEqualArea = function() ***REMOVED***
    return projection(azimuthalEqualAreaRaw)
        .scale(124.75)
        .clipAngle(180 - 1e-3);
  ***REMOVED***;
  
  var azimuthalEquidistantRaw = azimuthalRaw(function(c) ***REMOVED***
    return (c = acos(c)) && c / sin$1(c);
  ***REMOVED***);
  
  azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) ***REMOVED***
    return z;
  ***REMOVED***);
  
  var azimuthalEquidistant = function() ***REMOVED***
    return projection(azimuthalEquidistantRaw)
        .scale(79.4188)
        .clipAngle(180 - 1e-3);
  ***REMOVED***;
  
  function mercatorRaw(lambda, phi) ***REMOVED***
    return [lambda, log$1(tan((halfPi$3 + phi) / 2))];
  ***REMOVED***
  
  mercatorRaw.invert = function(x, y) ***REMOVED***
    return [x, 2 * atan(exp(y)) - halfPi$3];
  ***REMOVED***;
  
  var mercator = function() ***REMOVED***
    return mercatorProjection(mercatorRaw)
        .scale(961 / tau$4);
  ***REMOVED***;
  
  function mercatorProjection(project) ***REMOVED***
    var m = projection(project),
        scale = m.scale,
        translate = m.translate,
        clipExtent = m.clipExtent,
        clipAuto;
  
    m.scale = function(_) ***REMOVED***
      return arguments.length ? (scale(_), clipAuto && m.clipExtent(null), m) : scale();
    ***REMOVED***;
  
    m.translate = function(_) ***REMOVED***
      return arguments.length ? (translate(_), clipAuto && m.clipExtent(null), m) : translate();
    ***REMOVED***;
  
    m.clipExtent = function(_) ***REMOVED***
      if (!arguments.length) return clipAuto ? null : clipExtent();
      if (clipAuto = _ == null) ***REMOVED***
        var k = pi$4 * scale(),
            t = translate();
        _ = [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]];
      ***REMOVED***
      clipExtent(_);
      return m;
    ***REMOVED***;
  
    return m.clipExtent(null);
  ***REMOVED***
  
  function tany(y) ***REMOVED***
    return tan((halfPi$3 + y) / 2);
  ***REMOVED***
  
  function conicConformalRaw(y0, y1) ***REMOVED***
    var cy0 = cos$1(y0),
        n = y0 === y1 ? sin$1(y0) : log$1(cy0 / cos$1(y1)) / log$1(tany(y1) / tany(y0)),
        f = cy0 * pow$1(tany(y0), n) / n;
  
    if (!n) return mercatorRaw;
  
    function project(x, y) ***REMOVED***
      if (f > 0) ***REMOVED*** if (y < -halfPi$3 + epsilon$4) y = -halfPi$3 + epsilon$4; ***REMOVED***
      else ***REMOVED*** if (y > halfPi$3 - epsilon$4) y = halfPi$3 - epsilon$4; ***REMOVED***
      var r = f / pow$1(tany(y), n);
      return [r * sin$1(n * x), f - r * cos$1(n * x)];
    ***REMOVED***
  
    project.invert = function(x, y) ***REMOVED***
      var fy = f - y, r = sign$1(n) * sqrt$1(x * x + fy * fy);
      return [atan2(x, abs(fy)) / n * sign$1(fy), 2 * atan(pow$1(f / r, 1 / n)) - halfPi$3];
    ***REMOVED***;
  
    return project;
  ***REMOVED***
  
  var conicConformal = function() ***REMOVED***
    return conicProjection(conicConformalRaw)
        .scale(109.5)
        .parallels([30, 30]);
  ***REMOVED***;
  
  function equirectangularRaw(lambda, phi) ***REMOVED***
    return [lambda, phi];
  ***REMOVED***
  
  equirectangularRaw.invert = equirectangularRaw;
  
  var equirectangular = function() ***REMOVED***
    return projection(equirectangularRaw)
        .scale(152.63);
  ***REMOVED***;
  
  function conicEquidistantRaw(y0, y1) ***REMOVED***
    var cy0 = cos$1(y0),
        n = y0 === y1 ? sin$1(y0) : (cy0 - cos$1(y1)) / (y1 - y0),
        g = cy0 / n + y0;
  
    if (abs(n) < epsilon$4) return equirectangularRaw;
  
    function project(x, y) ***REMOVED***
      var gy = g - y, nx = n * x;
      return [gy * sin$1(nx), g - gy * cos$1(nx)];
    ***REMOVED***
  
    project.invert = function(x, y) ***REMOVED***
      var gy = g - y;
      return [atan2(x, abs(gy)) / n * sign$1(gy), g - sign$1(n) * sqrt$1(x * x + gy * gy)];
    ***REMOVED***;
  
    return project;
  ***REMOVED***
  
  var conicEquidistant = function() ***REMOVED***
    return conicProjection(conicEquidistantRaw)
        .scale(131.154)
        .center([0, 13.9389]);
  ***REMOVED***;
  
  function gnomonicRaw(x, y) ***REMOVED***
    var cy = cos$1(y), k = cos$1(x) * cy;
    return [cy * sin$1(x) / k, sin$1(y) / k];
  ***REMOVED***
  
  gnomonicRaw.invert = azimuthalInvert(atan);
  
  var gnomonic = function() ***REMOVED***
    return projection(gnomonicRaw)
        .scale(144.049)
        .clipAngle(60);
  ***REMOVED***;
  
  function scaleTranslate(kx, ky, tx, ty) ***REMOVED***
    return kx === 1 && ky === 1 && tx === 0 && ty === 0 ? identity$7 : transformer(***REMOVED***
      point: function(x, y) ***REMOVED***
        this.stream.point(x * kx + tx, y * ky + ty);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***
  
  var identity$8 = function() ***REMOVED***
    var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, transform = identity$7, // scale, translate and reflect
        x0 = null, y0, x1, y1, clip = identity$7, // clip extent
        cache,
        cacheStream,
        projection;
  
    function reset() ***REMOVED***
      cache = cacheStream = null;
      return projection;
    ***REMOVED***
  
    return projection = ***REMOVED***
      stream: function(stream) ***REMOVED***
        return cache && cacheStream === stream ? cache : cache = transform(clip(cacheStream = stream));
      ***REMOVED***,
      clipExtent: function(_) ***REMOVED***
        return arguments.length ? (clip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$7) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
      ***REMOVED***,
      scale: function(_) ***REMOVED***
        return arguments.length ? (transform = scaleTranslate((k = +_) * sx, k * sy, tx, ty), reset()) : k;
      ***REMOVED***,
      translate: function(_) ***REMOVED***
        return arguments.length ? (transform = scaleTranslate(k * sx, k * sy, tx = +_[0], ty = +_[1]), reset()) : [tx, ty];
      ***REMOVED***,
      reflectX: function(_) ***REMOVED***
        return arguments.length ? (transform = scaleTranslate(k * (sx = _ ? -1 : 1), k * sy, tx, ty), reset()) : sx < 0;
      ***REMOVED***,
      reflectY: function(_) ***REMOVED***
        return arguments.length ? (transform = scaleTranslate(k * sx, k * (sy = _ ? -1 : 1), tx, ty), reset()) : sy < 0;
      ***REMOVED***,
      fitExtent: function(extent, object) ***REMOVED***
        return fitExtent(projection, extent, object);
      ***REMOVED***,
      fitSize: function(size, object) ***REMOVED***
        return fitSize(projection, size, object);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;
  
  function orthographicRaw(x, y) ***REMOVED***
    return [cos$1(y) * sin$1(x), sin$1(y)];
  ***REMOVED***
  
  orthographicRaw.invert = azimuthalInvert(asin$1);
  
  var orthographic = function() ***REMOVED***
    return projection(orthographicRaw)
        .scale(249.5)
        .clipAngle(90 + epsilon$4);
  ***REMOVED***;
  
  function stereographicRaw(x, y) ***REMOVED***
    var cy = cos$1(y), k = 1 + cos$1(x) * cy;
    return [cy * sin$1(x) / k, sin$1(y) / k];
  ***REMOVED***
  
  stereographicRaw.invert = azimuthalInvert(function(z) ***REMOVED***
    return 2 * atan(z);
  ***REMOVED***);
  
  var stereographic = function() ***REMOVED***
    return projection(stereographicRaw)
        .scale(250)
        .clipAngle(142);
  ***REMOVED***;
  
  function transverseMercatorRaw(lambda, phi) ***REMOVED***
    return [log$1(tan((halfPi$3 + phi) / 2)), -lambda];
  ***REMOVED***
  
  transverseMercatorRaw.invert = function(x, y) ***REMOVED***
    return [-y, 2 * atan(exp(x)) - halfPi$3];
  ***REMOVED***;
  
  var transverseMercator = function() ***REMOVED***
    var m = mercatorProjection(transverseMercatorRaw),
        center = m.center,
        rotate = m.rotate;
  
    m.center = function(_) ***REMOVED***
      return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
    ***REMOVED***;
  
    m.rotate = function(_) ***REMOVED***
      return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
    ***REMOVED***;
  
    return rotate([0, 0, 90])
        .scale(159.155);
  ***REMOVED***;
  
  exports.version = version;
  exports.bisect = bisectRight;
  exports.bisectRight = bisectRight;
  exports.bisectLeft = bisectLeft;
  exports.ascending = ascending;
  exports.bisector = bisector;
  exports.descending = descending;
  exports.deviation = deviation;
  exports.extent = extent;
  exports.histogram = histogram;
  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
  exports.thresholdScott = scott;
  exports.thresholdSturges = sturges;
  exports.max = max;
  exports.mean = mean;
  exports.median = median;
  exports.merge = merge;
  exports.min = min;
  exports.pairs = pairs;
  exports.permute = permute;
  exports.quantile = threshold;
  exports.range = range;
  exports.scan = scan;
  exports.shuffle = shuffle;
  exports.sum = sum;
  exports.ticks = ticks;
  exports.tickStep = tickStep;
  exports.transpose = transpose;
  exports.variance = variance;
  exports.zip = zip;
  exports.entries = entries;
  exports.keys = keys;
  exports.values = values;
  exports.map = map$1;
  exports.set = set;
  exports.nest = nest;
  exports.randomUniform = uniform;
  exports.randomNormal = normal;
  exports.randomLogNormal = logNormal;
  exports.randomBates = bates;
  exports.randomIrwinHall = irwinHall;
  exports.randomExponential = exponential;
  exports.easeLinear = linear;
  exports.easeQuad = quadInOut;
  exports.easeQuadIn = quadIn;
  exports.easeQuadOut = quadOut;
  exports.easeQuadInOut = quadInOut;
  exports.easeCubic = cubicInOut;
  exports.easeCubicIn = cubicIn;
  exports.easeCubicOut = cubicOut;
  exports.easeCubicInOut = cubicInOut;
  exports.easePoly = polyInOut;
  exports.easePolyIn = polyIn;
  exports.easePolyOut = polyOut;
  exports.easePolyInOut = polyInOut;
  exports.easeSin = sinInOut;
  exports.easeSinIn = sinIn;
  exports.easeSinOut = sinOut;
  exports.easeSinInOut = sinInOut;
  exports.easeExp = expInOut;
  exports.easeExpIn = expIn;
  exports.easeExpOut = expOut;
  exports.easeExpInOut = expInOut;
  exports.easeCircle = circleInOut;
  exports.easeCircleIn = circleIn;
  exports.easeCircleOut = circleOut;
  exports.easeCircleInOut = circleInOut;
  exports.easeBounce = bounceOut;
  exports.easeBounceIn = bounceIn;
  exports.easeBounceOut = bounceOut;
  exports.easeBounceInOut = bounceInOut;
  exports.easeBack = backInOut;
  exports.easeBackIn = backIn;
  exports.easeBackOut = backOut;
  exports.easeBackInOut = backInOut;
  exports.easeElastic = elasticOut;
  exports.easeElasticIn = elasticIn;
  exports.easeElasticOut = elasticOut;
  exports.easeElasticInOut = elasticInOut;
  exports.polygonArea = area;
  exports.polygonCentroid = centroid;
  exports.polygonHull = hull;
  exports.polygonContains = contains;
  exports.polygonLength = length$1;
  exports.path = path;
  exports.quadtree = quadtree;
  exports.queue = queue;
  exports.arc = arc;
  exports.area = area$1;
  exports.line = line;
  exports.pie = pie;
  exports.radialArea = radialArea;
  exports.radialLine = radialLine$1;
  exports.symbol = symbol;
  exports.symbols = symbols;
  exports.symbolCircle = circle;
  exports.symbolCross = cross$1;
  exports.symbolDiamond = diamond;
  exports.symbolSquare = square;
  exports.symbolStar = star;
  exports.symbolTriangle = triangle;
  exports.symbolWye = wye;
  exports.curveBasisClosed = basisClosed;
  exports.curveBasisOpen = basisOpen;
  exports.curveBasis = basis;
  exports.curveBundle = bundle;
  exports.curveCardinalClosed = cardinalClosed;
  exports.curveCardinalOpen = cardinalOpen;
  exports.curveCardinal = cardinal;
  exports.curveCatmullRomClosed = catmullRomClosed;
  exports.curveCatmullRomOpen = catmullRomOpen;
  exports.curveCatmullRom = catmullRom;
  exports.curveLinearClosed = linearClosed;
  exports.curveLinear = curveLinear;
  exports.curveMonotoneX = monotoneX;
  exports.curveMonotoneY = monotoneY;
  exports.curveNatural = natural;
  exports.curveStep = step;
  exports.curveStepAfter = stepAfter;
  exports.curveStepBefore = stepBefore;
  exports.stack = stack;
  exports.stackOffsetExpand = expand;
  exports.stackOffsetNone = none;
  exports.stackOffsetSilhouette = silhouette;
  exports.stackOffsetWiggle = wiggle;
  exports.stackOrderAscending = ascending$1;
  exports.stackOrderDescending = descending$2;
  exports.stackOrderInsideOut = insideOut;
  exports.stackOrderNone = none$1;
  exports.stackOrderReverse = reverse;
  exports.color = color;
  exports.rgb = rgb;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.hcl = hcl;
  exports.cubehelix = cubehelix;
  exports.interpolate = interpolate;
  exports.interpolateArray = array$1;
  exports.interpolateDate = date;
  exports.interpolateNumber = interpolateNumber;
  exports.interpolateObject = object;
  exports.interpolateRound = interpolateRound;
  exports.interpolateString = interpolateString;
  exports.interpolateTransformCss = interpolateTransformCss;
  exports.interpolateTransformSvg = interpolateTransformSvg;
  exports.interpolateZoom = interpolateZoom;
  exports.interpolateRgb = interpolateRgb;
  exports.interpolateRgbBasis = rgbBasis;
  exports.interpolateRgbBasisClosed = rgbBasisClosed;
  exports.interpolateHsl = hsl$2;
  exports.interpolateHslLong = hslLong;
  exports.interpolateLab = lab$1;
  exports.interpolateHcl = hcl$2;
  exports.interpolateHclLong = hclLong;
  exports.interpolateCubehelix = cubehelix$2;
  exports.interpolateCubehelixLong = cubehelixLong;
  exports.interpolateBasis = basis$2;
  exports.interpolateBasisClosed = basisClosed$1;
  exports.quantize = quantize;
  exports.dispatch = dispatch;
  exports.dsvFormat = dsv;
  exports.csvParse = csvParse;
  exports.csvParseRows = csvParseRows;
  exports.csvFormat = csvFormat;
  exports.csvFormatRows = csvFormatRows;
  exports.tsvParse = tsvParse;
  exports.tsvParseRows = tsvParseRows;
  exports.tsvFormat = tsvFormat;
  exports.tsvFormatRows = tsvFormatRows;
  exports.request = request;
  exports.html = html;
  exports.json = json;
  exports.text = text;
  exports.xml = xml;
  exports.csv = csv$1;
  exports.tsv = tsv$1;
  exports.now = now;
  exports.timer = timer;
  exports.timerFlush = timerFlush;
  exports.timeout = timeout$1;
  exports.interval = interval$1;
  exports.timeInterval = newInterval;
  exports.timeMillisecond = millisecond;
  exports.timeMilliseconds = milliseconds;
  exports.timeSecond = second;
  exports.timeSeconds = seconds;
  exports.timeMinute = minute;
  exports.timeMinutes = minutes;
  exports.timeHour = hour;
  exports.timeHours = hours;
  exports.timeDay = day;
  exports.timeDays = days;
  exports.timeWeek = sunday;
  exports.timeWeeks = sundays;
  exports.timeSunday = sunday;
  exports.timeSundays = sundays;
  exports.timeMonday = monday;
  exports.timeMondays = mondays;
  exports.timeTuesday = tuesday;
  exports.timeTuesdays = tuesdays;
  exports.timeWednesday = wednesday;
  exports.timeWednesdays = wednesdays;
  exports.timeThursday = thursday;
  exports.timeThursdays = thursdays;
  exports.timeFriday = friday;
  exports.timeFridays = fridays;
  exports.timeSaturday = saturday;
  exports.timeSaturdays = saturdays;
  exports.timeMonth = month;
  exports.timeMonths = months;
  exports.timeYear = year;
  exports.timeYears = years;
  exports.utcMillisecond = millisecond;
  exports.utcMilliseconds = milliseconds;
  exports.utcSecond = second;
  exports.utcSeconds = seconds;
  exports.utcMinute = utcMinute;
  exports.utcMinutes = utcMinutes;
  exports.utcHour = utcHour;
  exports.utcHours = utcHours;
  exports.utcDay = utcDay;
  exports.utcDays = utcDays;
  exports.utcWeek = utcSunday;
  exports.utcWeeks = utcSundays;
  exports.utcSunday = utcSunday;
  exports.utcSundays = utcSundays;
  exports.utcMonday = utcMonday;
  exports.utcMondays = utcMondays;
  exports.utcTuesday = utcTuesday;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesday = utcWednesday;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursday = utcThursday;
  exports.utcThursdays = utcThursdays;
  exports.utcFriday = utcFriday;
  exports.utcFridays = utcFridays;
  exports.utcSaturday = utcSaturday;
  exports.utcSaturdays = utcSaturdays;
  exports.utcMonth = utcMonth;
  exports.utcMonths = utcMonths;
  exports.utcYear = utcYear;
  exports.utcYears = utcYears;
  exports.formatLocale = formatLocale;
  exports.formatDefaultLocale = defaultLocale;
  exports.formatSpecifier = formatSpecifier;
  exports.precisionFixed = precisionFixed;
  exports.precisionPrefix = precisionPrefix;
  exports.precisionRound = precisionRound;
  exports.isoFormat = formatIso;
  exports.isoParse = parseIso;
  exports.timeFormatLocale = formatLocale$1;
  exports.timeFormatDefaultLocale = defaultLocale$1;
  exports.scaleBand = band;
  exports.scalePoint = point$4;
  exports.scaleIdentity = identity$4;
  exports.scaleLinear = linear$2;
  exports.scaleLog = log;
  exports.scaleOrdinal = ordinal;
  exports.scaleImplicit = implicit;
  exports.scalePow = pow;
  exports.scaleSqrt = sqrt;
  exports.scaleQuantile = quantile$$1;
  exports.scaleQuantize = quantize$1;
  exports.scaleThreshold = threshold$1;
  exports.scaleTime = time;
  exports.scaleUtc = utcTime;
  exports.schemeCategory10 = category10;
  exports.schemeCategory20b = category20b;
  exports.schemeCategory20c = category20c;
  exports.schemeCategory20 = category20;
  exports.scaleSequential = sequential;
  exports.interpolateCubehelixDefault = cubehelix$3;
  exports.interpolateRainbow = rainbow$1;
  exports.interpolateWarm = warm;
  exports.interpolateCool = cool;
  exports.interpolateViridis = viridis;
  exports.interpolateMagma = magma;
  exports.interpolateInferno = inferno;
  exports.interpolatePlasma = plasma;
  exports.creator = creator;
  exports.customEvent = customEvent;
  exports.local = local;
  exports.matcher = matcher$1;
  exports.mouse = mouse;
  exports.namespace = namespace;
  exports.namespaces = namespaces;
  exports.select = select;
  exports.selectAll = selectAll;
  exports.selection = selection;
  exports.selector = selector;
  exports.selectorAll = selectorAll;
  exports.touch = touch;
  exports.touches = touches;
  exports.window = window;
  exports.active = active;
  exports.interrupt = interrupt;
  exports.transition = transition;
  exports.axisTop = axisTop;
  exports.axisRight = axisRight;
  exports.axisBottom = axisBottom;
  exports.axisLeft = axisLeft;
  exports.cluster = cluster;
  exports.hierarchy = hierarchy;
  exports.pack = index;
  exports.packSiblings = siblings;
  exports.packEnclose = enclose;
  exports.partition = partition;
  exports.stratify = stratify;
  exports.tree = tree;
  exports.treemap = index$1;
  exports.treemapBinary = binary;
  exports.treemapDice = treemapDice;
  exports.treemapSlice = treemapSlice;
  exports.treemapSliceDice = sliceDice;
  exports.treemapSquarify = squarify;
  exports.treemapResquarify = resquarify;
  exports.forceCenter = center$1;
  exports.forceCollide = collide;
  exports.forceLink = link;
  exports.forceManyBody = manyBody;
  exports.forceSimulation = simulation;
  exports.forceX = x$3;
  exports.forceY = y$3;
  exports.drag = drag;
  exports.dragDisable = dragDisable;
  exports.dragEnable = yesdrag;
  exports.voronoi = voronoi;
  exports.zoom = zoom;
  exports.zoomIdentity = identity$6;
  exports.zoomTransform = transform;
  exports.brush = brush;
  exports.brushX = brushX;
  exports.brushY = brushY;
  exports.brushSelection = brushSelection;
  exports.chord = chord;
  exports.ribbon = ribbon;
  exports.geoAlbers = albers;
  exports.geoAlbersUsa = albersUsa;
  exports.geoArea = area$2;
  exports.geoAzimuthalEqualArea = azimuthalEqualArea;
  exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
  exports.geoAzimuthalEquidistant = azimuthalEquidistant;
  exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
  exports.geoBounds = bounds;
  exports.geoCentroid = centroid$1;
  exports.geoCircle = circle$1;
  exports.geoClipExtent = extent$1;
  exports.geoConicConformal = conicConformal;
  exports.geoConicConformalRaw = conicConformalRaw;
  exports.geoConicEqualArea = conicEqualArea;
  exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
  exports.geoConicEquidistant = conicEquidistant;
  exports.geoConicEquidistantRaw = conicEquidistantRaw;
  exports.geoDistance = distance;
  exports.geoEquirectangular = equirectangular;
  exports.geoEquirectangularRaw = equirectangularRaw;
  exports.geoGnomonic = gnomonic;
  exports.geoGnomonicRaw = gnomonicRaw;
  exports.geoGraticule = graticule;
  exports.geoGraticule10 = graticule10;
  exports.geoIdentity = identity$8;
  exports.geoInterpolate = interpolate$2;
  exports.geoLength = length$2;
  exports.geoMercator = mercator;
  exports.geoMercatorRaw = mercatorRaw;
  exports.geoOrthographic = orthographic;
  exports.geoOrthographicRaw = orthographicRaw;
  exports.geoPath = index$3;
  exports.geoProjection = projection;
  exports.geoProjectionMutator = projectionMutator;
  exports.geoRotation = rotation;
  exports.geoStereographic = stereographic;
  exports.geoStereographicRaw = stereographicRaw;
  exports.geoStream = geoStream;
  exports.geoTransform = transform$1;
  exports.geoTransverseMercator = transverseMercator;
  exports.geoTransverseMercatorRaw = transverseMercatorRaw;
  
  Object.defineProperty(exports, '__esModule', ***REMOVED*** value: true ***REMOVED***);
  
  ***REMOVED***)));
  