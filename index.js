var recording, dependencies;

function startRecording(){
	recording = true;
	dependencies = [];
}

function record(cell){
	if(recording){
		dependencies.push(cell);
	}
}

function stopRecording(){
	recording = false;
}

function observable(data){
	var cell, publish, subscribers = [];

	publish = function(data){
		subscribers.forEach(function(callback){
			callback(data);
		});
	};

	cell = function(value){
		var changed;

		if(arguments.length){
			changed = data !== value;
			data = value;

			if(changed){
				publish(data);
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

	cell.peek = function(){
		return data;
	};

	return cell;
}

function computed(fn){
	var data = observable();

	startRecording();
	data(fn());
	stopRecording();

	dependencies.forEach(function(dependency){
		dependency.subscribe(function(value){
			data(fn());
		});
	});

	return data;
}

exports.observable = observable;
exports.computed = computed;