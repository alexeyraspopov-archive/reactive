'use strict';

var deps, recording;

function record(cell){
	if(recording && deps.indexOf(cell) < 0){
		deps.push(cell);
	}
}

function startRecord(start){
	deps = [];
	recording = true;
	start();
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
			changed = value !== newValue;
			value = newValue;

			if(changed){
				cell.notify(value);
			}
		}

		record(cell);

		return value;
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

	return cell;
};

exports.computed = function(read){
	var data = exports.observable();

	startRecord(read);

	getDeps().forEach(function(cell){
		cell.subscribe(function(value){
			data(value);
		});
	});

	return data;
};
