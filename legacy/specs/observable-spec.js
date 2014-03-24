describe('observable', function(){
	var observable, subscriber, value;

	beforeEach(function(){
		observable = reactive.observable();
		subscriber = { fn: function(){} };
		value = 13;
	});

	it('should be a function', function(){
		expect(observable instanceof Function).toBeTruthy();
	});

	it('should save inital value', function(){
		var observable = reactive.observable(value);

		expect(observable()).toBe(value);
	});

	it('shoud save value when called with argument', function(){
		expect(observable()).toBeUndefined();
		observable(value);
		expect(observable()).toBe(value);
	});

	it('should publish value for subscribers', function(){
		spyOn(subscriber, 'fn');
		observable.subscribe(subscriber.fn);
		observable(value);
		expect(subscriber.fn).toHaveBeenCalledWith(value);
	});

	it('should remove subscriber', function(){
		spyOn(subscriber, 'fn');
		observable.subscribe(subscriber.fn);
		observable.unsubscribe(subscriber.fn);
		observable(value);
		expect(subscriber.fn).not.toHaveBeenCalled();
	});
	
	it('should have access to observable proto', function(){
		expect(reactive.observable.fn).toBeDefined();
	});
	
	// it('should extend observable from `fn` object', function(){
	// 	var prototype = reactive.observable.fn;
		
	// 	Object.keys(prototype).forEach(function(key){
	// 		expect(prototype[key] === observable[key]).toBeTruthy();
	// 	});
	// });
	
	describe('observable.fn.filter', function(){
		
		it('should update value to observer by condition', function(){
			var filterInstance = {
					filter: function(value){
						return true;
					}
				};
			
			// why `spyOn` don't return original function's value?
			// spyOn(filterInstance, 'filter');
			
			var filtered = observable.filter(filterInstance.filter);
			
			observable(value);
			
			// expect(filterInstance.filter).toHaveBeenCalledWith(value);
			expect(filtered()).toBe(value);
		});
	})
});