export default class Component {
	$target;
	$props;
	$state;
	$listeners;

	constructor($target, $props) {
		this.$target = $target;
		this.$props = $props;
		this.$listeners = [];
		this.setup();
		this.setEvent();
		this.render();
	}

	/* 상태 */
	setup() {}

	/* 생명주기 마운트 되었을 때 */
	mounted() {}

	/* 생명주기 마운트 해제되었을 때 */
	unmounted() {
		this.$listeners.forEach(({ target, eventType, listener }) => {
			target.removeEventListener(eventType, listener)
		});
		this.$listeners = [];
	}

 	/* UI */
	template() {
		return '';
	}

	render() {
		this.$target.innerHTML = this.template();
		this.mounted();
	}

	/* 이벤트 설정 */
	setEvent() {}

	/* 상태 변경 / 렌더링 */
	setState(newState) {
		this.$state = { ...this.$state, ...newState };
		this.render();
	}

	addEvent(eventType, selector, callback) {
		const existingListener = this.$target[`_${eventType}_${selector}_listener`];

		if (existingListener)
			this.$target.removeEventListener(eventType, existingListener);

		const newListener = (event) => {
			if (!event.target.closest(selector)) return false;
			callback(event);
		}

		this.$target[`_${eventType}_${selector}_listener`] = newListener;
		this.$target.addEventListener(eventType, newListener);

		this.$listeners.push({
			target: this.$target,
			eventType,
			listener: newListener,
		});
	}

	addModalEvent(eventType, selector, callback) {
		const existingListener = this.$props.modalContainer[`_${eventType}_${selector}_listener`];

		if (existingListener)
			this.$props.modalContainer.removeEventListener(eventType, existingListener);

		const newListener = (event)	=> {
			if (!event.target.closest(selector)) return false;
			callback(event);
		}

		this.$props.modalContainer[`_${eventType}_${selector}_listener`];
		this.$props.modalContainer.addEventListener(eventType, newListener);

		this.$listeners.push({
			target: this.$props.modalContainer,
			eventType,
			listener: newListener,
		})
	}

	updateProps(newProps) {
		this.$props = { ...this.$props, ...newProps };
		this.render();
	}
}