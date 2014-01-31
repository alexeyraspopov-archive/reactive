var dependencies = [];

function resetDependencies(){
	dependencies = [];
}

function publish(subscribers, data){
	subscribers.forEach(function(callback){
		callback(data);
	});
}

// TODO: observable array
function observable(data){
	var cell, subscribers = [];

	// subscribable?
	cell = function(value){
		var changed;

		if(arguments.length){
			changed = data !== value;
			data = value;

			if(changed){
				publish(subscribers, data);
			}
		}

		dependencies.push(cell);

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

	dependencies.forEach(function(dependency){
		dependency.subscribe(function(){
			data(fn());
		});
	});

	return data;
}

exports.observable = observable;
exports.computed = computed;