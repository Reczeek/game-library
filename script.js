const form = document.getElementById("gameForm");
const gameList = document.getElementById("gameList");
let games = [];

function addGame() {
    const gameName = document.getElementById("gameName").value;
    const gameGenre = document.getElementById("gameGenre").value;
    const gameStatus = document.getElementById("gameStatus").value;
    const gameRating = parseInt(document.getElementById("gameRating").value);
    const game = {
        name: gameName,
        genre: gameGenre,
        status: gameStatus,
        rating: gameRating
    };
    games.push(game)
    renderGames()
};

function renderGames() {
    gameList.innerHTML = "";
    for (const game of games){
        const gameCard = document.createElement("div");
        gameCard.textContent += "\n" + game.name;
        gameCard.textContent += "\n" + game.genre;
        gameCard.textContent += "\n" + game.status;
        gameCard.textContent += "\n" + game.rating + "\n";
        gameList.appendChild(gameCard);
    };
};