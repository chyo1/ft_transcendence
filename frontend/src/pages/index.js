import Home from './Home.js';
import Game from './Game.js';
import Tournament from './Tournament.js';

export default (main, props) => {
	const home = () => new Home(main, props);
	const game = () => new Game(main, props);
	const tournament = () => new Tournament(main, props);

	return {
		home,
		game,
		tournament,
	};
}