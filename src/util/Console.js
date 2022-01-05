const { Console } = require('console');
const { inspect } = require('util');
const { mergeDefault } = require('./Util');
const constants = require('./Constants');
const Timestamp = require('./Timestamp');

class NucleusConsole extends Console {
    constructor(options = {}) {
        options = mergeDefault(constants.Defaults.Console, options);

        super(options.stdout, options.stderr, false);

        Object.defineProperty(this, 'stdout', { value: options.stdout });
        Object.defineProperty(this, 'stderr', { value: options.stderr });

        this.template = options.timestamps !== false ? new Timestamp(options.timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : options.timestamps) : null;
        this.utc = options.utc;
    }

    get timestamp() {
        return this.utc ? this.template.displayUTC() : this.template.display();
    }

    /**
	 * The timestamp to use
	 * @type {string}
	 * @private
	 */
	get timestamp() {
		return this.utc ? this.template.displayUTC() : this.template.display();
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {Array<*>} data The data we want to print
	 * @param {string} [type="log"] The type of log, particularly useful for coloring
	 * @private
	 */
	write(data, type = 'log') {
		type = type.toLowerCase();
		data = data.map(this.constructor._flatten).join('\n');
		const { time, message } = this.colors[type];
		const timestamp = this.template ? time.format(`[${this.timestamp}]`) : '';
		super[constants.DEFAULTS.CONSOLE.types[type] || 'log'](data.split('\n').map(str => `${timestamp} ${message.format(str)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	log(...data) {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	warn(...data) {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	error(...data) {
		this.write(data, 'error');
	}

	/**
	 * Calls a debug write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	debug(...data) {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	verbose(...data) {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	wtf(...data) {
		this.write(data, 'wtf');
	}

	/**
	 * Flattens our data into a readable string.
	 * @since 0.4.0
	 * @param {*} data Some data to flatten
	 * @returns {string}
	 * @private
	 */
	static _flatten(data) {
		if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
		if (typeof data === 'string') return data;
		if (typeof data === 'object') {
			const isArray = Array.isArray(data);
			if (isArray && data.every(datum => typeof datum === 'string')) return data.join('\n');
			return data.stack || data.message || inspect(data, { depth: Number(isArray), colors: Colors.useColors });
		}
		return String(data);
	}
}

module.exports = NucleusConsole;