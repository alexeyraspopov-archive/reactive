'use strict';

var deps, recording;

function record(cell){
	if(recording && deps.indexOf(cell) < 0){
		deps.push(cell);
	}
}

function startRecord(){
	deps = [];
	recording = true;
}

function getDeps(){
	recording = false;

	return deps;
}

exports.observable = function(value){
	var cell, subscribers;

	cell = function(newValue){
		var changed;

		if(arguments.length){
			changed = cell.comparator(value, newValue);
			value = newValue;

			if(changed){
				cell.notify(value);
			}
		}

		record(cell);

		return value;
	};

	cell.comparator = function(value, newValue){
		return value !== newValue;
	};

	subscribers = [];

	cell.subscribe = function(fn){
		if(subscribers.indexOf(fn) < 0){
			subscribers.push(fn);
		}
	};

	cell.unsubscribe = function(fn){
		var index = subscribers.indexOf(fn);

		if(index > -1){
			subscribers.splice(index, 1);
		}
	};

	cell.notify = function(data){
		subscribers.forEach(function(fn){
			fn(data);
		});
	};

	cell.extend = function(options){
		Object.keys(options).filter(function(key){
			return exports.extenders.hasOwnProperty(key);
		}).forEach(function(key){
			exports.extenders[key](cell, options[key]);
		});

		return cell;
	};

	return cell;
};

exports.computed = function(read){
	var data = exports.observable();

	startRecord();
	data(read());

	getDeps().forEach(function(cell){
		cell.subscribe(function(){
			data(read());
		});
	});

	return data;
};

exports.extenders = {
	notify: function(cell, option){
		cell.comparator = option === 'always' ? function(){
			return true;
		} : cell.comparator;
	}
};
