// TODO: observable array
var dependencies = [], recording;

function resetDependencies(){
	recording = true;
	dependencies = [];
}

function stopRecording(){
	recording = false;
}

function record(observable){
	if(recording){
		dependencies.push(observable);
	}
}

function observable(data){
	var cell, subscribers = [];

	cell = function(value){
		var changed;

		if(arguments.length){
			changed = data !== value;
			data = value;

			if(changed){
				cell.notify(subscribers, data);
			}
		}

		record(cell);

		return data;
	};

	cell.subscribe = function(callback){
		subscribers.push(callback);

		return cell;
	};

	cell.unsubscribe = function(callback){
		var index = subscribers.indexOf(callback);

		if(index > -1){
			subscribers.splice(index, 1);
		}
	};
	
	cell.notify = function(){
		subscribers.forEach(function(callback){
			callback(data);
		});
	};

	cell.peek = function(){
		return data;
	};
	
	Object.keys(observable.fn).forEach(function(key){
		cell[key] = observable.fn[key].bind(null, cell);
	});

	return cell;
}

observable.fn = {
	filter: function(target, fn){
		var filtered = observable(), update;

		update = function(data){
			console.log('\n\n', data, fn(data), '\n\n');
			return fn(data) && filtered(data);
		};

		target.subscribe(update);
		update();

		return filtered;
	}
};

function computed(fn){
	var data = observable();

	resetDependencies();
	data(fn());
	stopRecording();

	dependencies.forEach(function(dependency){
		dependency.subscribe(function(){
			data(fn());
		});
	});

	return data;
}

exports.observable = observable;
exports.computed = computed;