import Component from "../core/Component.js";

export default class Modal extends Component {
	template() {
		const { isModalOpen, modalContent } = this.$props;

		return `
		<div id="modal-container"
		class="${isModalOpen? 'd-block show' : ''} modal fade modal-overlay"
		>
			<div id="inner-modal" class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title fs-5"></div>
						<button id="close-modal-button" class="btn-close" aria-label="Close"></button>
					</div>
					${modalContent}
				</div>
			</div>
		</div>
		`
	}

	mounted() {
		const { closeModal } = this.$props;
		
		this.addEvent('click', '#close-modal-button', closeModal);
		this.addEvent('click', '#modal-container', (event) => {

			if (event.target.closest('#inner-modal')) {
				return;  // 부모에서의 처리 방지
			  }
			closeModal()
		});
	}

}