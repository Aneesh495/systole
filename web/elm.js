(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.3/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /(^|:)script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^[\0-\x20\s]*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^[\0-\x20\s]*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' || key == '\x5F_proto_\x5F' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{tail: tail, nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\u000A    ',
		A2($elm$core$String$split, '\u000A', str));
};
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\u000A\u000A(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\u0027' + (f + '\u0027]'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\u000A\u000A',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\u000A\u000A';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\u000A\u000A    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\u000A\u000A' + msg));
			}
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Main$NoModal = {$: 'NoModal'};
var $author$project$Dsp$Types$LeadI = {$: 'LeadI'};
var $author$project$Dsp$Types$LeadII = {$: 'LeadII'};
var $author$project$Dsp$Types$LeadV1 = {$: 'LeadV1'};
var $author$project$Dsp$Types$LeadV2 = {$: 'LeadV2'};
var $author$project$Dsp$Types$LeadV3 = {$: 'LeadV3'};
var $author$project$Dsp$Types$LeadV4 = {$: 'LeadV4'};
var $author$project$Dsp$Types$LeadV5 = {$: 'LeadV5'};
var $author$project$Dsp$Types$LeadV6 = {$: 'LeadV6'};
var $author$project$Dsp$Types$LeadAVF = {$: 'LeadAVF'};
var $author$project$Dsp$Types$LeadAVL = {$: 'LeadAVL'};
var $author$project$Dsp$Types$LeadAVR = {$: 'LeadAVR'};
var $author$project$Dsp$Types$LeadIII = {$: 'LeadIII'};
var $author$project$Dsp$Types$allLeads = _List_fromArray(
	[$author$project$Dsp$Types$LeadI, $author$project$Dsp$Types$LeadII, $author$project$Dsp$Types$LeadIII, $author$project$Dsp$Types$LeadAVR, $author$project$Dsp$Types$LeadAVL, $author$project$Dsp$Types$LeadAVF, $author$project$Dsp$Types$LeadV1, $author$project$Dsp$Types$LeadV2, $author$project$Dsp$Types$LeadV3, $author$project$Dsp$Types$LeadV4, $author$project$Dsp$Types$LeadV5, $author$project$Dsp$Types$LeadV6]);
var $author$project$Simulation$Patient$Male = {$: 'Male'};
var $author$project$Simulation$Patient$Female = {$: 'Female'};
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Simulation$Patient$defaultAbg = {ph: 7.40, hco3MeqL: 24.0, paO2Mmhg: 95.0, paCo2Mmhg: 40.0, saO2Percent: 98.0, lactateMmolL: 1.0, baseExcessMeqL: 0.0};
var $author$project$Simulation$Patient$defaultLabs = {sodiumMeqL: 140.0, hemoglobinGDl: 14.2, potassiumMeqL: 4.2, troponinINgMl: 0.01, plateletCountKUl: 240.0, hematocritPercent: 42.0, whiteBloodCellsKUl: 7.5, serumCreatinineMgDl: 0.9, bloodUreaNitrogenMgDl: 14.0};
var $author$project$Simulation$Ward$createBed = function (num) {
	return function (name) {
		return function (age) {
			return function (sex) {
				return function (weight) {
					return function (height) {
						return function (diag) {
							return function (scen) {
								return function (hr) {
									return function (sbp) {
										return function (dbp) {
											return function (spo2) {
												return function (etco2) {
													return function (cvp) {
														var map = dbp + ((sbp - dbp) / 3.0);
														var bsa = (0.007184 * A2($elm$core$Basics$pow, weight, 0.425)) * A2($elm$core$Basics$pow, height, 0.725);
														var patient = {
															id: 'PT-' + $elm$core$String$fromInt(84900 + num),
															abg: $author$project$Simulation$Patient$defaultAbg,
															sex: sex,
															labs: $author$project$Simulation$Patient$defaultLabs,
															name: name,
															bsaM2: bsa,
															ageYears: age,
															heightCm: height,
															weightKg: weight,
															bedNumber: num,
															baselineCvpMmhg: cvp,
															primaryDiagnosis: diag,
															baselineEtco2Mmhg: etco2,
															baselineSpo2Percent: spo2,
															baselineHeartRateBpm: hr,
															baselineSystolicMmhg: sbp,
															baselineDiastolicMmhg: dbp
														};
														return {cvpMmhg: cvp, patient: patient, meanMmhg: map, scenario: scen, bedNumber: num, etco2Mmhg: etco2, spo2Percent: spo2, heartRateBpm: hr, systolicMmhg: sbp, diastolicMmhg: dbp, hasActiveCrisis: false, hasActiveWarning: false, primaryRhythmString: 'Normal Sinus Rhythm'};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Simulation$Scenarios$BaselineNominal = {$: 'BaselineNominal'};
var $author$project$Simulation$Scenarios$AcuteAnteriorStemi = {$: 'AcuteAnteriorStemi'};
var $author$project$Simulation$Scenarios$HypovolemicHemorrhage = {$: 'HypovolemicHemorrhage'};
var $author$project$Simulation$Scenarios$SepticShockDistributive = {$: 'SepticShockDistributive'};
var $author$project$Simulation$Scenarios$OpioidRespiratoryDepression = {$: 'OpioidRespiratoryDepression'};
var $author$project$Simulation$Ward$initWard = function () {
	var bed8 = $author$project$Simulation$Ward$createBed(8)('Isabella Santos')(23)($author$project$Simulation$Patient$Female)(58.0)(168.0)('Traumatic Brain Injury / ICP Monitor')($author$project$Simulation$Scenarios$BaselineNominal)(72.0)(128.0)(76.0)(99.0)(36.0)(5.0);
	var bed7 = $author$project$Simulation$Ward$createBed(7)('David Miller')(64)($author$project$Simulation$Patient$Male)(92.0)(180.0)('Acute Decompensated Heart Failure')($author$project$Simulation$Scenarios$BaselineNominal)(92.0)(148.0)(92.0)(96.0)(40.0)(14.0);
	var bed6 = $author$project$Simulation$Ward$createBed(6)('Sophia Chen')(31)($author$project$Simulation$Patient$Female)(54.0)(165.0)('Post-Op Opioid Monitoring')($author$project$Simulation$Scenarios$OpioidRespiratoryDepression)(52.0)(104.0)(64.0)(84.0)(64.0)(7.0);
	var bed5 = $author$project$Simulation$Ward$createBed(5)('Liam Gallagher')(71)($author$project$Simulation$Patient$Male)(78.0)(174.0)('COPD Exacerbation / ARDS')($author$project$Simulation$Scenarios$BaselineNominal)(84.0)(134.0)(82.0)(95.0)(44.0)(8.0);
	var bed4 = $author$project$Simulation$Ward$createBed(4)('Priya Sharma')(52)($author$project$Simulation$Patient$Female)(59.0)(160.0)('Severe Uroseptic Shock')($author$project$Simulation$Scenarios$SepticShockDistributive)(125.0)(82.0)(42.0)(92.0)(28.0)(4.0);
	var bed3 = $author$project$Simulation$Ward$createBed(3)('Marcus Thorne')(44)($author$project$Simulation$Patient$Male)(88.0)(185.0)('Polytrauma / Hemorrhagic Shock')($author$project$Simulation$Scenarios$HypovolemicHemorrhage)(132.0)(88.0)(72.0)(93.0)(26.0)(2.0);
	var bed2 = $author$project$Simulation$Ward$createBed(2)('Eleanor Wright')(67)($author$project$Simulation$Patient$Female)(64.0)(162.0)('Acute Anterior STEMI')($author$project$Simulation$Scenarios$AcuteAnteriorStemi)(108.0)(102.0)(68.0)(94.0)(35.0)(10.0);
	var bed1 = $author$project$Simulation$Ward$createBed(1)('Alexander Vance')(58)($author$project$Simulation$Patient$Male)(75.0)(178.0)('Post-Op CABG x3')($author$project$Simulation$Scenarios$BaselineNominal)(76.0)(122.0)(78.0)(98.5)(38.0)(6.0);
	return {
		beds: _List_fromArray(
			[bed1, bed2, bed3, bed4, bed5, bed6, bed7, bed8]),
		selectedBedNumber: 1
	};
}();
var $author$project$Alarms$SmartFusion$defaultSqi = {abpSqi: 0.95, co2Sqi: 0.95, ecgSqi: 0.95, ppgSqi: 0.95};
var $author$project$Dsp$EcgAnalysis$NormalAxis = function (a) {
	return {$: 'NormalAxis', a: a};
};
var $author$project$Dsp$EcgAnalysis$emptyHrvMetrics = {sdnnMs: 0.0, rmssdMs: 0.0, meanRrMs: 0.0, sampleCount: 0, pnn50Percent: 0.0};
var $author$project$Dsp$EcgAnalysis$emptyMetrics = {
	hrv: $author$project$Dsp$EcgAnalysis$emptyHrvMetrics,
	qtcBazettMs: 425.0,
	heartRateBpm: 75.0,
	prIntervalMs: 160.0,
	qtIntervalMs: 380.0,
	rrIntervalMs: 800.0,
	stDeviations: _List_Nil,
	qrsDurationMs: 88.0,
	electricalAxis: $author$project$Dsp$EcgAnalysis$NormalAxis(45.0),
	qtcFridericiaMs: 409.0
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Dsp$Filter$bandpass = F3(
	function (fs, f0, q) {
		var w0 = (2.0 * $elm$core$Basics$pi) * (f0 / fs);
		var cosW0 = $elm$core$Basics$cos(w0);
		var sinW0 = $elm$core$Basics$sin(w0);
		var alpha = sinW0 / (2.0 * q);
		var b2 = -alpha;
		var b1 = 0.0;
		var b0 = alpha;
		var a2 = 1.0 - alpha;
		var a1 = (-2.0) * cosW0;
		var a0 = 1.0 + alpha;
		return {a1: a1 / a0, a2: a2 / a0, b0: b0 / a0, b1: b1 / a0, b2: b2 / a0};
	});
var $author$project$Dsp$Types$emptyBuffer = function (cap) {
	return {size: 0, values: _List_Nil, capacity: cap};
};
var $author$project$Dsp$Filter$initBiquadState = {w1: 0.0, w2: 0.0};
var $author$project$Dsp$PanTompkins$initDetector = function (cfg) {
	var coeffs = A3($author$project$Dsp$Filter$bandpass, cfg.sampleRate, 10.0, 1.0);
	return {
		npki: 0.001,
		spki: 0.02,
		config: cfg,
		intBuffer: $author$project$Dsp$Types$emptyBuffer(cfg.windowSize),
		diffBuffer: $author$project$Dsp$Types$emptyBuffer(5),
		runningSum: 0.0,
		sampleIndex: 0,
		thresholdI1: 0.005,
		thresholdI2: 0.0025,
		bandpassState: $author$project$Dsp$Filter$initBiquadState,
		bandpassCoeffs: coeffs,
		candidateBuffer: $author$project$Dsp$Types$emptyBuffer(3),
		recentRrIntervals: _List_Nil,
		lastRPeakSampleIndex: -1000
	};
};
var $author$project$Ui$TrendsView$Interval1Hour = {$: 'Interval1Hour'};
var $author$project$Pharmacokinetics$Models$PropofolMarsh = {$: 'PropofolMarsh'};
var $author$project$Dsp$PanTompkins$defaultConfig = {sampleRate: 200.0, windowSize: 30, searchBackFactor: 1.66, refractorySamples: 40};
var $author$project$Ui$EhrExportModal$FhirJsonFormat = {$: 'FhirJsonFormat'};
var $author$project$Hemodynamics$Calculations$calculateBsaDubois = F2(
	function (weightKg, heightCm) {
		return ((weightKg > 0.0) && (heightCm > 0.0)) ? ((0.007184 * A2($elm$core$Basics$pow, weightKg, 0.425)) * A2($elm$core$Basics$pow, heightCm, 0.725)) : 1.85;
	});
var $author$project$Simulation$Patient$defaultPatient = function () {
	var w = 75.0;
	var h = 178.0;
	var bsa = A2($author$project$Hemodynamics$Calculations$calculateBsaDubois, w, h);
	return {id: 'PT-84920', abg: $author$project$Simulation$Patient$defaultAbg, sex: $author$project$Simulation$Patient$Male, labs: $author$project$Simulation$Patient$defaultLabs, name: 'Alexander Vance', bsaM2: bsa, ageYears: 58.0, heightCm: h, weightKg: w, bedNumber: 1, baselineCvpMmhg: 6.0, primaryDiagnosis: 'Post-Op Coronary Artery Bypass (CABG x3)', baselineEtco2Mmhg: 38.0, baselineSpo2Percent: 98.5, baselineHeartRateBpm: 76.0, baselineSystolicMmhg: 122.0, baselineDiastolicMmhg: 78.0};
}();
var $author$project$Hemodynamics$Calculations$defaultProfile = {bsaM2: 1.85, shockIndex: 0.62, strokeVolumeMl: 70.0, cardiacOutputLpm: 5.2, cardiacIndexLpmM2: 2.81, modifiedShockIndex: 0.81, strokeVolumeIndexMlM2: 37.8, systemicVascularResistanceDyns: 1100.0, pulmonaryVascularResistanceDyns: 120.0, leftVentricularStrokeWorkIndexGm: 52.0, systemicVascularResistanceIndexDyns: 2035.0, pulmonaryVascularResistanceIndexDyns: 222.0};
var $author$project$Hemodynamics$PressureVolumeLoop$defaultPvModel = {v0Ml: 10.0, edpvrBeta: 1.0, edpvrAlpha: 0.025, targetEdvMl: 120.0, eesMmHgPerMl: 2.2, heartRateBpm: 75.0, meanArterialPressureMmHg: 90.0};
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Simulation$Ventilator$stepVentilator = F3(
	function (settings, mechanics, state) {
		var totalCycleDuration = 60.0 / A2($elm$core$Basics$max, 1.0, settings.respiratoryRateBpm);
		var peepTotal = settings.peepCmH2o + mechanics.autoPeepCmH2o;
		var ti = totalCycleDuration * (settings.iERatio / (1.0 + settings.iERatio));
		var tPause = ti * settings.inspiratoryPauseFraction;
		var tActiveInsp = ti - tPause;
		var te = totalCycleDuration - ti;
		var dt = 1.0 / state.sampleRate;
		var newCycleSec = state.currentCycleSec + dt;
		var isEndOfCycle = _Utils_cmp(newCycleSec, totalCycleDuration) > -1;
		var cycleTime = isEndOfCycle ? 0.0 : newCycleSec;
		var isExpiration = _Utils_cmp(cycleTime, ti) > -1;
		var isInspiration = _Utils_cmp(cycleTime, tActiveInsp) < 0;
		var isInspiratoryPause = (_Utils_cmp(cycleTime, tActiveInsp) > -1) && (_Utils_cmp(cycleTime, ti) < 0);
		var volumeMl = function () {
			if (isInspiration) {
				var alpha = cycleTime / A2($elm$core$Basics$max, 0.01, tActiveInsp);
				return settings.tidalVolumeTargetMl * alpha;
			} else {
				if (isInspiratoryPause) {
					return settings.tidalVolumeTargetMl;
				} else {
					var timeConstantRc = (mechanics.staticComplianceMlPerCmH2o / 1000.0) * mechanics.airwayResistanceCmH2oPerLPerSec;
					var texp = cycleTime - ti;
					return A2(
						$elm$core$Basics$max,
						0.0,
						settings.tidalVolumeTargetMl * A2(
							$elm$core$Basics$pow,
							$elm$core$Basics$e,
							(-texp) / A2($elm$core$Basics$max, 0.1, timeConstantRc)));
				}
			}
		}();
		var elasticPressure = volumeMl / A2($elm$core$Basics$max, 1.0, mechanics.staticComplianceMlPerCmH2o);
		var rawFlowLps = function () {
			if (isInspiration) {
				var alpha = cycleTime / A2($elm$core$Basics$max, 0.01, tActiveInsp);
				var _v0 = settings.flowProfile;
				if (_v0.$ === 'SquareFlow') {
					return (settings.tidalVolumeTargetMl / 1000.0) / A2($elm$core$Basics$max, 0.01, tActiveInsp);
				} else {
					var peakFlow = (2.0 * (settings.tidalVolumeTargetMl / 1000.0)) / A2($elm$core$Basics$max, 0.01, tActiveInsp);
					return peakFlow * (1.0 - (0.7 * alpha));
				}
			} else {
				if (isInspiratoryPause) {
					return 0.0;
				} else {
					var timeConstantRc = (mechanics.staticComplianceMlPerCmH2o / 1000.0) * mechanics.airwayResistanceCmH2oPerLPerSec;
					var peakExpFlow = (settings.tidalVolumeTargetMl / 1000.0) / A2($elm$core$Basics$max, 0.1, timeConstantRc);
					var texp = cycleTime - ti;
					return (-peakExpFlow) * A2(
						$elm$core$Basics$pow,
						$elm$core$Basics$e,
						(-texp) / A2($elm$core$Basics$max, 0.1, timeConstantRc));
				}
			}
		}();
		var flowLpm = rawFlowLps * 60.0;
		var resistivePressure = A2($elm$core$Basics$max, 0.0, rawFlowLps) * mechanics.airwayResistanceCmH2oPerLPerSec;
		var airwayPressure = (peepTotal + elasticPressure) + resistivePressure;
		var newPip = A2($elm$core$Basics$max, state.pipTracker, airwayPressure);
		var newPlat = isInspiratoryPause ? airwayPressure : state.platTracker;
		var cycleUpdates = isEndOfCycle ? {finalPip: newPip, finalPlat: newPlat, nextPipTracker: 0.0, nextPlatTracker: 0.0} : {finalPip: state.lastPip, finalPlat: state.lastPlat, nextPipTracker: newPip, nextPlatTracker: newPlat};
		var pmean = peepTotal + ((ti / totalCycleDuration) * (cycleUpdates.finalPlat - peepTotal));
		var scalars = {flowLitersPerMin: flowLpm, deliveredVolumeMl: volumeMl, airwayPressureCmH2o: airwayPressure, plateauPressureCmH2o: cycleUpdates.finalPlat, meanAirwayPressureCmH2o: pmean, peakInspiratoryPressureCmH2o: cycleUpdates.finalPip};
		var nextState = _Utils_update(
			state,
			{lastPip: cycleUpdates.finalPip, lastPlat: cycleUpdates.finalPlat, pipTracker: cycleUpdates.nextPipTracker, platTracker: cycleUpdates.nextPlatTracker, currentCycleSec: cycleTime});
		return _Utils_Tuple2(scalars, nextState);
	});
var $author$project$Simulation$Ventilator$VolumeControl = {$: 'VolumeControl'};
var $author$project$Simulation$Ventilator$DeceleratingRamp = {$: 'DeceleratingRamp'};
var $author$project$Simulation$Ventilator$defaultSettings = {mode: $author$project$Simulation$Ventilator$VolumeControl, iERatio: 0.5, peepCmH2o: 8.0, fio2Percent: 40.0, flowProfile: $author$project$Simulation$Ventilator$DeceleratingRamp, respiratoryRateBpm: 14.0, tidalVolumeTargetMl: 450.0, inspiratoryPauseFraction: 0.1, inspiratoryPressureTargetCmH2o: 18.0};
var $author$project$Dsp$Capnography$Phase1InspiratoryBaseline = {$: 'Phase1InspiratoryBaseline'};
var $author$project$Dsp$Capnography$emptyCapnoState = {
	buffer: $author$project$Dsp$Types$emptyBuffer(6),
	phase2Slope: 0.0,
	phase3Slope: 0.0,
	recentEtco2: _List_Nil,
	currentPhase: $author$project$Dsp$Capnography$Phase1InspiratoryBaseline,
	cyclePeakCo2: 0.0,
	phase3Samples: _List_Nil,
	cycleBaselineCo2: 0.0,
	sampleCountInPhase: 0,
	lastBreathTimestamp: 0.0
};
var $author$project$Dsp$Arrhythmia$NormalSinusRhythm = {$: 'NormalSinusRhythm'};
var $author$project$Dsp$Arrhythmia$emptyClassifier = {recentBeats: _List_Nil, currentRhythm: $author$project$Dsp$Arrhythmia$NormalSinusRhythm, consecutivePvcs: 0, lastBeatTimestamp: 0.0, recentRrIntervals: _List_Nil};
var $author$project$Dsp$Plethysmograph$defaultCalibration = {a: -1.6, b: -23.5, c: 109.8};
var $author$project$Dsp$Plethysmograph$emptyPlethState = {
	maxIr: 0.0,
	minIr: 1000.0,
	maxRed: 0.0,
	minRed: 1000.0,
	irBuffer: $author$project$Dsp$Types$emptyBuffer(6),
	recentPi: _List_Nil,
	redBuffer: $author$project$Dsp$Types$emptyBuffer(6),
	calibration: $author$project$Dsp$Plethysmograph$defaultCalibration,
	sampleCount: 0,
	lastTroughTimestamp: 0.0
};
var $author$project$Simulation$Ventilator$defaultMechanics = {autoPeepCmH2o: 1.0, staticComplianceMlPerCmH2o: 40.0, airwayResistanceCmH2oPerLPerSec: 10.0};
var $author$project$Alarms$Manager$emptyAlarmManager = {activeAlarms: _List_Nil, isAudioMuted: false, isAudioSilenced: false, silenceRemainingSec: 0.0};
var $author$project$Dsp$PulseContour$emptyContourState = {
	isRising: false,
	inSystole: false,
	currentPeak: 120.0,
	recentBeats: _List_Nil,
	systolicSum: 0.0,
	sampleBuffer: $author$project$Dsp$Types$emptyBuffer(6),
	currentTrough: 80.0,
	systolicCount: 0,
	lastPeakTimestamp: 0.0,
	lastTroughTimestamp: 0.0
};
var $author$project$Simulation$SignalGenerator$initGeneratorState = function (cfg) {
	return {config: cfg, sampleIndex: 0, cardiacPhase: 0.0, pseudoRandomSeed: 1337, respiratoryPhase: 0.0};
};
var $author$project$Pharmacokinetics$Compartment$emptyConcentrations = {centralCp: 0.0, effectSiteCe: 0.0, peripheralFastC2: 0.0, peripheralSlowC3: 0.0};
var $author$project$Simulation$Ventilator$initVentilatorState = function (sampleRate) {
	return {lastPip: 22.0, lastPlat: 18.0, pipTracker: 15.0, sampleRate: sampleRate, platTracker: 12.0, phaseTimeSec: 0.0, currentCycleSec: 0.0};
};
var $author$project$Pharmacokinetics$Models$marshPropofolParams = function (cov) {
	var w = A2($elm$core$Basics$max, 30.0, cov.weightKg);
	return {v1Liters: 0.228 * w, v2Liters: 0.463 * w, v3Liters: 2.893 * w, k10PerMin: 0.119, k12PerMin: 0.112, k13PerMin: 0.0033, k21PerMin: 0.055, k31PerMin: 0.0019, ke0PerMin: 0.26};
};
var $author$project$Pharmacokinetics$Compartment$initCompartmentState = function (p) {
	return {params: p, massFast: 0.0, massSlow: 0.0, massCentral: 0.0, effectSiteConcentration: 0.0};
};
var $author$project$Dsp$Respiration$PausePhase = {$: 'PausePhase'};
var $author$project$Dsp$Respiration$initRespirationState = function (sampleRate) {
	var bpCoeffs = A3($author$project$Dsp$Filter$bandpass, sampleRate, 0.3, 0.8);
	return {
		baselineZ0: 500.0,
		lastSample: 0.0,
		sampleRate: sampleRate,
		breathCount: 0,
		currentPhase: $author$project$Dsp$Respiration$PausePhase,
		bandpassState: $author$project$Dsp$Filter$initBiquadState,
		bandpassCoeffs: bpCoeffs,
		breathIntervalsSec: _List_fromArray(
			[4.0, 4.0, 4.0]),
		estimatedTidalVolume: 500.0,
		timeSinceLastBreathSec: 0.0
	};
};
var $author$project$Simulation$SignalGenerator$defaultGeneratorConfig = {sampleRateHz: 200.0, stElevationMv: 0.0, noiseAmplitudeMv: 0.015, isArrhythmiaActive: false};
var $author$project$Hemodynamics$Calculations$calculateOxygenTransport = F7(
	function (hb, sao2Percent, svo2Percent, pao2, pvo2, co, bsa) {
		var safeBsa = A2($elm$core$Basics$max, 0.5, bsa);
		var safeCo = A2($elm$core$Basics$max, 0.1, co);
		var cvo2 = ((hb * 1.34) * (svo2Percent / 100.0)) + (pvo2 * 0.0031);
		var cao2 = ((hb * 1.34) * (sao2Percent / 100.0)) + (pao2 * 0.0031);
		var vo2 = (safeCo * (cao2 - cvo2)) * 10.0;
		var do2 = (safeCo * cao2) * 10.0;
		var do2i = do2 / safeBsa;
		var o2er = (do2 > 0.0) ? ((vo2 / do2) * 100.0) : 0.0;
		return {oxygenDeliveryLpm: do2, oxygenConsumptionLpm: vo2, venousOxygenContentMlDl: cvo2, oxygenDeliveryIndexLpmM2: do2i, arterialOxygenContentMlDl: cao2, oxygenExtractionRatioPercent: o2er};
	});
var $author$project$Main$init = function (_v0) {
	var initialSnippets = A2(
		$elm$core$List$map,
		function (lead) {
			return {lead: lead, points: _List_Nil};
		},
		$author$project$Dsp$Types$allLeads);
	var initialTrend = {etco2MmHg: 38.0, abpMeanMmHg: 93.3, spO2Percent: 98.0, heartRateBpm: 75.0, timestampSec: 0.0, abpSystolicMmHg: 120.0, abpDiastolicMmHg: 80.0, respiratoryRateBpm: 14.0, temperatureCelsius: 37.0};
	var initialPump = {drug: $author$project$Pharmacokinetics$Models$PropofolMarsh, isRunning: false, historicalCe: _List_Nil, concentrations: $author$project$Pharmacokinetics$Compartment$emptyConcentrations, currentRateMcgMin: 350.0, targetConcentration: 4.0, syringeTotalCapacityMl: 50.0, syringeVolumeRemainingMl: 48.5};
	var defaultHrv = {lfHfRatio: 1.33, hfPowerMs2: 450.0, lfPowerMs2: 600.0, vlfPowerMs2: 250.0, hfNormalized: 42.9, lfNormalized: 57.1, totalPowerMs2: 1300.0};
	var initVent = $author$project$Simulation$Ventilator$initVentilatorState(200.0);
	var _v1 = A3($author$project$Simulation$Ventilator$stepVentilator, $author$project$Simulation$Ventilator$defaultSettings, $author$project$Simulation$Ventilator$defaultMechanics, initVent);
	var initialVentScalars = _v1.a;
	var patient = $author$project$Simulation$Patient$defaultPatient;
	var genCfg = $author$project$Simulation$SignalGenerator$defaultGeneratorConfig;
	var genSt = $author$project$Simulation$SignalGenerator$initGeneratorState(genCfg);
	var ptSt = $author$project$Dsp$PanTompkins$initDetector($author$project$Dsp$PanTompkins$defaultConfig);
	var cov = {isMale: true, ageYears: patient.ageYears, heightCm: patient.heightCm, weightKg: patient.weightKg};
	var marshParams = $author$project$Pharmacokinetics$Models$marshPropofolParams(cov);
	var pkSt = $author$project$Pharmacokinetics$Compartment$initCompartmentState(marshParams);
	return _Utils_Tuple2(
		{
			ward: $author$project$Simulation$Ward$initWard,
			pvModel: $author$project$Hemodynamics$PressureVolumeLoop$defaultPvModel,
			isPaused: false,
			simSpeed: 1.0,
			abpPoints: _List_Nil,
			cvpPoints: _List_Nil,
			ehrFormat: $author$project$Ui$EhrExportModal$FhirJsonFormat,
			ppgPoints: _List_Nil,
			psdPoints: _List_fromArray(
				[
					_Utils_Tuple2(0.05, 50.0),
					_Utils_Tuple2(0.1, 120.0),
					_Utils_Tuple2(0.25, 80.0)
				]),
			pumpState: initialPump,
			sensorSqi: $author$project$Alarms$SmartFusion$defaultSqi,
			ventState: initVent,
			capnoState: $author$project$Dsp$Capnography$emptyCapnoState,
			ecgMetrics: $author$project$Dsp$EcgAnalysis$emptyMetrics,
			hrvMetrics: defaultHrv,
			isWardView: false,
			pawHistory: A2($elm$core$List$repeat, 60, 8.0),
			plethState: $author$project$Dsp$Plethysmograph$emptyPlethState,
			ptDetector: ptSt,
			volHistory: A2($elm$core$List$repeat, 60, 0.0),
			activeModal: $author$project$Main$NoModal,
			capnoPoints: _List_Nil,
			flowHistory: A2($elm$core$List$repeat, 60, 0.0),
			hemoProfile: $author$project$Hemodynamics$Calculations$defaultProfile,
			rrHistoryMs: _List_fromArray(
				[800.0, 810.0, 795.0, 805.0, 800.0]),
			ventScalars: initialVentScalars,
			alarmManager: $author$project$Alarms$Manager$emptyAlarmManager,
			leadIiPoints: _List_Nil,
			trendRecords: _List_fromArray(
				[initialTrend]),
			ventSettings: $author$project$Simulation$Ventilator$defaultSettings,
			currentTimeMs: 0.0,
			trendInterval: $author$project$Ui$TrendsView$Interval1Hour,
			ventMechanics: $author$project$Simulation$Ventilator$defaultMechanics,
			activeScenario: $author$project$Simulation$Scenarios$BaselineNominal,
			generatorState: genSt,
			isHeartBeating: false,
			allLeadSnippets: initialSnippets,
			oxygenTransport: A7($author$project$Hemodynamics$Calculations$calculateOxygenTransport, patient.labs.hemoglobinGDl, 98.5, 74.0, 95.0, 40.0, 5.2, patient.bsaM2),
			heartBeatTimerMs: 0.0,
			respirationState: $author$project$Dsp$Respiration$initRespirationState(200.0),
			pulseContourState: $author$project$Dsp$PulseContour$emptyContourState,
			pkCompartmentState: pkSt,
			arrhythmiaClassifier: $author$project$Dsp$Arrhythmia$emptyClassifier,
			lastTrendRecordTimeMs: 0.0
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$SetSpeed = function (a) {
	return {$: 'SetSpeed', a: a};
};
var $author$project$Main$OpenModal = function (a) {
	return {$: 'OpenModal', a: a};
};
var $author$project$Main$SelectBed = function (a) {
	return {$: 'SelectBed', a: a};
};
var $author$project$Main$Modal12Lead = {$: 'Modal12Lead'};
var $author$project$Main$ModalPvLoop = {$: 'ModalPvLoop'};
var $author$project$Main$ModalTrends = {$: 'ModalTrends'};
var $author$project$Main$TogglePause = {$: 'TogglePause'};
var $author$project$Main$ResetNominal = {$: 'ResetNominal'};
var $author$project$Main$ModalSpectrum = {$: 'ModalSpectrum'};
var $author$project$Main$SilenceAlarms = {$: 'SilenceAlarms'};
var $author$project$Main$ModalEhrExport = {$: 'ModalEhrExport'};
var $author$project$Main$SelectScenario = function (a) {
	return {$: 'SelectScenario', a: a};
};
var $author$project$Main$ToggleWardView = {$: 'ToggleWardView'};
var $author$project$Main$ModalVentilator = {$: 'ModalVentilator'};
var $author$project$Ui$Theme$backgroundColor = '#06090e';
var $author$project$Ui$Theme$textPrimaryColor = '#f0f6fc';
var $author$project$Main$AcknowledgeAlarms = {$: 'AcknowledgeAlarms'};
var $author$project$Main$ModalHemodynamics = {$: 'ModalHemodynamics'};
var $author$project$Main$ModalInfusionPump = {$: 'ModalInfusionPump'};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Simulation$Ward$getBed = F2(
	function (bedNum, ward) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (b) {
					return _Utils_eq(b.bedNumber, bedNum);
				},
				ward.beds));
	});
var $author$project$Main$PvModalMsg = function (a) {
	return {$: 'PvModalMsg', a: a};
};
var $author$project$Main$TogglePump = {$: 'TogglePump'};
var $author$project$Main$CloseModals = {$: 'CloseModals'};
var $author$project$Main$EhrModalMsg = function (a) {
	return {$: 'EhrModalMsg', a: a};
};
var $author$project$Main$SetPumpRate = function (a) {
	return {$: 'SetPumpRate', a: a};
};
var $author$project$Main$VentViewMsg = function (a) {
	return {$: 'VentViewMsg', a: a};
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Ui$Theme$ppgColor = '#00e5ff';
var $author$project$Ui$Theme$bezelColor = '#1b2332';
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Ui$Theme$abpColor = '#ff2a4b';
var $author$project$Ui$Theme$cvpColor = '#4d79ff';
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Ui$Theme$capnoColor = '#ffcc00';
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Hemodynamics$PressureVolumeLoop$evaluateEdpvr = F2(
	function (model, volume) {
		var exponent = A3($elm$core$Basics$clamp, -10.0, 10.0, model.edpvrAlpha * volume);
		return A2(
			$elm$core$Basics$max,
			0.0,
			model.edpvrBeta * (A2($elm$core$Basics$pow, $elm$core$Basics$e, exponent) - 1.0));
	});
var $author$project$Hemodynamics$PressureVolumeLoop$evaluateEspvr = F2(
	function (model, volume) {
		return A2($elm$core$Basics$max, 0.0, model.eesMmHgPerMl * (volume - model.v0Ml));
	});
var $author$project$Ui$Theme$textMutedColor = '#7d8ca3';
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $author$project$Ui$PvLoopModal$renderPvSvg = F3(
	function (model, metrics, trajectory) {
		var svgW = 490.0;
		var svgH = 340.0;
		var padT = 20.0;
		var padR = 20.0;
		var padL = 50.0;
		var padB = 40.0;
		var mapY = function (press) {
			return (svgH - padB) - ((press / 160.0) * ((svgH - padT) - padB));
		};
		var espvrY1 = mapY(0.0);
		var espvrY2 = mapY(
			A2($author$project$Hemodynamics$PressureVolumeLoop$evaluateEspvr, model, 160.0));
		var mapX = function (vol) {
			return padL + ((vol / 180.0) * ((svgW - padL) - padR));
		};
		var espvrX1 = mapX(model.v0Ml);
		var espvrX2 = mapX(160.0);
		var pathPoints = function () {
			if (!trajectory.b) {
				return '';
			} else {
				var p0 = trajectory.a;
				var rest = trajectory.b;
				var startCmd = 'M ' + ($elm$core$String$fromFloat(
					mapX(p0.volumeMl)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0.pressureMmHg))));
				var lineCmds = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						function (p) {
							return 'L ' + ($elm$core$String$fromFloat(
								mapX(p.volumeMl)) + (' ' + $elm$core$String$fromFloat(
								mapY(p.pressureMmHg))));
						},
						rest));
				return startCmd + (' ' + (lineCmds + ' Z'));
			}
		}();
		var edpvrPoints = A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function (i) {
					var vol = i * 5.0;
					var press = A2($author$project$Hemodynamics$PressureVolumeLoop$evaluateEdpvr, model, vol);
					return $elm$core$String$fromFloat(
						mapX(vol)) + (',' + $elm$core$String$fromFloat(
						mapY(press)));
				},
				A2($elm$core$List$range, 0, 30)));
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width('100%'),
					$elm$svg$Svg$Attributes$height('340'),
					$elm$svg$Svg$Attributes$viewBox(
					'0 0 ' + ($elm$core$String$fromFloat(svgW) + (' ' + $elm$core$String$fromFloat(svgH))))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(padL)),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(
								mapY(50.0))),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(svgW - padR)),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(
								mapY(50.0))),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
							$elm$svg$Svg$Attributes$strokeDasharray('3 3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(padL)),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(
								mapY(100.0))),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(svgW - padR)),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(
								mapY(100.0))),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
							$elm$svg$Svg$Attributes$strokeDasharray('3 3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(
								mapX(50.0))),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(padT)),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(
								mapX(50.0))),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(svgH - padB)),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
							$elm$svg$Svg$Attributes$strokeDasharray('3 3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(
								mapX(100.0))),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(padT)),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(
								mapX(100.0))),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(svgH - padB)),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
							$elm$svg$Svg$Attributes$strokeDasharray('3 3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(padL)),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(svgH - padB)),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(svgW - padR)),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(svgH - padB)),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$textMutedColor)
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(padL)),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(padT)),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(padL)),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(svgH - padB)),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$textMutedColor)
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(svgW / 2.0)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(svgH - 10.0)),
							$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
							$elm$svg$Svg$Attributes$fontSize('11'),
							$elm$svg$Svg$Attributes$textAnchor('middle')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text('Left Ventricular Volume (mL)')
						])),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('16'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(svgH / 2.0)),
							$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
							$elm$svg$Svg$Attributes$fontSize('11'),
							$elm$svg$Svg$Attributes$textAnchor('middle'),
							$elm$svg$Svg$Attributes$transform(
							'rotate(-90 16 ' + ($elm$core$String$fromFloat(svgH / 2.0) + ')'))
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text('Pressure (mmHg)')
						])),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x1(
							$elm$core$String$fromFloat(espvrX1)),
							$elm$svg$Svg$Attributes$y1(
							$elm$core$String$fromFloat(espvrY1)),
							$elm$svg$Svg$Attributes$x2(
							$elm$core$String$fromFloat(espvrX2)),
							$elm$svg$Svg$Attributes$y2(
							$elm$core$String$fromFloat(espvrY2)),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$capnoColor),
							$elm$svg$Svg$Attributes$strokeWidth('1.5'),
							$elm$svg$Svg$Attributes$strokeDasharray('4 4')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polyline,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points(edpvrPoints),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$cvpColor),
							$elm$svg$Svg$Attributes$strokeWidth('1.5'),
							$elm$svg$Svg$Attributes$strokeDasharray('3 3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d(pathPoints),
							$elm$svg$Svg$Attributes$fill('rgba(255, 42, 75, 0.15)'),
							$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$abpColor),
							$elm$svg$Svg$Attributes$strokeWidth('2.5')
						]),
					_List_Nil)
				]));
	});
var $author$project$Ui$PvLoopModal$ClosePvModal = {$: 'ClosePvModal'};
var $author$project$Ui$Theme$surfaceColor = '#0d1219';
var $author$project$Hemodynamics$PressureVolumeLoop$computePvMetrics = function (model) {
	var esp = model.meanArterialPressureMmHg * 1.05;
	var ees = model.eesMmHgPerMl;
	var edv = model.targetEdvMl;
	var esv = A3($elm$core$Basics$clamp, model.v0Ml + 5.0, edv - 5.0, model.v0Ml + (esp / model.eesMmHgPerMl));
	var potentialEnergy = (0.5 * esp) * A2($elm$core$Basics$max, 0.0, esv - model.v0Ml);
	var edp = A2($author$project$Hemodynamics$PressureVolumeLoop$evaluateEdpvr, model, edv);
	var sv = A2($elm$core$Basics$max, 1.0, edv - esv);
	var strokeWork = (sv * (esp - edp)) * 0.9;
	var pva = strokeWork + potentialEnergy;
	var efficiency = (pva > 1.0e-3) ? ((strokeWork / pva) * 100.0) : 0.0;
	var ef = (sv / edv) * 100.0;
	var ea = esp / sv;
	var vac = ea / ees;
	return {strokeVolumeMl: sv, strokeWorkMmhgMl: strokeWork, pressureVolumeArea: pva, arterialElastanceEa: ea, endSystolicVolumeMl: esv, endDiastolicVolumeMl: edv, potentialEnergyMmhgMl: potentialEnergy, ejectionFractionPercent: ef, endSystolicElastanceEes: ees, endSystolicPressureMmHg: esp, endDiastolicPressureMmHg: edp, ventriculoArterialCoupling: vac, mechanicalEfficiencyPercent: efficiency};
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Ui$PvLoopModal$round1 = function (val) {
	return $elm$core$Basics$round(val * 10.0) / 10.0;
};
var $author$project$Ui$PvLoopModal$round2 = function (val) {
	return $elm$core$Basics$round(val * 100.0) / 100.0;
};
var $author$project$Ui$Theme$cardColor = '#121822';
var $author$project$Ui$PvLoopModal$renderMetricRow = F2(
	function (label, val) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '600')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(val)
						]))
				]));
	});
var $author$project$Ui$PvLoopModal$renderMetricsCard = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'gap', '8px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
						A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('HEMODYNAMIC INDICES')
					])),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'Stroke Volume (SV)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round1(m.strokeVolumeMl)) + ' mL'),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'Ejection Fraction (EF)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round1(m.ejectionFractionPercent)) + ' %'),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'End-Systolic Elastance (Ees)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round2(m.endSystolicElastanceEes)) + ' mmHg/mL'),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'Arterial Elastance (Ea)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round2(m.arterialElastanceEa)) + ' mmHg/mL'),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'V-A Coupling (Ea / Ees)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round2(m.ventriculoArterialCoupling))),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'Stroke Work (SW)',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round1(m.strokeWorkMmhgMl)) + ' mmHg*mL'),
				A2(
				$author$project$Ui$PvLoopModal$renderMetricRow,
				'Mechanical Efficiency',
				$elm$core$String$fromFloat(
					$author$project$Ui$PvLoopModal$round1(m.mechanicalEfficiencyPercent)) + ' %')
			]));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Ui$PvLoopModal$renderBtn = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
					A2($elm$html$Html$Attributes$style, 'padding', '4px 10px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'flex', '1')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$PvLoopModal$AdjustPreload = function (a) {
	return {$: 'AdjustPreload', a: a};
};
var $author$project$Ui$PvLoopModal$AdjustAfterload = function (a) {
	return {$: 'AdjustAfterload', a: a};
};
var $author$project$Ui$PvLoopModal$AdjustContractility = function (a) {
	return {$: 'AdjustContractility', a: a};
};
var $author$project$Ui$PvLoopModal$renderControlsCard = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'gap', '10px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
						A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('MYOCARDIAL STATE ADJUSTMENT')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'gap', '4px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Contractility (Ees: ' + ($elm$core$String$fromFloat(
									$author$project$Ui$PvLoopModal$round2(model.eesMmHgPerMl)) + ')'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'-0.4',
								$author$project$Ui$PvLoopModal$AdjustContractility(
									A2($elm$core$Basics$max, 0.6, model.eesMmHgPerMl - 0.4))),
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'+0.4',
								$author$project$Ui$PvLoopModal$AdjustContractility(
									A2($elm$core$Basics$min, 5.0, model.eesMmHgPerMl + 0.4)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'gap', '4px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Preload (EDV: ' + ($elm$core$String$fromFloat(
									$author$project$Ui$PvLoopModal$round1(model.targetEdvMl)) + ' mL)'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'-15 mL',
								$author$project$Ui$PvLoopModal$AdjustPreload(
									A2($elm$core$Basics$max, 70.0, model.targetEdvMl - 15.0))),
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'+15 mL',
								$author$project$Ui$PvLoopModal$AdjustPreload(
									A2($elm$core$Basics$min, 170.0, model.targetEdvMl + 15.0)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'gap', '4px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Afterload (MAP: ' + ($elm$core$String$fromFloat(
									$author$project$Ui$PvLoopModal$round1(model.meanArterialPressureMmHg)) + ' mmHg)'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'-10 mmHg',
								$author$project$Ui$PvLoopModal$AdjustAfterload(
									A2($elm$core$Basics$max, 40.0, model.meanArterialPressureMmHg - 10.0))),
								A2(
								$author$project$Ui$PvLoopModal$renderBtn,
								'+10 mmHg',
								$author$project$Ui$PvLoopModal$AdjustAfterload(
									A2($elm$core$Basics$min, 150.0, model.meanArterialPressureMmHg + 10.0)))
							]))
					]))
			]));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Hemodynamics$PressureVolumeLoop$generateLoopTrajectory = F2(
	function (model, samplesPerPhase) {
		var metrics = $author$project$Hemodynamics$PressureVolumeLoop$computePvMetrics(model);
		var nFloat = samplesPerPhase;
		var phase1 = A2(
			$elm$core$List$map,
			function (i) {
				var alpha = i / nFloat;
				var p = metrics.endDiastolicPressureMmHg + (alpha * (metrics.endSystolicPressureMmHg - metrics.endDiastolicPressureMmHg));
				return {volumeMl: metrics.endDiastolicVolumeMl, pressureMmHg: p};
			},
			A2($elm$core$List$range, 0, samplesPerPhase));
		var phase2 = A2(
			$elm$core$List$map,
			function (i) {
				var alpha = i / nFloat;
				var crest = $elm$core$Basics$sin(alpha * $elm$core$Basics$pi) * 10.0;
				var v = metrics.endDiastolicVolumeMl - (alpha * (metrics.endDiastolicVolumeMl - metrics.endSystolicVolumeMl));
				var p = metrics.endSystolicPressureMmHg + crest;
				return {volumeMl: v, pressureMmHg: p};
			},
			A2($elm$core$List$range, 0, samplesPerPhase));
		var phase3 = A2(
			$elm$core$List$map,
			function (i) {
				var alpha = i / nFloat;
				var p = metrics.endSystolicPressureMmHg - (alpha * (metrics.endSystolicPressureMmHg - (metrics.endDiastolicPressureMmHg * 0.5)));
				return {volumeMl: metrics.endSystolicVolumeMl, pressureMmHg: p};
			},
			A2($elm$core$List$range, 0, samplesPerPhase));
		var phase4 = A2(
			$elm$core$List$map,
			function (i) {
				var alpha = i / nFloat;
				var v = metrics.endSystolicVolumeMl + (alpha * (metrics.endDiastolicVolumeMl - metrics.endSystolicVolumeMl));
				var p = A2($author$project$Hemodynamics$PressureVolumeLoop$evaluateEdpvr, model, v);
				return {volumeMl: v, pressureMmHg: p};
			},
			A2($elm$core$List$range, 0, samplesPerPhase));
		return $elm$core$List$concat(
			_List_fromArray(
				[phase1, phase2, phase3, phase4]));
	});
var $author$project$Ui$PvLoopModal$viewPvModal = function (model) {
	var trajectory = A2($author$project$Hemodynamics$PressureVolumeLoop$generateLoopTrajectory, model, 16);
	var metrics = $author$project$Hemodynamics$PressureVolumeLoop$computePvMetrics(model);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100vw'),
				A2($elm$html$Html$Attributes$style, 'height', '100vh'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 6, 23, 0.85)'),
				A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(6px)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '150')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
						A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
						A2($elm$html$Html$Attributes$style, 'width', '880px'),
						A2($elm$html$Html$Attributes$style, 'max-width', '94vw'),
						A2($elm$html$Html$Attributes$style, 'padding', '24px'),
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.7)'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'gap', '16px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$bezelColor),
								A2($elm$html$Html$Attributes$style, 'padding-bottom', '12px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h2,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin', '0'),
												A2($elm$html$Html$Attributes$style, 'font-size', '18px'),
												A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
												A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('LEFT VENTRICULAR PRESSURE-VOLUME ANALYSIS')
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Suga-Sagawa Time-Varying Elastance and Ventriculo-Arterial Coupling')
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Ui$PvLoopModal$ClosePvModal),
										A2($elm$html$Html$Attributes$style, 'background', 'transparent'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
										A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '13px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Close [ESC]')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'grid'),
								A2($elm$html$Html$Attributes$style, 'grid-template-columns', '520px 1fr'),
								A2($elm$html$Html$Attributes$style, 'gap', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
										A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px')
									]),
								_List_fromArray(
									[
										A3($author$project$Ui$PvLoopModal$renderPvSvg, model, metrics, trajectory)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
										A2($elm$html$Html$Attributes$style, 'gap', '14px')
									]),
								_List_fromArray(
									[
										$author$project$Ui$PvLoopModal$renderMetricsCard(metrics),
										$author$project$Ui$PvLoopModal$renderControlsCard(model)
									]))
							]))
					]))
			]));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $author$project$Ui$Theme$ecgColor = '#00ff41';
var $author$project$Ui$EhrExportModal$CloseEhrModal = {$: 'CloseEhrModal'};
var $author$project$Ui$EhrExportModal$SelectFormat = function (a) {
	return {$: 'SelectFormat', a: a};
};
var $author$project$Ui$EhrExportModal$renderFormatBtn = F3(
	function (label, format, isSelected) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					$author$project$Ui$EhrExportModal$SelectFormat(format)),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isSelected ? $author$project$Ui$Theme$bezelColor : 'transparent'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					'1px solid ' + (isSelected ? $author$project$Ui$Theme$ecgColor : $author$project$Ui$Theme$bezelColor)),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isSelected ? $author$project$Ui$Theme$ecgColor : $author$project$Ui$Theme$textMutedColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$EhrExportModal$CopyExportPayload = function (a) {
	return {$: 'CopyExportPayload', a: a};
};
var $author$project$Ui$EhrExportModal$ClinicalNarrativeFormat = {$: 'ClinicalNarrativeFormat'};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $author$project$Protocol$Hl7Fhir$loincHeartRate = '8867-4';
var $author$project$Protocol$Hl7Fhir$loincSystolicBp = '8480-6';
var $author$project$Protocol$Hl7Fhir$buildObservation = F7(
	function (id, code, name, val, unit, ucum, ts) {
		return {id: id, unit: unit, status: 'final', display: name, ucumCode: ucum, loincCode: code, valueQuantity: val, effectiveTimestamp: ts};
	});
var $author$project$Protocol$Hl7Fhir$loincDiastolicBp = '8462-4';
var $author$project$Protocol$Hl7Fhir$loincEndTidalCo2 = '19889-5';
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Protocol$Hl7Fhir$encodeFhirObservation = function (obs) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'resourceType',
				$elm$json$Json$Encode$string('Observation')),
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(obs.id)),
				_Utils_Tuple2(
				'status',
				$elm$json$Json$Encode$string(obs.status)),
				_Utils_Tuple2(
				'code',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'coding',
							A2(
								$elm$json$Json$Encode$list,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$elm$json$Json$Encode$object(
										_List_fromArray(
											[
												_Utils_Tuple2(
												'system',
												$elm$json$Json$Encode$string('http://loinc.org')),
												_Utils_Tuple2(
												'code',
												$elm$json$Json$Encode$string(obs.loincCode)),
												_Utils_Tuple2(
												'display',
												$elm$json$Json$Encode$string(obs.display))
											]))
									])))
						]))),
				_Utils_Tuple2(
				'valueQuantity',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$float(obs.valueQuantity)),
							_Utils_Tuple2(
							'unit',
							$elm$json$Json$Encode$string(obs.unit)),
							_Utils_Tuple2(
							'system',
							$elm$json$Json$Encode$string('http://unitsofmeasure.org')),
							_Utils_Tuple2(
							'code',
							$elm$json$Json$Encode$string(obs.ucumCode))
						]))),
				_Utils_Tuple2(
				'effectiveDateTime',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromFloat(obs.effectiveTimestamp) + 'ms'))
			]));
};
var $author$project$Protocol$Hl7Fhir$loincOxygenSaturation = '59408-5';
var $author$project$Protocol$Hl7Fhir$exportPatientBundleJson = F2(
	function (patient, ts) {
		var obsEtco2 = A7($author$project$Protocol$Hl7Fhir$buildObservation, patient.id + '-etco2', $author$project$Protocol$Hl7Fhir$loincEndTidalCo2, 'End-Tidal Carbon Dioxide', patient.baselineEtco2Mmhg, 'mmHg', 'mm[Hg]', ts);
		var obsSpo2 = A7($author$project$Protocol$Hl7Fhir$buildObservation, patient.id + '-spo2', $author$project$Protocol$Hl7Fhir$loincOxygenSaturation, 'Oxygen Saturation', patient.baselineSpo2Percent, '%', '%', ts);
		var obsSys = A7($author$project$Protocol$Hl7Fhir$buildObservation, patient.id + '-sys', $author$project$Protocol$Hl7Fhir$loincSystolicBp, 'Systolic Blood Pressure', patient.baselineSystolicMmhg, 'mmHg', 'mm[Hg]', ts);
		var obsDia = A7($author$project$Protocol$Hl7Fhir$buildObservation, patient.id + '-dia', $author$project$Protocol$Hl7Fhir$loincDiastolicBp, 'Diastolic Blood Pressure', patient.baselineDiastolicMmhg, 'mmHg', 'mm[Hg]', ts);
		var obsHr = A7($author$project$Protocol$Hl7Fhir$buildObservation, patient.id + '-hr', $author$project$Protocol$Hl7Fhir$loincHeartRate, 'Heart Rate', patient.baselineHeartRateBpm, 'beats/min', '/min', ts);
		var entries = A2(
			$elm$core$List$map,
			function (obs) {
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'fullUrl',
							$elm$json$Json$Encode$string('urn:uuid:' + obs.id)),
							_Utils_Tuple2(
							'resource',
							$author$project$Protocol$Hl7Fhir$encodeFhirObservation(obs))
						]));
			},
			_List_fromArray(
				[obsHr, obsSys, obsDia, obsSpo2, obsEtco2]));
		var bundle = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'resourceType',
					$elm$json$Json$Encode$string('Bundle')),
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$string('bundle-' + patient.id)),
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('transaction')),
					_Utils_Tuple2(
					'entry',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, entries))
				]));
		return A2($elm$json$Json$Encode$encode, 2, bundle);
	});
var $author$project$Ui$EhrExportModal$generateClinicalNarrative = function (p) {
	var vitalSection = 'CURRENT PHYSIOLOGICAL VITALS:\u000A' + ('- Heart Rate: ' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(p.baselineHeartRateBpm)) + (' bpm\u000A' + ('- Arterial Blood Pressure: ' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(p.baselineSystolicMmhg)) + ('/' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(p.baselineDiastolicMmhg)) + (' mmHg\u000A' + ('- SpO2: ' + ($elm$core$String$fromFloat(p.baselineSpo2Percent) + (' %\u000A' + ('- End-Tidal CO2: ' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(p.baselineEtco2Mmhg)) + (' mmHg\u000A' + ('- Central Venous Pressure: ' + ($elm$core$String$fromFloat(p.baselineCvpMmhg) + ' mmHg\u000A\u000A'))))))))))))))));
	var sexStr = function () {
		var _v0 = p.sex;
		if (_v0.$ === 'Male') {
			return 'Male';
		} else {
			return 'Female';
		}
	}();
	var header = '=======================================================================\u000A' + ('ICU INTENSIVE CARE CLINICAL PROGRESS NOTE - PHYSIOLOGICAL TELEMETRY\u000A' + ('=======================================================================\u000A' + ('Patient ID: ' + (p.id + ('\u000AName: ' + (p.name + (' | Age: ' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(p.ageYears)) + (' | Sex: ' + (sexStr + ('\u000AWeight: ' + ($elm$core$String$fromFloat(p.weightKg) + (' kg | Height: ' + ($elm$core$String$fromFloat(p.heightCm) + (' cm | BSA: ' + ($elm$core$String$fromFloat(p.bsaM2) + (' m2\u000A' + ('Primary Admission Diagnosis: ' + (p.primaryDiagnosis + '\u000A\u000A')))))))))))))))))));
	var footer = '=======================================================================\u000A' + ('Generated deterministically by Systole ICU Physiological Telemetry Core\u000A' + ('Compliant with IEC 62304 Class C Medical Software Safety Standard\u000A' + '=======================================================================\u000A'));
	var abg = p.abg;
	var l = p.labs;
	var labSection = 'LABORATORY & ARTERIAL BLOOD GAS PANEL:\u000A' + ('- Arterial pH: ' + ($elm$core$String$fromFloat(abg.ph) + ('\u000A- PaO2: ' + ($elm$core$String$fromFloat(abg.paO2Mmhg) + (' mmHg | PaCO2: ' + ($elm$core$String$fromFloat(abg.paCo2Mmhg) + (' mmHg\u000A' + ('- Base Excess: ' + ($elm$core$String$fromFloat(abg.baseExcessMeqL) + (' mEq/L | Serum Lactate: ' + ($elm$core$String$fromFloat(abg.lactateMmolL) + (' mmol/L\u000A' + ('- Hemoglobin: ' + ($elm$core$String$fromFloat(l.hemoglobinGDl) + (' g/dL | Hematocrit: ' + ($elm$core$String$fromFloat(l.hematocritPercent) + (' %\u000A' + ('- Serum Potassium: ' + ($elm$core$String$fromFloat(l.potassiumMeqL) + (' mEq/L | Sodium: ' + ($elm$core$String$fromFloat(l.sodiumMeqL) + (' mEq/L\u000A' + ('- Troponin I: ' + ($elm$core$String$fromFloat(l.troponinINgMl) + ' ng/mL\u000A\u000A'))))))))))))))))))))))));
	return _Utils_ap(
		header,
		_Utils_ap(
			vitalSection,
			_Utils_ap(labSection, footer)));
};
var $author$project$Ui$EhrExportModal$viewEhrModal = F3(
	function (activeFormat, patient, currentTimestamp) {
		var narrative = $author$project$Ui$EhrExportModal$generateClinicalNarrative(patient);
		var fhirJson = A2($author$project$Protocol$Hl7Fhir$exportPatientBundleJson, patient, currentTimestamp);
		var activePayload = function () {
			if (activeFormat.$ === 'FhirJsonFormat') {
				return fhirJson;
			} else {
				return narrative;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100vw'),
					A2($elm$html$Html$Attributes$style, 'height', '100vh'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 6, 23, 0.85)'),
					A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(6px)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '150')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
							A2($elm$html$Html$Attributes$style, 'width', '820px'),
							A2($elm$html$Html$Attributes$style, 'max-width', '94vw'),
							A2($elm$html$Html$Attributes$style, 'max-height', '88vh'),
							A2($elm$html$Html$Attributes$style, 'padding', '24px'),
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
							A2($elm$html$Html$Attributes$style, 'gap', '16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$bezelColor),
									A2($elm$html$Html$Attributes$style, 'padding-bottom', '12px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'margin', '0'),
													A2($elm$html$Html$Attributes$style, 'font-size', '18px'),
													A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
													A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('EHR CLINICAL DATA EXPORT')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('HL7 FHIR R4 Standard Observation Bundle and Clinical Summary')
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Ui$EhrExportModal$CloseEhrModal),
											A2($elm$html$Html$Attributes$style, 'background', 'transparent'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-size', '13px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Close [ESC]')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'gap', '8px')
										]),
									_List_fromArray(
										[
											A3(
											$author$project$Ui$EhrExportModal$renderFormatBtn,
											'HL7 FHIR JSON',
											$author$project$Ui$EhrExportModal$FhirJsonFormat,
											_Utils_eq(activeFormat, $author$project$Ui$EhrExportModal$FhirJsonFormat)),
											A3(
											$author$project$Ui$EhrExportModal$renderFormatBtn,
											'Clinical Summary',
											$author$project$Ui$EhrExportModal$ClinicalNarrativeFormat,
											_Utils_eq(activeFormat, $author$project$Ui$EhrExportModal$ClinicalNarrativeFormat))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Ui$EhrExportModal$CopyExportPayload(activePayload)),
											A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$ecgColor),
											A2($elm$html$Html$Attributes$style, 'color', '#000000'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 16px'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
											A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Copy Payload')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
									A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
									A2($elm$html$Html$Attributes$style, 'padding', '14px'),
									A2($elm$html$Html$Attributes$style, 'flex', '1'),
									A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
									A2($elm$html$Html$Attributes$style, 'max-height', '450px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$pre,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin', '0'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
											A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap'),
											A2($elm$html$Html$Attributes$style, 'word-break', 'break-all')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(activePayload)
										]))
								]))
						]))
				]));
	});
var $author$project$Main$TrendsViewMsg = function (a) {
	return {$: 'TrendsViewMsg', a: a};
};
var $author$project$Main$SelectPumpDrug = function (a) {
	return {$: 'SelectPumpDrug', a: a};
};
var $author$project$Main$DeliverPumpBolus = {$: 'DeliverPumpBolus'};
var $author$project$Main$SpectrumModalMsg = function (a) {
	return {$: 'SpectrumModalMsg', a: a};
};
var $author$project$Ui$TrendsView$Interval8Hour = {$: 'Interval8Hour'};
var $author$project$Ui$TrendsView$Interval24Hour = {$: 'Interval24Hour'};
var $author$project$Ui$TrendsView$CloseTrendsView = {$: 'CloseTrendsView'};
var $author$project$Ui$TrendsView$renderTrendChart = F4(
	function (title, color1, color2, records) {
		var svgW = 480.0;
		var svgH = 160.0;
		var padT = 15.0;
		var padR = 10.0;
		var padL = 40.0;
		var padB = 25.0;
		var mapY = function (val) {
			var clamped = A2(
				$elm$core$Basics$max,
				30.0,
				A2($elm$core$Basics$min, 200.0, val));
			var ratio = (clamped - 30.0) / 170.0;
			return (svgH - padB) - (ratio * ((svgH - padT) - padB));
		};
		var n = $elm$core$List$length(records);
		var mapX = function (i) {
			return padL + ((i / A2($elm$core$Basics$max, 1.0, n - 1.0)) * ((svgW - padL) - padR));
		};
		var hrPath = function () {
			if (!records.b) {
				return '';
			} else {
				var p0 = records.a;
				var rest = records.b;
				var start = 'M ' + ($elm$core$String$fromFloat(
					mapX(0)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0.heartRateBpm))));
				var lines = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, r) {
								return 'L ' + ($elm$core$String$fromFloat(
									mapX(i + 1)) + (' ' + $elm$core$String$fromFloat(
									mapY(r.heartRateBpm))));
							}),
						rest));
				return start + (' ' + lines);
			}
		}();
		var abpPath = function () {
			if (!records.b) {
				return '';
			} else {
				var p0 = records.a;
				var rest = records.b;
				var start = 'M ' + ($elm$core$String$fromFloat(
					mapX(0)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0.abpMeanMmHg))));
				var lines = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, r) {
								return 'L ' + ($elm$core$String$fromFloat(
									mapX(i + 1)) + (' ' + $elm$core$String$fromFloat(
									mapY(r.abpMeanMmHg))));
							}),
						rest));
				return start + (' ' + lines);
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', color1)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-weight', '400')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('HR (Green) | MAP (Red)')
								]))
						])),
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height('160'),
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromFloat(svgW) + (' ' + $elm$core$String$fromFloat(svgH))))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(padL)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(
										mapY(60.0))),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(svgW - padR)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(
										mapY(60.0))),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
									$elm$svg$Svg$Attributes$strokeDasharray('2 2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(padL)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(
										mapY(120.0))),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(svgW - padR)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(
										mapY(120.0))),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
									$elm$svg$Svg$Attributes$strokeDasharray('2 2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(hrPath),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke(color1),
									$elm$svg$Svg$Attributes$strokeWidth('2.0')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(abpPath),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke(color2),
									$elm$svg$Svg$Attributes$strokeWidth('2.0')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Ui$TrendsView$SelectInterval = function (a) {
	return {$: 'SelectInterval', a: a};
};
var $author$project$Ui$TrendsView$renderIntervalBtn = F3(
	function (label, interval, isSelected) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					$author$project$Ui$TrendsView$SelectInterval(interval)),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isSelected ? $author$project$Ui$Theme$ecgColor : $author$project$Ui$Theme$bezelColor),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isSelected ? '#000000' : $author$project$Ui$Theme$textPrimaryColor),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $author$project$Ui$TrendsView$round1 = function (val) {
	return $elm$core$Basics$round(val * 10.0) / 10.0;
};
var $author$project$Ui$Theme$respColor = '#ff9400';
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Ui$TrendsView$formatTime = function (sec) {
	var totalSec = $elm$core$Basics$round(sec);
	var pad = function (n) {
		return (n < 10) ? ('0' + $elm$core$String$fromInt(n)) : $elm$core$String$fromInt(n);
	};
	var s = A2($elm$core$Basics$modBy, 60, totalSec);
	var m = A2($elm$core$Basics$modBy, 60, (totalSec / 60) | 0);
	return pad(m) + (':' + pad(s));
};
var $author$project$Ui$TrendsView$renderTabularTrends = function (records) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '14px'),
				A2($elm$html$Html$Attributes$style, 'overflow-x', 'auto')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'border-collapse', 'collapse'),
						A2($elm$html$Html$Attributes$style, 'font-size', '12px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$thead,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$tr,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$bezelColor),
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
										A2($elm$html$Html$Attributes$style, 'text-align', 'left')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('TIME')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('HR (bpm)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('ABP (Sys/Dia)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('MAP (mmHg)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('SpO2 (%)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$capnoColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('EtCO2 (mmHg)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$respColor)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('RR (bpm)')
											])),
										A2(
										$elm$html$Html$th,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '8px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('TEMP (C)')
											]))
									]))
							])),
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (r) {
								return A2(
									$elm$html$Html$tr,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$cardColor),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$Ui$TrendsView$formatTime(r.timestampSec))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(
														$elm$core$Basics$round(r.heartRateBpm)))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(
														$elm$core$Basics$round(r.abpSystolicMmHg)) + ('/' + $elm$core$String$fromInt(
														$elm$core$Basics$round(r.abpDiastolicMmHg))))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(
														$elm$core$Basics$round(r.abpMeanMmHg)))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromFloat(
														$author$project$Ui$TrendsView$round1(r.spO2Percent)))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$capnoColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(
														$elm$core$Basics$round(r.etco2MmHg)))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$respColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(
														$elm$core$Basics$round(r.respiratoryRateBpm)))
												])),
											A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromFloat(
														$author$project$Ui$TrendsView$round1(r.temperatureCelsius)))
												]))
										]));
							},
							A2($elm$core$List$take, 10, records)))
					]))
			]));
};
var $author$project$Ui$TrendsView$renderSpO2CapnoChart = F4(
	function (title, color1, color2, records) {
		var svgW = 480.0;
		var svgH = 160.0;
		var padT = 15.0;
		var padR = 10.0;
		var padL = 40.0;
		var padB = 25.0;
		var mapY = function (val) {
			var clamped = A2(
				$elm$core$Basics$max,
				0.0,
				A2($elm$core$Basics$min, 100.0, val));
			var ratio = clamped / 100.0;
			return (svgH - padB) - (ratio * ((svgH - padT) - padB));
		};
		var n = $elm$core$List$length(records);
		var mapX = function (i) {
			return padL + ((i / A2($elm$core$Basics$max, 1.0, n - 1.0)) * ((svgW - padL) - padR));
		};
		var co2Path = function () {
			if (!records.b) {
				return '';
			} else {
				var p0 = records.a;
				var rest = records.b;
				var start = 'M ' + ($elm$core$String$fromFloat(
					mapX(0)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0.etco2MmHg))));
				var lines = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, r) {
								return 'L ' + ($elm$core$String$fromFloat(
									mapX(i + 1)) + (' ' + $elm$core$String$fromFloat(
									mapY(r.etco2MmHg))));
							}),
						rest));
				return start + (' ' + lines);
			}
		}();
		var spo2Path = function () {
			if (!records.b) {
				return '';
			} else {
				var p0 = records.a;
				var rest = records.b;
				var start = 'M ' + ($elm$core$String$fromFloat(
					mapX(0)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0.spO2Percent))));
				var lines = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, r) {
								return 'L ' + ($elm$core$String$fromFloat(
									mapX(i + 1)) + (' ' + $elm$core$String$fromFloat(
									mapY(r.spO2Percent))));
							}),
						rest));
				return start + (' ' + lines);
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', color1)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-weight', '400')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('SpO2 (Cyan) | EtCO2 (Yellow)')
								]))
						])),
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height('160'),
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromFloat(svgW) + (' ' + $elm$core$String$fromFloat(svgH))))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(padL)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(
										mapY(90.0))),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(svgW - padR)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(
										mapY(90.0))),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
									$elm$svg$Svg$Attributes$strokeDasharray('2 2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(padL)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(
										mapY(40.0))),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(svgW - padR)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(
										mapY(40.0))),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
									$elm$svg$Svg$Attributes$strokeDasharray('2 2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(spo2Path),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke(color1),
									$elm$svg$Svg$Attributes$strokeWidth('2.0')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(co2Path),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke(color2),
									$elm$svg$Svg$Attributes$strokeWidth('2.0')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Ui$TrendsView$viewTrendsScreen = F2(
	function (activeInterval, records) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'gap', '14px'),
					A2($elm$html$Html$Attributes$style, 'padding', '16px'),
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
					A2($elm$html$Html$Attributes$style, 'min-height', 'calc(100vh - 120px)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '12px 16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin', '0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
											A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('PHYSIOLOGICAL VITAL SIGN TRENDS')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Longitudinal Retrospective Telemetry Archive and Statistical Summary')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px')
								]),
							_List_fromArray(
								[
									A3(
									$author$project$Ui$TrendsView$renderIntervalBtn,
									'1 Hour',
									$author$project$Ui$TrendsView$Interval1Hour,
									_Utils_eq(activeInterval, $author$project$Ui$TrendsView$Interval1Hour)),
									A3(
									$author$project$Ui$TrendsView$renderIntervalBtn,
									'8 Hours',
									$author$project$Ui$TrendsView$Interval8Hour,
									_Utils_eq(activeInterval, $author$project$Ui$TrendsView$Interval8Hour)),
									A3(
									$author$project$Ui$TrendsView$renderIntervalBtn,
									'24 Hours',
									$author$project$Ui$TrendsView$Interval24Hour,
									_Utils_eq(activeInterval, $author$project$Ui$TrendsView$Interval24Hour)),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Ui$TrendsView$CloseTrendsView),
											A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$bezelColor),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-size', '12px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Close Screen')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 1fr'),
							A2($elm$html$Html$Attributes$style, 'gap', '14px')
						]),
					_List_fromArray(
						[
							A4($author$project$Ui$TrendsView$renderTrendChart, 'HEART RATE & ARTERIAL PRESSURE (bpm / mmHg)', $author$project$Ui$Theme$ecgColor, $author$project$Ui$Theme$abpColor, records),
							A4($author$project$Ui$TrendsView$renderSpO2CapnoChart, 'SPO2 & ETCO2 (% / mmHg)', $author$project$Ui$Theme$ppgColor, $author$project$Ui$Theme$capnoColor, records)
						])),
					$author$project$Ui$TrendsView$renderTabularTrends(records)
				]));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Ui$Theme$alertColor = '#ff0033';
var $author$project$Ui$LeadModal$metricItem = F2(
	function (label, val) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '2px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(val)
						]))
				]));
	});
var $author$project$Ui$LeadModal$axisToString = function (axis) {
	switch (axis.$) {
		case 'NormalAxis':
			var deg = axis.a;
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(deg)) + '° (Normal)';
		case 'LeftAxisDeviation':
			var deg = axis.a;
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(deg)) + '° (LAD)';
		case 'RightAxisDeviation':
			var deg = axis.a;
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(deg)) + '° (RAD)';
		default:
			var deg = axis.a;
			return $elm$core$String$fromInt(
				$elm$core$Basics$round(deg)) + '° (Extreme)';
	}
};
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$Attributes$fontWeight = _VirtualDom_attribute('font-weight');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $author$project$Ui$Sweepbar$normalizeX = F2(
	function (timestampMs, totalW) {
		var sweepPeriodMs = 4000.0;
		var moduloMs = timestampMs - ($elm$core$Basics$floor(timestampMs / sweepPeriodMs) * sweepPeriodMs);
		return (moduloMs / sweepPeriodMs) * totalW;
	});
var $author$project$Ui$Sweepbar$renderWaveformPath = F5(
	function (points, totalW, totalH, minVal, maxVal) {
		if (!points.b) {
			return '';
		} else {
			var first = points.a;
			var rest = points.b;
			var toSvgCoord = function (p) {
				var valRange = A2($elm$core$Basics$max, 0.1, maxVal - minVal);
				var usableH = totalH * 0.8;
				var normVal = (p.value - minVal) / valRange;
				var xCoord = A2($author$project$Ui$Sweepbar$normalizeX, p.timestamp, totalW);
				var padY = totalH * 0.1;
				var yCoord = (totalH - padY) - (normVal * usableH);
				return _Utils_Tuple2(
					xCoord,
					A3($elm$core$Basics$clamp, 2.0, totalH - 2.0, yCoord));
			};
			var _v1 = toSvgCoord(first);
			var startX = _v1.a;
			var startY = _v1.b;
			var stepCmd = F2(
				function (p, acc) {
					var _v2 = toSvgCoord(p);
					var px = _v2.a;
					var py = _v2.b;
					return acc + (' L ' + ($elm$core$String$fromFloat(px) + (' ' + $elm$core$String$fromFloat(py))));
				});
			var startCmd = 'M ' + ($elm$core$String$fromFloat(startX) + (' ' + $elm$core$String$fromFloat(startY)));
			return A3($elm$core$List$foldl, stepCmd, startCmd, rest);
		}
	});
var $author$project$Ui$EcgGrid$renderCalibrationPulse = F2(
	function (originX, originY) {
		var pulseD = 'M ' + ($elm$core$String$fromFloat(originX) + (' ' + ($elm$core$String$fromFloat(originY) + (' L ' + ($elm$core$String$fromFloat(originX + 8.0) + (' ' + ($elm$core$String$fromFloat(originY) + (' L ' + ($elm$core$String$fromFloat(originX + 8.0) + (' ' + ($elm$core$String$fromFloat(originY - 40.0) + (' L ' + ($elm$core$String$fromFloat(originX + 32.0) + (' ' + ($elm$core$String$fromFloat(originY - 40.0) + (' L ' + ($elm$core$String$fromFloat(originX + 32.0) + (' ' + ($elm$core$String$fromFloat(originY) + (' L ' + ($elm$core$String$fromFloat(originX + 44.0) + (' ' + $elm$core$String$fromFloat(originY)))))))))))))))))))))));
		return A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d(pulseD),
					$elm$svg$Svg$Attributes$fill('none'),
					$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$ecgColor),
					$elm$svg$Svg$Attributes$strokeWidth('1.8')
				]),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$pattern = $elm$svg$Svg$trustedNode('pattern');
var $elm$svg$Svg$Attributes$patternUnits = _VirtualDom_attribute('patternUnits');
var $author$project$Ui$Theme$gridMajorColor = 'rgba(255, 65, 54, 0.18)';
var $author$project$Ui$Theme$gridMinorColor = 'rgba(255, 65, 54, 0.08)';
var $author$project$Ui$EcgGrid$renderEcgGridBackground = F2(
	function (gridWidth, gridHeight) {
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$defs,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$pattern,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('ecg-minor-grid'),
								$elm$svg$Svg$Attributes$width('8'),
								$elm$svg$Svg$Attributes$height('8'),
								$elm$svg$Svg$Attributes$patternUnits('userSpaceOnUse')
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$d('M 8 0 L 0 0 0 8'),
										$elm$svg$Svg$Attributes$fill('none'),
										$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$gridMinorColor),
										$elm$svg$Svg$Attributes$strokeWidth('0.5')
									]),
								_List_Nil)
							])),
						A2(
						$elm$svg$Svg$pattern,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('ecg-major-grid'),
								$elm$svg$Svg$Attributes$width('40'),
								$elm$svg$Svg$Attributes$height('40'),
								$elm$svg$Svg$Attributes$patternUnits('userSpaceOnUse')
							]),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$rect,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$width('40'),
										$elm$svg$Svg$Attributes$height('40'),
										$elm$svg$Svg$Attributes$fill('url(#ecg-minor-grid)')
									]),
								_List_Nil),
								A2(
								$elm$svg$Svg$path,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$d('M 40 0 L 0 0 0 40'),
										$elm$svg$Svg$Attributes$fill('none'),
										$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$gridMajorColor),
										$elm$svg$Svg$Attributes$strokeWidth('1.0')
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('0'),
						$elm$svg$Svg$Attributes$y('0'),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(gridWidth)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(gridHeight)),
						$elm$svg$Svg$Attributes$fill('url(#ecg-major-grid)')
					]),
				_List_Nil)
			]);
	});
var $author$project$Ui$LeadModal$renderLeadSvg = F4(
	function (label, pts, w, h) {
		var pathD = A5($author$project$Ui$Sweepbar$renderWaveformPath, pts, w, h, -0.6, 1.8);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox(
					'0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)))),
					$elm$svg$Svg$Attributes$width('100%'),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(h) + 'px'),
					$elm$svg$Svg$Attributes$style('display: block;')
				]),
			_Utils_ap(
				A2($author$project$Ui$EcgGrid$renderEcgGridBackground, w, h),
				_List_fromArray(
					[
						A2($author$project$Ui$EcgGrid$renderCalibrationPulse, 8.0, h * 0.65),
						A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x('56'),
								$elm$svg$Svg$Attributes$y('22'),
								$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ecgColor),
								$elm$svg$Svg$Attributes$fontSize('13'),
								$elm$svg$Svg$Attributes$fontWeight('bold'),
								$elm$svg$Svg$Attributes$fontFamily('monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							])),
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$d(pathD),
								$elm$svg$Svg$Attributes$fill('none'),
								$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$ecgColor),
								$elm$svg$Svg$Attributes$strokeWidth('1.6'),
								$elm$svg$Svg$Attributes$strokeLinecap('round'),
								$elm$svg$Svg$Attributes$strokeLinejoin('round')
							]),
						_List_Nil)
					])));
	});
var $author$project$Dsp$Types$leadToString = function (lead) {
	switch (lead.$) {
		case 'LeadI':
			return 'I';
		case 'LeadII':
			return 'II';
		case 'LeadIII':
			return 'III';
		case 'LeadAVR':
			return 'aVR';
		case 'LeadAVL':
			return 'aVL';
		case 'LeadAVF':
			return 'aVF';
		case 'LeadV1':
			return 'V1';
		case 'LeadV2':
			return 'V2';
		case 'LeadV3':
			return 'V3';
		case 'LeadV4':
			return 'V4';
		case 'LeadV5':
			return 'V5';
		default:
			return 'V6';
	}
};
var $author$project$Ui$LeadModal$renderLeadTile = F2(
	function (lead, pts) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#06090e'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #141c2b'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '8px')
				]),
			_List_fromArray(
				[
					A4(
					$author$project$Ui$LeadModal$renderLeadSvg,
					$author$project$Dsp$Types$leadToString(lead),
					pts,
					280.0,
					110.0)
				]));
	});
var $author$project$Ui$LeadModal$renderLeadColumn = F2(
	function (leads, leadMap) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'gap', '12px')
				]),
			A2(
				$elm$core$List$map,
				function (lead) {
					return A2(
						$author$project$Ui$LeadModal$renderLeadTile,
						lead,
						leadMap(lead));
				},
				leads));
	});
var $author$project$Ui$LeadModal$render12LeadModal = F4(
	function (snippets, metrics, isStemi, closeMsg) {
		var leadMap = function (lead) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.points;
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (s) {
								return _Utils_eq(s.lead, lead);
							},
							snippets))));
		};
		var rhythmStripPoints = leadMap($author$project$Dsp$Types$LeadII);
		var col4 = _List_fromArray(
			[$author$project$Dsp$Types$LeadV4, $author$project$Dsp$Types$LeadV5, $author$project$Dsp$Types$LeadV6]);
		var col3 = _List_fromArray(
			[$author$project$Dsp$Types$LeadV1, $author$project$Dsp$Types$LeadV2, $author$project$Dsp$Types$LeadV3]);
		var col2 = _List_fromArray(
			[$author$project$Dsp$Types$LeadAVR, $author$project$Dsp$Types$LeadAVL, $author$project$Dsp$Types$LeadAVF]);
		var col1 = _List_fromArray(
			[$author$project$Dsp$Types$LeadI, $author$project$Dsp$Types$LeadII, $author$project$Dsp$Types$LeadIII]);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'right', '0'),
					A2($elm$html$Html$Attributes$style, 'bottom', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 4, 8, 0.88)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
					A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(4px)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#0a0e17'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'width', '94vw'),
							A2($elm$html$Html$Attributes$style, 'max-width', '1280px'),
							A2($elm$html$Html$Attributes$style, 'max-height', '92vh'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
							A2($elm$html$Html$Attributes$style, 'padding', '24px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 24px 64px rgba(0, 0, 0, 0.8)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #1a2333'),
									A2($elm$html$Html$Attributes$style, 'padding-bottom', '16px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'margin', '0 0 4px 0')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('12-LEAD DIAGNOSTIC ELECTROCARDIOGRAM')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Standard 25 mm/s, 10 mm/mV, 0.05-150 Hz diagnostic bandwidth')
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
											A2($elm$html$Html$Attributes$style, 'gap', '16px')
										]),
									_List_fromArray(
										[
											isStemi ? A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'background', 'rgba(255, 0, 51, 0.2)'),
													A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$alertColor),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$alertColor),
													A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
													A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
													A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('CRITICAL: ACUTE STEMI CRITERIA MET')
												])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(closeMsg),
													A2($elm$html$Html$Attributes$style, 'background', '#182234'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
													A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
													A2($elm$html$Html$Attributes$style, 'padding', '8px 18px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
													A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('CLOSE [ESC]')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(6, 1fr)'),
									A2($elm$html$Html$Attributes$style, 'gap', '12px'),
									A2($elm$html$Html$Attributes$style, 'background', '#0e1522'),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #182234'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
									A2($elm$html$Html$Attributes$style, 'padding', '12px 16px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'HEART RATE',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(metrics.heartRateBpm)) + ' BPM'),
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'PR INTERVAL',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(metrics.prIntervalMs)) + ' ms'),
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'QRS DURATION',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(metrics.qrsDurationMs)) + ' ms'),
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'QT / QTc (FRID)',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(metrics.qtIntervalMs)) + (' / ' + ($elm$core$String$fromInt(
										$elm$core$Basics$round(metrics.qtcFridericiaMs)) + ' ms'))),
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'ELECTRICAL AXIS',
									$author$project$Ui$LeadModal$axisToString(metrics.electricalAxis)),
									A2(
									$author$project$Ui$LeadModal$metricItem,
									'HRV (RMSSD)',
									$elm$core$String$fromFloat(
										$elm$core$Basics$round(metrics.hrv.rmssdMs * 10.0) / 10.0) + ' ms')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(4, 1fr)'),
									A2($elm$html$Html$Attributes$style, 'gap', '12px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2($author$project$Ui$LeadModal$renderLeadColumn, col1, leadMap),
									A2($author$project$Ui$LeadModal$renderLeadColumn, col2, leadMap),
									A2($author$project$Ui$LeadModal$renderLeadColumn, col3, leadMap),
									A2($author$project$Ui$LeadModal$renderLeadColumn, col4, leadMap)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', '#06090e'),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #182234'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
									A2($elm$html$Html$Attributes$style, 'padding', '12px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
											A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('CONTINUOUS RHYTHM STRIP: LEAD II (10 SECONDS)')
										])),
									A4($author$project$Ui$LeadModal$renderLeadSvg, 'II (Rhythm)', rhythmStripPoints, 1150.0, 120.0)
								]))
						]))
				]));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Ui$SpectrumModal$renderPsdSvg = function (psd) {
	var svgW = 450.0;
	var svgH = 300.0;
	var padT = 20.0;
	var padR = 15.0;
	var padL = 45.0;
	var padB = 35.0;
	var maxP = A3(
		$elm$core$List$foldl,
		F2(
			function (_v3, acc) {
				var p = _v3.b;
				return A2($elm$core$Basics$max, acc, p);
			}),
		10.0,
		psd);
	var mapY = function (p) {
		return (svgH - padB) - ((p / maxP) * ((svgH - padT) - padB));
	};
	var mapX = function (f) {
		return padL + ((f / 0.5) * ((svgW - padL) - padR));
	};
	var hfEndX = mapX(0.40);
	var lfEndX = mapX(0.15);
	var vlfEndX = mapX(0.04);
	var curvePath = function () {
		var _v0 = A2(
			$elm$core$List$filter,
			function (_v1) {
				var f = _v1.a;
				return f <= 0.5;
			},
			psd);
		if (!_v0.b) {
			return '';
		} else {
			var p0 = _v0.a;
			var rest = _v0.b;
			var start = 'M ' + ($elm$core$String$fromFloat(
				mapX(p0.a)) + (' ' + $elm$core$String$fromFloat(
				mapY(p0.b))));
			var lines = A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (_v2) {
						var f = _v2.a;
						var p = _v2.b;
						return 'L ' + ($elm$core$String$fromFloat(
							mapX(f)) + (' ' + $elm$core$String$fromFloat(
							mapY(p))));
					},
					rest));
			return start + (' ' + lines);
		}
	}();
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width('100%'),
				$elm$svg$Svg$Attributes$height('300'),
				$elm$svg$Svg$Attributes$viewBox(
				'0 0 ' + ($elm$core$String$fromFloat(svgW) + (' ' + $elm$core$String$fromFloat(svgH))))
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(padL)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(vlfEndX - padL)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat((svgH - padT) - padB)),
						$elm$svg$Svg$Attributes$fill('rgba(100, 116, 139, 0.12)')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(vlfEndX)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(lfEndX - vlfEndX)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat((svgH - padT) - padB)),
						$elm$svg$Svg$Attributes$fill('rgba(255, 204, 0, 0.12)')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(lfEndX)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(hfEndX - lfEndX)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat((svgH - padT) - padB)),
						$elm$svg$Svg$Attributes$fill('rgba(0, 255, 65, 0.12)')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat((padL + vlfEndX) / 2.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT + 14.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$textAnchor('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text('VLF')
					])),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat((vlfEndX + lfEndX) / 2.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT + 14.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$capnoColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$textAnchor('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text('LF')
					])),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat((lfEndX + hfEndX) / 2.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(padT + 14.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ecgColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$textAnchor('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text('HF')
					])),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(padL)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(svgH - padB)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(svgW - padR)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(svgH - padB)),
						$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$textMutedColor)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(padL)),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(padT)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(padL)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(svgH - padB)),
						$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$textMutedColor)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(svgW / 2.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(svgH - 8.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
						$elm$svg$Svg$Attributes$fontSize('11'),
						$elm$svg$Svg$Attributes$textAnchor('middle')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text('Frequency (Hz)')
					])),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(curvePath),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$ecgColor),
						$elm$svg$Svg$Attributes$strokeWidth('2.0')
					]),
				_List_Nil)
			]));
};
var $author$project$Ui$SpectrumModal$round1 = function (val) {
	return $elm$core$Basics$round(val * 10.0) / 10.0;
};
var $author$project$Ui$SpectrumModal$renderBandRow = F3(
	function (label, val, color) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', color),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '600')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(val)
						]))
				]));
	});
var $author$project$Ui$SpectrumModal$renderBandsCard = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'gap', '8px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
						A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('SPECTRAL POWER BANDS')
					])),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'LF Power (0.04-0.15 Hz)',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.lfPowerMs2)) + ' ms2',
				$author$project$Ui$Theme$capnoColor),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'HF Power (0.15-0.40 Hz)',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.hfPowerMs2)) + ' ms2',
				$author$project$Ui$Theme$ecgColor),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'VLF Power (0.003-0.04 Hz)',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.vlfPowerMs2)) + ' ms2',
				$author$project$Ui$Theme$textMutedColor),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'Total Power',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.totalPowerMs2)) + ' ms2',
				$author$project$Ui$Theme$textPrimaryColor),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'Normalized LF (LFnu)',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.lfNormalized)) + ' %',
				$author$project$Ui$Theme$capnoColor),
				A3(
				$author$project$Ui$SpectrumModal$renderBandRow,
				'Normalized HF (HFnu)',
				$elm$core$String$fromFloat(
					$author$project$Ui$SpectrumModal$round1(m.hfNormalized)) + ' %',
				$author$project$Ui$Theme$ecgColor)
			]));
};
var $author$project$Ui$SpectrumModal$CloseSpectrumModal = {$: 'CloseSpectrumModal'};
var $author$project$Ui$SpectrumModal$round2 = function (val) {
	return $elm$core$Basics$round(val * 100.0) / 100.0;
};
var $author$project$Ui$Theme$warningColor = '#ffcc00';
var $author$project$Ui$SpectrumModal$renderAutonomicCard = function (m) {
	var toneStatus = (m.lfHfRatio > 2.5) ? _Utils_Tuple2('Sympathetic Dominance (Stress / Sepsis)', $author$project$Ui$Theme$warningColor) : ((m.lfHfRatio < 0.8) ? _Utils_Tuple2('Parasympathetic Vagal Dominance', $author$project$Ui$Theme$ecgColor) : _Utils_Tuple2('Balanced Autonomic Tone', $author$project$Ui$Theme$ppgColor));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'gap', '10px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
						A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('AUTONOMIC TONE EVALUATION')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'baseline')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('LF / HF Ratio:')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
								A2($elm$html$Html$Attributes$style, 'color', toneStatus.b)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromFloat(
									$author$project$Ui$SpectrumModal$round2(m.lfHfRatio)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
						A2($elm$html$Html$Attributes$style, 'color', toneStatus.b)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(toneStatus.a)
					]))
			]));
};
var $author$project$Ui$SpectrumModal$viewSpectrumModal = F2(
	function (metrics, psd) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100vw'),
					A2($elm$html$Html$Attributes$style, 'height', '100vh'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 6, 23, 0.85)'),
					A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(6px)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '150')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
							A2($elm$html$Html$Attributes$style, 'width', '840px'),
							A2($elm$html$Html$Attributes$style, 'max-width', '94vw'),
							A2($elm$html$Html$Attributes$style, 'padding', '24px'),
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
							A2($elm$html$Html$Attributes$style, 'gap', '16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$bezelColor),
									A2($elm$html$Html$Attributes$style, 'padding-bottom', '12px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'margin', '0'),
													A2($elm$html$Html$Attributes$style, 'font-size', '18px'),
													A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
													A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('AUTONOMIC TONE & HRV POWER SPECTRAL DENSITY')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Welch Periodogram Spectral Estimation and Sympathovagal Balance (LF/HF)')
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Ui$SpectrumModal$CloseSpectrumModal),
											A2($elm$html$Html$Attributes$style, 'background', 'transparent'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-size', '13px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Close [ESC]')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', '480px 1fr'),
									A2($elm$html$Html$Attributes$style, 'gap', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
											A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
											A2($elm$html$Html$Attributes$style, 'padding', '12px')
										]),
									_List_fromArray(
										[
											$author$project$Ui$SpectrumModal$renderPsdSvg(psd)
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
											A2($elm$html$Html$Attributes$style, 'gap', '12px')
										]),
									_List_fromArray(
										[
											$author$project$Ui$SpectrumModal$renderAutonomicCard(metrics),
											$author$project$Ui$SpectrumModal$renderBandsCard(metrics)
										]))
								]))
						]))
				]));
	});
var $author$project$Ui$VentilatorView$round1 = function (val) {
	return $elm$core$Basics$round(val * 10.0) / 10.0;
};
var $author$project$Ui$VentilatorView$SetVentMode = function (a) {
	return {$: 'SetVentMode', a: a};
};
var $author$project$Ui$VentilatorView$renderModeBtn = F3(
	function (label, mode, isSelected) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					$author$project$Ui$VentilatorView$SetVentMode(mode)),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isSelected ? $author$project$Ui$Theme$capnoColor : $author$project$Ui$Theme$bezelColor),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isSelected ? '#000000' : $author$project$Ui$Theme$textPrimaryColor),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Simulation$Ventilator$PressureControl = {$: 'PressureControl'};
var $author$project$Simulation$Ventilator$PressureSupport = {$: 'PressureSupport'};
var $author$project$Ui$VentilatorView$renderNumericTile = F4(
	function (title, val, unit, color) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'baseline')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '10px'),
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
									A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.04em')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
									A2($elm$html$Html$Attributes$style, 'color', color)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(val)
								]))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(unit)
						]))
				]));
	});
var $author$project$Ui$VentilatorView$CloseVentilatorView = {$: 'CloseVentilatorView'};
var $author$project$Ui$VentilatorView$renderWaveformTrack = F5(
	function (title, color, minVal, maxVal, history) {
		var svgW = 750.0;
		var svgH = 120.0;
		var padT = 10.0;
		var padR = 10.0;
		var padL = 40.0;
		var padB = 20.0;
		var mapY = function (val) {
			var clamped = A2(
				$elm$core$Basics$max,
				minVal,
				A2($elm$core$Basics$min, maxVal, val));
			var ratio = (clamped - minVal) / (maxVal - minVal);
			return (svgH - padB) - (ratio * ((svgH - padT) - padB));
		};
		var mapX = F2(
			function (i, total) {
				return padL + ((i / A2($elm$core$Basics$max, 1.0, total - 1.0)) * ((svgW - padL) - padR));
			});
		var n = $elm$core$List$length(history);
		var pathData = function () {
			if (!history.b) {
				return '';
			} else {
				var p0 = history.a;
				var rest = history.b;
				var startCmd = 'M ' + ($elm$core$String$fromFloat(
					A2(mapX, 0, n)) + (' ' + $elm$core$String$fromFloat(
					mapY(p0))));
				var lineCmds = A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, v) {
								return 'L ' + ($elm$core$String$fromFloat(
									A2(mapX, i + 1, n)) + (' ' + $elm$core$String$fromFloat(
									mapY(v))));
							}),
						rest));
				return startCmd + (' ' + lineCmds);
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'gap', '4px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'color', color)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-weight', '400')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromFloat(minVal) + (' to ' + $elm$core$String$fromFloat(maxVal)))
								]))
						])),
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height('120'),
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromFloat(svgW) + (' ' + $elm$core$String$fromFloat(svgH))))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(padL)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(
										mapY(0.0))),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(svgW - padR)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(
										mapY(0.0))),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$bezelColor),
									$elm$svg$Svg$Attributes$strokeDasharray('2 2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d(pathData),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke(color),
									$elm$svg$Svg$Attributes$strokeWidth('2.0')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Ui$VentilatorView$viewVentilatorScreen = F6(
	function (settings, mechanics, scalars, pawHistory, flowHistory, volHistory) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'gap', '12px'),
					A2($elm$html$Html$Attributes$style, 'padding', '16px'),
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
					A2($elm$html$Html$Attributes$style, 'min-height', 'calc(100vh - 120px)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '12px 16px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin', '0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$capnoColor),
											A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.05em')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('ICU MECHANICAL VENTILATOR GRAPHICS')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Continuous Pulmonary Scalar Dynamics and Equation of Motion Solver')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px')
								]),
							_List_fromArray(
								[
									A3(
									$author$project$Ui$VentilatorView$renderModeBtn,
									'VCV',
									$author$project$Simulation$Ventilator$VolumeControl,
									_Utils_eq(settings.mode, $author$project$Simulation$Ventilator$VolumeControl)),
									A3(
									$author$project$Ui$VentilatorView$renderModeBtn,
									'PCV',
									$author$project$Simulation$Ventilator$PressureControl,
									_Utils_eq(settings.mode, $author$project$Simulation$Ventilator$PressureControl)),
									A3(
									$author$project$Ui$VentilatorView$renderModeBtn,
									'PSV',
									$author$project$Simulation$Ventilator$PressureSupport,
									_Utils_eq(settings.mode, $author$project$Simulation$Ventilator$PressureSupport)),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Ui$VentilatorView$CloseVentilatorView),
											A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$bezelColor),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-size', '12px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Close Screen')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 280px'),
							A2($elm$html$Html$Attributes$style, 'gap', '12px'),
							A2($elm$html$Html$Attributes$style, 'flex', '1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px')
								]),
							_List_fromArray(
								[
									A5($author$project$Ui$VentilatorView$renderWaveformTrack, 'Paw (cmH2O)', $author$project$Ui$Theme$capnoColor, 0.0, 40.0, pawHistory),
									A5($author$project$Ui$VentilatorView$renderWaveformTrack, 'Flow (L/min)', $author$project$Ui$Theme$ppgColor, -60.0, 60.0, flowHistory),
									A5($author$project$Ui$VentilatorView$renderWaveformTrack, 'Volume (mL)', $author$project$Ui$Theme$ecgColor, 0.0, 600.0, volHistory)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px')
								]),
							_List_fromArray(
								[
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'PEAK PRESSURE (PIP)',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(scalars.peakInspiratoryPressureCmH2o)),
									'cmH2O',
									$author$project$Ui$Theme$capnoColor),
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'PLATEAU PRESSURE (Pplat)',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(scalars.plateauPressureCmH2o)),
									'cmH2O',
									$author$project$Ui$Theme$capnoColor),
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'TOTAL PEEP',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(settings.peepCmH2o + mechanics.autoPeepCmH2o)),
									'cmH2O',
									$author$project$Ui$Theme$warningColor),
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'STATIC COMPLIANCE (Cstat)',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(mechanics.staticComplianceMlPerCmH2o)),
									'mL/cmH2O',
									$author$project$Ui$Theme$ppgColor),
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'AIRWAY RESISTANCE (Raw)',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(mechanics.airwayResistanceCmH2oPerLPerSec)),
									'cmH2O/(L/s)',
									$author$project$Ui$Theme$alertColor),
									A4(
									$author$project$Ui$VentilatorView$renderNumericTile,
									'DELIVERED TIDAL VOL (Vt)',
									$elm$core$String$fromFloat(
										$author$project$Ui$VentilatorView$round1(scalars.deliveredVolumeMl)),
									'mL',
									$author$project$Ui$Theme$ecgColor)
								]))
						]))
				]));
	});
var $author$project$Simulation$Scenarios$TensionPneumothorax = {$: 'TensionPneumothorax'};
var $author$project$Simulation$Scenarios$MalignantHyperthermiaCrisis = {$: 'MalignantHyperthermiaCrisis'};
var $author$project$Simulation$Scenarios$getScenarioDefinition = function (s) {
	switch (s.$) {
		case 'BaselineNominal':
			return {title: 'Nominal Resting Baseline', cvpMmhg: 6.0, scenario: $author$project$Simulation$Scenarios$BaselineNominal, etco2Mmhg: 38.0, spo2Percent: 98.5, heartRateBpm: 75.0, systolicMmhg: 120.0, temperatureC: 37.0, diastolicMmhg: 80.0, stElevationMv: 0.0, clinicalDescription: 'Euvolemic adult resting in ICU following elective surgery. Normal hemodynamics.', recommendedIntervention: 'Continue routine monitoring and maintenance hydration.'};
		case 'AcuteAnteriorStemi':
			return {title: 'Acute Anterior STEMI', cvpMmhg: 10.0, scenario: $author$project$Simulation$Scenarios$AcuteAnteriorStemi, etco2Mmhg: 35.0, spo2Percent: 94.0, heartRateBpm: 108.0, systolicMmhg: 102.0, temperatureC: 37.2, diastolicMmhg: 68.0, stElevationMv: 0.35, clinicalDescription: 'Acute coronary syndrome with occlusion of left anterior descending artery. ST elevation in V1-V4.', recommendedIntervention: 'Activate emergency cardiac catheterization lab, administer dual antiplatelet and heparin.'};
		case 'SepticShockDistributive':
			return {title: 'Severe Septic Shock', cvpMmhg: 4.0, scenario: $author$project$Simulation$Scenarios$SepticShockDistributive, etco2Mmhg: 28.0, spo2Percent: 92.0, heartRateBpm: 125.0, systolicMmhg: 82.0, temperatureC: 39.4, diastolicMmhg: 42.0, stElevationMv: 0.02, clinicalDescription: 'Hyperdynamic distributive shock secondary to urosepsis. Profound vasodilation and low SVR.', recommendedIntervention: 'Crystalloid fluid bolus 30 mL/kg, initiate Norepinephrine infusion, broad-spectrum antibiotics.'};
		case 'TensionPneumothorax':
			return {title: 'Tension Pneumothorax', cvpMmhg: 18.0, scenario: $author$project$Simulation$Scenarios$TensionPneumothorax, etco2Mmhg: 16.0, spo2Percent: 76.0, heartRateBpm: 142.0, systolicMmhg: 74.0, temperatureC: 37.0, diastolicMmhg: 48.0, stElevationMv: 0.0, clinicalDescription: 'Right-sided tension pneumothorax under positive pressure ventilation. Mediastinal shift and venous collapse.', recommendedIntervention: 'Immediate needle thoracostomy decompression in second intercostal space, followed by chest tube.'};
		case 'HypovolemicHemorrhage':
			return {title: 'Hemorrhagic Shock Class III', cvpMmhg: 2.0, scenario: $author$project$Simulation$Scenarios$HypovolemicHemorrhage, etco2Mmhg: 26.0, spo2Percent: 93.0, heartRateBpm: 132.0, systolicMmhg: 88.0, temperatureC: 35.8, diastolicMmhg: 72.0, stElevationMv: 0.0, clinicalDescription: 'Acute retroperitoneal hemorrhage. Significant intravascular volume depletion with tachycardia.', recommendedIntervention: 'Initiate massive transfusion protocol (1:1:1 PRBC, FFP, platelets), tranexamic acid.'};
		case 'OpioidRespiratoryDepression':
			return {title: 'Opioid Overdose / Bradypnea', cvpMmhg: 7.0, scenario: $author$project$Simulation$Scenarios$OpioidRespiratoryDepression, etco2Mmhg: 64.0, spo2Percent: 84.0, heartRateBpm: 52.0, systolicMmhg: 104.0, temperatureC: 36.4, diastolicMmhg: 64.0, stElevationMv: 0.0, clinicalDescription: 'Postoperative opioid accumulation. Severe central respiratory drive depression and hypercapnia.', recommendedIntervention: 'Titrate IV Naloxone in 40 mcg increments, bag-valve-mask ventilatory support.'};
		default:
			return {title: 'Malignant Hyperthermia Crisis', cvpMmhg: 12.0, scenario: $author$project$Simulation$Scenarios$MalignantHyperthermiaCrisis, etco2Mmhg: 82.0, spo2Percent: 90.0, heartRateBpm: 158.0, systolicMmhg: 148.0, temperatureC: 41.2, diastolicMmhg: 96.0, stElevationMv: 0.05, clinicalDescription: 'Hypermetabolic crisis triggered by volatile anesthetic exposure. Uncontrolled sarcoplasmic calcium release.', recommendedIntervention: 'Discontinue triggering agents, hyperventilate with 100% O2, administer IV Dantrolene 2.5 mg/kg.'};
	}
};
var $author$project$Ui$HemodynamicsModal$hemoCard = F5(
	function (label, val, unit, normalText, isNormal) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#0e1522'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					'1px solid ' + (isNormal ? '#182234' : $author$project$Ui$Theme$alertColor)),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'margin', '4px 0')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Attributes$style,
									'color',
									isNormal ? $author$project$Ui$Theme$textPrimaryColor : $author$project$Ui$Theme$alertColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(val)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(unit)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$Attributes$style,
							'color',
							isNormal ? $author$project$Ui$Theme$textMutedColor : $author$project$Ui$Theme$warningColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '10px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(normalText)
						]))
				]));
	});
var $author$project$Ui$HemodynamicsModal$roundFloat = F2(
	function (decimals, n) {
		var factor = A2($elm$core$Basics$pow, 10.0, decimals);
		return $elm$core$Basics$round(n * factor) / factor;
	});
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $author$project$Ui$HemodynamicsModal$renderSvrVsCiChart = F3(
	function (svr, ci, state) {
		var patientY = 180.0 - (((A3($elm$core$Basics$clamp, 1.0, 6.0, ci) - 1.0) / 5.0) * 160.0);
		var patientX = 40.0 + (((A3($elm$core$Basics$clamp, 200.0, 2000.0, svr) - 200.0) / 1800.0) * 380.0);
		var w = 460.0;
		var h = 220.0;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#06090e'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #162033'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('AFTERLOAD (SVR) VS CONTRACTILITY (CI) STATE SPACE')
						])),
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)))),
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(h) + 'px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1('40'),
									$elm$svg$Svg$Attributes$y1('180'),
									$elm$svg$Svg$Attributes$x2('440'),
									$elm$svg$Svg$Attributes$y2('180'),
									$elm$svg$Svg$Attributes$stroke('#2a3a54'),
									$elm$svg$Svg$Attributes$strokeWidth('1')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1('40'),
									$elm$svg$Svg$Attributes$y1('180'),
									$elm$svg$Svg$Attributes$x2('40'),
									$elm$svg$Svg$Attributes$y2('20'),
									$elm$svg$Svg$Attributes$stroke('#2a3a54'),
									$elm$svg$Svg$Attributes$strokeWidth('1')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('390'),
									$elm$svg$Svg$Attributes$y('200'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('SVR (Afterload)')
								])),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('8'),
									$elm$svg$Svg$Attributes$y('24'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('CI')
								])),
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('166'),
									$elm$svg$Svg$Attributes$y('84'),
									$elm$svg$Svg$Attributes$width('84'),
									$elm$svg$Svg$Attributes$height('48'),
									$elm$svg$Svg$Attributes$fill('rgba(0, 255, 65, 0.08)'),
									$elm$svg$Svg$Attributes$stroke('rgba(0, 255, 65, 0.3)'),
									$elm$svg$Svg$Attributes$strokeDasharray('2,2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('170'),
									$elm$svg$Svg$Attributes$y('112'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ecgColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Euvolemic')
								])),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('50'),
									$elm$svg$Svg$Attributes$y('50'),
									$elm$svg$Svg$Attributes$fill('rgba(255, 148, 0, 0.6)'),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Distributive Sepsis')
								])),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('310'),
									$elm$svg$Svg$Attributes$y('165'),
									$elm$svg$Svg$Attributes$fill('rgba(255, 0, 51, 0.6)'),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cardiogenic Shock')
								])),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx(
									$elm$core$String$fromFloat(patientX)),
									$elm$svg$Svg$Attributes$cy(
									$elm$core$String$fromFloat(patientY)),
									$elm$svg$Svg$Attributes$r('6'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$abpColor)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx(
									$elm$core$String$fromFloat(patientX)),
									$elm$svg$Svg$Attributes$cy(
									$elm$core$String$fromFloat(patientY)),
									$elm$svg$Svg$Attributes$r('12'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$abpColor),
									$elm$svg$Svg$Attributes$strokeWidth('1.5'),
									$elm$svg$Svg$Attributes$opacity('0.6')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromFloat(patientX + 12.0)),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromFloat(patientY - 4.0)),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textPrimaryColor),
									$elm$svg$Svg$Attributes$fontSize('11'),
									$elm$svg$Svg$Attributes$fontWeight('bold'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Patient')
								]))
						]))
				]));
	});
var $author$project$Ui$HemodynamicsModal$clinicalStateToString = function (s) {
	switch (s.$) {
		case 'EuvolemicNominal':
			return 'Euvolemic Compensated Normal';
		case 'HypovolemicShock':
			return 'Hypovolemic Shock (Volume Depleted)';
		case 'CardiogenicShock':
			return 'Cardiogenic Pump Failure';
		case 'DistributiveSepticShock':
			return 'Distributive Septic Shock (Vasodilated)';
		default:
			return 'Obstructive Shock (Extrinsic Compression)';
	}
};
var $author$project$Hemodynamics$Targets$CardiogenicShock = {$: 'CardiogenicShock'};
var $author$project$Hemodynamics$Targets$EuvolemicNominal = {$: 'EuvolemicNominal'};
var $author$project$Hemodynamics$Targets$HypovolemicShock = {$: 'HypovolemicShock'};
var $author$project$Hemodynamics$Targets$ObstructiveShock = {$: 'ObstructiveShock'};
var $author$project$Hemodynamics$Targets$DistributiveSepticShock = {$: 'DistributiveSepticShock'};
var $author$project$Hemodynamics$Targets$classifyHemodynamicState = F2(
	function (prof, cvp) {
		return (prof.shockIndex > 0.9) ? (((prof.cardiacIndexLpmM2 < 2.2) && ((cvp > 12.0) && (prof.systemicVascularResistanceDyns > 1400.0))) ? $author$project$Hemodynamics$Targets$CardiogenicShock : (((prof.cardiacIndexLpmM2 < 2.2) && (cvp < 5.0)) ? $author$project$Hemodynamics$Targets$HypovolemicShock : (((prof.cardiacIndexLpmM2 > 4.0) && (prof.systemicVascularResistanceDyns < 700.0)) ? $author$project$Hemodynamics$Targets$DistributiveSepticShock : (((cvp > 14.0) && (prof.cardiacIndexLpmM2 < 2.0)) ? $author$project$Hemodynamics$Targets$ObstructiveShock : $author$project$Hemodynamics$Targets$HypovolemicShock)))) : (((prof.systemicVascularResistanceDyns < 650.0) && (prof.cardiacIndexLpmM2 > 3.8)) ? $author$project$Hemodynamics$Targets$DistributiveSepticShock : $author$project$Hemodynamics$Targets$EuvolemicNominal);
	});
var $author$project$Ui$HemodynamicsModal$renderFrankStarlingChart = F3(
	function (cvp, svi, pos) {
		var patientY = 180.0 - ((A3($elm$core$Basics$clamp, 0.0, 60.0, svi) / 60.0) * 160.0);
		var patientX = 40.0 + ((A3($elm$core$Basics$clamp, 0.0, 20.0, cvp) / 20.0) * 380.0);
		var w = 460.0;
		var h = 220.0;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#06090e'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #162033'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$cvpColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('FRANK-STARLING MYOCARDIAL PERFORMANCE CURVE')
						])),
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)))),
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(h) + 'px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1('40'),
									$elm$svg$Svg$Attributes$y1('180'),
									$elm$svg$Svg$Attributes$x2('440'),
									$elm$svg$Svg$Attributes$y2('180'),
									$elm$svg$Svg$Attributes$stroke('#2a3a54'),
									$elm$svg$Svg$Attributes$strokeWidth('1')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1('40'),
									$elm$svg$Svg$Attributes$y1('180'),
									$elm$svg$Svg$Attributes$x2('40'),
									$elm$svg$Svg$Attributes$y2('20'),
									$elm$svg$Svg$Attributes$stroke('#2a3a54'),
									$elm$svg$Svg$Attributes$strokeWidth('1')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('400'),
									$elm$svg$Svg$Attributes$y('200'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Preload (CVP)')
								])),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('8'),
									$elm$svg$Svg$Attributes$y('24'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('SVI')
								])),
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('116'),
									$elm$svg$Svg$Attributes$y('46'),
									$elm$svg$Svg$Attributes$width('114'),
									$elm$svg$Svg$Attributes$height('40'),
									$elm$svg$Svg$Attributes$fill('rgba(0, 255, 65, 0.08)'),
									$elm$svg$Svg$Attributes$stroke('rgba(0, 255, 65, 0.3)'),
									$elm$svg$Svg$Attributes$strokeDasharray('2,2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('120'),
									$elm$svg$Svg$Attributes$y('70'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ecgColor),
									$elm$svg$Svg$Attributes$fontSize('10'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Optimal Zone')
								])),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 40 175 Q 120 70 240 50 T 440 45'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke('#3d5475'),
									$elm$svg$Svg$Attributes$strokeWidth('2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M 40 178 Q 140 140 280 120 T 440 115'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke('#2a3a54'),
									$elm$svg$Svg$Attributes$strokeWidth('1.5'),
									$elm$svg$Svg$Attributes$strokeDasharray('4,4')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx(
									$elm$core$String$fromFloat(patientX)),
									$elm$svg$Svg$Attributes$cy(
									$elm$core$String$fromFloat(patientY)),
									$elm$svg$Svg$Attributes$r('6'),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$alertColor)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx(
									$elm$core$String$fromFloat(patientX)),
									$elm$svg$Svg$Attributes$cy(
									$elm$core$String$fromFloat(patientY)),
									$elm$svg$Svg$Attributes$r('12'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$alertColor),
									$elm$svg$Svg$Attributes$strokeWidth('1.5'),
									$elm$svg$Svg$Attributes$opacity('0.6')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromFloat(patientX + 12.0)),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromFloat(patientY - 4.0)),
									$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textPrimaryColor),
									$elm$svg$Svg$Attributes$fontSize('11'),
									$elm$svg$Svg$Attributes$fontWeight('bold'),
									$elm$svg$Svg$Attributes$fontFamily('monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Patient Position')
								]))
						]))
				]));
	});
var $author$project$Hemodynamics$Targets$PlateauOptimal = F2(
	function (a, b) {
		return {$: 'PlateauOptimal', a: a, b: b};
	});
var $author$project$Hemodynamics$Targets$PreloadResponsive = F2(
	function (a, b) {
		return {$: 'PreloadResponsive', a: a, b: b};
	});
var $author$project$Hemodynamics$Targets$OverloadedDecompensated = F2(
	function (a, b) {
		return {$: 'OverloadedDecompensated', a: a, b: b};
	});
var $author$project$Hemodynamics$Targets$estimateFrankStarlingPosition = F2(
	function (cvp, svi) {
		return ((cvp < 6.0) && (svi < 35.0)) ? A2($author$project$Hemodynamics$Targets$PreloadResponsive, cvp, svi) : (((cvp <= 12.0) && (svi >= 35.0)) ? A2($author$project$Hemodynamics$Targets$PlateauOptimal, cvp, svi) : A2($author$project$Hemodynamics$Targets$OverloadedDecompensated, cvp, svi));
	});
var $author$project$Ui$HemodynamicsModal$renderHemodynamicsModal = F4(
	function (prof, o2, cvp, closeMsg) {
		var state = A2($author$project$Hemodynamics$Targets$classifyHemodynamicState, prof, cvp);
		var fsPos = A2($author$project$Hemodynamics$Targets$estimateFrankStarlingPosition, cvp, prof.strokeVolumeIndexMlM2);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'right', '0'),
					A2($elm$html$Html$Attributes$style, 'bottom', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 4, 8, 0.88)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
					A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(4px)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#0a0e17'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'width', '94vw'),
							A2($elm$html$Html$Attributes$style, 'max-width', '1200px'),
							A2($elm$html$Html$Attributes$style, 'max-height', '92vh'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
							A2($elm$html$Html$Attributes$style, 'padding', '24px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 24px 64px rgba(0, 0, 0, 0.8)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #1a2333'),
									A2($elm$html$Html$Attributes$style, 'padding-bottom', '16px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'margin', '0 0 4px 0')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('ADVANCED HEMODYNAMIC & VENTRICULAR FUNCTION PROFILE')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Diagnostic State: ' + $author$project$Ui$HemodynamicsModal$clinicalStateToString(state))
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(closeMsg),
											A2($elm$html$Html$Attributes$style, 'background', '#182234'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'padding', '8px 18px'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('CLOSE [ESC]')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 1fr'),
									A2($elm$html$Html$Attributes$style, 'gap', '20px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '24px')
								]),
							_List_fromArray(
								[
									A3($author$project$Ui$HemodynamicsModal$renderFrankStarlingChart, cvp, prof.strokeVolumeIndexMlM2, fsPos),
									A3($author$project$Ui$HemodynamicsModal$renderSvrVsCiChart, prof.systemicVascularResistanceDyns, prof.cardiacIndexLpmM2, state)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(4, 1fr)'),
									A2($elm$html$Html$Attributes$style, 'gap', '14px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A5(
									$author$project$Ui$HemodynamicsModal$hemoCard,
									'CARDIAC INDEX',
									$elm$core$String$fromFloat(
										A2($author$project$Ui$HemodynamicsModal$roundFloat, 2, prof.cardiacIndexLpmM2)),
									'L/min/m²',
									'Normal 2.5 - 4.0',
									(prof.cardiacIndexLpmM2 >= 2.5) && (prof.cardiacIndexLpmM2 <= 4.0)),
									A5(
									$author$project$Ui$HemodynamicsModal$hemoCard,
									'SVR INDEX',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(prof.systemicVascularResistanceIndexDyns)),
									'dyn·s·m²/cm⁵',
									'Normal 1600 - 2400',
									(prof.systemicVascularResistanceIndexDyns >= 1600) && (prof.systemicVascularResistanceIndexDyns <= 2400)),
									A5(
									$author$project$Ui$HemodynamicsModal$hemoCard,
									'STROKE WORK (LVSWI)',
									$elm$core$String$fromFloat(
										A2($author$project$Ui$HemodynamicsModal$roundFloat, 1, prof.leftVentricularStrokeWorkIndexGm)),
									'g·m/m²',
									'Normal 45 - 60',
									(prof.leftVentricularStrokeWorkIndexGm >= 45.0) && (prof.leftVentricularStrokeWorkIndexGm <= 60.0)),
									A5(
									$author$project$Ui$HemodynamicsModal$hemoCard,
									'SHOCK INDEX',
									$elm$core$String$fromFloat(
										A2($author$project$Ui$HemodynamicsModal$roundFloat, 2, prof.shockIndex)),
									'ratio',
									'Normal 0.5 - 0.7 (<0.9)',
									prof.shockIndex < 0.9)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', '#070c14'),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #162033'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
									A2($elm$html$Html$Attributes$style, 'padding', '16px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
											A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('TISSUE OXYGEN TRANSPORT DYNAMICS (FICK COUPLING)')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'grid'),
											A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(4, 1fr)'),
											A2($elm$html$Html$Attributes$style, 'gap', '14px')
										]),
									_List_fromArray(
										[
											A5(
											$author$project$Ui$HemodynamicsModal$hemoCard,
											'OXYGEN DELIVERY (DO2)',
											$elm$core$String$fromInt(
												$elm$core$Basics$round(o2.oxygenDeliveryLpm)),
											'mL/min',
											'Normal 950 - 1150',
											o2.oxygenDeliveryLpm >= 900.0),
											A5(
											$author$project$Ui$HemodynamicsModal$hemoCard,
											'OXYGEN CONSUMPTION (VO2)',
											$elm$core$String$fromInt(
												$elm$core$Basics$round(o2.oxygenConsumptionLpm)),
											'mL/min',
											'Normal 200 - 250',
											true),
											A5(
											$author$project$Ui$HemodynamicsModal$hemoCard,
											'EXTRACTION RATIO (O2ER)',
											$elm$core$String$fromFloat(
												A2($author$project$Ui$HemodynamicsModal$roundFloat, 1, o2.oxygenExtractionRatioPercent)),
											'%',
											'Normal 22 - 30%',
											(o2.oxygenExtractionRatioPercent >= 20.0) && (o2.oxygenExtractionRatioPercent <= 32.0)),
											A5(
											$author$project$Ui$HemodynamicsModal$hemoCard,
											'ARTERIAL CONTENT (CaO2)',
											$elm$core$String$fromFloat(
												A2($author$project$Ui$HemodynamicsModal$roundFloat, 1, o2.arterialOxygenContentMlDl)),
											'mL/dL',
											'Normal 18 - 20',
											true)
										]))
								]))
						]))
				]));
	});
var $author$project$Ui$InfusionPumpModal$pdCard = F3(
	function (label, val, unit) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#0e1522'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #182234'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(val)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(unit)
								]))
						]))
				]));
	});
var $author$project$Pharmacokinetics$Models$Fentanyl = {$: 'Fentanyl'};
var $author$project$Pharmacokinetics$Models$Dobutamine = {$: 'Dobutamine'};
var $author$project$Ui$InfusionPumpModal$roundFloat = F2(
	function (decimals, n) {
		var factor = A2($elm$core$Basics$pow, 10.0, decimals);
		return $elm$core$Basics$round(n * factor) / factor;
	});
var $author$project$Ui$InfusionPumpModal$drugTabButton = F3(
	function (label, isSelected, clickMsg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(clickMsg),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isSelected ? $author$project$Ui$Theme$ppgColor : '#141c2b'),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isSelected ? '#000000' : $author$project$Ui$Theme$textPrimaryColor),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					isSelected ? 'none' : '1px solid #233047'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '8px 16px'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
					A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$InfusionPumpModal$renderPkGraph = function (concs) {
	var cpY = 150.0 - ((A3($elm$core$Basics$clamp, 0.0, 8.0, concs.centralCp) / 8.0) * 120.0);
	var ceY = 150.0 - ((A3($elm$core$Basics$clamp, 0.0, 8.0, concs.effectSiteCe) / 8.0) * 120.0);
	var w = 650.0;
	var h = 180.0;
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox(
				'0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)))),
				$elm$svg$Svg$Attributes$width('100%'),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h) + 'px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('40'),
						$elm$svg$Svg$Attributes$y1('150'),
						$elm$svg$Svg$Attributes$x2('620'),
						$elm$svg$Svg$Attributes$y2('150'),
						$elm$svg$Svg$Attributes$stroke('#2a3a54'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('40'),
						$elm$svg$Svg$Attributes$y1('150'),
						$elm$svg$Svg$Attributes$x2('40'),
						$elm$svg$Svg$Attributes$y2('20'),
						$elm$svg$Svg$Attributes$stroke('#2a3a54'),
						$elm$svg$Svg$Attributes$strokeWidth('1')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('580'),
						$elm$svg$Svg$Attributes$y('170'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Time (min)')
					])),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('6'),
						$elm$svg$Svg$Attributes$y('24'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('mcg/mL')
					])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('40'),
						$elm$svg$Svg$Attributes$y('75'),
						$elm$svg$Svg$Attributes$width('580'),
						$elm$svg$Svg$Attributes$height('30'),
						$elm$svg$Svg$Attributes$fill('rgba(0, 229, 255, 0.06)'),
						$elm$svg$Svg$Attributes$stroke('rgba(0, 229, 255, 0.2)'),
						$elm$svg$Svg$Attributes$strokeDasharray('3,3')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('48'),
						$elm$svg$Svg$Attributes$y('94'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ppgColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Therapeutic Window (3.0 - 5.0 mcg/mL)')
					])),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('180'),
						$elm$svg$Svg$Attributes$y1('150'),
						$elm$svg$Svg$Attributes$x2('180'),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(cpY)),
						$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$ppgColor),
						$elm$svg$Svg$Attributes$strokeWidth('6')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('180'),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(cpY)),
						$elm$svg$Svg$Attributes$r('5'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ppgColor)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('192'),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(cpY + 4.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$ppgColor),
						$elm$svg$Svg$Attributes$fontSize('11'),
						$elm$svg$Svg$Attributes$fontWeight('bold'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Cp: ' + $elm$core$String$fromFloat(
							A2($author$project$Ui$InfusionPumpModal$roundFloat, 2, concs.centralCp)))
					])),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('340'),
						$elm$svg$Svg$Attributes$y1('150'),
						$elm$svg$Svg$Attributes$x2('340'),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(ceY)),
						$elm$svg$Svg$Attributes$stroke($author$project$Ui$Theme$respColor),
						$elm$svg$Svg$Attributes$strokeWidth('6')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$circle,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx('340'),
						$elm$svg$Svg$Attributes$cy(
						$elm$core$String$fromFloat(ceY)),
						$elm$svg$Svg$Attributes$r('5'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$respColor)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('352'),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(ceY + 4.0)),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$respColor),
						$elm$svg$Svg$Attributes$fontSize('11'),
						$elm$svg$Svg$Attributes$fontWeight('bold'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Ce: ' + $elm$core$String$fromFloat(
							A2($author$project$Ui$InfusionPumpModal$roundFloat, 2, concs.effectSiteCe)))
					]))
			]));
};
var $author$project$Pharmacokinetics$Models$Norepinephrine = {$: 'Norepinephrine'};
var $author$project$Pharmacokinetics$Models$PropofolSchnider = {$: 'PropofolSchnider'};
var $author$project$Pharmacokinetics$Pharmacodynamics$sigmoidEmax = F5(
	function (e0, emax, ec50, gamma, ce) {
		if ((ce <= 0.0) || (ec50 <= 0.0)) {
			return e0;
		} else {
			var ec50Pow = A2($elm$core$Basics$pow, ec50, gamma);
			var cePow = A2($elm$core$Basics$pow, ce, gamma);
			return e0 + ((emax * cePow) / (ec50Pow + cePow));
		}
	});
var $author$project$Pharmacokinetics$Pharmacodynamics$calculateBispectralIndex = function (propofolCeMcgMl) {
	var gamma = 2.4;
	var emax = -98.0;
	var ec50 = 3.2;
	var e0 = 98.0;
	var bis = A5($author$project$Pharmacokinetics$Pharmacodynamics$sigmoidEmax, e0, emax, ec50, gamma, propofolCeMcgMl);
	return A3($elm$core$Basics$clamp, 0.0, 100.0, bis);
};
var $author$project$Pharmacokinetics$Pharmacodynamics$calculateNorepinephrinePressureBoost = function (norepiCeNgMl) {
	var gamma = 1.6;
	var emax = 50.0;
	var ec50 = 2.5;
	var e0 = 0.0;
	var boost = A5($author$project$Pharmacokinetics$Pharmacodynamics$sigmoidEmax, e0, emax, ec50, gamma, norepiCeNgMl);
	return A3($elm$core$Basics$clamp, 0.0, 60.0, boost);
};
var $author$project$Ui$InfusionPumpModal$renderInfusionPumpModal = F6(
	function (pumpState, selectDrugMsg, setRateMsg, togglePumpMsg, bolusMsg, closeMsg) {
		var syringePercent = (pumpState.syringeVolumeRemainingMl / pumpState.syringeTotalCapacityMl) * 100.0;
		var norepiBoost = $author$project$Pharmacokinetics$Pharmacodynamics$calculateNorepinephrinePressureBoost(pumpState.concentrations.effectSiteCe);
		var drugName = function () {
			var _v0 = pumpState.drug;
			switch (_v0.$) {
				case 'PropofolMarsh':
					return 'Propofol (Marsh TCI Model)';
				case 'PropofolSchnider':
					return 'Propofol (Schnider TCI Model)';
				case 'Norepinephrine':
					return 'Norepinephrine (Alpha-1 Vasopressor)';
				case 'Dobutamine':
					return 'Dobutamine (Beta-1 Inotrope)';
				default:
					return 'Fentanyl (Synthetic Opioid)';
			}
		}();
		var bis = $author$project$Pharmacokinetics$Pharmacodynamics$calculateBispectralIndex(pumpState.concentrations.effectSiteCe);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'right', '0'),
					A2($elm$html$Html$Attributes$style, 'bottom', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(2, 4, 8, 0.88)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
					A2($elm$html$Html$Attributes$style, 'backdrop-filter', 'blur(4px)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#0a0e17'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'width', '94vw'),
							A2($elm$html$Html$Attributes$style, 'max-width', '1100px'),
							A2($elm$html$Html$Attributes$style, 'max-height', '92vh'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
							A2($elm$html$Html$Attributes$style, 'padding', '24px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 24px 64px rgba(0, 0, 0, 0.8)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #1a2333'),
									A2($elm$html$Html$Attributes$style, 'padding-bottom', '16px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'margin', '0 0 4px 0')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('SMART SYRINGE INFUSION PUMP & TCI ENGINE')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Active Protocol: ' + drugName)
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(closeMsg),
											A2($elm$html$Html$Attributes$style, 'background', '#182234'),
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'padding', '8px 18px'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('CLOSE [ESC]')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A3(
									$author$project$Ui$InfusionPumpModal$drugTabButton,
									'Propofol (Marsh)',
									_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$PropofolMarsh),
									selectDrugMsg($author$project$Pharmacokinetics$Models$PropofolMarsh)),
									A3(
									$author$project$Ui$InfusionPumpModal$drugTabButton,
									'Propofol (Schnider)',
									_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$PropofolSchnider),
									selectDrugMsg($author$project$Pharmacokinetics$Models$PropofolSchnider)),
									A3(
									$author$project$Ui$InfusionPumpModal$drugTabButton,
									'Norepinephrine',
									_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$Norepinephrine),
									selectDrugMsg($author$project$Pharmacokinetics$Models$Norepinephrine)),
									A3(
									$author$project$Ui$InfusionPumpModal$drugTabButton,
									'Dobutamine',
									_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$Dobutamine),
									selectDrugMsg($author$project$Pharmacokinetics$Models$Dobutamine)),
									A3(
									$author$project$Ui$InfusionPumpModal$drugTabButton,
									'Fentanyl',
									_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$Fentanyl),
									selectDrugMsg($author$project$Pharmacokinetics$Models$Fentanyl))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', '320px 1fr'),
									A2($elm$html$Html$Attributes$style, 'gap', '20px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '24px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'background', '#070c14'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #162033'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '16px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
													A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('SYRINGE RESERVOIR (50 mL)')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'background', '#141c2b'),
													A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
													A2($elm$html$Html$Attributes$style, 'height', '24px'),
													A2($elm$html$Html$Attributes$style, 'position', 'relative'),
													A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$ppgColor),
															A2($elm$html$Html$Attributes$style, 'height', '100%'),
															A2(
															$elm$html$Html$Attributes$style,
															'width',
															$elm$core$String$fromFloat(syringePercent) + '%'),
															A2($elm$html$Html$Attributes$style, 'transition', 'width 0.3s ease')
														]),
													_List_Nil),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
															A2($elm$html$Html$Attributes$style, 'top', '4px'),
															A2($elm$html$Html$Attributes$style, 'right', '8px'),
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
															A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$elm$core$String$fromFloat(
																$elm$core$Basics$round(pumpState.syringeVolumeRemainingMl * 10.0) / 10.0) + ' mL remaining')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
													A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '16px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
															A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('INFUSION RATE')
														])),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
															A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$elm$core$String$fromInt(
																$elm$core$Basics$round(pumpState.currentRateMcgMin)) + ' mcg/min')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
													A2($elm$html$Html$Attributes$style, 'gap', '10px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(togglePumpMsg),
															A2(
															$elm$html$Html$Attributes$style,
															'background',
															pumpState.isRunning ? $author$project$Ui$Theme$alertColor : $author$project$Ui$Theme$ecgColor),
															A2($elm$html$Html$Attributes$style, 'color', '#000000'),
															A2($elm$html$Html$Attributes$style, 'border', 'none'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'padding', '12px'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															pumpState.isRunning ? 'STOP INFUSION' : 'START INFUSION')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(bolusMsg),
															A2($elm$html$Html$Attributes$style, 'background', '#202d42'),
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
															A2($elm$html$Html$Attributes$style, 'border', '1px solid #364b6e'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'padding', '10px'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('DELIVER INDUCTION BOLUS')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'background', '#06090e'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #162033'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
											A2($elm$html$Html$Attributes$style, 'padding', '16px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
															A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('PHARMACOKINETIC CONCENTRATION PROFILE (Cp vs Ce)')
														])),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
															A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
															A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Plasma Cp (Cyan) | Effect-Site Ce (Orange)')
														]))
												])),
											$author$project$Ui$InfusionPumpModal$renderPkGraph(pumpState.concentrations)
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'grid'),
									A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(3, 1fr)'),
									A2($elm$html$Html$Attributes$style, 'gap', '14px')
								]),
							_List_fromArray(
								[
									A3(
									$author$project$Ui$InfusionPumpModal$pdCard,
									'CENTRAL CONCENTRATION (Cp)',
									$elm$core$String$fromFloat(
										A2($author$project$Ui$InfusionPumpModal$roundFloat, 2, pumpState.concentrations.centralCp)),
									'mcg/mL'),
									A3(
									$author$project$Ui$InfusionPumpModal$pdCard,
									'EFFECT-SITE CONCENTRATION (Ce)',
									$elm$core$String$fromFloat(
										A2($author$project$Ui$InfusionPumpModal$roundFloat, 2, pumpState.concentrations.effectSiteCe)),
									'mcg/mL'),
									(_Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$PropofolMarsh) || _Utils_eq(pumpState.drug, $author$project$Pharmacokinetics$Models$PropofolSchnider)) ? A3(
									$author$project$Ui$InfusionPumpModal$pdCard,
									'BISPECTRAL INDEX (BIS)',
									$elm$core$String$fromInt(
										$elm$core$Basics$round(bis)),
									'Target 40 - 60') : A3(
									$author$project$Ui$InfusionPumpModal$pdCard,
									'PREDICTED MAP BOOST',
									'+' + $elm$core$String$fromInt(
										$elm$core$Basics$round(norepiBoost)),
									'mmHg')
								]))
						]))
				]));
	});
var $author$project$Main$renderActiveModal = function (model) {
	var _v0 = model.activeModal;
	switch (_v0.$) {
		case 'NoModal':
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		case 'Modal12Lead':
			var isStemi = _Utils_eq(model.activeScenario, $author$project$Simulation$Scenarios$AcuteAnteriorStemi);
			return A4($author$project$Ui$LeadModal$render12LeadModal, model.allLeadSnippets, model.ecgMetrics, isStemi, $author$project$Main$CloseModals);
		case 'ModalHemodynamics':
			var scenDef = $author$project$Simulation$Scenarios$getScenarioDefinition(model.activeScenario);
			return A4($author$project$Ui$HemodynamicsModal$renderHemodynamicsModal, model.hemoProfile, model.oxygenTransport, scenDef.cvpMmhg, $author$project$Main$CloseModals);
		case 'ModalInfusionPump':
			return A6($author$project$Ui$InfusionPumpModal$renderInfusionPumpModal, model.pumpState, $author$project$Main$SelectPumpDrug, $author$project$Main$SetPumpRate, $author$project$Main$TogglePump, $author$project$Main$DeliverPumpBolus, $author$project$Main$CloseModals);
		case 'ModalPvLoop':
			return A2(
				$elm$html$Html$map,
				$author$project$Main$PvModalMsg,
				$author$project$Ui$PvLoopModal$viewPvModal(model.pvModel));
		case 'ModalVentilator':
			return A2(
				$elm$html$Html$map,
				$author$project$Main$VentViewMsg,
				A6($author$project$Ui$VentilatorView$viewVentilatorScreen, model.ventSettings, model.ventMechanics, model.ventScalars, model.pawHistory, model.flowHistory, model.volHistory));
		case 'ModalTrends':
			return A2(
				$elm$html$Html$map,
				$author$project$Main$TrendsViewMsg,
				A2($author$project$Ui$TrendsView$viewTrendsScreen, model.trendInterval, model.trendRecords));
		case 'ModalSpectrum':
			return A2(
				$elm$html$Html$map,
				$author$project$Main$SpectrumModalMsg,
				A2($author$project$Ui$SpectrumModal$viewSpectrumModal, model.hrvMetrics, model.psdPoints));
		default:
			var activeBed = A2(
				$elm$core$Maybe$withDefault,
				{cvpMmhg: 6.0, patient: $author$project$Simulation$Patient$defaultPatient, meanMmhg: 93.3, scenario: $author$project$Simulation$Scenarios$BaselineNominal, bedNumber: 1, etco2Mmhg: 38.0, spo2Percent: 98.0, heartRateBpm: 75.0, systolicMmhg: 120.0, diastolicMmhg: 80.0, hasActiveCrisis: false, hasActiveWarning: false, primaryRhythmString: 'Normal Sinus Rhythm'},
				A2($author$project$Simulation$Ward$getBed, model.ward.selectedBedNumber, model.ward));
			return A2(
				$elm$html$Html$map,
				$author$project$Main$EhrModalMsg,
				A3($author$project$Ui$EhrExportModal$viewEhrModal, model.ehrFormat, activeBed.patient, model.currentTimeMs));
	}
};
var $author$project$Alarms$Types$alarmColor = function (p) {
	switch (p.$) {
		case 'CrisisHighPriority':
			return '#ff0033';
		case 'WarningMediumPriority':
			return '#ffcc00';
		case 'AdvisoryLowPriority':
			return '#00e5ff';
		default:
			return '#00b0ff';
	}
};
var $author$project$Alarms$Types$priorityToString = function (p) {
	switch (p.$) {
		case 'CrisisHighPriority':
			return 'CRISIS';
		case 'WarningMediumPriority':
			return 'WARNING';
		case 'AdvisoryLowPriority':
			return 'ADVISORY';
		default:
			return 'TECHNICAL';
	}
};
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Alarms$Manager$getHighestPriorityAlarm = function (mgr) {
	var priorityWeight = function (p) {
		switch (p.$) {
			case 'CrisisHighPriority':
				return 4;
			case 'WarningMediumPriority':
				return 3;
			case 'AdvisoryLowPriority':
				return 2;
			default:
				return 1;
		}
	};
	var sorted = A2(
		$elm$core$List$sortWith,
		F2(
			function (a, b) {
				return A2(
					$elm$core$Basics$compare,
					priorityWeight(b.priority),
					priorityWeight(a.priority));
			}),
		mgr.activeAlarms);
	return $elm$core$List$head(sorted);
};
var $author$project$Ui$AlarmBanner$renderAlarmBanner = F3(
	function (mgr, silenceMsg, ackMsg) {
		var maybeHighest = $author$project$Alarms$Manager$getHighestPriorityAlarm(mgr);
		var alarmCount = $elm$core$List$length(mgr.activeAlarms);
		if (maybeHighest.$ === 'Just') {
			var alarm = maybeHighest.a;
			var priorityLabel = $author$project$Alarms$Types$priorityToString(alarm.priority);
			var textColor = $author$project$Alarms$Types$alarmColor(alarm.priority);
			var bg = function () {
				var _v1 = alarm.priority;
				switch (_v1.$) {
					case 'CrisisHighPriority':
						return 'rgba(255, 0, 51, 0.22)';
					case 'WarningMediumPriority':
						return 'rgba(255, 204, 0, 0.18)';
					default:
						return 'rgba(0, 229, 255, 0.12)';
				}
			}();
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', bg),
						A2($elm$html$Html$Attributes$style, 'border-bottom', '2px solid ' + textColor),
						A2($elm$html$Html$Attributes$style, 'padding', '8px 20px'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '12px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'background', textColor),
										A2($elm$html$Html$Attributes$style, 'color', '#000000'),
										A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
										A2($elm$html$Html$Attributes$style, 'padding', '3px 8px'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '3px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(priorityLabel)
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', textColor),
										A2($elm$html$Html$Attributes$style, 'font-size', '15px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(alarm.message)
									])),
								(alarmCount > 1) ? A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
										A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'(+' + ($elm$core$String$fromInt(alarmCount - 1) + ' other alerts)'))
									])) : $elm$html$Html$text('')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						_List_fromArray(
							[
								mgr.isAudioSilenced ? A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(silenceMsg),
										A2($elm$html$Html$Attributes$style, 'background', '#202d42'),
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$warningColor),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$warningColor),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
										A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'SILENCED (' + ($elm$core$String$fromInt(
											$elm$core$Basics$round(mgr.silenceRemainingSec)) + 's)'))
									])) : A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(silenceMsg),
										A2($elm$html$Html$Attributes$style, 'background', '#182234'),
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
										A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('SILENCE ALARMS (120s)')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(ackMsg),
										A2($elm$html$Html$Attributes$style, 'background', '#182234'),
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 14px'),
										A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
										A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('ACKNOWLEDGE')
									]))
							]))
					]));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', '#0a0e17'),
						A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #141c2b'),
						A2($elm$html$Html$Attributes$style, 'padding', '6px 20px'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
								A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('SYSTEM NOMINAL: All physiological parameters within verified clinical bounds')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
								A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('IEC 60601-1-8 ALARM ENGINE ACTIVE')
							]))
					]));
		}
	});
var $author$project$Ui$WardOverview$microVital = F3(
	function (label, val, col) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '9px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', col),
							A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '1px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(val)
						]))
				]));
	});
var $author$project$Ui$WardOverview$renderBedTile = F3(
	function (bed, isSelected, clickMsg) {
		var borderColor = bed.hasActiveCrisis ? $author$project$Ui$Theme$alertColor : (bed.hasActiveWarning ? $author$project$Ui$Theme$warningColor : (isSelected ? $author$project$Ui$Theme$ppgColor : $author$project$Ui$Theme$bezelColor));
		var bgColor = isSelected ? '#101826' : $author$project$Ui$Theme$cardColor;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(clickMsg),
					A2($elm$html$Html$Attributes$style, 'background', bgColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + borderColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.15s ease')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
							A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #1c2638'),
							A2($elm$html$Html$Attributes$style, 'padding-bottom', '6px'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
											A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '6px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											'BED ' + $elm$core$String$fromInt(bed.bedNumber))
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
											A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(bed.patient.name)
										]))
								])),
							bed.hasActiveCrisis ? A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$alertColor),
									A2($elm$html$Html$Attributes$style, 'color', '#ffffff'),
									A2($elm$html$Html$Attributes$style, 'padding', '2px 6px'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '3px'),
									A2($elm$html$Html$Attributes$style, 'font-size', '10px'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('CRISIS')
								])) : (bed.hasActiveWarning ? A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$warningColor),
									A2($elm$html$Html$Attributes$style, 'color', '#000000'),
									A2($elm$html$Html$Attributes$style, 'padding', '2px 6px'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '3px'),
									A2($elm$html$Html$Attributes$style, 'font-size', '10px'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('WARNING')
								])) : A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('NOMINAL')
								])))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
							A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
							A2($elm$html$Html$Attributes$style, 'text-overflow', 'ellipsis')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(bed.patient.primaryDiagnosis)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(4, 1fr)'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'background', '#070c14'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'padding', '6px')
						]),
					_List_fromArray(
						[
							A3(
							$author$project$Ui$WardOverview$microVital,
							'HR',
							$elm$core$String$fromInt(
								$elm$core$Basics$round(bed.heartRateBpm)),
							$author$project$Ui$Theme$ecgColor),
							A3(
							$author$project$Ui$WardOverview$microVital,
							'ABP',
							$elm$core$String$fromInt(
								$elm$core$Basics$round(bed.systolicMmhg)) + ('/' + $elm$core$String$fromInt(
								$elm$core$Basics$round(bed.diastolicMmhg))),
							$author$project$Ui$Theme$abpColor),
							A3(
							$author$project$Ui$WardOverview$microVital,
							'SpO2',
							$elm$core$String$fromInt(
								$elm$core$Basics$round(bed.spo2Percent)) + '%',
							$author$project$Ui$Theme$ppgColor),
							A3(
							$author$project$Ui$WardOverview$microVital,
							'EtCO2',
							$elm$core$String$fromInt(
								$elm$core$Basics$round(bed.etco2Mmhg)),
							$author$project$Ui$Theme$capnoColor)
						]))
				]));
	});
var $author$project$Ui$WardOverview$renderWardOverview = F2(
	function (ward, selectBedMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'grid'),
					A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(4, 1fr)'),
					A2($elm$html$Html$Attributes$style, 'gap', '14px'),
					A2($elm$html$Html$Attributes$style, 'padding', '16px'),
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor)
				]),
			A2(
				$elm$core$List$map,
				function (bed) {
					return A3(
						$author$project$Ui$WardOverview$renderBedTile,
						bed,
						_Utils_eq(bed.bedNumber, ward.selectedBedNumber),
						selectBedMsg(bed.bedNumber));
				},
				ward.beds));
	});
var $author$project$Main$formatSimTime = function (ms) {
	var totalSec = $elm$core$Basics$round(ms / 1000.0);
	var pad = function (n) {
		return (n < 10) ? ('0' + $elm$core$String$fromInt(n)) : $elm$core$String$fromInt(n);
	};
	var s = A2($elm$core$Basics$modBy, 60, totalSec);
	var m = A2($elm$core$Basics$modBy, 60, (totalSec / 60) | 0);
	return pad(m) + (':' + pad(s));
};
var $author$project$Main$renderPatientHeader = function (model) {
	var activeBed = A2(
		$elm$core$Maybe$withDefault,
		{cvpMmhg: 6.0, patient: $author$project$Simulation$Patient$defaultPatient, meanMmhg: 93.3, scenario: $author$project$Simulation$Scenarios$BaselineNominal, bedNumber: 1, etco2Mmhg: 38.0, spo2Percent: 98.0, heartRateBpm: 75.0, systolicMmhg: 120.0, diastolicMmhg: 80.0, hasActiveCrisis: false, hasActiveWarning: false, primaryRhythmString: 'Normal Sinus Rhythm'},
		A2($author$project$Simulation$Ward$getBed, model.ward.selectedBedNumber, model.ward));
	var p = activeBed.patient;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$surfaceColor),
				A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'baseline'),
						A2($elm$html$Html$Attributes$style, 'gap', '14px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$ppgColor),
								A2($elm$html$Html$Attributes$style, 'color', '#000000'),
								A2($elm$html$Html$Attributes$style, 'padding', '3px 8px'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'ICU BED ' + $elm$core$String$fromInt(activeBed.bedNumber))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(p.name)
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
								A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(
									$elm$core$Basics$round(p.ageYears)) + ('yo M | ' + ($elm$core$String$fromFloat(p.weightKg) + (' kg | BSA ' + ($elm$core$String$fromFloat(
									$elm$core$Basics$round(p.bsaM2 * 100.0) / 100.0) + ' m²')))))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
								A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
								A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Diagnosis: ' + p.primaryDiagnosis)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'gap', '16px'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
						A2($elm$html$Html$Attributes$style, 'font-size', '13px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('NEWS2: ')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$warningColor),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('2 (Low Risk)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('SOFA: ')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('1')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('SIM TIME: ')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Main$formatSimTime(model.currentTimeMs))
									]))
							]))
					]))
			]));
};
var $author$project$Main$TriggerEmergencyVfib = {$: 'TriggerEmergencyVfib'};
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Ui$Controls$navButton = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', '#141d2e'),
					A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #263857'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$Controls$speedButton = F3(
	function (label, isActive, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isActive ? '#2b3c5a' : '#101826'),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isActive ? $author$project$Ui$Theme$ppgColor : $author$project$Ui$Theme$textMutedColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #1e2c44'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '3px'),
					A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Simulation$Scenarios$allScenarios = _List_fromArray(
	[$author$project$Simulation$Scenarios$BaselineNominal, $author$project$Simulation$Scenarios$AcuteAnteriorStemi, $author$project$Simulation$Scenarios$SepticShockDistributive, $author$project$Simulation$Scenarios$TensionPneumothorax, $author$project$Simulation$Scenarios$HypovolemicHemorrhage, $author$project$Simulation$Scenarios$OpioidRespiratoryDepression, $author$project$Simulation$Scenarios$MalignantHyperthermiaCrisis]);
var $author$project$Ui$Controls$emergencyButton = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', '#2b0a12'),
					A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$alertColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #5a1424'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
					A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$Ui$Controls$stringToScenario = function (s) {
	switch (s) {
		case 'stemi':
			return $author$project$Simulation$Scenarios$AcuteAnteriorStemi;
		case 'sepsis':
			return $author$project$Simulation$Scenarios$SepticShockDistributive;
		case 'pneumo':
			return $author$project$Simulation$Scenarios$TensionPneumothorax;
		case 'hemorrhage':
			return $author$project$Simulation$Scenarios$HypovolemicHemorrhage;
		case 'opioid':
			return $author$project$Simulation$Scenarios$OpioidRespiratoryDepression;
		case 'hyperthermia':
			return $author$project$Simulation$Scenarios$MalignantHyperthermiaCrisis;
		default:
			return $author$project$Simulation$Scenarios$BaselineNominal;
	}
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Ui$Controls$scenarioToLabel = function (scen) {
	switch (scen.$) {
		case 'BaselineNominal':
			return 'Nominal Resting State';
		case 'AcuteAnteriorStemi':
			return 'Acute Anterior STEMI';
		case 'SepticShockDistributive':
			return 'Septic Shock (Hyperdynamic)';
		case 'TensionPneumothorax':
			return 'Tension Pneumothorax';
		case 'HypovolemicHemorrhage':
			return 'Severe Hemorrhagic Shock';
		case 'OpioidRespiratoryDepression':
			return 'Opioid Hypoventilation';
		default:
			return 'Malignant Hyperthermia';
	}
};
var $author$project$Ui$Controls$scenarioToString = function (scen) {
	switch (scen.$) {
		case 'BaselineNominal':
			return 'nominal';
		case 'AcuteAnteriorStemi':
			return 'stemi';
		case 'SepticShockDistributive':
			return 'sepsis';
		case 'TensionPneumothorax':
			return 'pneumo';
		case 'HypovolemicHemorrhage':
			return 'hemorrhage';
		case 'OpioidRespiratoryDepression':
			return 'opioid';
		default:
			return 'hyperthermia';
	}
};
var $author$project$Ui$Controls$renderScenarioOption = F2(
	function (scen, isSel) {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(
					$author$project$Ui$Controls$scenarioToString(scen)),
					$elm$html$Html$Attributes$selected(isSel)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$Ui$Controls$scenarioToLabel(scen))
				]));
	});
var $author$project$Ui$Controls$renderControlToolbar = F5(
	function (isPaused, simSpeed, currentScenario, isWardView, actions) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', '#090d15'),
					A2($elm$html$Html$Attributes$style, 'border-top', '1px solid #141c2b'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 16px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'gap', '10px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'gap', '8px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(actions.togglePause),
									A2(
									$elm$html$Html$Attributes$style,
									'background',
									isPaused ? $author$project$Ui$Theme$warningColor : '#182234'),
									A2(
									$elm$html$Html$Attributes$style,
									'color',
									isPaused ? '#000000' : $author$project$Ui$Theme$textPrimaryColor),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									isPaused ? 'RESUME [SPACE]' : 'PAUSE [SPACE]')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '4px')
								]),
							_List_fromArray(
								[
									A3(
									$author$project$Ui$Controls$speedButton,
									'1x',
									simSpeed === 1.0,
									actions.setSpeed(1.0)),
									A3(
									$author$project$Ui$Controls$speedButton,
									'2x',
									simSpeed === 2.0,
									actions.setSpeed(2.0)),
									A3(
									$author$project$Ui$Controls$speedButton,
									'5x',
									simSpeed === 5.0,
									actions.setSpeed(5.0))
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									function (s) {
										return actions.selectScenario(
											$author$project$Ui$Controls$stringToScenario(s));
									}),
									A2($elm$html$Html$Attributes$style, 'background', '#101826'),
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #233047'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'padding', '6px 8px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							A2(
								$elm$core$List$map,
								function (scen) {
									return A2(
										$author$project$Ui$Controls$renderScenarioOption,
										scen,
										_Utils_eq(scen, currentScenario));
								},
								$author$project$Simulation$Scenarios$allScenarios))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
						]),
					_List_fromArray(
						[
							A2($author$project$Ui$Controls$navButton, '12-LEAD', actions.open12Lead),
							A2($author$project$Ui$Controls$navButton, 'HEMO', actions.openHemo),
							A2($author$project$Ui$Controls$navButton, 'PV LOOP', actions.openPvLoop),
							A2($author$project$Ui$Controls$navButton, 'VENTILATOR', actions.openVentilator),
							A2($author$project$Ui$Controls$navButton, 'TRENDS', actions.openTrends),
							A2($author$project$Ui$Controls$navButton, 'SPECTRUM', actions.openSpectrum),
							A2($author$project$Ui$Controls$navButton, 'PUMP', actions.openPump),
							A2($author$project$Ui$Controls$navButton, 'EHR', actions.openEhr),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(actions.toggleWard),
									A2(
									$elm$html$Html$Attributes$style,
									'background',
									isWardView ? $author$project$Ui$Theme$ppgColor : '#182234'),
									A2(
									$elm$html$Html$Attributes$style,
									'color',
									isWardView ? '#000000' : $author$project$Ui$Theme$textPrimaryColor),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									isWardView ? 'BEDSIDE' : 'WARD')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px')
						]),
					_List_fromArray(
						[
							A2($author$project$Ui$Controls$emergencyButton, 'INJECT V-FIB', actions.triggerVfib),
							A2($author$project$Ui$Controls$emergencyButton, 'INJECT ASYSTOLE', actions.triggerAsystole),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(actions.resetNominal),
									A2($elm$html$Html$Attributes$style, 'background', '#182234'),
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #2a3a54'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('RESET')
								]))
						]))
				]));
	});
var $author$project$Ui$NumericBlock$renderAbpBlock = F3(
	function (sbp, dbp, map) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'min-width', '165px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('ABP (mmHg)')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$abpColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '36px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
							A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								$elm$core$Basics$round(sbp)) + ('/' + $elm$core$String$fromInt(
								$elm$core$Basics$round(dbp))))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Mean (' + ($elm$core$String$fromInt(
								$elm$core$Basics$round(map)) + ')'))
						]))
				]));
	});
var $author$project$Ui$NumericBlock$renderCvpBlock = function (cvp) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
				A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'min-width', '130px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$cvpColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('CVP (mmHg)')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$cvpColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '42px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
						A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
						A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$elm$core$Basics$round(cvp)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Venous Preload')
					]))
			]));
};
var $author$project$Dsp$Arrhythmia$rhythmToString = function (rhythm) {
	switch (rhythm.$) {
		case 'NormalSinusRhythm':
			return 'Normal Sinus Rhythm';
		case 'SinusBradycardia':
			return 'Sinus Bradycardia';
		case 'SinusTachycardia':
			return 'Sinus Tachycardia';
		case 'AtrialFibrillation':
			return 'Atrial Fibrillation';
		case 'PrematureVentricularContraction':
			return 'PVC Isolated';
		case 'VentricularBigeminy':
			return 'Ventricular Bigeminy';
		case 'VentricularTrigeminy':
			return 'Ventricular Trigeminy';
		case 'VentricularTachycardia':
			return 'VENTRICULAR TACHYCARDIA';
		case 'VentricularFibrillation':
			return 'VENTRICULAR FIBRILLATION';
		default:
			return 'ASYSTOLE';
	}
};
var $author$project$Ui$NumericBlock$renderSpo2Block = F2(
	function (spo2, pi) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'min-width', '140px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('SpO2 (%)')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ppgColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '42px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
							A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								$elm$core$Basics$round(spo2)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'PI: ' + ($elm$core$String$fromFloat(
								$elm$core$Basics$round(pi * 10.0) / 10.0) + '%'))
						]))
				]));
	});
var $author$project$Ui$NumericBlock$renderCapnoBlock = F2(
	function (etco2, rr) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'min-width', '140px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$capnoColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('EtCO2 (mmHg)')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$capnoColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '42px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
							A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								$elm$core$Basics$round(etco2)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'RR: ' + ($elm$core$String$fromInt(
								$elm$core$Basics$round(rr)) + ' /min'))
						]))
				]));
	});
var $author$project$Ui$NumericBlock$renderHeartRateBlock = F3(
	function (hr, rhythmStr, isBeating) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'min-width', '150px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
									A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('HR (BPM)')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
									A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
									A2(
									$elm$html$Html$Attributes$style,
									'transform',
									isBeating ? 'scale(1.25)' : 'scale(1.0)'),
									A2($elm$html$Html$Attributes$style, 'transition', 'transform 0.1s ease-in-out')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('♥')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$ecgColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '42px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
							A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								$elm$core$Basics$round(hr)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
							A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
							A2($elm$html$Html$Attributes$style, 'text-overflow', 'ellipsis')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(rhythmStr)
						]))
				]));
	});
var $author$project$Ui$Sweepbar$renderSweepbarChannel = function (ch) {
	var totalHeight = ch.heightPx;
	var totalWidth = 800.0;
	var eraseGap = 24.0;
	var cursorX = ch.sweepPositionX;
	var eraseLeft = cursorX;
	var eraseRight = A2($elm$core$Basics$min, totalWidth, cursorX + eraseGap);
	var aheadPoints = A2(
		$elm$core$List$filter,
		function (p) {
			return _Utils_cmp(
				A2($author$project$Ui$Sweepbar$normalizeX, p.timestamp, totalWidth),
				eraseRight) > 0;
		},
		ch.points);
	var pathAhead = A5($author$project$Ui$Sweepbar$renderWaveformPath, aheadPoints, totalWidth, totalHeight, ch.minValue, ch.maxValue);
	var behindPoints = A2(
		$elm$core$List$filter,
		function (p) {
			return _Utils_cmp(
				A2($author$project$Ui$Sweepbar$normalizeX, p.timestamp, totalWidth),
				cursorX) < 1;
		},
		ch.points);
	var pathBehind = A5($author$project$Ui$Sweepbar$renderWaveformPath, behindPoints, totalWidth, totalHeight, ch.minValue, ch.maxValue);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox(
				'0 0 ' + ($elm$core$String$fromFloat(totalWidth) + (' ' + $elm$core$String$fromFloat(totalHeight)))),
				$elm$svg$Svg$Attributes$width('100%'),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(totalHeight) + 'px'),
				$elm$svg$Svg$Attributes$style('background: #080c12; border-bottom: 1px solid #141c2b; display: block;')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('12'),
						$elm$svg$Svg$Attributes$y('20'),
						$elm$svg$Svg$Attributes$fill(ch.color),
						$elm$svg$Svg$Attributes$fontSize('12'),
						$elm$svg$Svg$Attributes$fontWeight('bold'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(ch.title + (' ' + ch.leadLabel))
					])),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x('12'),
						$elm$svg$Svg$Attributes$y('36'),
						$elm$svg$Svg$Attributes$fill($author$project$Ui$Theme$textMutedColor),
						$elm$svg$Svg$Attributes$fontSize('10'),
						$elm$svg$Svg$Attributes$fontFamily('monospace')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						$elm$core$String$fromFloat(ch.minValue) + (' - ' + ($elm$core$String$fromFloat(ch.maxValue) + (' ' + ch.unitString))))
					])),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1('0'),
						$elm$svg$Svg$Attributes$y1(
						$elm$core$String$fromFloat(totalHeight / 2.0)),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(totalWidth)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(totalHeight / 2.0)),
						$elm$svg$Svg$Attributes$stroke('#172133'),
						$elm$svg$Svg$Attributes$strokeWidth('1'),
						$elm$svg$Svg$Attributes$strokeDasharray('4,4')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(pathAhead),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke(ch.color),
						$elm$svg$Svg$Attributes$strokeWidth('1.6'),
						$elm$svg$Svg$Attributes$strokeLinecap('round'),
						$elm$svg$Svg$Attributes$strokeLinejoin('round'),
						$elm$svg$Svg$Attributes$opacity('0.45')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(pathBehind),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke(ch.color),
						$elm$svg$Svg$Attributes$strokeWidth('2.0'),
						$elm$svg$Svg$Attributes$strokeLinecap('round'),
						$elm$svg$Svg$Attributes$strokeLinejoin('round'),
						$elm$svg$Svg$Attributes$opacity('1.0')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(eraseLeft)),
						$elm$svg$Svg$Attributes$y('0'),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(eraseGap)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(totalHeight)),
						$elm$svg$Svg$Attributes$fill('#080c12')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$elm$core$String$fromFloat(cursorX)),
						$elm$svg$Svg$Attributes$y1('0'),
						$elm$svg$Svg$Attributes$x2(
						$elm$core$String$fromFloat(cursorX)),
						$elm$svg$Svg$Attributes$y2(
						$elm$core$String$fromFloat(totalHeight)),
						$elm$svg$Svg$Attributes$stroke(ch.color),
						$elm$svg$Svg$Attributes$strokeWidth('1.5'),
						$elm$svg$Svg$Attributes$opacity('0.8')
					]),
				_List_Nil)
			]));
};
var $author$project$Ui$NumericBlock$renderTemperatureBlock = function (tempC) {
	var tempF = (tempC * 1.8) + 32.0;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$cardColor),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + $author$project$Ui$Theme$bezelColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
				A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'min-width', '130px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$respColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '13px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('TEMP (°C)')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$respColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '36px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
						A2($elm$html$Html$Attributes$style, 'line-height', '1.0'),
						A2($elm$html$Html$Attributes$style, 'margin', '6px 0')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromFloat(
							$elm$core$Basics$round(tempC * 10.0) / 10.0))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textMutedColor),
						A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromFloat(
							$elm$core$Basics$round(tempF * 10.0) / 10.0) + ' °F')
					]))
			]));
};
var $author$project$Main$renderBedsideWorkspace = function (model) {
	var rhythmStr = $author$project$Dsp$Arrhythmia$rhythmToString(model.arrhythmiaClassifier.currentRhythm);
	var sweepPos = A2($author$project$Ui$Sweepbar$normalizeX, model.currentTimeMs, 800.0);
	var scenDef = $author$project$Simulation$Scenarios$getScenarioDefinition(model.activeScenario);
	var mapVal = scenDef.diastolicMmhg + ((scenDef.systolicMmhg - scenDef.diastolicMmhg) / 3.0);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'grid'),
				A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 180px'),
				A2($elm$html$Html$Attributes$style, 'flex', '1'),
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'border-right', '1px solid ' + $author$project$Ui$Theme$bezelColor)
					]),
				_List_fromArray(
					[
						$author$project$Ui$Sweepbar$renderSweepbarChannel(
						{color: $author$project$Ui$Theme$ecgColor, title: 'ECG', points: model.leadIiPoints, heightPx: 130.0, maxValue: 1.8, minValue: -0.5, leadLabel: 'II', unitString: 'mV', sweepPositionX: sweepPos}),
						$author$project$Ui$Sweepbar$renderSweepbarChannel(
						{color: $author$project$Ui$Theme$abpColor, title: 'ABP', points: model.abpPoints, heightPx: 130.0, maxValue: 180.0, minValue: 0.0, leadLabel: 'Arterial Line', unitString: 'mmHg', sweepPositionX: sweepPos}),
						$author$project$Ui$Sweepbar$renderSweepbarChannel(
						{color: $author$project$Ui$Theme$ppgColor, title: 'Pleth', points: model.ppgPoints, heightPx: 110.0, maxValue: 110.0, minValue: 80.0, leadLabel: 'SpO2 Finger Probe', unitString: 'Volts', sweepPositionX: sweepPos}),
						$author$project$Ui$Sweepbar$renderSweepbarChannel(
						{color: $author$project$Ui$Theme$capnoColor, title: 'Capno', points: model.capnoPoints, heightPx: 110.0, maxValue: 60.0, minValue: 0.0, leadLabel: 'Microstream CO2', unitString: 'mmHg', sweepPositionX: sweepPos}),
						$author$project$Ui$Sweepbar$renderSweepbarChannel(
						{color: $author$project$Ui$Theme$cvpColor, title: 'CVP', points: model.cvpPoints, heightPx: 95.0, maxValue: 25.0, minValue: 0.0, leadLabel: 'Internal Jugular Catheter', unitString: 'mmHg', sweepPositionX: sweepPos})
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
						A2($elm$html$Html$Attributes$style, 'gap', '10px'),
						A2($elm$html$Html$Attributes$style, 'padding', '10px'),
						A2($elm$html$Html$Attributes$style, 'background', '#090d15')
					]),
				_List_fromArray(
					[
						A3($author$project$Ui$NumericBlock$renderHeartRateBlock, scenDef.heartRateBpm, rhythmStr, model.isHeartBeating),
						A3($author$project$Ui$NumericBlock$renderAbpBlock, scenDef.systolicMmhg, scenDef.diastolicMmhg, mapVal),
						A2($author$project$Ui$NumericBlock$renderSpo2Block, scenDef.spo2Percent, 2.8),
						A2($author$project$Ui$NumericBlock$renderCapnoBlock, scenDef.etco2Mmhg, 14.0),
						$author$project$Ui$NumericBlock$renderCvpBlock(scenDef.cvpMmhg),
						$author$project$Ui$NumericBlock$renderTemperatureBlock(scenDef.temperatureC)
					]))
			]));
};
var $author$project$Main$TriggerEmergencyAsystole = {$: 'TriggerEmergencyAsystole'};
var $author$project$Main$view = function (model) {
	var toolbarActions = {
		openEhr: $author$project$Main$OpenModal($author$project$Main$ModalEhrExport),
		openHemo: $author$project$Main$OpenModal($author$project$Main$ModalHemodynamics),
		openPump: $author$project$Main$OpenModal($author$project$Main$ModalInfusionPump),
		setSpeed: $author$project$Main$SetSpeed,
		open12Lead: $author$project$Main$OpenModal($author$project$Main$Modal12Lead),
		openPvLoop: $author$project$Main$OpenModal($author$project$Main$ModalPvLoop),
		openTrends: $author$project$Main$OpenModal($author$project$Main$ModalTrends),
		toggleWard: $author$project$Main$ToggleWardView,
		togglePause: $author$project$Main$TogglePause,
		triggerVfib: $author$project$Main$TriggerEmergencyVfib,
		openSpectrum: $author$project$Main$OpenModal($author$project$Main$ModalSpectrum),
		resetNominal: $author$project$Main$ResetNominal,
		openVentilator: $author$project$Main$OpenModal($author$project$Main$ModalVentilator),
		selectScenario: $author$project$Main$SelectScenario,
		triggerAsystole: $author$project$Main$TriggerEmergencyAsystole
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', $author$project$Ui$Theme$backgroundColor),
				A2($elm$html$Html$Attributes$style, 'color', $author$project$Ui$Theme$textPrimaryColor),
				A2($elm$html$Html$Attributes$style, 'min-height', '100vh'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'font-family', '-apple-system, BlinkMacSystemFont, \u0027Segoe UI\u0027, Roboto, Helvetica, Arial, sans-serif')
			]),
		_List_fromArray(
			[
				A3($author$project$Ui$AlarmBanner$renderAlarmBanner, model.alarmManager, $author$project$Main$SilenceAlarms, $author$project$Main$AcknowledgeAlarms),
				$author$project$Main$renderPatientHeader(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'flex', '1'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
					]),
				_List_fromArray(
					[
						model.isWardView ? A2($author$project$Ui$WardOverview$renderWardOverview, model.ward, $author$project$Main$SelectBed) : $author$project$Main$renderBedsideWorkspace(model)
					])),
				A5($author$project$Ui$Controls$renderControlToolbar, model.isPaused, model.simSpeed, model.activeScenario, model.isWardView, toolbarActions),
				$author$project$Main$renderActiveModal(model)
			]));
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Dsp$Arrhythmia$Asystole = {$: 'Asystole'};
var $author$project$Ports$exportEhr = _Platform_outgoingPort('exportEhr', $elm$core$Basics$identity);
var $author$project$Ports$audioAlarm = _Platform_outgoingPort('audioAlarm', $elm$json$Json$Encode$string);
var $author$project$Alarms$Manager$silenceAlarms = F2(
	function (durationSec, mgr) {
		var updatedAlarms = A2(
			$elm$core$List$map,
			function (a) {
				return _Utils_update(
					a,
					{isSilenced: true});
			},
			mgr.activeAlarms);
		return _Utils_update(
			mgr,
			{activeAlarms: updatedAlarms, isAudioSilenced: true, silenceRemainingSec: durationSec});
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Alarms$Types$EcgModality = {$: 'EcgModality'};
var $author$project$Alarms$Types$CrisisHighPriority = {$: 'CrisisHighPriority'};
var $author$project$Alarms$Types$ExtremeBradycardia = function (a) {
	return {$: 'ExtremeBradycardia', a: a};
};
var $author$project$Alarms$Types$ExtremeTachycardia = function (a) {
	return {$: 'ExtremeTachycardia', a: a};
};
var $author$project$Alarms$Types$WarningMediumPriority = {$: 'WarningMediumPriority'};
var $author$project$Alarms$Manager$addHrAlerts = F3(
	function (hr, ts, acc) {
		return ((hr < 40.0) && (hr > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'HR_EXTREME_BRADY',
				message: 'Extreme Bradycardia: HR < 40 BPM',
				modality: $author$project$Alarms$Types$EcgModality,
				priority: $author$project$Alarms$Types$CrisisHighPriority,
				condition: $author$project$Alarms$Types$ExtremeBradycardia(hr),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : ((hr > 150.0) ? A2(
			$elm$core$List$cons,
			{
				id: 'HR_EXTREME_TACHY',
				message: 'Severe Tachycardia: HR > 150 BPM',
				modality: $author$project$Alarms$Types$EcgModality,
				priority: $author$project$Alarms$Types$WarningMediumPriority,
				condition: $author$project$Alarms$Types$ExtremeTachycardia(hr),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : acc);
	});
var $author$project$Alarms$Types$AbpModality = {$: 'AbpModality'};
var $author$project$Alarms$Types$SevereHypotension = function (a) {
	return {$: 'SevereHypotension', a: a};
};
var $author$project$Alarms$Types$SevereHypertension = function (a) {
	return {$: 'SevereHypertension', a: a};
};
var $author$project$Alarms$Manager$addAbpAlerts = F4(
	function (sbp, map, ts, acc) {
		return ((sbp < 70.0) && (sbp > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'ABP_SEVERE_HYPOTENSION',
				message: 'Severe Hypotension: SBP < 70 mmHg',
				modality: $author$project$Alarms$Types$AbpModality,
				priority: $author$project$Alarms$Types$CrisisHighPriority,
				condition: $author$project$Alarms$Types$SevereHypotension(sbp),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : (((map < 65.0) && (map > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'ABP_MAP_LOW',
				message: 'Low Perfusion: MAP < 65 mmHg',
				modality: $author$project$Alarms$Types$AbpModality,
				priority: $author$project$Alarms$Types$WarningMediumPriority,
				condition: $author$project$Alarms$Types$SevereHypotension(map),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : ((sbp > 190.0) ? A2(
			$elm$core$List$cons,
			{
				id: 'ABP_HYPERTENSIVE_CRISIS',
				message: 'Severe Hypertension: SBP > 190 mmHg',
				modality: $author$project$Alarms$Types$AbpModality,
				priority: $author$project$Alarms$Types$WarningMediumPriority,
				condition: $author$project$Alarms$Types$SevereHypertension(sbp),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : acc));
	});
var $author$project$Alarms$Types$PpgModality = {$: 'PpgModality'};
var $author$project$Alarms$Types$CriticalDesaturation = function (a) {
	return {$: 'CriticalDesaturation', a: a};
};
var $author$project$Alarms$Manager$addSpo2Alerts = F3(
	function (spo2, ts, acc) {
		return ((spo2 < 75.0) && (spo2 > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'SPO2_CRITICAL_DESAT',
				message: 'Critical Desaturation: SpO2 < 75%',
				modality: $author$project$Alarms$Types$PpgModality,
				priority: $author$project$Alarms$Types$CrisisHighPriority,
				condition: $author$project$Alarms$Types$CriticalDesaturation(spo2),
				isLatched: true,
				timestamp: ts,
				isSilenced: false
			},
			acc) : (((spo2 < 88.0) && (spo2 > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'SPO2_WARNING_DESAT',
				message: 'Hypoxemia Warning: SpO2 < 88%',
				modality: $author$project$Alarms$Types$PpgModality,
				priority: $author$project$Alarms$Types$WarningMediumPriority,
				condition: $author$project$Alarms$Types$CriticalDesaturation(spo2),
				isLatched: false,
				timestamp: ts,
				isSilenced: false
			},
			acc) : acc);
	});
var $author$project$Alarms$Types$ApneaDetected = function (a) {
	return {$: 'ApneaDetected', a: a};
};
var $author$project$Alarms$Types$CapnoModality = {$: 'CapnoModality'};
var $author$project$Alarms$Manager$addCapnoAlerts = F3(
	function (etco2, ts, acc) {
		return ((etco2 < 10.0) && (etco2 > 0.0)) ? A2(
			$elm$core$List$cons,
			{
				id: 'CAPNO_APNEA_EXTREME_LOW',
				message: 'Apnea or Severe Hypoperfusion: EtCO2 < 10 mmHg',
				modality: $author$project$Alarms$Types$CapnoModality,
				priority: $author$project$Alarms$Types$CrisisHighPriority,
				condition: $author$project$Alarms$Types$ApneaDetected(etco2),
				isLatched: true,
				timestamp: ts,
				isSilenced: false
			},
			acc) : acc;
	});
var $author$project$Alarms$Types$EcgLeadOff = {$: 'EcgLeadOff'};
var $author$project$Alarms$Types$AsystoleCrisis = {$: 'AsystoleCrisis'};
var $author$project$Alarms$Types$TechnicalFailure = {$: 'TechnicalFailure'};
var $author$project$Alarms$Types$VentricularTachycardiaCrisis = {$: 'VentricularTachycardiaCrisis'};
var $author$project$Alarms$Types$VentricularFibrillationCrisis = {$: 'VentricularFibrillationCrisis'};
var $author$project$Alarms$Manager$addEcgRhythmAlert = F5(
	function (rhythm, sbp, hasPpgPulse, ts, acc) {
		switch (rhythm.$) {
			case 'Asystole':
				return ((sbp > 60.0) || hasPpgPulse) ? A2(
					$elm$core$List$cons,
					{id: 'ECG_LEAD_OFF', message: 'ECG Lead Off: Pulses intact, check Lead II electrode', modality: $author$project$Alarms$Types$EcgModality, priority: $author$project$Alarms$Types$TechnicalFailure, condition: $author$project$Alarms$Types$EcgLeadOff, isLatched: false, timestamp: ts, isSilenced: false},
					acc) : A2(
					$elm$core$List$cons,
					{id: 'ASYSTOLE_CRISIS', message: 'ASYSTOLE: Zero electrical activity, initiate CPR', modality: $author$project$Alarms$Types$EcgModality, priority: $author$project$Alarms$Types$CrisisHighPriority, condition: $author$project$Alarms$Types$AsystoleCrisis, isLatched: true, timestamp: ts, isSilenced: false},
					acc);
			case 'VentricularFibrillation':
				return A2(
					$elm$core$List$cons,
					{id: 'VFIB_CRISIS', message: 'VENTRICULAR FIBRILLATION: Prepare defibrillator', modality: $author$project$Alarms$Types$EcgModality, priority: $author$project$Alarms$Types$CrisisHighPriority, condition: $author$project$Alarms$Types$VentricularFibrillationCrisis, isLatched: true, timestamp: ts, isSilenced: false},
					acc);
			case 'VentricularTachycardia':
				return A2(
					$elm$core$List$cons,
					{id: 'VTACH_CRISIS', message: 'VENTRICULAR TACHYCARDIA: Wide complex tachycardia', modality: $author$project$Alarms$Types$EcgModality, priority: $author$project$Alarms$Types$CrisisHighPriority, condition: $author$project$Alarms$Types$VentricularTachycardiaCrisis, isLatched: true, timestamp: ts, isSilenced: false},
					acc);
			default:
				return acc;
		}
	});
var $author$project$Alarms$Manager$evaluateVitals = function (rhythm) {
	return function (hr) {
		return function (sbp) {
			return function (dbp) {
				return function (map) {
					return function (spo2) {
						return function (etco2) {
							return function (hasPpgPulse) {
								return function (timestamp) {
									return function (mgr) {
										var newAlarms = A3(
											$author$project$Alarms$Manager$addCapnoAlerts,
											etco2,
											timestamp,
											A3(
												$author$project$Alarms$Manager$addSpo2Alerts,
												spo2,
												timestamp,
												A4(
													$author$project$Alarms$Manager$addAbpAlerts,
													sbp,
													map,
													timestamp,
													A3(
														$author$project$Alarms$Manager$addHrAlerts,
														hr,
														timestamp,
														A5($author$project$Alarms$Manager$addEcgRhythmAlert, rhythm, sbp, hasPpgPulse, timestamp, _List_Nil)))));
										var merged = A3(
											$elm$core$List$foldl,
											F2(
												function (newA, acc) {
													return A2(
														$elm$core$List$any,
														function (existing) {
															return _Utils_eq(existing.id, newA.id);
														},
														acc) ? acc : A2($elm$core$List$cons, newA, acc);
												}),
											mgr.activeAlarms,
											newAlarms);
										return _Utils_update(
											mgr,
											{activeAlarms: merged});
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Pharmacokinetics$Models$fentanylParams = function (cov) {
	var w = A2($elm$core$Basics$max, 30.0, cov.weightKg);
	var scale = w / 70.0;
	return {v1Liters: 13.0 * scale, v2Liters: 45.0 * scale, v3Liters: 275.0 * scale, k10PerMin: 0.062, k12PerMin: 0.315, k13PerMin: 0.038, k21PerMin: 0.083, k31PerMin: 0.003, ke0PerMin: 0.147};
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Dsp$Types$pushBuffer = F2(
	function (val, buf) {
		return (_Utils_cmp(buf.size, buf.capacity) < 0) ? _Utils_update(
			buf,
			{
				size: buf.size + 1,
				values: A2($elm$core$List$cons, val, buf.values)
			}) : _Utils_update(
			buf,
			{
				values: A2(
					$elm$core$List$cons,
					val,
					A2($elm$core$List$take, buf.capacity - 1, buf.values))
			});
	});
var $author$project$Dsp$Filter$applyBiquad = F3(
	function (coeffs, x, state) {
		var y = (coeffs.b0 * x) + state.w1;
		var nextW1 = ((coeffs.b1 * x) - (coeffs.a1 * y)) + state.w2;
		var nextW2 = (coeffs.b2 * x) - (coeffs.a2 * y);
		return _Utils_Tuple2(
			y,
			{w1: nextW1, w2: nextW2});
	});
var $author$project$Dsp$PanTompkins$processSample = F3(
	function (rawSample, timestamp, state) {
		var _v0 = A3($author$project$Dsp$Filter$applyBiquad, state.bandpassCoeffs, rawSample, state.bandpassState);
		var bpSample = _v0.a;
		var nextBpState = _v0.b;
		var currentIdx = state.sampleIndex + 1;
		var samplesSinceLast = currentIdx - state.lastRPeakSampleIndex;
		var isBeyondRefractory = _Utils_cmp(samplesSinceLast, state.config.refractorySamples) > -1;
		var oldestInt = function () {
			if (_Utils_cmp(state.intBuffer.size, state.config.windowSize) > -1) {
				var _v13 = A2($elm$core$List$drop, state.intBuffer.size - 1, state.intBuffer.values);
				if (_v13.b) {
					var head = _v13.a;
					return head;
				} else {
					return 0.0;
				}
			} else {
				return 0.0;
			}
		}();
		var nextDiffBuffer = A2($author$project$Dsp$Types$pushBuffer, bpSample, state.diffBuffer);
		var diffVals = nextDiffBuffer.values;
		var deriv = function () {
			if (diffVals.b && diffVals.b.b) {
				if ((diffVals.b.b.b && diffVals.b.b.b.b) && diffVals.b.b.b.b.b) {
					var x0 = diffVals.a;
					var _v8 = diffVals.b;
					var x1 = _v8.a;
					var _v9 = _v8.b;
					var _v10 = _v9.b;
					var x3 = _v10.a;
					var _v11 = _v10.b;
					var x4 = _v11.a;
					return ((((2.0 * x0) + x1) - x3) - (2.0 * x4)) / 8.0;
				} else {
					var x0 = diffVals.a;
					var _v12 = diffVals.b;
					var x1 = _v12.a;
					return (x0 - x1) / 2.0;
				}
			} else {
				return 0.0;
			}
		}();
		var squared = deriv * deriv;
		var nextSum = (_Utils_cmp(state.intBuffer.size, state.config.windowSize) > -1) ? A2($elm$core$Basics$max, 0.0, (state.runningSum - oldestInt) + squared) : (state.runningSum + squared);
		var nextIntBuffer = A2($author$project$Dsp$Types$pushBuffer, squared, state.intBuffer);
		var integrated = nextSum / A2($elm$core$Basics$max, 1, nextIntBuffer.size);
		var nextCandBuffer = A2($author$project$Dsp$Types$pushBuffer, integrated, state.candidateBuffer);
		var isLocalMax = function () {
			var _v4 = nextCandBuffer.values;
			if ((_v4.b && _v4.b.b) && _v4.b.b.b) {
				var curr = _v4.a;
				var _v5 = _v4.b;
				var mid = _v5.a;
				var _v6 = _v5.b;
				var prev = _v6.a;
				return (_Utils_cmp(mid, prev) > 0) && (_Utils_cmp(mid, curr) > 0);
			} else {
				return false;
			}
		}();
		var candidateValue = function () {
			var _v2 = nextCandBuffer.values;
			if (_v2.b && _v2.b.b) {
				var _v3 = _v2.b;
				var mid = _v3.a;
				return mid;
			} else {
				return integrated;
			}
		}();
		var isQrsPeak = isLocalMax && (isBeyondRefractory && (_Utils_cmp(candidateValue, state.thresholdI1) > 0));
		var update = function () {
			if (isQrsPeak) {
				var updatedSpki = (0.125 * candidateValue) + (0.875 * state.spki);
				var dtMs = (samplesSinceLast / state.config.sampleRate) * 1000.0;
				var updatedRrList = ((dtMs >= 250.0) && (dtMs <= 2500.0)) ? A2(
					$elm$core$List$cons,
					dtMs,
					A2($elm$core$List$take, 7, state.recentRrIntervals)) : state.recentRrIntervals;
				var meanRr = function () {
					if (!updatedRrList.b) {
						return dtMs;
					} else {
						var xs = updatedRrList;
						return $elm$core$List$sum(xs) / $elm$core$List$length(xs);
					}
				}();
				var bpm = (meanRr > 0.0) ? (60000.0 / meanRr) : 0.0;
				var t1 = state.npki + (0.25 * (updatedSpki - state.npki));
				var t2 = 0.5 * t1;
				return {
					npki: state.npki,
					spki: updatedSpki,
					thresholdI1: t1,
					thresholdI2: t2,
					heartRateBpm: $elm$core$Maybe$Just(bpm),
					rrIntervalMs: $elm$core$Maybe$Just(dtMs),
					recentRrIntervals: updatedRrList,
					lastRPeakSampleIndex: currentIdx
				};
			} else {
				if (isLocalMax && isBeyondRefractory) {
					var updatedNpki = (0.125 * candidateValue) + (0.875 * state.npki);
					var t1 = updatedNpki + (0.25 * (state.spki - updatedNpki));
					var t2 = 0.5 * t1;
					return {npki: updatedNpki, spki: state.spki, thresholdI1: t1, thresholdI2: t2, heartRateBpm: $elm$core$Maybe$Nothing, rrIntervalMs: $elm$core$Maybe$Nothing, recentRrIntervals: state.recentRrIntervals, lastRPeakSampleIndex: state.lastRPeakSampleIndex};
				} else {
					return {npki: state.npki, spki: state.spki, thresholdI1: state.thresholdI1, thresholdI2: state.thresholdI2, heartRateBpm: $elm$core$Maybe$Nothing, rrIntervalMs: $elm$core$Maybe$Nothing, recentRrIntervals: state.recentRrIntervals, lastRPeakSampleIndex: state.lastRPeakSampleIndex};
				}
			}
		}();
		var nextState = _Utils_update(
			state,
			{npki: update.npki, spki: update.spki, intBuffer: nextIntBuffer, diffBuffer: nextDiffBuffer, runningSum: nextSum, sampleIndex: currentIdx, thresholdI1: update.thresholdI1, thresholdI2: update.thresholdI2, bandpassState: nextBpState, candidateBuffer: nextCandBuffer, recentRrIntervals: update.recentRrIntervals, lastRPeakSampleIndex: update.lastRPeakSampleIndex});
		var detectionResult = {isPeak: isQrsPeak, peakValue: candidateValue, timestamp: timestamp, heartRateBpm: update.heartRateBpm, rrIntervalMs: update.rrIntervalMs};
		return _Utils_Tuple2(detectionResult, nextState);
	});
var $author$project$Dsp$Arrhythmia$isLifeThreatening = function (rhythm) {
	switch (rhythm.$) {
		case 'VentricularTachycardia':
			return true;
		case 'VentricularFibrillation':
			return true;
		case 'Asystole':
			return true;
		default:
			return false;
	}
};
var $author$project$Dsp$Arrhythmia$classifyRhythm = F2(
	function (currentTimestamp, state) {
		var timeSinceLastBeat = currentTimestamp - state.lastBeatTimestamp;
		var _v0 = ((state.lastBeatTimestamp > 0.0) && (timeSinceLastBeat > 3000.0)) ? _Utils_Tuple2($author$project$Dsp$Arrhythmia$Asystole, true) : _Utils_Tuple2(
			state.currentRhythm,
			$author$project$Dsp$Arrhythmia$isLifeThreatening(state.currentRhythm));
		var rhythm = _v0.a;
		var isEmerg = _v0.b;
		var classification = {
			rhythm: rhythm,
			timestamp: currentTimestamp,
			confidence: _Utils_eq(rhythm, $author$project$Dsp$Arrhythmia$Asystole) ? 0.99 : 0.90,
			isEmergency: isEmerg,
			meanRateBpm: function () {
				if (_Utils_eq(rhythm, $author$project$Dsp$Arrhythmia$Asystole)) {
					return 0.0;
				} else {
					var _v1 = state.recentRrIntervals;
					if (_v1.b) {
						var head = _v1.a;
						return (head > 0.0) ? (60000.0 / head) : 0.0;
					} else {
						return 0.0;
					}
				}
			}(),
			consecutivePvcCount: state.consecutivePvcs
		};
		return _Utils_Tuple2(
			classification,
			_Utils_update(
				state,
				{currentRhythm: rhythm}));
	});
var $author$project$Dsp$Arrhythmia$NormalBeat = {$: 'NormalBeat'};
var $author$project$Dsp$Arrhythmia$VentricularBigeminy = {$: 'VentricularBigeminy'};
var $author$project$Dsp$Arrhythmia$VentricularTrigeminy = {$: 'VentricularTrigeminy'};
var $author$project$Dsp$Arrhythmia$VentricularTachycardia = {$: 'VentricularTachycardia'};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Dsp$Arrhythmia$SinusBradycardia = {$: 'SinusBradycardia'};
var $author$project$Dsp$Arrhythmia$SinusTachycardia = {$: 'SinusTachycardia'};
var $author$project$Dsp$Arrhythmia$AtrialFibrillation = {$: 'AtrialFibrillation'};
var $author$project$Dsp$Arrhythmia$evaluateRegularityAndRate = F2(
	function (rrList, bpm) {
		var count = $elm$core$List$length(rrList);
		if (count >= 6) {
			var mean = $elm$core$List$sum(rrList) / count;
			var variance = function (s) {
				return s / count;
			}(
				$elm$core$List$sum(
					A2(
						$elm$core$List$map,
						function (r) {
							return (r - mean) * (r - mean);
						},
						rrList)));
			var stdDev = $elm$core$Basics$sqrt(variance);
			var cv = (mean > 0.0) ? (stdDev / mean) : 0.0;
			return (cv > 0.22) ? $author$project$Dsp$Arrhythmia$AtrialFibrillation : ((bpm < 50.0) ? $author$project$Dsp$Arrhythmia$SinusBradycardia : ((bpm > 110.0) ? $author$project$Dsp$Arrhythmia$SinusTachycardia : $author$project$Dsp$Arrhythmia$NormalSinusRhythm));
		} else {
			if (bpm < 50.0) {
				return $author$project$Dsp$Arrhythmia$SinusBradycardia;
			} else {
				if (bpm > 110.0) {
					return $author$project$Dsp$Arrhythmia$SinusTachycardia;
				} else {
					return $author$project$Dsp$Arrhythmia$NormalSinusRhythm;
				}
			}
		}
	});
var $author$project$Dsp$Arrhythmia$PrematureVentricularContraction = {$: 'PrematureVentricularContraction'};
var $author$project$Dsp$Arrhythmia$prematureVentricularContribution = $author$project$Dsp$Arrhythmia$PrematureVentricularContraction;
var $author$project$Dsp$Arrhythmia$classifyPattern = F4(
	function (pvcCount, beats, rrList, bpm) {
		if ((pvcCount >= 3) && (bpm >= 100.0)) {
			return $author$project$Dsp$Arrhythmia$VentricularTachycardia;
		} else {
			if (pvcCount >= 3) {
				return $author$project$Dsp$Arrhythmia$VentricularTachycardia;
			} else {
				_v0$4:
				while (true) {
					_v0$5:
					while (true) {
						if (beats.b) {
							switch (beats.a.$) {
								case 'NormalBeat':
									if ((beats.b.b && beats.b.b.b) && beats.b.b.b.b) {
										switch (beats.b.a.$) {
											case 'PrematureVentricularBeat':
												if ((beats.b.b.a.$ === 'NormalBeat') && (beats.b.b.b.a.$ === 'PrematureVentricularBeat')) {
													var _v8 = beats.a;
													var _v9 = beats.b;
													var _v10 = _v9.a;
													var _v11 = _v9.b;
													var _v12 = _v11.a;
													var _v13 = _v11.b;
													var _v14 = _v13.a;
													return $author$project$Dsp$Arrhythmia$VentricularBigeminy;
												} else {
													break _v0$5;
												}
											case 'NormalBeat':
												if ((((((beats.b.b.a.$ === 'PrematureVentricularBeat') && (beats.b.b.b.a.$ === 'NormalBeat')) && beats.b.b.b.b.b) && (beats.b.b.b.b.a.$ === 'NormalBeat')) && beats.b.b.b.b.b.b) && (beats.b.b.b.b.b.a.$ === 'PrematureVentricularBeat')) {
													var _v26 = beats.a;
													var _v27 = beats.b;
													var _v28 = _v27.a;
													var _v29 = _v27.b;
													var _v30 = _v29.a;
													var _v31 = _v29.b;
													var _v32 = _v31.a;
													var _v33 = _v31.b;
													var _v34 = _v33.a;
													var _v35 = _v33.b;
													var _v36 = _v35.a;
													return $author$project$Dsp$Arrhythmia$VentricularTrigeminy;
												} else {
													break _v0$5;
												}
											default:
												break _v0$5;
										}
									} else {
										break _v0$5;
									}
								case 'PrematureVentricularBeat':
									if (((beats.b.b && (beats.b.a.$ === 'NormalBeat')) && beats.b.b.b) && beats.b.b.b.b) {
										switch (beats.b.b.a.$) {
											case 'PrematureVentricularBeat':
												if (beats.b.b.b.a.$ === 'NormalBeat') {
													var _v1 = beats.a;
													var _v2 = beats.b;
													var _v3 = _v2.a;
													var _v4 = _v2.b;
													var _v5 = _v4.a;
													var _v6 = _v4.b;
													var _v7 = _v6.a;
													return $author$project$Dsp$Arrhythmia$VentricularBigeminy;
												} else {
													break _v0$4;
												}
											case 'NormalBeat':
												if (((((beats.b.b.b.a.$ === 'PrematureVentricularBeat') && beats.b.b.b.b.b) && (beats.b.b.b.b.a.$ === 'NormalBeat')) && beats.b.b.b.b.b.b) && (beats.b.b.b.b.b.a.$ === 'NormalBeat')) {
													var _v15 = beats.a;
													var _v16 = beats.b;
													var _v17 = _v16.a;
													var _v18 = _v16.b;
													var _v19 = _v18.a;
													var _v20 = _v18.b;
													var _v21 = _v20.a;
													var _v22 = _v20.b;
													var _v23 = _v22.a;
													var _v24 = _v22.b;
													var _v25 = _v24.a;
													return $author$project$Dsp$Arrhythmia$VentricularTrigeminy;
												} else {
													break _v0$4;
												}
											default:
												break _v0$4;
										}
									} else {
										break _v0$4;
									}
								default:
									break _v0$5;
							}
						} else {
							break _v0$5;
						}
					}
					return A2($author$project$Dsp$Arrhythmia$evaluateRegularityAndRate, rrList, bpm);
				}
				var _v37 = beats.a;
				return $author$project$Dsp$Arrhythmia$prematureVentricularContribution;
			}
		}
	});
var $author$project$Dsp$Arrhythmia$PrematureAtrialBeat = {$: 'PrematureAtrialBeat'};
var $author$project$Dsp$Arrhythmia$PrematureVentricularBeat = {$: 'PrematureVentricularBeat'};
var $author$project$Dsp$Arrhythmia$updateWithBeat = F4(
	function (qrsDurationMs, rrIntervalMs, timestamp, state) {
		var updatedRr = A2(
			$elm$core$List$take,
			16,
			A2($elm$core$List$cons, rrIntervalMs, state.recentRrIntervals));
		var isWideQrs = qrsDurationMs >= 120.0;
		var meanRr = function () {
			var _v1 = state.recentRrIntervals;
			if (!_v1.b) {
				return rrIntervalMs;
			} else {
				var xs = _v1;
				return $elm$core$List$sum(xs) / $elm$core$List$length(xs);
			}
		}();
		var isPremature = (meanRr > 0.0) && (_Utils_cmp(rrIntervalMs, 0.8 * meanRr) < 0);
		var beatType = (isPremature && isWideQrs) ? $author$project$Dsp$Arrhythmia$PrematureVentricularBeat : (isPremature ? $author$project$Dsp$Arrhythmia$PrematureAtrialBeat : $author$project$Dsp$Arrhythmia$NormalBeat);
		var updatedPvcs = function () {
			if (beatType.$ === 'PrematureVentricularBeat') {
				return state.consecutivePvcs + 1;
			} else {
				return 0;
			}
		}();
		var updatedBeats = A2(
			$elm$core$List$take,
			16,
			A2($elm$core$List$cons, beatType, state.recentBeats));
		var bpm = (rrIntervalMs > 0.0) ? (60000.0 / rrIntervalMs) : 0.0;
		var classifiedRhythm = A4($author$project$Dsp$Arrhythmia$classifyPattern, updatedPvcs, updatedBeats, updatedRr, bpm);
		var nextState = _Utils_update(
			state,
			{recentBeats: updatedBeats, currentRhythm: classifiedRhythm, consecutivePvcs: updatedPvcs, lastBeatTimestamp: timestamp, recentRrIntervals: updatedRr});
		var classification = {
			rhythm: classifiedRhythm,
			timestamp: timestamp,
			confidence: 0.95,
			isEmergency: $author$project$Dsp$Arrhythmia$isLifeThreatening(classifiedRhythm),
			meanRateBpm: bpm,
			consecutivePvcCount: updatedPvcs
		};
		return _Utils_Tuple2(classification, nextState);
	});
var $author$project$Pharmacokinetics$Compartment$stepCompartment = F3(
	function (infusionRateMcgMin, dtMinutes, state) {
		var numSteps = A2(
			$elm$core$Basics$max,
			1,
			$elm$core$Basics$ceiling(dtMinutes / 0.01));
		var subDt = dtMinutes / numSteps;
		var p = state.params;
		var integrateStep = F2(
			function (_v0, st) {
				var fluxElimination = p.k10PerMin * st.massCentral;
				var flux3to1 = p.k31PerMin * st.massSlow;
				var flux2to1 = p.k21PerMin * st.massFast;
				var flux1to3 = p.k13PerMin * st.massCentral;
				var flux1to2 = p.k12PerMin * st.massCentral;
				var dMass3 = flux1to3 - flux3to1;
				var nextMass3 = A2($elm$core$Basics$max, 0.0, st.massSlow + (dMass3 * subDt));
				var dMass2 = flux1to2 - flux2to1;
				var nextMass2 = A2($elm$core$Basics$max, 0.0, st.massFast + (dMass2 * subDt));
				var dMass1 = ((((infusionRateMcgMin - fluxElimination) - flux1to2) + flux2to1) - flux1to3) + flux3to1;
				var nextMass1 = A2($elm$core$Basics$max, 0.0, st.massCentral + (dMass1 * subDt));
				var v3Ml = A2($elm$core$Basics$max, 100.0, p.v3Liters * 1000.0);
				var v2Ml = A2($elm$core$Basics$max, 100.0, p.v2Liters * 1000.0);
				var v1Ml = A2($elm$core$Basics$max, 100.0, p.v1Liters * 1000.0);
				var c3 = st.massSlow / v3Ml;
				var c2 = st.massFast / v2Ml;
				var c1 = st.massCentral / v1Ml;
				var dCe = p.ke0PerMin * (c1 - st.effectSiteConcentration);
				var nextCe = A2($elm$core$Basics$max, 0.0, st.effectSiteConcentration + (dCe * subDt));
				return _Utils_update(
					st,
					{massFast: nextMass2, massSlow: nextMass3, massCentral: nextMass1, effectSiteConcentration: nextCe});
			});
		var finalState = A3(
			$elm$core$List$foldl,
			integrateStep,
			state,
			A2($elm$core$List$range, 1, numSteps));
		var concentrations = {
			centralCp: finalState.massCentral / A2($elm$core$Basics$max, 100.0, p.v1Liters * 1000.0),
			effectSiteCe: finalState.effectSiteConcentration,
			peripheralFastC2: finalState.massFast / A2($elm$core$Basics$max, 100.0, p.v2Liters * 1000.0),
			peripheralSlowC3: finalState.massSlow / A2($elm$core$Basics$max, 100.0, p.v3Liters * 1000.0)
		};
		return _Utils_Tuple2(concentrations, finalState);
	});
var $author$project$Dsp$Respiration$Expiration = {$: 'Expiration'};
var $author$project$Dsp$Respiration$ApneaCrisis = function (a) {
	return {$: 'ApneaCrisis', a: a};
};
var $author$project$Dsp$Respiration$Inspiration = {$: 'Inspiration'};
var $author$project$Dsp$Respiration$ApneaWarning = function (a) {
	return {$: 'ApneaWarning', a: a};
};
var $author$project$Dsp$Respiration$BreathingNormal = {$: 'BreathingNormal'};
var $author$project$Dsp$Respiration$stepRespiration = F2(
	function (rawImpedance, state) {
		var newZ0 = state.baselineZ0 + (0.0005 * (rawImpedance - state.baselineZ0));
		var acImpedance = rawImpedance - newZ0;
		var _v0 = A3($author$project$Dsp$Filter$applyBiquad, state.bandpassCoeffs, acImpedance, state.bandpassState);
		var filteredSample = _v0.a;
		var newBpState = _v0.b;
		var dt = 1.0 / state.sampleRate;
		var newTimeSinceLastBreath = state.timeSinceLastBreathSec + dt;
		var isPositiveZeroCrossing = (state.lastSample <= 0.0) && ((filteredSample > 0.0) && (newTimeSinceLastBreath > 1.2));
		var transition = function () {
			if (isPositiveZeroCrossing) {
				var trimmedIntervals = A2(
					$elm$core$List$take,
					5,
					A2($elm$core$List$cons, newTimeSinceLastBreath, state.breathIntervalsSec));
				return {nextCount: state.breathCount + 1, nextPhase: $author$project$Dsp$Respiration$Inspiration, resetTime: 0.0, updatedIntervals: trimmedIntervals};
			} else {
				if (_Utils_cmp(filteredSample, -0.05) < 0) {
					return {nextCount: state.breathCount, nextPhase: $author$project$Dsp$Respiration$Expiration, resetTime: newTimeSinceLastBreath, updatedIntervals: state.breathIntervalsSec};
				} else {
					return {nextCount: state.breathCount, nextPhase: state.currentPhase, resetTime: newTimeSinceLastBreath, updatedIntervals: state.breathIntervalsSec};
				}
			}
		}();
		var apnea = (transition.resetTime >= 20.0) ? $author$project$Dsp$Respiration$ApneaCrisis(transition.resetTime) : ((transition.resetTime >= 12.0) ? $author$project$Dsp$Respiration$ApneaWarning(transition.resetTime) : $author$project$Dsp$Respiration$BreathingNormal);
		var nextState = _Utils_update(
			state,
			{baselineZ0: newZ0, lastSample: filteredSample, breathCount: transition.nextCount, currentPhase: transition.nextPhase, bandpassState: newBpState, breathIntervalsSec: transition.updatedIntervals, timeSinceLastBreathSec: transition.resetTime});
		var meanInterval = function () {
			var _v1 = transition.updatedIntervals;
			if (!_v1.b) {
				return 4.0;
			} else {
				return $elm$core$List$sum(transition.updatedIntervals) / $elm$core$List$length(transition.updatedIntervals);
			}
		}();
		var respiratoryRate = (meanInterval > 0.1) ? A3($elm$core$Basics$clamp, 0.0, 120.0, 60.0 / meanInterval) : 0.0;
		var metrics = {apneaStatus: apnea, currentPhase: transition.nextPhase, respiratoryRateBpm: respiratoryRate, baselineImpedanceOhms: newZ0, tidalVolumeEstimateMl: state.estimatedTidalVolume};
		return _Utils_Tuple2(metrics, nextState);
	});
var $author$project$Simulation$Ward$updateBedVitals = function (bedNum) {
	return function (hr) {
		return function (sbp) {
			return function (dbp) {
				return function (spo2) {
					return function (etco2) {
						return function (cvp) {
							return function (crisis) {
								return function (warning) {
									return function (rhythmStr) {
										return function (ward) {
											var map = dbp + ((sbp - dbp) / 3.0);
											var updateSingleBed = function (b) {
												return _Utils_eq(b.bedNumber, bedNum) ? _Utils_update(
													b,
													{cvpMmhg: cvp, meanMmhg: map, etco2Mmhg: etco2, spo2Percent: spo2, heartRateBpm: hr, systolicMmhg: sbp, diastolicMmhg: dbp, hasActiveCrisis: crisis, hasActiveWarning: warning, primaryRhythmString: rhythmStr}) : b;
											};
											return _Utils_update(
												ward,
												{
													beds: A2($elm$core$List$map, updateSingleBed, ward.beds)
												});
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Dsp$PulseContour$estimateStrokeVolume = F3(
	function (sbp, dbp, systolicArea) {
		var sumPressure = sbp + dbp;
		if (sumPressure > 0.0) {
			var k = 1150.0;
			var sv = k * (systolicArea / sumPressure);
			return A3($elm$core$Basics$clamp, 20.0, 160.0, sv);
		} else {
			return 70.0;
		}
	});
var $author$project$Dsp$PulseContour$processAbpSample = F3(
	function (sample, timestamp, state) {
		var nextBuf = A2($author$project$Dsp$Types$pushBuffer, sample, state.sampleBuffer);
		var slope = function () {
			var _v1 = nextBuf.values;
			if ((_v1.b && _v1.b.b) && _v1.b.b.b) {
				var s0 = _v1.a;
				var _v2 = _v1.b;
				var _v3 = _v2.b;
				var s2 = _v3.a;
				return (s0 - s2) / 2.0;
			} else {
				return 0.0;
			}
		}();
		var isPeak = state.isRising && ((_Utils_cmp(slope, -0.3) < 0) && (sample > 90.0));
		var isTrough = (!state.isRising) && ((slope > 0.4) && (sample < 110.0));
		var step = function () {
			if (isTrough && (state.systolicCount > 10)) {
				var sbp = A2($elm$core$Basics$max, 40.0, state.currentPeak);
				var dbp = A2(
					$elm$core$Basics$min,
					sbp,
					A2($elm$core$Basics$max, 20.0, sample));
				var pp = sbp - dbp;
				var map = dbp + (pp / 3.0);
				var dicrotic = dbp + (0.62 * pp);
				var dt = 0.005;
				var area = state.systolicSum * dt;
				var sv = A3($author$project$Dsp$PulseContour$estimateStrokeVolume, sbp, dbp, area);
				var feat = {meanMmhg: map, timestamp: timestamp, systolicMmhg: sbp, diastolicMmhg: dbp, dicroticNotchMmhg: dicrotic, pulsePressureMmhg: pp, systolicAreaMmhgSec: area, estimatedStrokeVolumeMl: sv};
				return {
					nextPeak: sample,
					nextRising: true,
					nextTrough: sample,
					maybeFeature: $elm$core$Maybe$Just(feat),
					nextInSystole: true,
					nextSystolicSum: 0.0,
					nextSystolicCount: 0
				};
			} else {
				if (isPeak) {
					return {nextPeak: sample, nextRising: false, nextTrough: state.currentTrough, maybeFeature: $elm$core$Maybe$Nothing, nextInSystole: false, nextSystolicSum: state.systolicSum, nextSystolicCount: state.systolicCount};
				} else {
					var updatedCount = state.inSystole ? (state.systolicCount + 1) : state.systolicCount;
					var updatedPeak = (state.inSystole && (_Utils_cmp(sample, state.currentPeak) > 0)) ? sample : state.currentPeak;
					var updatedSum = state.inSystole ? (state.systolicSum + (sample - state.currentTrough)) : state.systolicSum;
					return {nextPeak: updatedPeak, nextRising: state.isRising, nextTrough: state.currentTrough, maybeFeature: $elm$core$Maybe$Nothing, nextInSystole: state.inSystole, nextSystolicSum: updatedSum, nextSystolicCount: updatedCount};
				}
			}
		}();
		var updatedRecentBeats = function () {
			var _v0 = step.maybeFeature;
			if (_v0.$ === 'Just') {
				var f = _v0.a;
				var b = {systolic: f.systolicMmhg, timestamp: f.timestamp, strokeVolume: f.estimatedStrokeVolumeMl, pulsePressure: f.pulsePressureMmhg};
				return A2(
					$elm$core$List$take,
					24,
					A2($elm$core$List$cons, b, state.recentBeats));
			} else {
				return state.recentBeats;
			}
		}();
		var nextState = _Utils_update(
			state,
			{isRising: step.nextRising, inSystole: step.nextInSystole, currentPeak: step.nextPeak, recentBeats: updatedRecentBeats, systolicSum: step.nextSystolicSum, sampleBuffer: nextBuf, currentTrough: step.nextTrough, systolicCount: step.nextSystolicCount});
		return _Utils_Tuple2(step.maybeFeature, nextState);
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Dsp$Plethysmograph$estimateSpo2 = F2(
	function (r, coeffs) {
		var raw = (((coeffs.a * r) * r) + (coeffs.b * r)) + coeffs.c;
		return A3($elm$core$Basics$clamp, 50.0, 100.0, raw);
	});
var $author$project$Dsp$Plethysmograph$processPpgSample = F4(
	function (redSample, irSample, timestamp, state) {
		var nextRedBuf = A2($author$project$Dsp$Types$pushBuffer, redSample, state.redBuffer);
		var nextIrBuf = A2($author$project$Dsp$Types$pushBuffer, irSample, state.irBuffer);
		var irSlope = function () {
			var _v3 = nextIrBuf.values;
			if ((_v3.b && _v3.b.b) && _v3.b.b.b) {
				var s0 = _v3.a;
				var _v4 = _v3.b;
				var _v5 = _v4.b;
				var s2 = _v5.a;
				return (s0 - s2) / 2.0;
			} else {
				return 0.0;
			}
		}();
		var isTrough = (irSlope > 0.02) && (state.sampleCount > 25);
		var step = function () {
			if (isTrough) {
				var dcRed = A2($elm$core$Basics$max, 0.01, state.minRed);
				var acRed = A2($elm$core$Basics$max, 0.001, state.maxRed - state.minRed);
				var dtMs = A2($elm$core$Basics$max, 300.0, timestamp - state.lastTroughTimestamp);
				var dcIr = A2($elm$core$Basics$max, 0.01, state.minIr);
				var acIr = A2($elm$core$Basics$max, 0.001, state.maxIr - state.minIr);
				var pr = 60000.0 / dtMs;
				var pi = (acIr / dcIr) * 100.0;
				var updatedPiList = A2(
					$elm$core$List$take,
					16,
					A2($elm$core$List$cons, pi, state.recentPi));
				var pvi = function () {
					var _v2 = _Utils_Tuple2(
						$elm$core$List$maximum(updatedPiList),
						$elm$core$List$minimum(updatedPiList));
					if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
						var maxP = _v2.a.a;
						var minP = _v2.b.a;
						return (maxP > 0.0) ? (((maxP - minP) / maxP) * 100.0) : 0.0;
					} else {
						return 0.0;
					}
				}();
				var r = (acRed / dcRed) / (acIr / dcIr);
				var spo2 = A2($author$project$Dsp$Plethysmograph$estimateSpo2, r, state.calibration);
				var feature = {timestamp: timestamp, spo2Percent: spo2, pulseRateBpm: pr, ratioOfRatios: r, perfusionIndexPercent: pi, plethVariabilityIndexPercent: pvi};
				return {
					nextMaxIr: irSample,
					nextMinIr: irSample,
					nextMaxRed: redSample,
					nextMinRed: redSample,
					maybeFeature: $elm$core$Maybe$Just(feature),
					nextSampleCount: 0
				};
			} else {
				return {
					nextMaxIr: A2($elm$core$Basics$max, state.maxIr, irSample),
					nextMinIr: A2($elm$core$Basics$min, state.minIr, irSample),
					nextMaxRed: A2($elm$core$Basics$max, state.maxRed, redSample),
					nextMinRed: A2($elm$core$Basics$min, state.minRed, redSample),
					maybeFeature: $elm$core$Maybe$Nothing,
					nextSampleCount: state.sampleCount + 1
				};
			}
		}();
		var nextRecentPi = function () {
			var _v1 = step.maybeFeature;
			if (_v1.$ === 'Just') {
				var f = _v1.a;
				return A2(
					$elm$core$List$take,
					16,
					A2($elm$core$List$cons, f.perfusionIndexPercent, state.recentPi));
			} else {
				return state.recentPi;
			}
		}();
		var nextTroughTs = function () {
			var _v0 = step.maybeFeature;
			if (_v0.$ === 'Just') {
				return timestamp;
			} else {
				return state.lastTroughTimestamp;
			}
		}();
		var nextState = _Utils_update(
			state,
			{maxIr: step.nextMaxIr, minIr: step.nextMinIr, maxRed: step.nextMaxRed, minRed: step.nextMinRed, irBuffer: nextIrBuf, recentPi: nextRecentPi, redBuffer: nextRedBuf, sampleCount: step.nextSampleCount, lastTroughTimestamp: nextTroughTs});
		return _Utils_Tuple2(step.maybeFeature, nextState);
	});
var $author$project$Dsp$Capnography$calculateAlphaAngle = F2(
	function (upstrokeSlope, plateauSlope) {
		var excessElevation = A3($elm$core$Basics$clamp, 0.0, 50.0, plateauSlope * 2.2);
		var baselineAngle = 105.0;
		return baselineAngle + excessElevation;
	});
var $author$project$Dsp$Capnography$Phase3AlveolarPlateau = {$: 'Phase3AlveolarPlateau'};
var $author$project$Dsp$Capnography$Phase2ExpiratoryUpstroke = {$: 'Phase2ExpiratoryUpstroke'};
var $author$project$Dsp$Capnography$Phase4InspiratoryDownstroke = {$: 'Phase4InspiratoryDownstroke'};
var $author$project$Dsp$Capnography$processCapnoSample = F3(
	function (sample, timestamp, state) {
		var nextBuf = A2($author$project$Dsp$Types$pushBuffer, sample, state.buffer);
		var slope = function () {
			var _v4 = nextBuf.values;
			if ((_v4.b && _v4.b.b) && _v4.b.b.b) {
				var s0 = _v4.a;
				var _v5 = _v4.b;
				var _v6 = _v5.b;
				var s2 = _v6.a;
				return (s0 - s2) / 2.0;
			} else {
				return 0.0;
			}
		}();
		var transition = function () {
			var _v3 = state.currentPhase;
			switch (_v3.$) {
				case 'Phase1InspiratoryBaseline':
					return ((sample > 4.0) && (slope > 0.8)) ? {nextPeak: sample, nextPhase: $author$project$Dsp$Capnography$Phase2ExpiratoryUpstroke, maybeFeature: $elm$core$Maybe$Nothing, nextLastBreath: state.lastBreathTimestamp, nextPhase3Samples: _List_Nil} : {nextPeak: state.cyclePeakCo2, nextPhase: $author$project$Dsp$Capnography$Phase1InspiratoryBaseline, maybeFeature: $elm$core$Maybe$Nothing, nextLastBreath: state.lastBreathTimestamp, nextPhase3Samples: _List_Nil};
				case 'Phase2ExpiratoryUpstroke':
					return ((slope < 0.3) && (sample > 20.0)) ? {
						nextPeak: sample,
						nextPhase: $author$project$Dsp$Capnography$Phase3AlveolarPlateau,
						maybeFeature: $elm$core$Maybe$Nothing,
						nextLastBreath: state.lastBreathTimestamp,
						nextPhase3Samples: _List_fromArray(
							[sample])
					} : {
						nextPeak: A2($elm$core$Basics$max, state.cyclePeakCo2, sample),
						nextPhase: $author$project$Dsp$Capnography$Phase2ExpiratoryUpstroke,
						maybeFeature: $elm$core$Maybe$Nothing,
						nextLastBreath: state.lastBreathTimestamp,
						nextPhase3Samples: _List_Nil
					};
				case 'Phase3AlveolarPlateau':
					if ((_Utils_cmp(slope, -1.0) < 0) && (sample > 15.0)) {
						var etco2 = A2($elm$core$Basics$max, state.cyclePeakCo2, sample);
						var alpha = A2($author$project$Dsp$Capnography$calculateAlphaAngle, state.phase2Slope, state.phase3Slope);
						var sharkFin = (alpha > 130.0) || (state.phase3Slope > 18.0);
						var dtMs = A2($elm$core$Basics$max, 1000.0, timestamp - state.lastBreathTimestamp);
						var beta = 92.0;
						var rr = 60000.0 / dtMs;
						var feat = {etco2Mmhg: etco2, timestamp: timestamp, betaAngleDeg: beta, alphaAngleDeg: alpha, phase3SlopeMmhgSec: state.phase3Slope, respiratoryRateBpm: rr, isSharkFinBronchospasm: sharkFin};
						return {
							nextPeak: 0.0,
							nextPhase: $author$project$Dsp$Capnography$Phase4InspiratoryDownstroke,
							maybeFeature: $elm$core$Maybe$Just(feat),
							nextLastBreath: timestamp,
							nextPhase3Samples: _List_Nil
						};
					} else {
						var updatedSamples = A2($elm$core$List$cons, sample, state.phase3Samples);
						return {
							nextPeak: A2($elm$core$Basics$max, state.cyclePeakCo2, sample),
							nextPhase: $author$project$Dsp$Capnography$Phase3AlveolarPlateau,
							maybeFeature: $elm$core$Maybe$Nothing,
							nextLastBreath: state.lastBreathTimestamp,
							nextPhase3Samples: updatedSamples
						};
					}
				default:
					return (sample < 3.0) ? {nextPeak: 0.0, nextPhase: $author$project$Dsp$Capnography$Phase1InspiratoryBaseline, maybeFeature: $elm$core$Maybe$Nothing, nextLastBreath: state.lastBreathTimestamp, nextPhase3Samples: _List_Nil} : {nextPeak: state.cyclePeakCo2, nextPhase: $author$project$Dsp$Capnography$Phase4InspiratoryDownstroke, maybeFeature: $elm$core$Maybe$Nothing, nextLastBreath: state.lastBreathTimestamp, nextPhase3Samples: _List_Nil};
			}
		}();
		var nextP3Slope = function () {
			var _v1 = transition.nextPhase3Samples;
			if (_v1.b) {
				var first = _v1.a;
				var rest = _v1.b;
				var _v2 = $elm$core$List$reverse(rest);
				if (_v2.b) {
					var last = _v2.a;
					var n = $elm$core$List$length(transition.nextPhase3Samples);
					return (n > 2.0) ? ((first - last) / (n * 0.005)) : state.phase3Slope;
				} else {
					return state.phase3Slope;
				}
			} else {
				return state.phase3Slope;
			}
		}();
		var nextRecentEtco2 = function () {
			var _v0 = transition.maybeFeature;
			if (_v0.$ === 'Just') {
				var f = _v0.a;
				return A2(
					$elm$core$List$take,
					12,
					A2($elm$core$List$cons, f.etco2Mmhg, state.recentEtco2));
			} else {
				return state.recentEtco2;
			}
		}();
		var nextState = _Utils_update(
			state,
			{
				buffer: nextBuf,
				phase3Slope: nextP3Slope,
				recentEtco2: nextRecentEtco2,
				currentPhase: transition.nextPhase,
				cyclePeakCo2: transition.nextPeak,
				phase3Samples: transition.nextPhase3Samples,
				sampleCountInPhase: _Utils_eq(transition.nextPhase, state.currentPhase) ? (state.sampleCountInPhase + 1) : 0,
				lastBreathTimestamp: transition.nextLastBreath
			});
		return _Utils_Tuple2(transition.maybeFeature, nextState);
	});
var $author$project$Simulation$SignalGenerator$nextNoise = function (seed) {
	var nextSeed = A2($elm$core$Basics$modBy, 2147483647, (seed * 16807) + 1);
	var norm = ((nextSeed / 2147483647.0) * 2.0) - 1.0;
	return _Utils_Tuple2(norm, nextSeed);
};
var $author$project$Simulation$SignalGenerator$synthesizeAbpWave = F4(
	function (cardiacPhase, sbp, dbp, respPhase) {
		var respMod = $elm$core$Basics$sin(respPhase) * 3.5;
		var effSbp = sbp + respMod;
		var effDbp = dbp + (respMod * 0.5);
		var pp = effSbp - effDbp;
		var abpVal = function () {
			if (cardiacPhase < 1.6) {
				var frac = cardiacPhase / 1.6;
				return effDbp + ((pp * 0.15) * (1.0 - frac));
			} else {
				if (cardiacPhase <= 2.2) {
					var upFrac = (cardiacPhase - 1.6) / 0.6;
					return effDbp + (pp * $elm$core$Basics$sin(upFrac * ($elm$core$Basics$pi / 2.0)));
				} else {
					if (cardiacPhase <= 2.8) {
						var downFrac = (cardiacPhase - 2.2) / 0.6;
						return effSbp - ((pp * 0.38) * downFrac);
					} else {
						if (cardiacPhase <= 3.2) {
							var notchFrac = (cardiacPhase - 2.8) / 0.4;
							var rebound = $elm$core$Basics$sin(notchFrac * $elm$core$Basics$pi) * (pp * 0.12);
							return ((effDbp + (pp * 0.62)) - ((pp * 0.15) * notchFrac)) + rebound;
						} else {
							var decayFrac = (cardiacPhase - 3.2) / ((2.0 * $elm$core$Basics$pi) - 3.2);
							return effDbp + ((pp * 0.47) * A2($elm$core$Basics$pow, $elm$core$Basics$e, (-1.8) * decayFrac));
						}
					}
				}
			}
		}();
		return abpVal;
	});
var $author$project$Simulation$SignalGenerator$synthesizeCvpWave = F3(
	function (cardiacPhase, cvpBase, respPhase) {
		var respMod = $elm$core$Basics$sin(respPhase) * 2.0;
		var vWave = 0.9 * A2(
			$elm$core$Basics$pow,
			$elm$core$Basics$e,
			(-0.5) * A2($elm$core$Basics$pow, (cardiacPhase - 2.6) / 0.2, 2.0));
		var cWave = 0.5 * A2(
			$elm$core$Basics$pow,
			$elm$core$Basics$e,
			(-0.5) * A2($elm$core$Basics$pow, (cardiacPhase - 1.7) / 0.12, 2.0));
		var aWave = 0.8 * A2(
			$elm$core$Basics$pow,
			$elm$core$Basics$e,
			(-0.5) * A2($elm$core$Basics$pow, (cardiacPhase - 0.8) / 0.15, 2.0));
		return A2($elm$core$Basics$max, 0.0, (((cvpBase + respMod) + aWave) + cWave) + vWave);
	});
var $author$project$Simulation$SignalGenerator$synthesizePpgWaves = F3(
	function (cardiacPhase, spo2, respPhase) {
		var respMod = $elm$core$Basics$sin(respPhase) * 0.05;
		var rRatio = (110.0 - spo2) / 25.0;
		var pulse = function () {
			if ((cardiacPhase >= 1.8) && (cardiacPhase <= 3.4)) {
				var phi = (cardiacPhase - 1.8) / 1.6;
				return $elm$core$Basics$sin(phi * $elm$core$Basics$pi);
			} else {
				return 0.0;
			}
		}();
		var dcRed = 1.8;
		var dcIr = 2.2;
		var acIr = (0.18 * pulse) * (1.0 + respMod);
		var acRed = ((acIr / dcIr) * dcRed) * rRatio;
		var ppgRed = dcRed + acRed;
		var ppgIr = dcIr + acIr;
		return _Utils_Tuple2(ppgRed, ppgIr);
	});
var $author$project$Simulation$SignalGenerator$synthesize12LeadEcg = F3(
	function (phi, stElev, noise) {
		var stSegment = ((phi >= 1.8) && (phi <= 2.5)) ? stElev : 0.0;
		var gauss = F3(
			function (a, mu, sigma) {
				var d = (phi - mu) / sigma;
				return a * A2($elm$core$Basics$pow, $elm$core$Basics$e, ((-0.5) * d) * d);
			});
		var pWave = A3(gauss, 0.15, 0.7, 0.12);
		var qWave = A3(gauss, -0.15, 1.45, 0.04);
		var rWave = A3(gauss, 1.45, 1.58, 0.05);
		var sWave = A3(gauss, -0.32, 1.72, 0.06);
		var tWave = A3(gauss, 0.32, 2.75, 0.28);
		var leadV1 = (((((-0.5) * rWave) + (0.3 * sWave)) + (0.1 * tWave)) + (stElev * 0.4)) + noise;
		var leadV2 = (((((-0.2) * rWave) + (0.5 * sWave)) + (0.2 * tWave)) + (stElev * 0.8)) + noise;
		var leadV3 = ((((0.6 * rWave) - (0.3 * sWave)) + (0.3 * tWave)) + (stElev * 1.2)) + noise;
		var leadV4 = ((((1.2 * rWave) - (0.2 * sWave)) + (0.35 * tWave)) + (stElev * 1.4)) + noise;
		var leadV5 = ((((1.3 * rWave) - (0.15 * sWave)) + (0.32 * tWave)) + (stElev * 0.9)) + noise;
		var leadV6 = ((((1.0 * rWave) - (0.1 * sWave)) + (0.28 * tWave)) + (stElev * 0.5)) + noise;
		var leadIIBase = (((((pWave + qWave) + rWave) + sWave) + tWave) + stSegment) + noise;
		var leadI = (leadIIBase * 0.65) + noise;
		var leadII = leadIIBase;
		var leadAvf = (0.75 * leadIIBase) + noise;
		var leadAvl = (0.35 * leadIIBase) + noise;
		var leadAvr = ((-0.85) * leadIIBase) + noise;
		var leadIII = (leadIIBase * 0.45) + noise;
		return {leadI: leadI, leadII: leadII, leadV1: leadV1, leadV2: leadV2, leadV3: leadV3, leadV4: leadV4, leadV5: leadV5, leadV6: leadV6, leadAvf: leadAvf, leadAvl: leadAvl, leadAvr: leadAvr, leadIII: leadIII};
	});
var $author$project$Simulation$SignalGenerator$synthesizeCapnoWave = F2(
	function (respPhase, etco2) {
		if (respPhase <= 0.25) {
			var frac = respPhase / 0.25;
			return (etco2 * frac) * 0.85;
		} else {
			if (_Utils_cmp(respPhase, $elm$core$Basics$pi) < 1) {
				var frac = (respPhase - 0.25) / ($elm$core$Basics$pi - 0.25);
				return (etco2 * 0.85) + ((etco2 * 0.15) * frac);
			} else {
				if (_Utils_cmp(respPhase, $elm$core$Basics$pi + 0.3) < 1) {
					var downFrac = (respPhase - $elm$core$Basics$pi) / 0.3;
					return etco2 * (1.0 - downFrac);
				} else {
					return 0.0;
				}
			}
		}
	});
var $author$project$Simulation$SignalGenerator$synthesizeWaveforms = F8(
	function (hr, sbp, dbp, spo2, etco2, cvp, timestamp, state) {
		var cardiacFreq = hr / 60.0;
		var _v0 = $author$project$Simulation$SignalGenerator$nextNoise(state.pseudoRandomSeed);
		var rawNoise = _v0.a;
		var nextSeed = _v0.b;
		var respFreq = 14.0 / 60.0;
		var _v1 = A3($author$project$Simulation$SignalGenerator$synthesizePpgWaves, state.cardiacPhase, spo2, state.respiratoryPhase);
		var ppgRed = _v1.a;
		var ppgIr = _v1.b;
		var cvpWave = A3($author$project$Simulation$SignalGenerator$synthesizeCvpWave, state.cardiacPhase, cvp, state.respiratoryPhase);
		var noise = rawNoise * state.config.noiseAmplitudeMv;
		var capno = A2($author$project$Simulation$SignalGenerator$synthesizeCapnoWave, state.respiratoryPhase, etco2);
		var ecg = A3($author$project$Simulation$SignalGenerator$synthesize12LeadEcg, state.cardiacPhase, state.config.stElevationMv, noise);
		var abp = A4($author$project$Simulation$SignalGenerator$synthesizeAbpWave, state.cardiacPhase, sbp, dbp, state.respiratoryPhase);
		var samples = {leadI: ecg.leadI, ppgIr: ppgIr, leadII: ecg.leadII, leadV1: ecg.leadV1, leadV2: ecg.leadV2, leadV3: ecg.leadV3, leadV4: ecg.leadV4, leadV5: ecg.leadV5, leadV6: ecg.leadV6, ppgRed: ppgRed, abpMmhg: abp, cvpMmhg: cvpWave, leadAvf: ecg.leadAvf, leadAvl: ecg.leadAvl, leadAvr: ecg.leadAvr, leadIII: ecg.leadIII, capnoMmhg: capno, timestamp: timestamp};
		var fs = state.config.sampleRateHz;
		var dRespPhase = ((2.0 * $elm$core$Basics$pi) * respFreq) / fs;
		var nextRespPhase = function () {
			var p = state.respiratoryPhase + dRespPhase;
			return (_Utils_cmp(p, 2.0 * $elm$core$Basics$pi) > -1) ? (p - (2.0 * $elm$core$Basics$pi)) : p;
		}();
		var dCardiacPhase = ((2.0 * $elm$core$Basics$pi) * cardiacFreq) / fs;
		var nextCardiacPhase = function () {
			var p = state.cardiacPhase + dCardiacPhase;
			return (_Utils_cmp(p, 2.0 * $elm$core$Basics$pi) > -1) ? (p - (2.0 * $elm$core$Basics$pi)) : p;
		}();
		var nextState = _Utils_update(
			state,
			{sampleIndex: state.sampleIndex + 1, cardiacPhase: nextCardiacPhase, pseudoRandomSeed: nextSeed, respiratoryPhase: nextRespPhase});
		return _Utils_Tuple2(samples, nextState);
	});
var $author$project$Hemodynamics$Calculations$calculateHemodynamics = F8(
	function (hr, map, cvp, sbp, mpap, pcwp, sv, bsa) {
		var safeSbp = A2($elm$core$Basics$max, 10.0, sbp);
		var safeMap = A2($elm$core$Basics$max, 10.0, map);
		var safeBsa = A2($elm$core$Basics$max, 0.5, bsa);
		var safeHr = A2($elm$core$Basics$max, 10.0, hr);
		var svi = sv / safeBsa;
		var lvswi = A2($elm$core$Basics$max, 0.0, (0.0136 * svi) * (map - pcwp));
		var msi = hr / safeMap;
		var si = hr / safeSbp;
		var co = (safeHr * sv) / 1000.0;
		var safeCo = A2($elm$core$Basics$max, 0.1, co);
		var pvr = A2($elm$core$Basics$max, 20.0, ((mpap - pcwp) / safeCo) * 80.0);
		var pvri = pvr * safeBsa;
		var svr = A2($elm$core$Basics$max, 100.0, ((map - cvp) / safeCo) * 80.0);
		var svri = svr * safeBsa;
		var ci = co / safeBsa;
		return {bsaM2: safeBsa, shockIndex: si, strokeVolumeMl: sv, cardiacOutputLpm: co, cardiacIndexLpmM2: ci, modifiedShockIndex: msi, strokeVolumeIndexMlM2: svi, systemicVascularResistanceDyns: svr, pulmonaryVascularResistanceDyns: pvr, leftVentricularStrokeWorkIndexGm: lvswi, systemicVascularResistanceIndexDyns: svri, pulmonaryVascularResistanceIndexDyns: pvri};
	});
var $author$project$Main$stepSimulation = F2(
	function (elapsedMs, model) {
		var effectiveElapsedMs = A2($elm$core$Basics$min, 100.0, elapsedMs * model.simSpeed);
		var _v0 = A3($author$project$Simulation$Ventilator$stepVentilator, model.ventSettings, model.ventMechanics, model.ventState);
		var newVentScalars = _v0.a;
		var nextVentSt = _v0.b;
		var newPawHistory = A2(
			$elm$core$List$take,
			60,
			A2($elm$core$List$cons, newVentScalars.airwayPressureCmH2o, model.pawHistory));
		var newVolHistory = A2(
			$elm$core$List$take,
			60,
			A2($elm$core$List$cons, newVentScalars.deliveredVolumeMl, model.volHistory));
		var newFlowHistory = A2(
			$elm$core$List$take,
			60,
			A2($elm$core$List$cons, newVentScalars.flowLitersPerMin, model.flowHistory));
		var infusionRate = model.pumpState.isRunning ? model.pumpState.currentRateMcgMin : 0.0;
		var subStepDtMs = 5.0;
		var numSubSteps = A2(
			$elm$core$Basics$max,
			1,
			$elm$core$Basics$round(effectiveElapsedMs / subStepDtMs));
		var dtMinutes = (effectiveElapsedMs / 1000.0) / 60.0;
		var _v1 = A3($author$project$Pharmacokinetics$Compartment$stepCompartment, infusionRate, dtMinutes, model.pkCompartmentState);
		var updatedConcs = _v1.a;
		var nextPkSt = _v1.b;
		var scenDef = $author$project$Simulation$Scenarios$getScenarioDefinition(model.activeScenario);
		var executeSubStep = F2(
			function (_v10, _v11) {
				var m = _v11.a;
				var curTime = _v11.b;
				var maxPts = 750;
				var t = curTime + subStepDtMs;
				var addPt = F3(
					function (val, isPk, buf) {
						return A2(
							$elm$core$List$cons,
							{value: val, isRPeak: isPk, timestamp: t},
							A2($elm$core$List$take, maxPts - 1, buf));
					});
				var _v3 = A8($author$project$Simulation$SignalGenerator$synthesizeWaveforms, scenDef.heartRateBpm, scenDef.systolicMmhg, scenDef.diastolicMmhg, scenDef.spo2Percent, scenDef.etco2Mmhg, scenDef.cvpMmhg, t, m.generatorState);
				var raw = _v3.a;
				var nextGenSt = _v3.b;
				var newAbp = A3(addPt, raw.abpMmhg, false, m.abpPoints);
				var newCvp = A3(addPt, raw.cvpMmhg, false, m.cvpPoints);
				var newPpg = A3(addPt, raw.ppgIr * 40.0, false, m.ppgPoints);
				var newCapno = A3(addPt, raw.capnoMmhg, false, m.capnoPoints);
				var _v4 = A3($author$project$Dsp$PanTompkins$processSample, raw.leadII, t, m.ptDetector);
				var qrsDet = _v4.a;
				var nextPtSt = _v4.b;
				var newTimer = qrsDet.isPeak ? 0.0 : (m.heartBeatTimerMs + subStepDtMs);
				var newLeadIi = A3(addPt, raw.leadII, qrsDet.isPeak, m.leadIiPoints);
				var updatedRr = function () {
					if (qrsDet.isPeak) {
						var rr = A2($elm$core$Maybe$withDefault, 60000.0 / scenDef.heartRateBpm, qrsDet.rrIntervalMs);
						return A2(
							$elm$core$List$take,
							30,
							A2($elm$core$List$cons, rr, m.rrHistoryMs));
					} else {
						return m.rrHistoryMs;
					}
				}();
				var newBeating = qrsDet.isPeak ? true : ((m.heartBeatTimerMs > 120.0) ? false : m.isHeartBeating);
				var _v5 = function () {
					if (qrsDet.isPeak) {
						var rr = A2($elm$core$Maybe$withDefault, 60000.0 / scenDef.heartRateBpm, qrsDet.rrIntervalMs);
						return A4($author$project$Dsp$Arrhythmia$updateWithBeat, 88.0, rr, t, m.arrhythmiaClassifier);
					} else {
						return A2($author$project$Dsp$Arrhythmia$classifyRhythm, t, m.arrhythmiaClassifier);
					}
				}();
				var arrClass = _v5.a;
				var nextArrCl = _v5.b;
				var _v6 = A2($author$project$Dsp$Respiration$stepRespiration, 500.0 + (raw.capnoMmhg * 0.5), m.respirationState);
				var respMetrics = _v6.a;
				var nextRespSt = _v6.b;
				var _v7 = A3($author$project$Dsp$Capnography$processCapnoSample, raw.capnoMmhg, t, m.capnoState);
				var capnoFeat = _v7.a;
				var nextCapnoSt = _v7.b;
				var _v8 = A4($author$project$Dsp$Plethysmograph$processPpgSample, raw.ppgRed, raw.ppgIr, t, m.plethState);
				var ppgFeat = _v8.a;
				var nextPlethSt = _v8.b;
				var _v9 = A3($author$project$Dsp$PulseContour$processAbpSample, raw.abpMmhg, t, m.pulseContourState);
				var abpFeat = _v9.a;
				var nextContourSt = _v9.b;
				return _Utils_Tuple2(
					_Utils_update(
						m,
						{abpPoints: newAbp, cvpPoints: newCvp, ppgPoints: newPpg, capnoState: nextCapnoSt, plethState: nextPlethSt, ptDetector: nextPtSt, capnoPoints: newCapno, rrHistoryMs: updatedRr, leadIiPoints: newLeadIi, generatorState: nextGenSt, isHeartBeating: newBeating, heartBeatTimerMs: newTimer, respirationState: nextRespSt, pulseContourState: nextContourSt, arrhythmiaClassifier: nextArrCl}),
					t);
			});
		var _v2 = A3(
			$elm$core$List$foldl,
			executeSubStep,
			_Utils_Tuple2(model, model.currentTimeMs),
			A2($elm$core$List$range, 1, numSubSteps));
		var finalModel = _v2.a;
		var finalTime = _v2.b;
		var rhythmStr = $author$project$Dsp$Arrhythmia$rhythmToString(finalModel.arrhythmiaClassifier.currentRhythm);
		var shouldRecordTrend = (finalTime - finalModel.lastTrendRecordTimeMs) >= 2000.0;
		var nextTrendTime = shouldRecordTrend ? finalTime : finalModel.lastTrendRecordTimeMs;
		var rhythm = finalModel.arrhythmiaClassifier.currentRhythm;
		var updatedAlarmMgr = $author$project$Alarms$Manager$evaluateVitals(rhythm)(scenDef.heartRateBpm)(scenDef.systolicMmhg)(scenDef.diastolicMmhg)(scenDef.spo2Percent)(scenDef.etco2Mmhg)(scenDef.temperatureC)(
			_Utils_eq(finalModel.activeScenario, $author$project$Simulation$Scenarios$AcuteAnteriorStemi))(finalTime)(finalModel.alarmManager);
		var hasCrisis = A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a.priority, $author$project$Alarms$Types$CrisisHighPriority);
			},
			updatedAlarmMgr.activeAlarms);
		var hasWarning = A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a.priority, $author$project$Alarms$Types$WarningMediumPriority);
			},
			updatedAlarmMgr.activeAlarms);
		var updatedWard = $author$project$Simulation$Ward$updateBedVitals(finalModel.ward.selectedBedNumber)(scenDef.heartRateBpm)(scenDef.systolicMmhg)(scenDef.diastolicMmhg)(scenDef.spo2Percent)(scenDef.etco2Mmhg)(scenDef.cvpMmhg)(hasCrisis)(hasWarning)(rhythmStr)(finalModel.ward);
		var pState = model.pumpState;
		var nextPumpState = _Utils_update(
			pState,
			{concentrations: updatedConcs});
		var mapVal = scenDef.diastolicMmhg + ((scenDef.systolicMmhg - scenDef.diastolicMmhg) / 3.0);
		var updatedHemo = A8($author$project$Hemodynamics$Calculations$calculateHemodynamics, scenDef.heartRateBpm, mapVal, scenDef.cvpMmhg, scenDef.systolicMmhg, 22.0, 10.0, 72.0, $author$project$Simulation$Patient$defaultPatient.bsaM2);
		var updatedTrends = function () {
			if (shouldRecordTrend) {
				var newRec = {etco2MmHg: scenDef.etco2Mmhg, abpMeanMmHg: mapVal, spO2Percent: scenDef.spo2Percent, heartRateBpm: scenDef.heartRateBpm, timestampSec: finalTime / 1000.0, abpSystolicMmHg: scenDef.systolicMmhg, abpDiastolicMmHg: scenDef.diastolicMmhg, respiratoryRateBpm: 14.0, temperatureCelsius: scenDef.temperatureC};
				return A2(
					$elm$core$List$take,
					50,
					A2($elm$core$List$cons, newRec, finalModel.trendRecords));
			} else {
				return finalModel.trendRecords;
			}
		}();
		return _Utils_Tuple2(
			_Utils_update(
				finalModel,
				{ward: updatedWard, pumpState: nextPumpState, ventState: nextVentSt, pawHistory: newPawHistory, volHistory: newVolHistory, flowHistory: newFlowHistory, hemoProfile: updatedHemo, ventScalars: newVentScalars, alarmManager: updatedAlarmMgr, trendRecords: updatedTrends, currentTimeMs: finalTime, lastTrendRecordTimeMs: nextTrendTime}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pharmacokinetics$Models$dobutamineParams = function (cov) {
	var vd = A2($elm$core$Basics$max, 6.0, 0.25 * cov.weightKg);
	return {v1Liters: vd, v2Liters: vd * 0.5, v3Liters: vd * 0.5, k10PerMin: 0.346, k12PerMin: 0.06, k13PerMin: 0.01, k21PerMin: 0.06, k31PerMin: 0.01, ke0PerMin: 0.693};
};
var $author$project$Pharmacokinetics$Models$norepinephrineParams = function (cov) {
	var vd = A2($elm$core$Basics$max, 5.0, 0.2 * cov.weightKg);
	return {v1Liters: vd, v2Liters: vd * 0.5, v3Liters: vd * 0.5, k10PerMin: 0.277, k12PerMin: 0.05, k13PerMin: 0.01, k21PerMin: 0.05, k31PerMin: 0.01, ke0PerMin: 0.693};
};
var $author$project$Pharmacokinetics$Models$calculateLeanBodyMass = function (cov) {
	var bmiRatio = cov.weightKg / cov.heightCm;
	return cov.isMale ? A2($elm$core$Basics$max, 25.0, (1.1 * cov.weightKg) - (128.0 * (bmiRatio * bmiRatio))) : A2($elm$core$Basics$max, 20.0, (1.07 * cov.weightKg) - (148.0 * (bmiRatio * bmiRatio)));
};
var $author$project$Pharmacokinetics$Models$schniderPropofolParams = function (cov) {
	var lbm = $author$project$Pharmacokinetics$Models$calculateLeanBodyMass(cov);
	var cl3 = 0.836;
	var age = A3($elm$core$Basics$clamp, 18.0, 95.0, cov.ageYears);
	var cl2 = A2($elm$core$Basics$max, 0.2, 1.29 - (0.024 * (age - 53.0)));
	var v3 = 238.0;
	var k31 = cl3 / v3;
	var v2 = A2($elm$core$Basics$max, 5.0, 18.9 - (0.391 * (age - 53.0)));
	var k21 = cl2 / v2;
	var v1 = 4.27;
	var k12 = cl2 / v1;
	var k13 = cl3 / v1;
	var w = cov.weightKg;
	var h = cov.heightCm;
	var cl1 = A2($elm$core$Basics$max, 0.5, ((1.89 + (0.0456 * (w - 77.0))) - (0.0681 * (lbm - 59.0))) + (0.0264 * (h - 177.0)));
	var k10 = cl1 / v1;
	return {v1Liters: v1, v2Liters: v2, v3Liters: v3, k10PerMin: k10, k12PerMin: k12, k13PerMin: k13, k21PerMin: k21, k31PerMin: k31, ke0PerMin: 0.456};
};
var $author$project$Dsp$Arrhythmia$VentricularFibrillation = {$: 'VentricularFibrillation'};
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'FrameTick':
				var elapsedMs = msg.a;
				return model.isPaused ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A2($author$project$Main$stepSimulation, elapsedMs, model);
			case 'TogglePause':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isPaused: !model.isPaused}),
					$elm$core$Platform$Cmd$none);
			case 'SetSpeed':
				var spd = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{simSpeed: spd}),
					$elm$core$Platform$Cmd$none);
			case 'SelectScenario':
				var scen = msg.a;
				var scenDef = $author$project$Simulation$Scenarios$getScenarioDefinition(scen);
				var genCfg = model.generatorState.config;
				var updatedGenCfg = _Utils_update(
					genCfg,
					{stElevationMv: scenDef.stElevationMv});
				var genSt = model.generatorState;
				var updatedGenSt = _Utils_update(
					genSt,
					{config: updatedGenCfg});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{activeScenario: scen, generatorState: updatedGenSt}),
					$elm$core$Platform$Cmd$none);
			case 'SelectBed':
				var bedNum = msg.a;
				var w = model.ward;
				var updatedWard = _Utils_update(
					w,
					{selectedBedNumber: bedNum});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ward: updatedWard, isWardView: false}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleWardView':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isWardView: !model.isWardView}),
					$elm$core$Platform$Cmd$none);
			case 'OpenModal':
				var m = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{activeModal: m}),
					$elm$core$Platform$Cmd$none);
			case 'CloseModals':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{activeModal: $author$project$Main$NoModal}),
					$elm$core$Platform$Cmd$none);
			case 'SilenceAlarms':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							alarmManager: A2($author$project$Alarms$Manager$silenceAlarms, 120.0, model.alarmManager)
						}),
					$author$project$Ports$audioAlarm('MUTE'));
			case 'AcknowledgeAlarms':
				var mgr = model.alarmManager;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							alarmManager: _Utils_update(
								mgr,
								{activeAlarms: _List_Nil})
						}),
					$elm$core$Platform$Cmd$none);
			case 'SelectPumpDrug':
				var drug = msg.a;
				var patient = $author$project$Simulation$Patient$defaultPatient;
				var pState = model.pumpState;
				var cov = {isMale: true, ageYears: patient.ageYears, heightCm: patient.heightCm, weightKg: patient.weightKg};
				var newParams = function () {
					switch (drug.$) {
						case 'PropofolMarsh':
							return $author$project$Pharmacokinetics$Models$marshPropofolParams(cov);
						case 'PropofolSchnider':
							return $author$project$Pharmacokinetics$Models$schniderPropofolParams(cov);
						case 'Norepinephrine':
							return $author$project$Pharmacokinetics$Models$norepinephrineParams(cov);
						case 'Dobutamine':
							return $author$project$Pharmacokinetics$Models$dobutamineParams(cov);
						default:
							return $author$project$Pharmacokinetics$Models$fentanylParams(cov);
					}
				}();
				var newPkSt = $author$project$Pharmacokinetics$Compartment$initCompartmentState(newParams);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pumpState: _Utils_update(
								pState,
								{drug: drug}),
							pkCompartmentState: newPkSt
						}),
					$elm$core$Platform$Cmd$none);
			case 'SetPumpRate':
				var rate = msg.a;
				var pState = model.pumpState;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pumpState: _Utils_update(
								pState,
								{
									currentRateMcgMin: A2($elm$core$Basics$max, 0.0, rate)
								})
						}),
					$elm$core$Platform$Cmd$none);
			case 'TogglePump':
				var pState = model.pumpState;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pumpState: _Utils_update(
								pState,
								{isRunning: !pState.isRunning})
						}),
					$elm$core$Platform$Cmd$none);
			case 'DeliverPumpBolus':
				var pkSt = model.pkCompartmentState;
				var updatedPkSt = _Utils_update(
					pkSt,
					{massCentral: pkSt.massCentral + 50000.0});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pkCompartmentState: updatedPkSt}),
					$elm$core$Platform$Cmd$none);
			case 'TriggerEmergencyVfib':
				var mgr = $author$project$Alarms$Manager$evaluateVitals($author$project$Dsp$Arrhythmia$VentricularFibrillation)(0.0)(0.0)(0.0)(0.0)(0.0)(0.0)(false)(model.currentTimeMs)(model.alarmManager);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{alarmManager: mgr, activeScenario: $author$project$Simulation$Scenarios$BaselineNominal}),
					$author$project$Ports$audioAlarm('CRISIS'));
			case 'TriggerEmergencyAsystole':
				var mgr = $author$project$Alarms$Manager$evaluateVitals($author$project$Dsp$Arrhythmia$Asystole)(0.0)(0.0)(0.0)(0.0)(0.0)(0.0)(false)(model.currentTimeMs)(model.alarmManager);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{alarmManager: mgr, activeScenario: $author$project$Simulation$Scenarios$BaselineNominal}),
					$author$project$Ports$audioAlarm('CRISIS'));
			case 'ResetNominal':
				var genCfg = model.generatorState.config;
				var updatedGenCfg = _Utils_update(
					genCfg,
					{stElevationMv: 0.0});
				var genSt = model.generatorState;
				var updatedGenSt = _Utils_update(
					genSt,
					{config: updatedGenCfg});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{alarmManager: $author$project$Alarms$Manager$emptyAlarmManager, activeScenario: $author$project$Simulation$Scenarios$BaselineNominal, generatorState: updatedGenSt}),
					$author$project$Ports$audioAlarm('MUTE'));
			case 'InboundTelemetry':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'PvModalMsg':
				var pvMsg = msg.a;
				switch (pvMsg.$) {
					case 'ClosePvModal':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{activeModal: $author$project$Main$NoModal}),
							$elm$core$Platform$Cmd$none);
					case 'AdjustContractility':
						var ees = pvMsg.a;
						var m = model.pvModel;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pvModel: _Utils_update(
										m,
										{eesMmHgPerMl: ees})
								}),
							$elm$core$Platform$Cmd$none);
					case 'AdjustPreload':
						var edv = pvMsg.a;
						var m = model.pvModel;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pvModel: _Utils_update(
										m,
										{targetEdvMl: edv})
								}),
							$elm$core$Platform$Cmd$none);
					default:
						var mapPress = pvMsg.a;
						var m = model.pvModel;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									pvModel: _Utils_update(
										m,
										{meanArterialPressureMmHg: mapPress})
								}),
							$elm$core$Platform$Cmd$none);
				}
			case 'VentViewMsg':
				var vMsg = msg.a;
				switch (vMsg.$) {
					case 'CloseVentilatorView':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{activeModal: $author$project$Main$NoModal}),
							$elm$core$Platform$Cmd$none);
					case 'SetVentMode':
						var mode = vMsg.a;
						var st = model.ventSettings;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ventSettings: _Utils_update(
										st,
										{mode: mode})
								}),
							$elm$core$Platform$Cmd$none);
					case 'AdjustVentRate':
						var rate = vMsg.a;
						var st = model.ventSettings;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ventSettings: _Utils_update(
										st,
										{respiratoryRateBpm: rate})
								}),
							$elm$core$Platform$Cmd$none);
					case 'AdjustVentPeep':
						var peep = vMsg.a;
						var st = model.ventSettings;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ventSettings: _Utils_update(
										st,
										{peepCmH2o: peep})
								}),
							$elm$core$Platform$Cmd$none);
					default:
						var vt = vMsg.a;
						var st = model.ventSettings;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ventSettings: _Utils_update(
										st,
										{tidalVolumeTargetMl: vt})
								}),
							$elm$core$Platform$Cmd$none);
				}
			case 'TrendsViewMsg':
				var tMsg = msg.a;
				if (tMsg.$ === 'CloseTrendsView') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{activeModal: $author$project$Main$NoModal}),
						$elm$core$Platform$Cmd$none);
				} else {
					var interval = tMsg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{trendInterval: interval}),
						$elm$core$Platform$Cmd$none);
				}
			case 'SpectrumModalMsg':
				var sMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{activeModal: $author$project$Main$NoModal}),
					$elm$core$Platform$Cmd$none);
			default:
				var eMsg = msg.a;
				switch (eMsg.$) {
					case 'CloseEhrModal':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{activeModal: $author$project$Main$NoModal}),
							$elm$core$Platform$Cmd$none);
					case 'SelectFormat':
						var fmt = eMsg.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{ehrFormat: fmt}),
							$elm$core$Platform$Cmd$none);
					default:
						var payload = eMsg.a;
						return _Utils_Tuple2(
							model,
							$author$project$Ports$exportEhr(
								$elm$json$Json$Encode$string(payload)));
				}
		}
	});
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$core$String$slice = _String_slice;
var $elm$core$String$length = _String_length;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {host: host, path: path, port_: port_, query: query, fragment: fragment, protocol: protocol};
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$core$String$contains = _String_contains;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$browser$Browser$element = _Browser_element;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Ports$streamIn = _Platform_incomingPort('streamIn', $elm$json$Json$Decode$value);
var $author$project$Main$FrameTick = function (a) {
	return {$: 'FrameTick', a: a};
};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {key: key, event: event};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var event = _v0.event;
		var key = _v0.key;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $author$project$Main$handleKeyDown = function (key) {
	switch (key) {
		case ' ':
			return $author$project$Main$TogglePause;
		case 'Escape':
			return $author$project$Main$CloseModals;
		case '1':
			return $author$project$Main$OpenModal($author$project$Main$Modal12Lead);
		case '2':
			return $author$project$Main$OpenModal($author$project$Main$ModalHemodynamics);
		case '3':
			return $author$project$Main$OpenModal($author$project$Main$ModalInfusionPump);
		case '4':
			return $author$project$Main$OpenModal($author$project$Main$ModalPvLoop);
		case '5':
			return $author$project$Main$OpenModal($author$project$Main$ModalVentilator);
		case '6':
			return $author$project$Main$OpenModal($author$project$Main$ModalTrends);
		case '7':
			return $author$project$Main$OpenModal($author$project$Main$ModalSpectrum);
		case '8':
			return $author$project$Main$OpenModal($author$project$Main$ModalEhrExport);
		case 'w':
			return $author$project$Main$ToggleWardView;
		case 'W':
			return $author$project$Main$ToggleWardView;
		default:
			return $author$project$Main$FrameTick(0.0);
	}
};
var $author$project$Main$InboundTelemetry = function (a) {
	return {$: 'InboundTelemetry', a: a};
};
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {subs: subs, oldTime: oldTime, request: request};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var oldTime = _v0.oldTime;
		var request = _v0.request;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var oldTime = _v0.oldTime;
		var subs = _v0.subs;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Main$FrameTick),
				$elm$browser$Browser$Events$onKeyDown(
				A2(
					$elm$json$Json$Decode$map,
					$author$project$Main$handleKeyDown,
					A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
				$author$project$Ports$streamIn($author$project$Main$InboundTelemetry)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, view: $author$project$Main$view, update: $author$project$Main$update, subscriptions: $author$project$Main$subscriptions});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));