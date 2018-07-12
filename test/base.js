/* global describe, it, beforeEach */
"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require("amule");
const Myro = require("../");
const assert = require("assert");
const mysql = require("mysql");
let client;
describe("CRUD", () => {
	let connection;
	before((done) => {
		connection = mysql.createConnection({
			host: "192.168.0.200",
			user: "root",
			password: "root",
			database: "ponury"
		});
		connection.connect(done);
	});
	after(async () => {
		connection.end();
	});
	beforeEach((done) => {
		connection.query("TRUNCATE `tbl`", (err) => {
			done(err);
		});
	});
	it("has", (done) => {
		let mule = new AMule();
		mule.use(new Myro(connection));
		mule.has("tbl", 42, function (err, has) {
			assert.strictEqual(err, null);
			assert.strictEqual(has, false);
			connection.query("INSERT INTO `tbl` SET `id`=42, `value`='value'", (err) => {
				if (err) {
					return done(err);
				}
				mule.has("tbl", 42, function (err, has) {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
	});
	it("set", (done) => {
		let mule = new AMule();
		mule.use(new Myro(connection));
		mule.set("tbl", 42, {value: "value"}, (err) => {
			assert.strictEqual(err, null);
			mule.has("tbl", 42, (err, has) => {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				done();
			});
		});
	});
	it("get", (done) => {
		let mule = new AMule();
		mule.use(new Myro(connection));
		mule.has("tbl", 42, function (err, has) {
			assert.strictEqual(err, null);
			assert.strictEqual(has, false);
			connection.query("INSERT INTO `tbl` SET `id`=42, `value`='value'", (err) => {
				if (err) {
					return done(err);
				}
				mule.get("tbl", 42, function (err, res) {
					assert.strictEqual(err, null);
					assert.strictEqual(res.value, "value");
					done();
				});
			});
		});
	});
	it("get json type", (done) => {
		let mule = new AMule();
		const json = {a:1,b:true,c:null,d:[1,2.3,4,{}]};
		mule.use(new Myro(connection));
		mule.has("tbl_json", 42, function (err, has) {
			assert.strictEqual(err, null);
			assert.strictEqual(has, false);
			connection.query("INSERT INTO `tbl_json` SET `id`=42, `value`='" + JSON.stringify(json) + "'", (err) => {
				if (err) {
					return done(err);
				}
				mule.get("tbl_json", 42, function (err, res) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(res.value, json);
					done();
				});
			});
		});
	});
	it("delete with readOnly:true", (done) => {
		let mule = new AMule();
		mule.use(new Myro(connection));
		connection.query("INSERT INTO `tbl` SET `id`=42, `value`='value'", (err) => {
			if (err) {
				return done(err);
			}
			mule.has("tbl", 42, (err, has) => {
				assert.strictEqual(err, null);
				assert.strictEqual(has, true);
				mule.delete("tbl", 42, function (err) {
					assert.strictEqual(err, null);
					mule.has("tbl", 42, (err, has) => {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					});
				});
			});
		});
	});
	it("clear with readOnly:true", (done) => {
		let mule = new AMule();
		mule.use(new Myro(connection));
		connection.query("INSERT INTO `tbl` SET `id`=42, `value`='value'", (err) => {
			if (err) {
				return done(err);
			}
			mule.has("tbl", 42, (err, has) => {
				assert.strictEqual(err, null);
				assert.strictEqual(has, true);
				mule.clear(function (err) {
					assert.strictEqual(err, null);
					mule.has("tbl", 42, (err, has) => {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					});
				});
			});
		});
	});
	it("stats", (done) => {
		let mule = new AMule();
		const more = new Myro(connection);
		mule.use(more);
		mule.get("tbl", 42, function (err, value) {
			assert.strictEqual(err, null);
			assert.strictEqual(value, null);
			const stats = more.getStats();
			assert.strictEqual(stats.misses, 1);
			assert.strictEqual(stats.ratio, 0);
			assert.strictEqual(stats.hits, 0);
			connection.query("INSERT INTO `tbl` SET `id`=42, `value`='value'", (err) => {
				if (err) {
					return done(err);
				}
				assert.strictEqual(err, null);
				mule.get("tbl", 42, function (err, val) {
					assert.strictEqual(err, null);
					assert.strictEqual(val.value, "value");
					let stats = more.getStats(true);
					assert.strictEqual(stats.misses, 1);
					assert.strictEqual(stats.ratio, 0.5);
					assert.strictEqual(stats.hits, 1);
					stats = more.getStats();
					assert.strictEqual(stats.misses, 0);
					assert(Number.isNaN(stats.ratio));
					assert.strictEqual(stats.hits, 0);
					done();
				});
			});
		});
	});
});

