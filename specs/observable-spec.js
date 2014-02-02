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
});