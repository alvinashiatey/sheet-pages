class HTMLElement {
	element = null;
	children = [];
	content = '';
	attr = {};
	classList = [];
	constructor(element) {
		this.element = element;
		return this;
	}
	/***
	 * @params {Object} attributes - create attributes attached to the element
	 */
	createAttribute(attributes) {
		for (let attr in attributes) {
			this.attr[attr] = value[attr];
		}
	}

	addClass(className) {
		this.classList.push(className);
		this.setAttribute('class', this.classList.join(' '));
		return this;
	}

	setAttribute(name, value) {
		this.attr[name] = value;
	}

	getAttribute(name) {
		return this.attr[name];
	}

	set textContent(content) {
		if (content instanceof HTMLElement) {
			throw new Error('Cannot set textContent to HTMLElement');
		} else {
			this.content = content;
		}
		return this;
	}

	set innerHTML(html) {
		this.content = html;
	}

	get innerHTML() {
		return this.content;
	}

	appendChild(element) {
		this.children.push(element);
	}

	render() {
		this.content += this.children.map(child => child.render()).join('');
		let returnAttrString = Object.keys(this.attr)
			.map(key => `${key}="${this.attr[key]}"`)
			.join(' ')
			.trim();
		if (this.isSelfClosing()) {
			return returnAttrString
				? `<${this.element} ${returnAttrString}>`
				: `<${this.element}>`;
		} else {
			return returnAttrString
				? `<${this.element} ${returnAttrString}>${this.content}</${this.element}>`
				: `<${this.element}>${this.content}</${this.element}>`;
		}
	}

	isSelfClosing() {
		let selfClosingTags = [
			'area',
			'base',
			'br',
			'col',
			'embed',
			'hr',
			'img',
			'input',
			'link',
			'meta',
			'param',
			'source',
			'track',
			'wbr'
		];
		return selfClosingTags.includes(this.element);
	}
}

class HTMLBuilder {
	elements = {};
	lang = 'en';
	constructor(options = {}) {
		this.elements = {};
		this.lang = options.lang || 'en';
		this.createBody();
		this.createHead();
	}

	#initialMeta() {
		let meta1 = this.createElement('meta');
		meta1.setAttribute('charset', 'utf-8');
		this.mainHead.appendChild(meta1);
		let meta2 = this.createElement('meta');
		meta2.setAttribute('name', 'viewport');
		meta2.setAttribute('content', 'width=device-width, initial-scale=1');
		this.mainHead.appendChild(meta2);
	}

	createHead() {
		this.mainHead = this.createElement('head');
		this.elements['head'] = this.mainHead;
		this.#initialMeta();
	}

	/**
	 * @param {String} title - title for the HTML document
	 */
	set title(val) {
		let titleElement = this.createElement('title');
		titleElement.textContent = val;
		this.head.appendChild(titleElement);
	}

	get title() {
		return this.elements['title'].innerHTML;
	}

	get head() {
		return this.elements['head'];
	}

	createBody() {
		this.mainBody = this.createElement('body');
		this.elements['body'] = this.mainBody;
	}

	get body() {
		return this.elements['body'];
	}

	createElement(tagName) {
		let element = new HTMLElement(tagName);
		this.elements[tagName] = element;
		return this.elements[tagName];
	}

	set style(path) {
		let link = this.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', path);
		this.head.appendChild(link);
	}

	getByClassName(className) {
		return this.elements['body'].children.filter(child =>
			child.classList.includes(className)
		);
	}

	getById(id) {
		return this.elements['body'].children.filter(
			child => child.attr.id === id
		);
	}

	compile() {
		return `<!DOCTYPE html>
                <html lang="${this.lang}">
                ${this.elements['head'] && this.elements['head'].render()}
                ${this.elements['body'].render()}
                </html>`;
	}
}

export { HTMLElement, HTMLBuilder };
