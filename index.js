/* jshint node:true */

'use strict';

var _ = require('lodash');
var monk = require('monk');
var wrap = require('co-monk');
var assert = require('assert');

function MongodbModel(name, collection) {
	assert(name && _.isString(name), 'A name is required to create a model');
	this.name = name;
	this.collection = collection;
}

MongodbModel.prototype.name = null;

MongodbModel.prototype.wipe = function *() {
	yield this.collection.remove({});
};

MongodbModel.prototype.insert = function *(task) {
	yield this.collection.insert(task);
	return task;
};

MongodbModel.prototype.update = function *(taskId, updates) {
	return yield this.collection.findAndModify(
		{ _id: taskId },
		{ $set: updates },
		{ new: true }
	);
};

MongodbModel.prototype.delete = function *(taskId) {
	var task = yield this.collection.findById(taskId);
	if (task) {
		yield this.collection.remove({ _id: taskId });
	}
	return task;
};

MongodbModel.prototype.findById = function *(taskId) {
	return yield this.collection.findById(taskId);
};

MongodbModel.prototype.findOne = function *(criteria, sort) {
	return (yield this.collection.find(criteria, { sort: sort, limit: 1 }))[0];
};

function MongoDb(url) {
	assert(url && _.isString(url), 'Mongodb URL required');
	this.db = monk(url);
	this.url = url;
	this.models = {};
}

MongoDb.prototype.db = null;

MongoDb.prototype.url = null;

MongoDb.prototype.models = null;

MongoDb.prototype.name = 'mongodb';

MongoDb.prototype.Model = MongodbModel;

MongoDb.prototype.model = function(name) {
	if (!this.models[name]) {
		var model = wrap(this.db.get(name));
		this.models[name] = new this.Model(name, model);
	}
	return this.models[name];
};

module.exports = function(url) {
	return new MongoDb(url);
};