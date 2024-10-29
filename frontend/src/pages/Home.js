import Component from "../core/Component.js";

import { modalDuo, modalTournament, modalLanguage } from "../pages/modal.js";
import { homeData } from "./language.js";

export default class Home extends Component {
	setup() {
		this.$url = this.$props.urlHandler;
	}

	template() {
		const language = this.$url.getParam('language');
		const data = homeData[language];
		return `
				<div class="d-flex justify-content-start align-items-start">
					<h1 class="fs-1 fw-bold">PingPong</h1>
				</div>
				<div class="d-flex justify-content-end align-items-end flex-grow-1 flex-column py-5">
					<button class="btn btn-outline-secondary w-25 p-1 m-1" style="--bs-btn-border-color:none" id='redirect-login'>${data.login}</button>
					<button class="btn btn-outline-secondary w-25 p-1 m-1" style="--bs-btn-border-color:none" id='open-modal-duo'>${data.duo}</button>
					<button class="btn btn-outline-secondary w-25 p-1 m-1" style="--bs-btn-border-color:none" id='open-modal-tournament'>${data.tournament}</button>
					<button class="btn btn-outline-secondary w-25 p-1 m-1" style="--bs-btn-border-color:none" id='open-modal-language'>${data.language}</button>
				</div>
		`;
	}

	setEvent() {
		const { openModal, closeModal, renderModal } = this.$props;
		const routeChangeEvent = new CustomEvent('routeChange');

		const updateLanguage = () => {
			this.$url.updateURL()
			openModal(modalLanguage(this.$url.getParam('language')));
			window.dispatchEvent(routeChangeEvent);
		}

		this.addEvent('click', '#redirect-login', () => {
			window.location.href = '/api/oauth?' + this.$url.urlParams.toString();
		})
		this.addEvent('click', '#open-modal-duo', () => {
			openModal(modalDuo(this.$url.getParam('language')));
			this.$url.setPathname('/games');
			this.$url.setParam('type', 'duo');
			this.$url.updateURL();
			window.dispatchEvent(routeChangeEvent);
		});
		this.addEvent('click', '#open-modal-tournament', () => {
			openModal(modalTournament(this.$url.getParam('language')));
			this.$url.setPathname('/games');
			this.$url.setParam('type', 'tournament');
			this.$url.updateURL();
			window.dispatchEvent(routeChangeEvent);
		});
		this.addEvent('click', '#open-modal-language', () => {
			openModal(modalLanguage(this.$url.getParam('language')));
			this.addModalEvent('click', '#language-korean', () => {
				this.$url.setParam('language', 'ko');
				updateLanguage();
			});
			this.addModalEvent('click', '#language-english', () => {
				this.$url.setParam('language', 'en');
				updateLanguage();
			});
			this.addModalEvent('click', '#language-france', () => {
				this.$url.setParam('language', 'fr');
				updateLanguage();
			})
		});
		this.addModalEvent('click', '#close-modal-button-inner', closeModal);
		this.addModalEvent('click', '#m-language .list-group-item', renderModal);
	}
}