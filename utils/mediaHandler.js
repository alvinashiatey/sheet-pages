import axios from 'axios';
import fs from 'fs';
import path from 'path';

class MediaHandler {
	static filePathRelative = null;
	static counter = 0;
	static #validateURL(url) {
		if (url.toLowerCase().includes('http')) {
			return url;
		} else {
			return false;
		}
	}

	static async download(url, dest) {
		if (!MediaHandler.#validateURL(url)) return false;
		const bName = path.basename(url);
		// generate random filename with datetime stamp and the extension from basename
		// regex that returns .jpg||.png||.jpeg from 1645041124752.jpg?itok=bLtBRKi7 or 1645041124752.png?%3Fitok%3DbLtBRKi7

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
