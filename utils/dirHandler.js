import fs from 'fs';
import { join, resolve } from 'path';

class DirectoryHandler {
	static checkIfExists(path) {
		try {
			return fs.existsSync(path);
		} catch (e) {
			return false;
		}
	}
	static async createDirectory(path) {
		if (!fs.existsSync(path)) {
			return fs.mkdirSync(path, { recursive: true });
		}
	}
	static async createFile(path, data) {
		try {
			fs.writeFile(path, data, err => {
				if (err) throw err;
			});
		} catch (e) {
			console.log(e);
		}
	}
	static copyFile(path, dest) {
		try {
			const src = join(process.cwd(), path);
			const destPath = resolve(process.cwd(), dest, path);
			fs.copyFile(src, destPath, err => {
				if (err) throw err;
			});
		} catch (e) {
			console.log(e);
		}
	}
}

export default DirectoryHandler;
