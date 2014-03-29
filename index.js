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

function stopRecord(){
	recording = false;
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

	startRecord();
	read();
	stopRecord();

	deps.forEach(function(cell){
		cell.subscribe(function(value){
			data(value);
		});
	});

	return data;
};
