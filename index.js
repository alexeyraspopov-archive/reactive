'use strict';

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

		return value;
	};

	subscribers = [];

	cell.subscribe = function(fn){
		if(subscribers.indexOf(fn) < 0){
			subscribers.push(fn);
		}

		return cell;
	};

	cell.unsubscribe = function(fn){
		var index = subscribers.indexOf(fn);

		if(index > -1){
			subscribers.splice(index, 1);
		}

		return cell;
	};

	cell.notify = function(data){
		subscribers.forEach(function(fn){
			fn(data);
		});

		return cell;
	};

	return cell;
};
