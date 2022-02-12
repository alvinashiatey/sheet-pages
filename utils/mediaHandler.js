import axios from 'axios';
import fs from 'fs';
import path from 'path';

class MediaHandler {
	static filePathRelative = null;
	static #validateURL(url) {
		if (url.toLowerCase().includes('http')) {
			return url;
		} else {
			return false;
		}
	}

	static async download(url, dest) {
		if (!MediaHandler.#validateURL(url)) return false;
		const fileName = path.basename(url);
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
		return new Promise((resolve, reject) => {
			response.data
				.pipe(fs.createWriteStream(filePath))
				.on('error', reject)
				.on('close', () =>
					resolve({
						fileName,
						filePath,
						filePathRelative: MediaHandler.filePathRelative
					})
				);
		});
	}
}

export default MediaHandler;
