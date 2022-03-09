import axios from 'axios';
import fs from 'fs';
import path from 'path';
import Cache from './Cache.js';
const OUTPUT = 'dist';
const DIR = `${process.cwd()}/${OUTPUT}/images`;

class MediaHandler {
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
		if (!url || url === '') return;
		try {
			if (!MediaHandler.#validateURL(url)) return false;
			let val = {};
			// Check if file exists in cache
			if (MediaHandler.getFromCache(url)) {
				return MediaHandler.getFromCache(url);
			} else {
				const bName = path.basename(url) || '.jpg';
				const extRegex = bName.match(/\.(jpg|png|jpeg|gif|webp)/);
				const ext = extRegex ? extRegex[0] : '';
				const fileName = `img-${MediaHandler.generateRandomName(
					8
				)}${Math.floor(Math.random() * 100)}${ext}`;
				const filePath = path.join(dest, fileName);
				const response = await axios({
					url,
					method: 'GET',
					responseType: 'stream'
				});
				if (!response) return false;
				if (!fs.existsSync(dest)) fs.mkdirSync(dest);
				val.filePathRelative = path.relative(
					path.join(dest, '..'),
					filePath
				);
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
			console.error(err.message);
			return false;
		}
	}

	static generateRandomName(length) {
		const chars =
			'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let result = '';
		for (let i = length; i > 0; --i)
			result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	static async imageShortCode(url, cls) {
		if (!url || url === '') return;
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
				val.cls = cls;
				MediaHandler.addToCache(url, val);
				console.log(`from cache`);
			}
			return `<img class="${val.cls || ''}" src="/${val.src}" alt="" />`;
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
