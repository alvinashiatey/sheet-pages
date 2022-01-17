import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
const DIR = `${process.cwd()}/dist/`;

const styles = `body {font-family: 'Helvetica', sans-serif;font-size: 62.5%;line-height: 1.42857143;color: #333;background-color: #fff;font-size: 2rem;}.container {width: 90%;margin: 0 auto;}*:where(:not(iframe, canvas, img, svg, video):not(svg *, symbol *)) {all: unset;display: revert;}*, *::before, *::after {box-sizing: border-box;}a {cursor: revert;}ol, ul, menu {list-style: none;}img {max-width: 100%;}table {border-collapse: collapse;}textarea {white-space: revert;}:where([hidden]) {display: none;}:where([contenteditable]) {-moz-user-modify: read-write;-webkit-user-modify: read-write;overflow-wrap: break-word;-webkit-line-break: after-white-space;}:where([draggable='true']) {-webkit-user-drag: element;}`;

const collapseArray = arr => {
	const result = {};
	const keys = Object.keys(arr[0]);
	keys.forEach(key => {
		result[key] = [];
	});
	arr.forEach(item => {
		for (const [k, value] of Object.entries(item)) {
			if (item[k] !== '' && item[k] !== undefined) {
				result[k].push(value);
			}
		}
	});
	return result;
};

const zip = (...arrays) => {
	let zipped = [];
	for (let i = 0; i < arrays[0].length; i++) {
		if (!Array.isArray(zipped[i])) {
			zipped[i] = [];
		}
		for (const arr of arrays) {
			zipped[i].push(arr[i]);
		}
	}
	//flatten the array
	// return zipped.reduce((acc, val) => acc.concat(val), []);
	return zipped;
};

let divConstructor = el => {
	if (Array.isArray(el)) {
		return `<div>${el
			.map(item => {
				// check if item is not url
				if (item === undefined) return null;
				if (item.toLowerCase().includes('http')) {
					return item;
				} else {
					return `<p>${item}</p>`;
				}
			})
			.join('')}</div>`;
	} else {
		return `<div>${el}</div>`;
	}
};

const ulConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let keys = Object.keys(arg);
		let listKeys = keys.filter(
			key => key.includes('UL-') || key.includes('OL-')
		);
		let li = '';
		if (listKeys.length > 0) {
			let listArray = [];
			for (let liKey of listKeys) {
				if (liKey.toLowerCase().includes('image')) {
					listArray.push(
						arg[liKey].map(img => `<img src="${img}" alt="">`)
					);
				} else if (liKey.toLowerCase().includes('link')) {
					listArray.push(
						arg[liKey].map(
							link =>
								`<a href="${link}" target="_blank">${link}</a>`
						)
					);
				} else {
					listArray.push(arg[liKey]);
				}
			}
			let listWorkingArray = zip(...listArray);
			for (let liELement of listWorkingArray) {
				let div = '';
				div += divConstructor(liELement);
				li += `<li>${div}</li>`;
			}
			return `<ul>${li}</ul>`;
		}
	} else if (Array.isArray(arg)) {
		return `<ul>${arg
			.map(item => {
				return `<li>${divConstructor(item)}</li>`;
			})
			.join('')}</ul>`;
	} else if (arg !== undefined) {
		return `<ul><li>${arg}</li></ul>`;
	}
	return null;
};

const headConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let keys = Object.keys(arg);
		let headKeys = keys.filter(
			key =>
				key.toLowerCase().includes('head-') ||
				key.toLowerCase().includes('meta-')
		);
		// check if headKeys includes "title" or "description"
		let title = '';
		let description = '';
		let keywords = '';
		let meta = '';
		let head = '';
		if (headKeys.length > 0) {
			for (let headKey of headKeys) {
				if (headKey.toLowerCase().includes('title')) {
					if (arg[headKey] === undefined) return '';
					title = `<title>${arg[headKey]}</title>`;
				} else if (headKey.toLowerCase().includes('description')) {
					if (arg[headKey] === undefined) return '';
					description = `<meta name="description" content="${arg[headKey]}">`;
				} else if (headKey.toLowerCase().includes('keywords')) {
					if (arg[headKey] === undefined) return '';
					keywords = `<meta name="keywords" content="${arg[headKey]}">`;
				} else {
					if (arg[headKey] === undefined) return '';
					meta = `<meta name="${headKey}" content="${arg[headKey]}">`;
				}
			}
			head = `${title}${description}${keywords}${meta}`;
		}
		return head;
	}
};

const bodyConstructor = dataObject => {
	if (typeof dataObject === 'object' && dataObject !== null) {
		let body = '';
		let keys = Object.keys(dataObject);
		let filterKeys = keys.filter(
			key =>
				key.toLowerCase().includes('ul-') ||
				key.toLowerCase().includes('ol-') ||
				key.toLowerCase().includes('head-') ||
				key.toLowerCase().includes('meta-')
		);

		let newKeys = keys.filter(
			key =>
				!filterKeys
					.map(name => name.toLowerCase())
					.includes(key.toLowerCase())
		);
		let otherElements = newKeys.map(key => {
			if (key.toLowerCase().includes('image')) {
				return dataObject[key].map(img => `<img src="${img}" alt="">`);
			} else if (key.toLowerCase().includes('link')) {
				return dataObject[key].map(
					link => `<a href="${link}" target="_blank">${link}</a>`
				);
			} else {
				return dataObject[key];
			}
		});

		let otherElementsWorkingArray = Array.isArray(otherElements[0])
			? zip(...otherElements)
			: otherElements;
		let block = '';
		otherElementsWorkingArray.forEach(element => {
			let div = '';
			div += divConstructor(element);
			block += `<div class="el">${div}</div>`;
		});
		body += `<div class="block__container"><div class="block">${block}</div></div>`;
		body += ulConstructor(dataObject) || '';
		return body;
	}
};

const buildHtml = data => {
	let body = '';
	let head = '';
	if (!Array.isArray(data)) {
		if (typeof data === 'object' && data !== null) {
			head = headConstructor(data);
			body = bodyConstructor(data);
		} else {
			body = data;
		}
	} else {
		let collapsedArray = collapseArray(data);
		body = bodyConstructor(collapsedArray);
		head = headConstructor(collapsedArray);
	}
	return `<!DOCTYPE html> <html> <head> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> ${head} <style type="text/css">${styles}</style></head><body><div class="container">${body}</div></body></html>`;
};

const buildLinkedIndexPage = links => {
	let indexPage = '';
	indexPage += `<div class="index__container">`;
	for (let link of links) {
		indexPage += `<div class="link"><a href="${link.url}">${link.name}</a></div>`;
	}
	indexPage += `</div>`;
	let html = buildHtml(indexPage);
	const filePath = path.join(DIR);
	const fileName = path.join(filePath, `index.html`);
	fs.writeFile(fileName, html, function (err) {
		if (err) throw err;
	});
	return indexPage;
};

async function generateSingleHtml(data, directory) {
	const html = buildHtml(data);
	const filePath = path.join(directory);
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath, { recursive: true });
	}
	const fileName = path.join(filePath, `index.html`);
	fs.writeFile(fileName, html, function (err) {
		if (err) throw err;
		console.log('HTML file generated!');
	});
}

async function generateMultipleHtml(data, directory) {
	let links = [];
	for (let [index, doc] of data.entries()) {
		const html = buildHtml(doc);
		let p = doc[Object.keys(doc)[0]].split(' ').join('-');
		let filePath = path.join(directory, `${p}/`);
		links.push({ url: `/${p}/`, name: p });
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath, { recursive: true });
		}
		const fileName = path.join(filePath, `index.html`);
		fs.writeFile(fileName, html, function (err) {
			if (err) throw err;
			console.log('HTML file generated. Path:' + chalk.yellow(fileName));
		});
	}
	buildLinkedIndexPage(links);
}

export default async function (data, rows = false, directory = DIR) {
	if (data.length <= 1 && data.length !== 0 && !rows) {
		return generateSingleHtml(data[0], directory);
	} else if (data.length > 1 && !rows) {
		return generateSingleHtml(data, directory);
	} else if (data.length > 1 && rows) {
		return generateMultipleHtml(data, directory);
	}
}
