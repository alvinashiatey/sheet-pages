import path from 'path';
import dirHandler from './dirHandler.js';
import mediaHandler from './mediaHandler.js';
import templateEngine from './templateEngine.js';
import chalk from 'chalk';
const OUTPUT = 'dist';
const DIR = `${process.cwd()}/${OUTPUT}/`;
import style from './styles.js';
templateEngine.addShortcode('image', mediaHandler.imageShortCode);

const collapseArray = arr => {
	const result = {};
	const keys = Object.keys(arr[0]);
	keys.forEach(key => {
		result[key] = [];
	});
	arr.forEach(item => {
		for (const [k, value] of Object.entries(item)) {
			if (item[k] !== undefined) {
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

const elementConstructor = (arg, keys = null) => {
	let isLink = txt => txt.toLowerCase().includes('http');
	let elements = [];
	const elementCheck = key => {
		let val = '';
		let cls = getClassName(key);
		if (key.toLowerCase().includes('ignore')) {
			val = '';
		} else if (key.toLowerCase().includes('link')) {
			val = linkConstructor(arg[key]);
		} else if (key.toLowerCase().includes('image')) {
			val = imageConstructor(arg[key], cls);
		} else {
			if (isLink(key)) {
				val = linkConstructor(arg[key], cls);
			} else {
				val = paragraphConstructor(arg[key], cls);
			}
		}
		return val;
	};
	if (typeof arg === 'object' && arg !== null && keys !== null) {
		if (!keys.length) return null;
		for (let key of keys) {
			elements.push(elementCheck(key));
		}
		return elements;
	} else if (Array.isArray(arg)) {
		return arg.map(item => divConstructor(item));
	} else if (arg !== undefined) {
		return paragraphConstructor(arg);
	}
	return null;
};

let divConstructor = (el, cls = '') => {
	let clsName = cls !== null ? ` class="${cls}"` : '';
	if (Array.isArray(el)) {
		const els = el
			.map(item => {
				if (item === undefined || item === null) return '';
				return item;
			})
			.join('');
		if (els === '') return '';
		return `<div ${clsName}>${els}</div>`;
	} else {
		if (el === undefined || el === '') return '';
		return clsName ? `<div ${clsName}>${el}</div>` : `<div>${el}</div>`;
	}
};

const ulConstructor = arg => {
	if (typeof arg === 'object' && arg !== null) {
		let listKeys = dataFilter(arg).listKeys;
		if (listKeys.length > 0) {
			let returnArray = elementConstructor(arg, listKeys);
			let listWorkingArray = Array.isArray(returnArray[0])
				? zip(...returnArray)
				: returnArray;
			return `<ul>${listWorkingArray
				.map(list => `<li>${divConstructor(list, 'row')}</li>`)
				.join('')}</ul>`;
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
							if (headerELement === '') continue;
							div += divConstructor(
								`<a href='/'><h1>${headerELement}</h1></a>`,
								headerKey.split('-')[1]
							);
						} else {
							if (headerELement === '') continue;
							div += divConstructor(
								headerELement,
								headerKey.split('-')[1]
							);
						}
					}
				} else if (headerWorkingArray !== undefined) {
					if (headerWorkingArray === '') return null;
					div += divConstructor(
						`<a href='/'><h1>${headerWorkingArray}</h1></a>`,
						headerKey.split('-')[1]
					);
				} else {
					return null;
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
			values.head = `<title>${
				values.title.join('').trim() || ''
			}</title>${values.description || ''}${values.keywords || ''}${
				values.meta || ''
			}`;
		}
		return values;
	}
};

const imageConstructor = (arg, cls = null) => {
	let clsString = cls !== null ? ` class="${cls}"` : '';
	let tag = '';
	let p = `${OUTPUT}/images/`;
	if (Array.isArray(arg)) {
		return arg.map(item => {
			if (item === '') return null;
			item.toLowerCase().includes('http') &&
				mediaHandler.download(item, p);
			tag = `<img  ${clsString} src="${mediaHandler.filePathRelative}" alt="">`;
			return divConstructor(tag, 'row__image');
		});
	} else if (arg !== undefined) {
		if (arg === '') return null;
		arg.toLowerCase().includes('http') && mediaHandler.download(arg, p);
		tag = `<img  ${clsString} src="${mediaHandler.filePathRelative}" alt="">`;
		return divConstructor(tag, 'row__image');
	}
	return null;
};

const linkConstructor = (arg, cls = null) => {
	let clsString = cls !== null ? ` class="${cls}"` : '';
	if (Array.isArray(arg)) {
		return arg.map(item => {
			return `<a href="${item}" ${clsString} target="_blank">${item}</a>`;
		});
	} else if (arg !== undefined) {
		return `<a href="${arg}" ${clsString} target="_blank">${arg}</a>`;
	}
	return null;
};

const paragraphConstructor = (arg, cls = null) => {
	let clsString = cls !== null ? ` class="${cls}"` : '';
	if (Array.isArray(arg)) {
		return arg.map(item => {
			if (item === '') return null;
			return `<p ${clsString}>${item}</p>`;
		});
	} else if (arg !== undefined) {
		if (arg === '') return null;
		return clsString ? `<p ${clsString}>${arg}</p>` : `<p>${arg}</p>`;
	}
	return null;
};

const getClassName = arg => {
	let className = arg.match(/\[class="?(.*?)"?\]/);
	if (className !== null) {
		return className[1];
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

		let otherElements = elementConstructor(dataObject, newKeys);
		let otherElementsWorkingArray = Array.isArray(otherElements[0])
			? zip(...otherElements)
			: otherElements;
		let block = '';
		otherElementsWorkingArray.forEach(element => {
			if (element !== null) {
				let div = '';
				div += divConstructor(element, 'row__el');
				block += divConstructor(div, 'el');
			}
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
	let cssInclude = css ? `<link rel="stylesheet" href="style.css">` : '';
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
	dirHandler.createDirectory(fileName, html);
	return indexPage;
};

async function generateCSS(css) {
	try {
		if (!css) return;
		const styles = style.css;
		const filePath = path.join(DIR);
		const fileName = path.join(filePath, `style.css`);
		await dirHandler.createFile(fileName, styles);
	} catch (err) {
		console.log(err);
	}
}

async function useTemplateEngine(templatePath, sheetName, data) {
	try {
		return templateEngine.render(templatePath, sheetName, data);
	} catch (e) {
		console.log(e);
	}
}

async function generateSingleHtml(data, css, directory, sheetName) {
	console.log(sheetName);
	try {
		let templatePath = path.join(DIR, `../${sheetName}.html`);
		let useEngine = dirHandler.checkIfExists(templatePath);
		const html = useEngine
			? await useTemplateEngine(templatePath, sheetName, data)
			: buildHtml(data, css);
		const filePath = path.join(directory);
		await dirHandler.createDirectory(filePath);
		const fileName = path.join(filePath, `index.html`);
		await dirHandler.createFile(fileName, html).then(() => {
			console.log('HTML file generated!');
		});
		await generateCSS(css).then(() => {
			console.log('CSS file generated!');
		});
	} catch (e) {
		console.log(e);
	}
}

async function generateMultipleHtml(data, css, directory, sheetName) {
	try {
		let links = [];
		let templatePath = path.join(DIR, `../${sheetName}.html`);
		let useEngine = dirHandler.checkIfExists(templatePath);
		for (let [index, doc] of data.entries()) {
			const html = useEngine
				? await useTemplateEngine(templatePath, sheetName, doc)
				: buildHtml(doc, css);
			let p = doc[Object.keys(doc)[0]].split(' ').join('-');
			let filePath = path.join(directory, `${p}/`);
			links.push({ url: `/${p}/`, name: p });
			await dirHandler.createDirectory(filePath);
			const fileName = path.join(filePath, `index.html`);
			await dirHandler.createFile(fileName, html).then(() => {
				console.log(
					'HTML file generated. Path:' + chalk.yellow(fileName)
				);
			});
		}
		buildLinkedIndexPage(links);
	} catch (e) {
		console.log(e);
	}
}

export default async function (
	data,
	css = false,
	rows = false,
	sheetName = undefined,
	directory = DIR
) {
	if (data.length <= 1 && data.length !== 0 && !rows) {
		return generateSingleHtml(data[0], css, directory, sheetName);
	} else if (data.length > 1 && !rows) {
		return generateSingleHtml(data, css, directory, sheetName);
	} else if (data.length > 1 && rows) {
		return generateMultipleHtml(data, css, directory, sheetName);
	}
}
