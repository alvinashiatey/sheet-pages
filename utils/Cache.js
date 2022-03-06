const CACHE = `${process.cwd()}/.cache/`;
import fs from 'fs';
import { join } from 'path';

class Cache {
	cacheDate = new Date().getTime();
	cache = {
		cacheDate: this.cacheDate
	};
	constructor(name) {
		this.filename = `${name}-sheet.json`;
		if (!fs.existsSync(CACHE)) fs.mkdirSync(CACHE);
		const filePath = join(CACHE, this.filename);
		if (fs.existsSync(filePath) && this.isCacheValid(1)) {
			this.cache = JSON.parse(fs.readFileSync(filePath));
		} else {
			fs.writeFileSync(filePath, JSON.stringify(this.cache));
		}
		return this;
	}

	get(key) {
		return this.cache[key];
	}

	set(key, value) {
		this.cache[key] = value;
		this.save();
	}

	clear() {
		this.cache = {};
		this.save();
	}

	save() {
		const filePath = join(CACHE, this.filename);
		fs.writeFileSync(filePath, JSON.stringify(this.cache));
	}

	isCacheValid(day) {
		// check if cacheDate has elapsed since a day
		const cacheDate = new Date(this.cache.cacheDate);
		const now = new Date();
		const diff = now.getTime() - cacheDate.getTime();
		const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
		if (diffDays > day) {
			this.cacheDate = new Date().getTime();
			return false;
		}
		return true;
	}

	get isEmpty() {
		return Object.keys(this.cache).length <= 1;
	}
}

export default Cache;
