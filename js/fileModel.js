
var app = app || {};
var ws = ws || {};

(function () {
	'use strict';

	var Utils = app.Utils;

	app.FileModel = function (key) {
		this.key = key;
		this.files = Utils.store(key);
		this.onChanges = [];
	};

	app.FileModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.FileModel.prototype.inform = function () {
		//Utils.store(this.key, this.files);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.FileModel.prototype.addfile = function (task) {
		this.files = this.files.concat({
			id: task.uuid,
			title: task.title,
			description: task.description,
			author: '',
			lastDate:'',
			state:task.state,
			editing: false ,
			achive: 0,
			writing_title: false,
			writing_desc: false,
		});

		this.inform();
	};

	app.FileModel.prototype.addnewfile = function (title, uuid){
		this.files = this.files.concat({
			id: uuid,
			title: title,
			description: '',
			author: '',
			lastDate:'',
			state:'0',
			editing: false ,
			achive: 0,
			writing_title: false,
			writing_desc: false,
		});
		this.inform();
	};

	app.FileModel.prototype.toggleAll = function (checked) {

		this.files = this.files.map(function (file) {
			return Utils.extend({}, file, {editing: checked});
		});

		this.inform();
	};

	app.FileModel.prototype.toggle = function (fileToToggle) {
		this.files = this.files.map(function (file) {
			return file !== fileToToggle ?
				file :
				Utils.extend({}, file, {editing: !file.editing});
		});

		this.inform();
	};

	app.FileModel.prototype.destroy = function (uuida) {


		this.files = this.files.filter(function (candidate) {
				if(candidate.id != uuida){
					return true;
				}

			return false;
		});

		this.inform();
	};

	app.FileModel.prototype.save = function (event) {
		this.files = this.files.map(function (file) {
			if(event.type == 'description'){
					if(file.id == event.uuid){
						file.description = event.value
					}
				}
					return file;
		});

		this.inform();
	};

})();
