describe('computed', function(){
	var observable, subscriber, value;

	beforeEach(function(){
		observable = reactive.observable();
		subscriber = { fn: function(){
			return observable();
		} };
		value = 13;
	});

	it('should call fn on create', function(){
		spyOn(subscriber, 'fn');
		reactive.computed(subscriber.fn);
		expect(subscriber.fn).toHaveBeenCalled();
	});

	it('should compute value when dependencies were changed', function(){
		var computed = reactive.computed(subscriber.fn);

		observable(value);
		expect(computed()).toBe(value);
		expect(computed()).toBe(subscriber.fn());
	});
});