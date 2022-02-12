import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
const DIR = `${process.cwd()}/dist/`;
import style from './styles.js';

const styles = style.css;

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

const dataFilter = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let keys = Object.keys(arg);
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
		return {
			listKeys,
			headerKeys,
			headKeys
		};
	}
};

let divConstructor = (el, cls = '') => {
	let clsName = cls !== '' ? ` class="${cls}"` : '';
	if (Array.isArray(el)) {
		return `<div ${clsName}>${el
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
		return `<div ${clsName}>${el}</div>`;
	}
};

const ulConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let listKeys = dataFilter(arg).listKeys;
		let li = '';
		if (listKeys.length > 0) {
			let listArray = [];
			for (let liKey of listKeys) {
				if (liKey.toLowerCase().includes('image')) {
					listArray.push(imageConstructor(arg[liKey]));
				} else if (liKey.toLowerCase().includes('link')) {
					listArray.push(linkConstructor(arg[liKey]));
				} else {
					listArray.push(arg[liKey]);
				}
			}
			let listWorkingArray = zip(...listArray);
			for (let liELement of listWorkingArray) {
				let div = '';
				div += divConstructor(liELement, 'row');
				li += `<li>${div}</li>`;
			}
			return `<ul>${li}</ul>`;
		}
	} else if (Array.isArray(arg)) {
		return `<ul>${arg
			.map(item => {
				return `<li>${divConstructor(item, 'row')}</li>`;
			})
			.join('')}</ul>`;
	} else if (arg !== undefined) {
		return `<ul><li class="row">${arg}</li></ul>`;
	}
	return null;
};

const headerConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let headerKeys = dataFilter(arg).headerKeys;
		if (headerKeys.length > 0) {
			let div = '';
			for (let headerKey of headerKeys) {
				let headerArray = arg[headerKey];
				let headerWorkingArray = Array.isArray(headerArray[0])
					? zip(...headerArray)
					: headerArray;
				if (Array.isArray(headerWorkingArray)) {
					for (let headerELement of headerWorkingArray) {
						if (headerKey.toLowerCase().includes('title')) {
							div += divConstructor(
								`<a href='/'><h1>${headerELement}</h1></a>`,
								headerKey.split('-')[1]
							);
						} else {
							div += divConstructor(
								headerELement,
								headerKey.split('-')[1]
							);
						}
					}
				} else {
					div += divConstructor(
						`<a href='/'><h1>${headerWorkingArray}</h1></a>`,
						headerKey.split('-')[1]
					);
				}
			}
			let header = `<header>${div || ''}</header>`;
			return header;
		}
	} else if (arg !== undefined) {
		return `<header><div>${arg || ''}</div></header>`;
	}
	return null;
};

const headConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let headKeys = dataFilter(arg).headKeys;
		// check if headKeys includes "title" or "description"
		let values = {};
		if (headKeys.length > 0) {
			for (let headKey of headKeys) {
				if (headKey.toLowerCase().includes('title')) {
					if (arg[headKey] === undefined) return '';
					values.title = arg[headKey];
				} else if (headKey.toLowerCase().includes('description')) {
					if (arg[headKey] === undefined) return '';
					values.description = `<meta name="description" content="${arg[headKey]}">`;
				} else if (headKey.toLowerCase().includes('keywords')) {
					if (arg[headKey] === undefined) return '';
					values.keywords = `<meta name="keywords" content="${arg[headKey]}">`;
				} else {
					if (arg[headKey] === undefined) return '';
					values.meta = `<meta name="${headKey}" content="${arg[headKey]}">`;
				}
			}
			values.head = `<title>${values.title || ''}</title>${
				values.description || ''
			}${values.keywords || ''}${values.meta || ''}`;
		}
		return values;
	}
};

const imageConstructor = arg => {
	let tag = '';
	if (Array.isArray(arg)) {
		return arg.map(item => {
			tag = `<img src="${item}" alt="">`;
			return divConstructor(tag, 'row__image');
		});
	} else if (arg !== undefined) {
		tag = `<img src="${arg}" alt="">`;
		return divConstructor(tag, 'row__image');
	}
	return null;
};

const linkConstructor = arg => {
	if (Array.isArray(arg)) {
		return arg.map(item => {
			return `<a href="${item}" target="_blank">${item}</a>`;
		});
	} else if (arg !== undefined) {
		return `<a href="${arg}" target="_blank">${arg}</a>`;
	}
	return null;
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
				key.toLowerCase().includes('header-') ||
				key.toLowerCase().includes('footer-') ||
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
				return imageConstructor(dataObject[key]);
			} else if (key.toLowerCase().includes('link')) {
				return linkConstructor(dataObject[key]);
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
			div += divConstructor(element, 'row__el');
			block += `<div class="el">${div}</div>`;
		});

		body += `<div class="block__container"><div class="block">${block}</div></div>`;
		body += ulConstructor(dataObject) || '';
		return body;
	}
};

const buildHtml = (data, css) => {
	let body = '';
	let head = '';
	let header = '';
	if (!Array.isArray(data)) {
		if (typeof data === 'object' && data !== null) {
			head = headConstructor(data).head || '';
			header = headerConstructor(data) || '';
			body = bodyConstructor(data) || '';
		} else {
			body = data;
		}
	} else {
		let collapsedArray = collapseArray(data);
		head = headConstructor(collapsedArray).head || '';
		header = headerConstructor(collapsedArray) || '';
		body = bodyConstructor(collapsedArray) || '';
	}
	let cssInclude = css ? `<style type="text/css">${styles}</style>` : '';
	return `<!DOCTYPE html> <html> <head> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> ${head} ${cssInclude} </head><body><div class="container">${header} ${body}</div></body></html>`;
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

async function generateSingleHtml(data, css, directory) {
	const html = buildHtml(data, css);
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

async function generateMultipleHtml(data, css, directory) {
	let links = [];
	for (let [index, doc] of data.entries()) {
		const html = buildHtml(doc, css);
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

export default async function (
	data,
	css = false,
	rows = false,
	directory = DIR
) {
	if (data.length <= 1 && data.length !== 0 && !rows) {
		return generateSingleHtml(data[0], css, directory);
	} else if (data.length > 1 && !rows) {
		return generateSingleHtml(data, css, directory);
	} else if (data.length > 1 && rows) {
		return generateMultipleHtml(data, css, directory);
	}
}
