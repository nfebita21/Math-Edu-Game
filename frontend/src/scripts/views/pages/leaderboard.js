import DBSource from "../../data/db-source";
import { createButtonBackToLobby, createRankingRow } from "../templates/template-creator";

const Leaderboard = {
  async render() {
    return `
      <div class="leaderboard">
        <div class="title-container">
        <div class="title-decor cities-left">
          <img src="./title-decor/city2.png">
          <img src="./title-decor/city4.png">
          <img src="./title-decor/city3.png">
        </div>
        <p>Papan Peringkat</p>
        <div class="title-decor cities-right">
          <img src="./title-decor/city.png">
          <img src="./title-decor/city4-backwards.png">
          <img src="./title-decor/city2-backwards.png">
        </div>
      </div>
      <div class="container leaderboard-container">
        <div class="leaderboard-header">
          <p>RANK</p>
          <p>AVATAR</p>
          <p>NAMA PEMAIN</p>
          <p id="hidden-field">PEROLEHAN CANDY TERBANYAK PER KOTA</p>
          <p>TOTAL SKOR</p>
        </div>
        <ul class="player-list"></ul>
        <div class="unavailable-leaderboard">
          <p>Papan peringkat belum tersedia</p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Create button back to lobby
    this.addButtonBackToLobby();

    // Add player ranking row
    const getLeaderboard = await DBSource.getStudentsLeaderboard();
    const leaderboard = getLeaderboard.data;
    const playerList = document.querySelector('.player-list');
    leaderboard.forEach((player, index) => {
      playerList.innerHTML += createRankingRow(index+1, player);
    });
    const unavailableLeaderboardText = document.querySelector('.unavailable-leaderboard');

    if (playerList.children.length > 0) {
      this.addTrophyToFirstRank();
      unavailableLeaderboardText.style.display = "none";
    } else {
      unavailableLeaderboardText.style.display = 'block';
    }

    

  },

  addButtonBackToLobby() {
    const contentContainer = document.querySelector('#content');
    contentContainer.innerHTML += createButtonBackToLobby();
    const btnBackToLobby = document.querySelector('.btn-back-to-lobby');
    btnBackToLobby.addEventListener('click', () => {
      window.location.href = '#/lobby?id=1';
    });
  },

  addTrophyToFirstRank() {
    const playerList = document.querySelector('.player-list');
    const trophy = document.createElement('img');
    trophy.src = 'trophy.png';
    trophy.classList.add('trophy');

    playerList.insertBefore(trophy, playerList.firstChild);
  },
};

export default Leaderboard;