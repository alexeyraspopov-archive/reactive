reactive.fn.filter = function(observable, fn){
	return reactive.computed(function(){
		var data = observable();

		return fn(data) && data;
	});
};

reactive.fn.filter = function(observable, fn){
	var filtered = reactive.observable();

	var update = function(data){
		return fn(data) && filtered(data);
	};

	observable.subscribe(update);
	update();

	return filtered;
};

// not necessary for observable but needed for signals
reactive.fn.map = function(observable, fn){
	return reactive.computed(function(){
		return fn(observable());
	});
};

reactive.fn.merge = function(observableA, observableB){
	var result = reactive.observable();

	observableA.subscribe(result);
	observableB.subscribe(result);

	return result;
};

function eventAsStream(element, name){
	var stream = reactive.observable();

	element.addEventListener(name, stream);

	return stream;
}