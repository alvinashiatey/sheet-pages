import fs from 'fs';

class DirectoryHandler {
	static checkIfExists(path) {
		try {
			return fs.accessSync(path);
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
		fs.writeFile(path, data, err => {
			if (err) throw err;
		});
	}
}

export default DirectoryHandler;
