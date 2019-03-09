class Util {
	constructor() {
		throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
	}

	/**
	 * Generates a random integer between [min, max] (included).
	 * @param {number} min Minimum threshold
	 * @param {number} max Maximum threshold
	 * @returns {number} The randomized integer
	 */
	static rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * Clamps a value to ensure it sits within a designated range.
	 *
	 * Called with no arguments, this function returns a value to fall
	 * between 0 - 1, offering a useful shorthand for validating multipliers.
	 *
	 * @param {number} input Value to operate upon
	 * @param {number} min Lower threshold; defaults to 0
	 * @param {number} max Upper threshold; defaults to 1
	 * @return {number}
	 */
	static clamp(input, min, max) {
		return Math.min(Math.max(input, min || 0), undefined === max ? 1 : max);
	}

	/**
	 * Gets a random element from an iterable object, which can be:
	 * * A string
	 * * An Array
	 * * A Set or Map object
	 *
	 * The object can also be non-iterable:
	 * * A boolean: in this case, if it's true, it returns 0 or 1. If it's false, it always returns 0.
	 * * A number: in this case, it returns a random integer between 0 and the given number non-included.
	 *
	 * @param {boolean|number|string|Array|Set|Map} data The iterable to randomize
	 * @returns {*} An element chosen at random *(returns 'null' if found nothing)*
	 */
	static random(data) {
		if (typeof data === 'boolean') {
			if (data) return Util.rand(0, 1);
			else return 0;
		}
		else if (typeof data === 'number') {
			return Math.floor(Math.random() * data);
		}
		else if (typeof data === 'string') {
			return data[Math.floor(Math.random() * data.length)];
		}
		else if (data instanceof Array) {
			return data[Math.floor(Math.random() * data.length)];
		}
		else if (data instanceof Set) {
			return [...data][Math.floor(Math.random() * data.size)];
		}
		else if (data instanceof Map) {
			const index = Math.floor(Math.random() * data.size);
			let cntr = 0;
			for (const key of data.keys()) {
				if (cntr++ === index) return data.get(key);
			}
		}
		return null;
	}

	/**
	 * Generates a string of random alphanumeric characters.
	 * @param {number} [length=4] Number of characters to return
	 */
	static randomID(length = 4) {
		return Math.random().toString(36).substr(2, (length || 4) + 2);
	}

	/**
	 * Calculates the modulus, the remainder of an integer division.
	 * @deprecated Use operator '%' instead.
	 * @param {number} dividend Dividend
	 * @param {number} divisor Divisor
	 * @returns {number}
	 */
	static mod(dividend, divisor) {
		return dividend - divisor * Math.floor(dividend / divisor);
	}

	/**
	 * Adds leading zeros when necessary.
	 * @param {number} value The number being formatted
	 * @param {number} min The minimum required length of the formatted number
	 * @returns {string}
	 */
	static zeroise(value, min) {
		let val = value.toString();
		if (val.length < min) val = Array(min - val.length + 1).join('0') + val;
		return val;
	}

	/**
	 * Capitalizes the first letter of a string.
	 * @param {string} str The string to process
	 * @returns {string} The processed string
	 */
	static capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Lowers the first character of a string.
	 * @param {string} str The string to process
	 * @returns {string} The processed string
	 */
	static strLcFirst(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	/**
	 * Transforms a camelCase string into a normal one with spaces.
	 * @param {string} str The string to process
	 * @returns {string} The processed string
	 */
	static strCamelToNorm(str) {
		str = str.replace(/([A-Z])/g, ' $1');
		return Util.capitalize(str);
	}

	/**
	 * Converts a kebab-cased-string into a camelCasedString.
	 * @param {string} input
	 * @return {string}
	 */
	static kebabToCamelCase(input) {
		return input.toLowerCase().replace(/([a-z])-+([a-z])/g, function(match, a, b) {
			return a + b.toUpperCase();
		});
	}

	/**
	 * Converts a camelCased string to its kebab-cased equivalent.
	 * Hilariously-named function entirely coincidental.
	 * @param {string} string camelCasedStringToConvert
	 * @return {string} input-string-served-in-kebab-form
	 */
	static camelToKebabCase(string) {
		// Don't bother trying to transform a string that isn't well-formed camelCase.
		if(!/^([a-z]+[A-Z])+[a-z]+$/.test(string)) return string;

		return string.replace(/([a-z]+)([A-Z])/g, (match, before, after) => {
			return before + '-' + after;
		}).toLowerCase();
	}

	/**
	 * Aligns a string by padding it with leading/trailing whitespace.
	 * @param {string} input
	 * @param {number} width Character width of the container
	 * @param {number} axis Multiplier specifying axis of alignment:
	 * * 0.0: Left-aligned
	 * * 0.5: Centred
	 * * 1.0: Right-aligned
	 * * The default is 0.5 (centre-aligned).
	 * @param {string} char Chracter to pad with. Defaults to space (U+0020)
	 * @return {string}
	 */
	static alignText(input, width, axis, char) {
		axis = undefined === axis ? 0.5 : axis;
		char = char || ' ';
		const emptySpace = width - input.length;

		// Returns early if there's nothing to do here.
		if (emptySpace < 1) return input;

		const left = emptySpace * axis;
		const right = emptySpace - left;

		return char.repeat(Math.round(left)) + input + char.repeat(Math.round(right));
	}

	/**
	 * Wraps a string to a specified line length.
	 *
	 * Words are pushed onto the following line, unless they exceed the line's total length limit.
	 *
	 * @param {string} input Block of text to wrap
	 * @param {number} len Number of characters permitted on each line.
	 * @return {string[]} An array of fold points, preserving any new-lines in the original text.
	 */
	static wordWrap(input, len) {
		const length = len || 80;
		const output = [];
		for (let i = 0, l = input.length; i < l; i += length) {
			let match, nl;
			let segment = input.substring(i, i + length);

			// Segment contains at least one newline.
			if ((nl = segment.lastIndexOf('\n')) !== -1) {
				output.push(segment.substring(0, nl + 1));
				segment = segment.substring(nl + 1);
			}

			// We're attempting to cut on a non-whitespace character. Do something.
			if (/\S/.test(input[(i + length) - 1]) && (match = segment.match(/\s(?=\S+$)/))) {
				output.push(segment.substr(0, i + length > l ? l : (match.index + 1)));
				i = (i - (match.input.length - match.index)) + 1;
			}
			else {
				output.push(segment);
			}
		}
		return output;
	}

	/**
	 * Rolls and sums the results of several D6.
	 * @param {number} nb How many D6 to roll
	 * @returns {number} Added results
	 */
	static sumD6(nb) {
		let result = 0;
		for (let i = 0; i < nb; i++) {
			result += Util.rand(1, 6);
		}
		return result;
	}

	/**
	 * Rolls a D666.
	 * @returns {number}
	 */
	static rollD666() {
		return Util.rand(1, 6) * 100 + Util.rand(1, 6) * 10 + Util.rand(1, 6);
	}

	/**
	 * Rolls a D66.
	 * @returns {number}
	 */
	static rollD66() {
		return Util.rand(1, 6) * 10 + Util.rand(1, 6);
	}

	static mapToJson(map) {
		return JSON.stringify([...map]);
	}
	static jsonToMap(jsonStr) {
		return new Map(JSON.parse(jsonStr));
	}

	/**
	 * Generates roll intervals for a seeded table.
	 * @param {number} count Number of entries
	 * @param {number} max Maximum size of the table.
	 * * D66 = 36
	 * * D666 = 216
	 * @returns {number[number[]]} An Array of intervals, which are arrays with [min, max]
	 */
	static createIntervals(count, max) {
		const interval = Math.floor(max / count);
		const mod = max % count;
		const intervals = [];
		const cap = max - mod;
		for (let i = 1; i <= cap; i++) {

			if (i % interval === 0) {
				const a = i + 1 - interval;
				const b = (i === cap) ? max : i;
				intervals.push([a, b]);
			}
		}

		return intervals;
	}

	/**
	 * Converts an integer to bijective (custom base) notation.
	 * @param {number} int A positive integer above zero
	 * @param {?string} [seq='123456'] Custom base (default is base-6)
	 * @return {string} The number's value expressed in bijective custom base
	 */
	static convertToBijective(int, seq) {
		const sequence = seq || '123456';
		const length = sequence.length;

		if (int <= 0) return int;
		if (int <= length) return sequence[int - 1];

		let index = (int % length) || length;
		const result = [sequence[index - 1]];

		while ((int = Math.floor((int - 1) / length)) > 0) {
			index = (int % length) || length;
			result.push(sequence[index - 1]);
		}

		return result.reverse().join('');
	}

	/**
	 * Checks if is a number.
	 * @param {*} x Value to check
	 * @returns {boolean}
	 */
	static isNumber(x) {
		if (typeof x === 'number') return true;
		if (/^0x[0-9a-f]+$/i.test(x)) return true;
		return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x));
	}

	/**
	 * Checks if is an Object.
	 * Does not count Arrays.
	 * @param {*} val Value to check
	 * @returns {boolean}
	 */
	static isObject(val) {
		if (val === null) return false;
		if (val instanceof Array) return false;
		return ((typeof val === 'function') || (typeof val === 'object'));
	}

	/**
	 * Gets or sets the value of a cookie with the designated name.
	 * @param {string} name Cookie's name
	 * @param {string} value Value to assign to cookie. Passing NULL deletes the cookie.
	 * @param {Object} options An object literal containing optional parameters to use when setting the cookie (expires/path/domain/secure).
	 * @return {string} The cookie's existing value if a value wasn't passed to the function.
	 */
	static cookie(name, value, options) {
		let cutoff, i, l, expires,
			// eslint-disable-next-line no-undef
			cookies = document.cookie;
		const rSplit = /;\s*/g,
			output = {},
			decode = decodeURIComponent;

		// If called without any arguments, or if an empty value's passed as our name parameter,
		// return a hash of EVERY available cookie.
		if (!name) {
			for (cookies = cookies.split(rSplit), i = 0, l = cookies.length; i < l; ++i) {
				if (cookies[i] && (cutoff = cookies[i].indexOf('='))) {
					output[cookies[i].substr(0, cutoff)] = decode(cookies[i].substr(cutoff + 1));
				}
			}
			return output;
		}

		/** Getter */
		if (undefined === value) {
			for (cookies = cookies.split(rSplit),
			cutoff = name.length + 1,
			i = 0,
			l = cookies.length;
				i < l; ++i) {
				if (name + '=' === cookies[i].substr(0, cutoff)) {
					return decode(cookies[i].substr(cutoff));
				}
			}
			return null;
		}

		/** Setter */
		else {
			options = options || {};
			expires = options.expires;

			/** Delete a cookie */
			if (value === null) value = '', expires = -1;

			if (expires) {
				// If we weren't passed a Date instance as our expiry point,
				// typecast the expiry option to an integer and use as a number of days from now.
				expires = (!expires.toUTCString ? new Date(Date.now() + (86400000 * expires)) : expires).toUTCString();
			}

			// eslint-disable-next-line no-undef
			document.cookie = name + '=' + encodeURIComponent(value) + (expires ? '; expires=' + expires : '')
				+ (options.path ? '; path=' + options.path : '')
				+ (options.domain ? '; domain=' + options.domain : '')
				+ (options.secure ? '; secure' : '');
		}
	}

	/** @deprecated */
	static parseInt(number, base) {
		const result = [];
		while (number > 0) {
			result.push(number % base);
			number = Math.floor(number / base);
		}
		return +result.reverse().join('');
	}
}

module.exports = Util;

/**
 * Regular Expression IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expression.
 * Note: This will not match on objects.
 * @param {RegExp} rx The regular expression to test with. E.g. /-ba/gim
 * @returns {number} -1 means not found
 */
if (typeof Array.prototype.regIndexOf === 'undefined') {
	Array.prototype.regIndexOf = function(rx) {
		for (const i in this) {
			if (this[i].toString().match(rx)) {
				return Number(i);
			}
		}
		return -1;
	};
}

/**
 * Regular Expression includes for Arrays.
 * @param {RegExp} rx The regular expression to test with.
 * @returns {boolean}
 */
if (typeof Array.prototype.regIncludes === 'undefined') {
	Array.prototype.regIncludes = function(rx) {
		return this.regIndexOf(rx) >= 0;
	};
}