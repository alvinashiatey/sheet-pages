class HTML {
        elements = {};

        append(entry) {
                this.elements[entry.element] = entry
        }
        render() {
                let result = `<!DOCTYPE html> <html>`;
                for (let key in this.elements) {
                        result += this.elements[key].render();
                }
                result += `</html>`;
                return result;
        }
}

class HTMLelement {
        element = null;
        children = []
        content = null;
        attr = {};

        createElement(tagName) {
                this.element = tagName;
                return this
        }
        createAttribute(name, value = null) {
                this.attr[name] = value
                // return a setter function to set the value
                return {
                        value: (val) => {
                                this.attr[name] = val
                        }
                }
        }
        setAttribute(name, value) {
                this.attr[name] = value
        }
        getAttribute(name) {
                return this.attr[name]
        }
        textContent(content) {
                if (content instanceof HTMLelement) {
                        this.children.push(content)
                        this.content = this.children.map(child => child.render()).join('')
                } else {
                        this.content = content
                }
                return this
        }
        append(location, element) {
                if (location.toLowerCase() === 'before') {
                        this.children.unshift(element)
                } else if (location.toLowerCase() === 'after') {
                        this.children.push(element)
                } else {
                        throw new Error('Invalid location')
                }
        }
        render() {
                let str = `<${this.element}`;
                for (let key in this.attr) {
                        str += ` ${key}="${this.attr[key]}"`
                }
                str += `>${this.content}</${this.element}>`
                return str
        }


}

class HeadElement extends HTMLelement {
        constructor(content) {
                super()
                this.createElement('head')
                this.content(content)
        }
}

class MetaElement extends HTMLElement {
        constructor(content) {
                super()
                this.createElement('meta')
                this.content(content)
        }
}



