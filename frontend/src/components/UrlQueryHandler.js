export default class UrlQueryHandler {
	constructor() {
		this.urlParams = new URLSearchParams(window.location.search);
		this.$path = window.location.pathname;
	}

	getParam(key) {
		return this.urlParams.get(key);
	}

	setParam(key, value) {
		this.urlParams.set(key, value);
		// this.updateURL();
	}
	
	setPathname(newPath) {
		this.$path = newPath;
		// const newUrl = newPath + '?' + this.urlParams.toString();
		// window.history.pushState({}, '', newUrl);
	}

	removeParam(key) {
		this.urlParams.delete(key);
		// this.updateURL();
	}

	updateURL(replace = false) {
		const newUrl = this.$path + '?' + this.urlParams.toString();
		if (replace)
			window.history.replaceState({}, '', newUrl);
		else
			window.history.pushState({}, '', newUrl);
	}

	updateParams() {
		this.urlParams = new URLSearchParams(window.location.search);
		this.$path = window.location.pathname;
	}

	getAllParams() {
		const params = {};
		this.urlParams.forEach((value, key) => {
			params[key] = value;
		});
		return params; // 객체 형태로 모든 파라미터 반환
	}

	hasParam(key) {
		return this.urlParams.has(key);
	}

	logParams() {
		console.log([...this.urlParams.entries()]);
	}
}