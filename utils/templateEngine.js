import nunjucks from 'nunjucks';
import path from 'path';

class Engine {
	static #path = path.join(process.cwd(), '/views');
	constructor() {
		this.env = new nunjucks.Environment(
			[
				new nunjucks.FileSystemLoader(Engine.#path, {
					noCache: true
				}),
				new nunjucks.FileSystemLoader(process.cwd(), {
					noCache: true
				})
			],
			{
				autoescape: true
			}
		);
	}

	async render(template, dataName, data) {
		return new Promise((resolve, reject) => {
			return this.env.render(
				path.resolve(Engine.#path, template),
				{
					[dataName]: data
				},
				function (err, res) {
					if (err) {
						return reject(err);
					}
					return resolve(res);
				}
			);
		});
	}

	addFilter(name, func) {
		this.env.addFilter(name, func);
	}

	addShortcode(name, func, isAsync = true) {
		let shortCodeFn = this.addCustomTag(name, func, isAsync);
		return this.env.addExtension(name, new shortCodeFn());
	}

	addCustomTag(name, callback, isAsync = true) {
		return function ShortCodeFucntion() {
			this.tags = [name];
			this.parse = function (parser, nodes) {
				const tok = parser.nextToken();
				const args = parser.parseSignature(true, true);
				parser.advanceAfterBlockEnd(tok.value);
				if (isAsync) {
					return new nodes.CallExtensionAsync(this, 'run', args);
				}
				return new nodes.CallExtension(this, 'run', args);
			};
			this.run = function (...args) {
				let resolve;
				if (isAsync) {
					resolve = args.pop();
				}
				let [context, ...argsArray] = args;
				if (isAsync) {
					try {
						return callback
							.call(context, ...argsArray)
							.then(function (returnValue) {
								let str = returnValue ? returnValue : '';
								resolve(
									null,
									new nunjucks.runtime.SafeString(str)
								);
							})
							.catch(function (err) {
								resolve(err.message, null);
							});
					} catch (err) {
						return err.message;
					}
				} else {
					try {
						return new nunjucks.runtime.SafeString(
							callback(context, ...argsArray)
						);
					} catch (err) {
						return err.message;
					}
				}
			};
		};
	}

	safeString(text) {
		return new nunjucks.runtime.SafeString(text);
	}
}

export default new Engine();
