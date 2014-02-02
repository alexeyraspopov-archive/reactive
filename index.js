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

function publish(subscribers, data){
	subscribers.forEach(function(callback){
		callback(data);
	});
}

// TODO: observable array
function observable(data){
	var cell, subscribers = [];

	cell = function(value){
		var changed;

		if(arguments.length){
			changed = data !== value;
			data = value;

			if(changed){
				publish(subscribers, data);
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