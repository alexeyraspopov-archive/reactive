var recording, dependencies;

function startRecording(){
	recording = true;
	dependencies = [];
}

function stopRecording(){
	recording = false;
}

function observable(data){
	var observable, subscribers = [];

	observable = function(value){
		var changed;

		if(arguments.length){
			changed = data !== value;
			data = value;

			changed && subscribers.forEach(function(callback){
				callback(data);
			});
		}

		if(recording){
			dependencies.push(observable);
		}

		return data;
	};

	observable.subscribe = function(callback){
		subscribers.push(callback);

		return observable;
	};

	observable.unsubscribe = function(callback){
		var index = subscribers.indexOf(callback);

		if(index > -1){
			subscribers.splice(index, 1);
		}
	};

	observable.peek = function(){
		return data;
	};

	return observable;
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