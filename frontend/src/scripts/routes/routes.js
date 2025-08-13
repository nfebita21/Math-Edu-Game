import Gallery from "../views/pages/gallery";
import Leaderboard from "../views/pages/leaderboard";
import Level from "../views/pages/level";
import Lobby from "../views/pages/lobby";
import Login from "../views/pages/login";
import Play from "../views/pages/play";
import Profile from "../views/pages/profile";
import SignUp from "../views/pages/sign-up";

const routes = {
  '/lobby?id': Lobby,
  '/collection': Gallery,
  '/leaderboard': Leaderboard,
  '/profile': Profile,
  '/login': Login,
  '/sign-up': SignUp,
  '/game/:cityName': Level,
  '/game/:cityName/:level/play': Play,
}

export default routes;