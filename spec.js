/* global describe, it */
'use strict';
var should, reactive;

should = require('should');
reactive = require('./index');

describe('observable', function(){
	it('should be a function', function(){
		reactive.observable().should.be.a.instanceOf(Function);
	});

	it('should save inital value', function(){
		var value, observable;

		value = 13;
		observable = reactive.observable(value);

		observable().should.be.exactly(value);
	});

	it('should save value when called with argument', function(){
		var value, observable;

		value = 13;
		observable = reactive.observable();

		observable(value);
		observable().should.be.exactly(value);
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

		wasCalled.should.be.exactly(true);
		wasCalledWith.should.be.exactly(value);
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

		wasCalled.should.be.exactly(false);
	});
});
