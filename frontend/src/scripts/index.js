import 'regenerator-runtime';
import '../styles/variables.css';
import '../styles/style.css';
import '../styles/responsive.css';
import App from './views/app';
import AuthService from './utils/auth-service';

const app = new App({
  button: [
    document.querySelector('#btn-profile'), 
    document.querySelector('#humberger-button'),
    document.querySelector('#btn-logout'),
  ],
  drawer: [
    document.querySelector('.profile-menu'), 
    document.querySelector('#navigation-drawer'),
  ],
  content: document.querySelector('#content'),
  body: document.getElementsByTagName('body')[0],
  header: document.getElementById('app-bar'),
  menuItem: [
    document.querySelectorAll('.app-bar .app-bar__navigation ul li a')[0],
    document.querySelectorAll('.app-bar .app-bar__navigation ul li a')[1]
  ],
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', async () => {
  app.renderPage();

  const isLoggedIn = await AuthService.isLoggedIn();
  const audio = document.getElementById("bg-music");

  if (isLoggedIn) {
    audio.play().catch(() => {});
    audio.volume = 0.5;
    audio.setAttribute("autoplay", "true");
  } else {
    audio.pause();        // ⛔ stop
    audio.currentTime = 0; // ⛔ reset ke awal
  }
});

const clickSound = document.getElementById("clickSound");
const dropdownProfile = document.getElementById('dropdownProfile');


document.addEventListener("click", (e) => {
  const el = e.target.closest("button, .button");

  if (!el) return;
  console.log(el)
  if (el.classList.contains("user-identity__photo")) {
    
    dropdownProfile.currentTime = 0;
    dropdownProfile.play();
    return; 
  }

  if (el.classList.contains("no-click-sound")) return;

  clickSound.currentTime = 0;
  clickSound.play();
});
