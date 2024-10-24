import { modalData } from "./language.js"

export const modalDuo = (language) => {
	const data = modalData[language];

	return `
		<div class="modal-body">
			<div class="container">
				<div class="row mb-3">
					<div class="col-12">
						<label for="p1" class="form-label">${data.p1}</label>
						<input type="text" class="form-control" id="p1" placeholder="${data.placeholder}">
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="p2" class="form-label">${data.p2}</label>
						<input type="text" class="form-control" id="p2" placeholder="${data.placeholder}">
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer d-flex ">
			<button id="close-modal-button-inner" type="button" class="btn btn-secondary">${data.close}</button>
			<button class="btn btn-primary" type="button" id="start-game">${data.start}</button>
		</div>
	`
}

export const modalTournament = (language) => {
	const data = modalData[language];

	return `
		<div class="modal-body">
			<div class="container">
				<div class="row mb-3">
					<div class="col-12">
						<label for="p1" class="form-label">${data.p1}</label>
						<input type="text" class="form-control" id="p1" placeholder="${data.placeholder}">
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="p2" class="form-label">${data.p2}</label>
						<input type="text" class="form-control" id="p2" placeholder="${data.placeholder}">
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="p3" class="form-label">${data.p3}</label>
						<input type="text" class="form-control" id="p3" placeholder="${data.placeholder}">
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12">
						<label for="p4" class="form-label">${data.p4}</label>
						<input type="text" class="form-control" id="p4" placeholder="${data.placeholder}">
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer d-flex ">
			<button id="close-modal-button-inner" type="button" class="btn btn-secondary">${data.close}</button>
			<button class="btn btn-primary" type="button" id="start-game">${data.start}</button>
		</div>
	`
}

export const modalLanguage = (language) => {
	const data = modalData[language];

	return `
		<div class="modal-body" id="m-language">
			<h5>Select Language</h5>
			<button id="language-korean" class="btn ${language == 'ko' ? 'active' : ''}">Korean</button>
			<button id="language-english" class="btn ${language == 'en' ? 'active' : ''}">English</button>
			<button id="language-france" class="btn ${language == 'fr' ? 'active' : ''}">France</button>
		</div>
		<div class="modal-footer d-flex">
			<button id="close-modal-button-inner" type="button" class="btn btn-secondary">${data.close}</button>
		</div>
	`
}