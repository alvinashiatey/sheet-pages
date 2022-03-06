import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Cache from './Cache.js';
const OUTPUT = 'dist';
const DIR = `${process.cwd()}/${OUTPUT}/images`;
const CACHE = `${process.cwd()}/.cache/`;

class MediaHandler {
	static filePathRelative = null;
	static counter = 0;
	static cacheDate = new Date().getTime();
	static cache = new Cache('images');
	static #validateURL(url) {
		if (!url) return false;
		if (url.toLowerCase().includes('http')) {
			return url;
		} else {
			return false;
		}
	}

	static async download(url, dest) {
		try {
			if (!MediaHandler.#validateURL(url)) return false;
			let val = {};
			// Check if file exists in cache
			if (MediaHandler.getFromCache(url)) {
				return MediaHandler.getFromCache(url);
			} else {
				const bName = path.basename(url);
				const extRegex = bName.match(/\.(jpg|png|jpeg|gif|webp)/);
				const ext = extRegex ? extRegex[0] : '';
				const fileName = `img-${MediaHandler.counter++}-aa${ext}`;
				const filePath = path.join(dest, fileName);

				MediaHandler.filePathRelative = path.relative(
					path.join(dest, '..'),
					filePath
				);
				const response = await axios({
					url,
					method: 'GET',
					responseType: 'stream'
				});
				if (!fs.existsSync(dest)) fs.mkdirSync(dest);
				val.filePathRelative = MediaHandler.filePathRelative;
				val.fileName = fileName;
				val.filePath = filePath;

				return new Promise((resolve, reject) => {
					response.data
						.pipe(fs.createWriteStream(filePath))
						.on('error', reject)
						.on('close', () => resolve(val));
				});
			}
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	static async imageShortCode(url, cls) {
		try {
			if (!MediaHandler.#validateURL(url)) return;
			let val = {};
			if (MediaHandler.getFromCache(url)) {
				val = MediaHandler.getFromCache(url);
			} else {
				let src = await MediaHandler.download(url, DIR);
				if (!src) return Error('Invalid URL');
				val.src = src.filePathRelative;
				val.alt = src.fileName;
			}
			val.cls = cls;
			MediaHandler.addToCache(url, val);
			return `<img class="${val.cls}" src="${val.src}" alt="${val.src}" />`;
		} catch (err) {
			console.error(err);
			return Error('Invalid URL');
		}
	}

	static addToCache(url, val) {
		MediaHandler.cache.set(url, val);
	}

	static getFromCache(url) {
		return MediaHandler.cache.get(url);
	}
}

export default MediaHandler;
