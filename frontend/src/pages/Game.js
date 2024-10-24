import Component from "../core/Component.js";

export default class Game extends Component {
	setup() {
		this.$url = this.$props.urlHandler;
		this.$state = {
			p1: '',
			p2: '',
			p3:	'',
			p4: '',
			players: [],
			type: this.$url.getParam('type'),
			gameState: 'lobby',
		}
	}

	template() {
		return `
			<h1>Game</h1>
			<button id="gtest">Test</button>
			<div data-component="game-canvas"></div>
		`;
	}

	mounted() {
		const $canvas = this.$target.querySelector('[data-component="game-canvas"]');

		/* test Pring logger */
		this.addEvent('click', '#gtest', () => {
			console.log(this.$state.p1);
			console.log(this.$state.p2);
			console.log(this.$state.p3);
			console.log(this.$state.p4);
		});

		/* game mount */
		if (this.$state.gameState == 'start') {

			console.log('game start');
		}
	}

	setEvent() {
		const { closeModal } = this.$props;

		const onClickStart = () => {
			/* duo & p1 & p2 == null && tournament & p3 & p4 == null check */
			if ((this.$state.p1 === '' && this.$state.p2 === '')
				|| (this.$state.type !== 'duo' && this.$state.p3 === '' && this.$state.p4 === '')) {
					alert('사용자 이름이 필요합니다');
					return;
				}

			this.$state.players = [this.$state.p1, this.$state.p2];
			if (this.$state.type === 'tournament') {
				this.$state.players.push(this.$state.p3, this.$state.p4);
			}
			this.$state.players = this.pairUsersForTournament(this.$state.players);
			console.log(this.$state.players);
			this.setState({ gameState: 'start' });
			closeModal();
		};

		const onChangePlayer = (event, stateKey) => {
			this.$state[stateKey] = event.target.value;
		}

		const addPlayerEvent = (fieldId) => {
			this.addModalEvent('change', `#${fieldId}`, (event) => onChangePlayer(event, fieldId));
		}

		this.addModalEvent('click', '#start-game', onClickStart);
		this.addModalEvent('click', '#close-modal-button-inner', closeModal);
		addPlayerEvent('p1');
		addPlayerEvent('p2');
		addPlayerEvent('p3');
		addPlayerEvent('p4');

	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	  
	pairUsersForTournament(users) {
		if (users.length % 2 !== 0) {
		  throw new Error("사용자 수는 짝수여야 합니다.");
		}
	  
		this.shuffleArray(users); // 배열을 랜덤하게 섞음
		let pairs = [];
	  
		for (let i = 0; i < users.length; i += 2) {
		  pairs.push([users[i], users[i + 1]]);
		}
	  
		return pairs;
	  }
}