"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const Layer = require("amule").Layer;
const mysql = require("mysql");
const Connection = require("mysql/lib/Connection");

class Myro extends Layer {
	/**
	 *
	 * @param {Connection} connection
	 */
	constructor(connection) {
		super();
		/**
		 *
		 */
		if (!connection) {
			throw new TypeError("'connection' must be instance of 'mysql.Connection'");
		}
		this.connection = connection;
		this.tables = new Map();
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	_has(key, field, callback) {
		const sql = mysql.format("SELECT `id` FROM ?? WHERE `id`= ?", [
			key,
			field
		]);
		this.connection.query(sql, (err, results) => {
			callback(null, !!(!err && results.length));
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	_get(key, field, callback) {
		this._describe(key, (err, fields) => {
			if (err) {
				fields = []; // MARK IGNORE ERROR ?
			}
			const sql = mysql.format("SELECT * FROM ?? WHERE `id`= ?", [
				key,
				field
			]);
			this.connection.query(sql, (err, results) => {
				const row = results[0];
				if (!row || err) {
					return callback(err, null);
				}
				if (fields.length) {
					fields.forEach(field => { // TODO: OPT
						if (row.hasOwnProperty(field) && typeof row[field] === "string") {
							try {
								row[field] = JSON.parse(row[field]);
							} catch (e) {
								// MARK IGNORE ERROR?
							}
						}
					});
				}
				callback(null, row);
			});
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {*} row
	 * @param {function} callback
	 */
	_set(key, field, row, callback) {
		process.nextTick(() => callback(null, false));
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	_delete(key, field, callback) {
		process.nextTick(() => callback(null, false));
	}

	/**
	 * @param {function} callback
	 */
	_clear(callback) {
		process.nextTick(() => callback(null, false));
	}

	/**
	 *
	 * @param {string} table_name
	 * @param {function} callback
	 * @private
	 */
	_describe(table_name, callback) {
		const table = this.tables.get(table_name);
		if (table) {
			return callback(null, table);
		}
		this.connection.query("SHOW COLUMNS FROM ??", table_name, (err, res) => {
			if (err) {
				return callback(err);
			}
			const fields = res.filter(row => row.Type === "json").map(row => row.Field);
			this.tables.set(table_name, fields);
			callback(null, fields);
		});
	}
}

module.exports = Myro;
