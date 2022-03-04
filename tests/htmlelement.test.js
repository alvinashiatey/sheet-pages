// const { HTML, HTMLelement } = require('../utils/HTMLelement.js');
import { HTML, HTMLElement } from '../utils/HTML.js';

describe('HTML Class', function () {
	let el;
	beforeEach(function () {
		el = new HTML();
	});

	// it is instantiated with a body element
	it('is instantiated with a body element', function () {
		expect(el.body).toBeDefined();
	});

	// call the head from the HTML class
	it('creates head element', function () {
		el.title = 'test';
		expect(el.elements['head']).toBeDefined();
	});

	// assign an id and get it back
	it('assigns an id and get it back', function () {
		el.body.attr.id = 'test';
		expect(el.body.attr.id).toBe('test');
	});

	it('it creates a new element', function () {
		el.createElement('div').addClass('test');
		expect(el.elements['div']).toBeDefined();
		expect(el.elements['div'].element).toEqual('div');
		expect(el.elements['div'].children).toEqual([]);
		expect(el.elements['div'] instanceof HTMLElement).toBe(true);
	});

	// get div with class test
	it('it gets elements by class name', function () {
		let div = el.createElement('div');
		div.textContent = 'test';
		div.addClass('test');
		el.body.appendChild(div);
		expect(el.getByClassName('test')).toEqual([div]);
	});

	// set style path to 'test.css'
	it('it sets style path', function () {
		el.style = './test.css';
		let len = el.elements['head'].children.length;
		expect(el.elements['head'].children[len - 1].attr.href).toEqual(
			'./test.css'
		);
	});

	// create a p tag and add content 'Hello World'
	it('creates a new element with content', function () {
		el.createElement('p').textContent = 'Hello World';
		expect(el.elements['p']).toBeDefined();
		expect(el.elements['p'].element).toEqual('p');
		expect(el.elements['p'].content).toEqual('Hello World');
		expect(el.elements['p'] instanceof HTMLElement).toBe(true);
	});

	// return the content from the body
	it('returns the content from the body', function () {
		el.body.textContent = 'Hello World';
		expect(el.body.content).toEqual('Hello World');
	});
});
