/* global describe, it, expect */
'use strict';
var reactive = require('./index');

// TODO: use spyOn instead of flags

describe('observable', function(){
	it('should be a function', function(){
		expect(reactive.observable() instanceof Function).toBeTruthy();
	});

	it('should save inital value', function(){
		var value, observable;

		value = 13;
		observable = reactive.observable(value);

		expect(observable()).toBe(value);
	});

	it('should save value when called with argument', function(){
		var value, observable;

		value = 13;
		observable = reactive.observable();

		observable(value);
		expect(observable()).toBe(value);
	});

	it('should publish value for subscribers', function(){
		var value, observable, wasCalled, wasCalledWith;

		value = 13;
		observable = reactive.observable();
		wasCalled = false;

		observable.subscribe(function(newValue){
			wasCalled = true;
			wasCalledWith = newValue;
		});

		observable(value);

		expect(wasCalled).toBe(true);
		expect(wasCalledWith).toBe(value);
	});

	it('should remove subscriber', function(){
		var value, observable, wasCalled, subscriber;

		value = 13;
		observable = reactive.observable();
		wasCalled = false;

		subscriber = function(){
			wasCalled = true;
		};

		observable.subscribe(subscriber);
		observable.unsubscribe(subscriber);

		observable(value);

		expect(wasCalled).toBe(false);
	});
});

describe('computed', function(){
	it('should register used observables', function(){
		var value, observable, computed, read;

		value = 13;
		observable = reactive.observable(value);
		computed = reactive.computed(read = function(){
			return observable() + 2;
		});

		expect(computed()).toBe(read());
	});
});

describe('extenders', function(){
	it('should change notifier logic', function(){
		var value, count, observable;

		value = 13;
		count = 0;
		observable = reactive.observable().extend({ notify: 'always' });

		observable.subscribe(function(){
			count++;
		});

		observable(value);
		observable(value);

		expect(count).toBe(2);
	});
});
