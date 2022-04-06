import chokidar from 'chokidar';

/* 
	@param string | string[] paths - The path[s] to watch for changes
	@param function callback - The function to call when a change is detected
*/

export default class Watch {
	constructor(paths, callback) {
		this.paths = paths;
		this.callback = callback;
		this.watcher = chokidar.watch(this.paths, {
			ignored: /(^|[\/\\])\../,
			persistent: true,
			ignoreInitial: true
		});
		this.watcher.on('all', (event, path) => {
			this.callback(event, path);
		});
	}

	close() {
		this.watcher.close();
	}
}
