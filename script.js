const form = document.getElementById("gameForm");
const gameList = document.getElementById("gameList");
const addGameSection = document.getElementById("addGameSection");
const gameCards = document.getElementById("gameCards")
let games = [];

loadScene(addGameSection)

function addGame(form) {
    const gameName = document.getElementById("gameName").value;
    const gameGenre = document.getElementById("gameGenre").value;
    const gameStatus = document.getElementById("gameStatus").value;
    const gameRating = parseInt(document.getElementById("gameRating").value);
    const date1= Date.now();
    const game = {
        name: gameName,
        genre: gameGenre,
        status: gameStatus,
        rating: gameRating,
        addGameDate: date1
    };
    games.push(game)
    renderGames();
    form.reset()
    loadScene(gameList) 
};

function renderGames() {
    gameCards.innerHTML = "";
    for (const game of games){
        const gameCard = document.createElement("div");
        gameCard.className = "gameCard";
        gameCard.textContent += "\n" + game.name;
        gameCard.textContent += "\n" + game.genre;
        gameCard.textContent += "\n" + game.status;
        gameCard.textContent += "\n" + game.rating;
        const index = games.indexOf(game);
        const buttons = document.createElement("div")
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click",() => editGame(game, games, index));
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click",() => deleteGame(game, games, index));
        gameCards.appendChild(gameCard);
        gameCard.appendChild(buttons);
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
    };
};

function loadScene(scene) {
    if (scene == addGameSection) {
        addGameSection.style.display = "block";
        gameList.style.display = "none";
    }
    if (scene == gameList) {
        gameList.style.display = "block";
        addGameSection.style.display = "none";
    }
}

function editGame(game, games, index) {
    loadScene(addGameSection);
    document.getElementById("gameName").value = game.name;
    document.getElementById("gameGenre").value = game.genre;
    document.getElementById("gameStatus").value = game.status;
    document.getElementById("gameRating").value = game.rating;
    games.splice(index, 1);
    renderGames()
}

function deleteGame(game, games, index) {
    games.splice(index, 1);
    renderGames()
};