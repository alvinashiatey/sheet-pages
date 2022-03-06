import path from 'path';
import dirHandler from './dirHandler.js';
import mediaHandler from './mediaHandler.js';
import templateEngine from './templateEngine.js';
import chalk from 'chalk';
import { HTMLBuilder } from './HTMLBuilder.js';
import style from './styles.js';
templateEngine.addShortcode('image', mediaHandler.imageShortCode);

// const elementConstructor = (arg, keys = null) => {
// 	let isLink = txt => txt.toLowerCase().includes('http');
// 	let elements = [];
// 	const elementCheck = key => {
// 		let val = '';
// 		let cls = getClassName(key);
// 		if (key.toLowerCase().includes('ignore')) {
// 			val = '';
// 		} else if (key.toLowerCase().includes('link')) {
// 			val = linkConstructor(arg[key]);
// 		} else if (key.toLowerCase().includes('image')) {
// 			val = imageConstructor(arg[key], cls);
// 		} else {
// 			if (isLink(key)) {
// 				val = linkConstructor(arg[key], cls);
// 			} else {
// 				val = paragraphConstructor(arg[key], cls);
// 			}
// 		}
// 		return val;
// 	};
// 	if (typeof arg === 'object' && arg !== null && keys !== null) {
// 		if (!keys.length) return null;
// 		for (let key of keys) {
// 			elements.push(elementCheck(key));
// 		}
// 		return elements;
// 	} else if (Array.isArray(arg)) {
// 		return arg.map(item => divConstructor(item));
// 	} else if (arg !== undefined) {
// 		return paragraphConstructor(arg);
// 	}
// 	return null;
// };

// const ulConstructor = arg => {
// 	if (typeof arg === 'object' && arg !== null) {
// 		let listKeys = dataFilter(arg).listKeys;
// 		if (listKeys.length > 0) {
// 			let returnArray = elementConstructor(arg, listKeys);
// 			let listWorkingArray = Array.isArray(returnArray[0])
// 				? zip(...returnArray)
// 				: returnArray;
// 			return `<ul>${listWorkingArray
// 				.map(list => `<li>${divConstructor(list, 'row')}</li>`)
// 				.join('')}</ul>`;
// 		}
// 	} else if (Array.isArray(arg)) {
// 		return `<ul>${arg
// 			.map(item => {
// 				return `<li>${divConstructor(item, 'row')}</li>`;
// 			})
// 			.join('')}</ul>`;
// 	} else if (arg !== undefined) {
// 		return `<ul><li class="row">${arg}</li></ul>`;
// 	}
// 	return null;
// };



// const getClassName = arg => {
// 	let className = arg.match(/\[class="?(.*?)"?\]/);
// 	if (className !== null) {
// 		return className[1];
// 	}
// 	return null;
// };

// const bodyConstructor = dataObject => {
// 	if (typeof dataObject === 'object' && dataObject !== null) {
// 		let body = '';
// 		let keys = Object.keys(dataObject);
// 		let filterKeys = keys.filter(
// 			key =>
// 				key.toLowerCase().includes('ul-') ||
// 				key.toLowerCase().includes('ol-') ||
// 				key.toLowerCase().includes('head-') ||
// 				key.toLowerCase().includes('header-') ||
// 				key.toLowerCase().includes('footer-') ||
// 				key.toLowerCase().includes('meta-')
// 		);

// 		let newKeys = keys.filter(
// 			key =>
// 				!filterKeys
// 					.map(name => name.toLowerCase())
// 					.includes(key.toLowerCase())
// 		);

// 		let otherElements = elementConstructor(dataObject, newKeys);
// 		let otherElementsWorkingArray = Array.isArray(otherElements[0])
// 			? zip(...otherElements)
// 			: otherElements;
// 		let block = '';
// 		otherElementsWorkingArray.forEach(element => {
// 			if (element !== null) {
// 				let div = '';
// 				div += divConstructor(element, 'row__el');
// 				block += divConstructor(div, 'el');
// 			}
// 		});
// 		body += `<div class="block__container"><div class="block">${block}</div></div>`;
// 		body += ulConstructor(dataObject) || '';
// 		return body;
// 	}
// };

// const buildHtml = (data, css) => {
// 	let html = new HTML();
// 	let body = '';
// 	let head = '';
// 	let header = '';
// 	if (!Array.isArray(data)) {
// 		if (typeof data === 'object' && data !== null) {
// 			head = headConstructor(data).head || '';
// 			header = headerConstructor(data) || '';
// 			body = bodyConstructor(data) || '';
// 		} else {
// 			body = data;
// 		}
// 	} else {
// 		let collapsedArray = collapseArray(data);
// 		head = headConstructor(collapsedArray).head || '';
// 		header = headerConstructor(collapsedArray) || '';
// 		body = bodyConstructor(collapsedArray) || '';
// 	}
// 	let cssInclude = css ? `<link rel="stylesheet" href="style.css">` : '';
// 	return `<!DOCTYPE html> <html> <head> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> ${head} ${cssInclude} </head><body><div class="container">${header} ${body}</div></body></html>`;
// };

// async function generateCSS(css) {
// 	try {
// 		if (!css) return;
// 		const styles = style.css;
// 		const filePath = path.join(DIR);
// 		const fileName = path.join(filePath, `style.css`);
// 		await dirHandler.createFile(fileName, styles);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// function handleCopyFiles() {
// 	let { copyFiles, outputPath } = config;
// 	if (copyFiles) {
// 		console.log('Copying files...');
// 		outputPath = outputPath || DIR;
// 		copyFiles.forEach(file => {
// 			dirHandler.copyFile(file, outputPath);
// 		});
// 	}
// }

// async function useTemplateEngine(templatePath, sheetName, data) {
// 	try {
// 		return templateEngine.render(templatePath, sheetName, data);
// 	} catch (e) {
// 		console.log(e);
// 	}
// }

// async function generateSingleHtml(data, css, directory, sheetName) {
// 	try {
// 		const filePath = path.join(directory);
// 		await dirHandler.createDirectory(filePath);
// 		let templatePath = path.join(DIR, `../${sheetName}.html`);
// 		let useEngine = dirHandler.checkIfExists(templatePath);
// 		const html = useEngine
// 			? await useTemplateEngine(templatePath, sheetName, data)
// 			: buildHtml(data, css);
// 		const fileName = path.join(filePath, `index.html`);
// 		await dirHandler.createFile(fileName, html).then(() => {
// 			console.log('HTML file generated!');
// 		});
// 		await generateCSS(css);
// 		handleCopyFiles();
// 	} catch (e) {
// 		console.log(e);
// 	}
// }

// async function generateMultipleHtml(data, css, directory, sheetName) {
// 	try {
// 		let links = [];
// 		let templatePath = path.join(DIR, `../${sheetName}.html`);
// 		let useEngine = dirHandler.checkIfExists(templatePath);
// 		for (let [index, doc] of data.entries()) {
// 			let p = doc[Object.keys(doc)[0]].split(' ').join('-');
// 			let filePath = path.join(directory, `${p}/`);
// 			await dirHandler.createDirectory(filePath);
// 			const html = useEngine
// 				? await useTemplateEngine(templatePath, sheetName, doc)
// 				: buildHtml(doc, css);
// 			links.push({ url: `/${p}/`, name: p });
// 			const fileName = path.join(filePath, `index.html`);
// 			await dirHandler.createFile(fileName, html).then(() => {
// 				console.log(
// 					'HTML file generated. Path:' + chalk.yellow(fileName)
// 				);
// 			});
// 		}
// 		handleCopyFiles();
// 	} catch (e) {
// 		console.log(e);
// 	}
// }

// export default async function (
// 	data,
// 	css = false,
// 	rows = false,
// 	sheetName = undefined,
// 	directory = DIR
// ) {
// 	if (data.length === 1 && !rows) {
// 		return generateSingleHtml(data[0], css, directory, sheetName);
// 	} else if (data.length > 1 && !rows) {
// 		return generateSingleHtml(data, css, directory, sheetName);
// 	} else if (data.length > 1 && rows) {
// 		return generateMultipleHtml(data, css, directory, sheetName);
// 	}
// }

class HtmlGenerator {
	outputPath = 'dist';
	constructor(
		options
	) {
		this.data = options.data;
		this.css = options.css || false;
		this.rows = options.rows || false;
		this.columns = options.columns || false;
		this.sheetName = options.sheetName;
		this.directory = options.directory || `${process.cwd()}/${this.outputPath}/`;
		this.config = options.config || {};
		console.log(this.config, this.css);
	}

	async engine(content) {
		let templatePath = path.join(
			this.directory,
			`../${this.sheetName}.html`
		);
		let useEngine = dirHandler.checkIfExists(templatePath);
		return useEngine
			? this.templateEngine(templatePath, this.sheetName, content)
			: this.buildHtml(content);
	}

	async buildHtml(content) {
		try {
			let val;
			let html = new HTMLBuilder();
			this.css &&
				(html.style = './style.css') &&
				(await this.#generateCSS());
			!Array.isArray(content)
				? (val = content)
				: (val = this.#collapsedArray(content));
			this.#handleHead(html, val);
			this.#setTitle(html, val);
			this.#handleHeader(html, val);
			this.#handleBody(html, val);
			return html.compile();
		} catch (e) {
			console.log(e);
		}
	}

	async templateEngine(templatePath, sheetName, data) {
		try {
			return templateEngine.render(templatePath, sheetName, data);
		} catch (e) {
			console.log(e);
		}
	}

	async generateSingleHtml() {
		try {
			const content = this.data.length === 1 ? this.data[0] : this.data;
			const filePath = path.join(this.directory);
			await dirHandler.createDirectory(filePath);
			const html = await this.engine(content);
			const fileName = path.join(filePath, `index.html`);
			await dirHandler.createFile(fileName, html).then(() => {
				console.log('HTML file generated!');
			});
			this.copyFiles();
		} catch (e) {
			console.log(e);
		}
	}

	async generateMultipleHtml() {
		try {
			for (let [index, doc] of this.data.entries()) {
				let p = doc[Object.keys(doc)[0]].split(' ').join('-');
				let filePath = path.join(this.directory, `${p}/`);
				await dirHandler.createDirectory(filePath);
				const html = await this.engine(doc);
				const fileName = path.join(filePath, `index.html`);
				await dirHandler.createFile(fileName, html).then(() => {
					console.log(
						'HTML file generated. Path:' + chalk.yellow(fileName)
					);
				});
			}
			this.copyFiles();
		} catch (e) {
			console.log(e);
		}
	}

	copyFiles() {
		let { copyFiles, outputPath } = this.config;

		if (copyFiles) {
			copyFiles.forEach(file => {
				let filePath = path.join(outputPath, file);
				dirHandler.copyFile(filePath, file);
			});
		}
	}

	#setTitle(html, data) {
		let keys = Object.keys(data);
		let hasTitle;
		keys.map(key => key.toLowerCase()).forEach(k => {
			if (k.includes('title')) return (hasTitle = true);
		});
		if (!hasTitle) {
			html.title = this.sheetName;
		}
	}


	#handleHead(html, data) {
		if (typeof data === 'object' && data !== null) {
			let headKeys = this.#filterKeys(data).headKeys;
			if (!headKeys.length) return;
			for (let key of headKeys) {
				if (this.#stringIncludes(key, 'title') && data[key] !== '') {
					if (data[key]) {
						html.title = Array.isArray(data[key])
							? data[key].join(' ').trim()
							: data[key];
					} else {
						html.title = this.sheetName;
					}
				} else {
					let keyName = key.toLowerCase().replace('meta-', '');
					let m = html.createElement('meta');
					m.setAttribute('name', keyName);
					let d = Array.isArray(data[key])
						? data[key].join(' ').trim()
						: data[key];
					m.setAttribute('content', d);
					html.head.appendChild(m);
				}
			}
		}
	}

	#handleTitle(html, data) {
		if (!data) return;
		let homeLink = html.createElement('a');
		homeLink.setAttribute('href', '/');
		let h1 = html.createElement('h1');
		let d = Array.isArray(data)
			? data.join(' ').trim()
			: data;
		h1.innerHTML = d;
		homeLink.appendChild(h1);
		return homeLink;
	}

	#handleHeader(html, data) {
		if (typeof data === 'object' && data !== null) {
			let headerKeys = this.#filterKeys(data).headerKeys;
			if (!headerKeys.length) return;
			let headerELement = html.createElement('header');
			for (let key of headerKeys) {
				if (this.#stringIncludes(key, 'title') && data[key] !== '') {
					let homeLink = this.#handleTitle(html, data[key]);
					headerELement.appendChild(homeLink);
				} else {
					let h = html.createElement('h1');
					let d = Array.isArray(data[key])
						? data[key].join(' ').trim()
						: data[key];
					h.innerHTML = d;
					headerELement.appendChild(h);
				}
			}
			html.body.appendChild(headerELement);
		}
	}

	#handleBody(html, data) {
		if (typeof data === 'object' && data !== null) {
			let bodyKeys = this.#filterKeys(data).bodyKeys;
			let listKeys = this.#filterKeys(data).listKeys;
			if (!bodyKeys.length) return;
			let bodyElement = html.createElement('main');
			let listElement = html.createElement('ul');
			for (let key of bodyKeys) {
				let el = this.#elementGenerator(html, data[key], key);
				if (Array.isArray(el)) el = el.join(' ');
				el && (bodyElement.innerHTML += el);
			}
			listKeys.length &&
				this.#handleListItems(html, data, listKeys, listElement);
			listKeys.length && bodyElement.appendChild(listElement);
			html.body.appendChild(bodyElement);
		}
	}

	#handleListItems(html, data, listKeys, listElement) {
		let listObject = listKeys.reduce((obj, list) => {
			return (obj[list] = data[list]), obj;
		}, {});
		let listZippedObjects = this.#zipObject(listObject);
		for (let list of listZippedObjects) {
			let listItem = this.#elementGenerator(html, list, listKeys);
			listElement.innerHTML += listItem.join('');
		}
	}

	#elementGenerator(html, data, keys) {
		let elements = [];
		if (Array.isArray(data) && keys !== null) {
			if (!data.length) return null;
			for (let item of data) {
				elements.push(this.#elementCheck(keys, item, html));
			}
			return elements;
		} else if (typeof data === 'string' && keys !== null) {
			return this.#elementCheck(keys, data, html);
		} else if (typeof data === 'object' && data !== null && keys !== null) {
			if (!keys.length) return null;
			for (let key of keys) {
				elements.push(this.#elementCheck(key, data[key], html));
			}
			return elements;
		}
	}

	#isLink(text) {
		return /^http/.test(text);
	}

	#elementCheck(key, data, html) {
		let val = '';
		let p = `${this.outputPath}/images/`;
		if (!data) return;
		if (key.toLowerCase().includes('ignore')) {
			return;
		} else if (key.toLowerCase().includes('link')) {
			let a = html.createElement('a');
			a.setAttribute('href', data);
			a.innerHTML = data;
			val = a.render();
		} else if (key.toLowerCase().includes('image')) {
			let img = html.createElement('img');
			mediaHandler.download(data, p);
			img.setAttribute('src', mediaHandler.filePathRelative);
			img.setAttribute('alt', '');
			val = img.render();
		} else {
			if (this.#isLink(data)) {
				let a = html.createElement('a');
				a.setAttribute('href', data);
				a.innerHTML = data;
				val = a.render();
			} else {
				let p = html.createElement('p');
				p.innerHTML = data;
				val = p.render();
			}
		}
		return val;
	}

	async #generateCSS() {
		try {
			if (!this.css) return;
			const styles = style.css;
			const filePath = path.join(this.directory);
			const fileName = path.join(filePath, `style.css`);
			await dirHandler.createFile(fileName, styles);
		} catch (err) {
			console.log(err);
		}
	}

	#stringIncludes(string, value) {
		return string.toLowerCase().includes(value);
	}

	#collapsedArray = array => {
		const result = {};
		const keys = Object.keys(array[0]);
		keys.forEach(key => {
			result[key] = [];
		});
		array.forEach(item => {
			for (const [k, value] of Object.entries(item)) {
				if (item[k] !== undefined) {
					result[k].push(value);
				}
			}
		});
		return result;
	};

	#zip(...arrays) {
		let zipped = [];
		for (let i = 0; i < arrays[0].length; i++) {
			if (!Array.isArray(zipped[i])) {
				zipped[i] = [];
			}
			for (const arr of arrays) {
				zipped[i].push(arr[i]);
			}
		}
		return zipped;
	}

	#zipObject(object) {
		let zipped = [];
		// take {a: [1,2,3], b: [4,5,6]} and return [{a:1,b:4}, {a:2,b:5}, {a:3,b:6}]
		for (let i = 0; i < object[Object.keys(object)[0]].length; i++) {
			let obj = {};
			for (const [key, value] of Object.entries(object)) {
				obj[key] = value[i];
			}
			zipped.push(obj);
		}
		return zipped;
	}

	#filterKeys(obj) {
		if (typeof obj === 'object' && obj !== null) {
			let keys = Object.keys(obj);
			let listKeys = keys.filter(
				key =>
					key.toLowerCase().includes('ul-') ||
					key.toLowerCase().includes('ol-')
			);
			let headerKeys = keys.filter(key =>
				key.toLowerCase().includes('header-')
			);
			let headKeys = keys.filter(
				key =>
					key.toLowerCase().includes('head-') ||
					key.toLowerCase().includes('meta-')
			);

			let bodyKeys = keys.filter(key => {
				return (
					!listKeys.includes(key) &&
					!headerKeys.includes(key) &&
					!headKeys.includes(key)
				);
			});

			return {
				listKeys,
				headerKeys,
				headKeys,
				bodyKeys
			};
		}
	}

	#flatten(array) {
		return array.reduce(
			(a, b) => a.concat(Array.isArray(b) ? this.#flatten(b) : b),
			[]
		);
	}

	#flattenObject = obj => {
		let result = {};
		for (let [key, value] of Object.entries(obj)) {
			if (typeof value === 'object') {
				result[key] = this.#flattenObject(value);
			} else {
				result[key] = value;
			}
		}
		return result;
	};

	async generate() {
		if (!this.rows || !this.columns) {
			return await this.generateSingleHtml();
		} else {
			return await this.generateMultipleHtml();
		}
	}
}

export default HtmlGenerator;
