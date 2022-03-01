import nunjucks from "nunjucks";
import path from "path";

class Engine {
        static #path = path.join(process.cwd(), "/views")

        constructor() {
                this.env = new nunjucks.Environment([
                        new nunjucks.FileSystemLoader(Engine.#path, {
                                noCache: true,
                        }),
                        new nunjucks.FileSystemLoader(process.cwd(), {
                                noCache: true,
                        }),
                ], {
                        autoescape: true,
                });

        }

        render(template, dataName, data) {
                return this.env.render(path.resolve(Engine.#path, template), {
                        [dataName]: data
                });
        }

        addFilter(name, func) {
                this.env.addFilter(name, func);
        }
}

export default new Engine();
