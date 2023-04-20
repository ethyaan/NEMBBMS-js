import util from 'util';
import config from '../config.js';
/**
 * create logger class for debug purposes
 * @type Class
 */
const loggerModule = class logger {
	/**
	 * set allowed log level for showing
	 */
	constructor() {
		this._types = config.LOG_TYPES;
	}
	_types;

	/**
	 * log text with the color
	 * @param color
	 * @param text
	 * @private
	 */
	_colorizedLog(color, text) {
		const codes = util.inspect.colors[color];
		Array.prototype.unshift.call(text, `\x1b[${codes[0]}m`);
		Array.prototype.push.call(text, `\x1b[${codes[1]}m`);
		console.log.apply(console, text);
	}

	/**
	 * log the arguments with white color
	 */
	log() {
		this._processLog.apply(this, ['log', 'white', arguments]);
	}

	/**
	 * log the arguments with blue color
	 */
	info() {
		this._processLog.apply(this, ['info', 'blue', arguments]);
	}

	/**
	 * log the argument with yellow color
	 */
	warn() {
		this._processLog.apply(this, ['warn', 'yellow', arguments]);
	}

	/**
	 * log the arguments with red color
	 */
	error() {
		this._processLog.apply(this, ['error', 'red', arguments]);
	}

	/**
	 * log the arguments with green color
	 */
	success() {
		this._processLog.apply(this, ['success', 'green', arguments]);
	}

	/**
	 * log the arguments with cyan color
	 */
	validation() {
		this._processLog.apply(this, ['validation', 'cyan', arguments]);
	}

	/**
	 * check whether wich kind of log is allowed for show
	 * @param type
	 * @returns {boolean}
	 * @private
	 */
	_checkLevel(type) {
		return (this._types.indexOf(type) >= 0);
	}

	/**
	 * prepare argument for logging , check if logged valid
	 * @param color
	 * @param args
	 * @private
	 * @param type
	 */
	_processLog(type, color, args) {
		if (this._checkLevel(type)) {
			this._colorizedLog(color, args);
		}
	}
};

export const Logger = new loggerModule();
