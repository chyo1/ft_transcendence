import Component from "./core/Component.js";
import Modal from "./components/Modal.js";

import preloading from "./pages/index.js";
import UrlQueryHandler from "./components/UrlQueryHandler.js";


export default class App extends Component {
	setup() {
		this.$state = {
			routes: [], // 라우팅 (경로 : 컴포넌트) 리스트
			isModalOpen: false, // 모달 열림닫힘 플래그
			modalContent: '', // 모달 컨텐츠
			currentPath: window.location.pathname,
		};
		this.$url = new UrlQueryHandler();
		this.$url.setParam('language', 'ko');

		/* routechange 이벤트 리스너 등록 */
		window.addEventListener('routeChange', () => {
			this.checkRoutes();
		});
	}

	template() {
		return `
			<div data-component="modal"></div>
			<main data-component="app" class="container" style="background-color:white;">
			<div class="d-flex flex-column vh-100">
				<div class="d-flex justify-content-start w-100 border-bottom border-2 border-secondary-subtle">
					<h2 id="logo" class="px-3 py-1" style="cursor: pointer;">logo</h1>
				</div>
				<div id="content" class="d-flex flex-column vh-100 m-3">
				</div>
			</div>
			</main>
		`;
	}

	checkRoutes() {
		const currentRoute = this.$state.routes.find((route) => {
			return route.fragment === window.location.pathname;
		});

		const isSamePath =	this.$state.currentComponent &&
							currentRoute &&
							currentRoute.fragment === window.location.pathname &&
							this.$state.currentPath === window.location.pathname;

		if (!currentRoute) {
			window.history.pushState({}, '', '/');
			this.$state.routes[0].component();
			this.$state.currentPath = '/';
			return ;
		}

		this.$state.currentPath = window.location.pathname;

		if (!isSamePath && this.$state.currentComponent)
			this.$state.currentComponent.unmounted();

		this.$state.currentComponent = currentRoute.component();
	};

	/* modal */
	openModal(content) {
		this.$state.isModalOpen = true;
		this.$state.modalContent = content;
		this.renderModal();
	}

	closeModal() {
		this.$state.isModalOpen = false;
		this.$state.modalContent = '';
		this.renderModal();
	}

	renderModal() {
		const $modal = this.$target.querySelector('[data-component="modal"]');
		const childProps = {
			openModal: this.openModal.bind(this),
			closeModal: this.closeModal.bind(this),
			isModalOpen: this.$state.isModalOpen,
			modalContent: this.$state.modalContent,
			language: this.$url.getParam('language'),
		};

		new Modal($modal, childProps);
	}

	setEvent() {
		window.addEventListener('popstate', () => {
			if (this.$state.isModalOpen)
				this.closeModal();
			
			this.$url.updateParams();
			this.checkRoutes();
		});
	}

	mounted() {
		const $content = this.$target.querySelector('#content');
		const $modal = this.$target.querySelector('[data-component="modal"]')

		const pages = preloading($content, {
			openModal: this.openModal.bind(this),
			closeModal: this.closeModal.bind(this),
			renderModal: this.renderModal.bind(this),
			isModalOpen: this.$state.isModalOpen,
			modalContent: this.$state.modalContent,
			modalContainer: $modal,
			language: this.$url.getParam('language'),
			urlHandler: this.$url,
		});

		this.$state.routes = [];
		this.$state.routes.push({ fragment: '/', component: pages.home });
		this.$state.routes.push({ fragment: '/games', component: pages.game });
		this.$state.routes.push({ fragment: '/tournaments', component: pages.tournament });

		const onClickLogo = () => {
			this.$url.setPathname('/');
			this.$url.removeParam('type');
			this.$url.updateURL();
			this.checkRoutes();
		}

		this.addEvent('click', '#logo', onClickLogo);
		this.renderModal();
		this.checkRoutes();
	}

}	