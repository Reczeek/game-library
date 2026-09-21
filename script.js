const form = document.getElementById("gameForm");
const gameList = document.getElementById("gameList");
const addGameSection = document.getElementById("addGameSection");
const gameCards = document.getElementById("gameCards");
const gameStatusFilter = document.getElementById("filter");
const gameSearch = document.getElementById("gameSearch");

let games = [];

loadGames();
gameStatusFilter.value = "all";

gameStatusFilter.addEventListener("change", () => {
    filterGames(gameStatusFilter.value);
});

gameSearch.addEventListener("input", () => {
    searchGames(gameSearch.value);
});

if (games.length === 0) {
    loadScene(addGameSection);
} else {
    renderGames(games);
    loadScene(gameList);
}

function addGame() {
    const gameName = document.getElementById("gameName").value;
    const gameGenre = document.getElementById("gameGenre").value;
    const gameStatus = document.getElementById("gameStatus").value;
    const gameRating = parseInt(document.getElementById("gameRating").value);

    const date1 = Date.now();

    const game = {
        name: gameName,
        genre: gameGenre,
        status: gameStatus,
        rating: gameRating,
        addGameDate: date1
    };

    games.push(game);
    saveGames(games);
    renderGames(games);
    form.reset();
    loadScene(gameList);
}

function renderGames(gameArray) {
    gameCards.innerHTML = "";

    for (const game of gameArray) {
        const gameCard = document.createElement("div");
        gameCard.className = "gameCard";

        gameCard.textContent += "\n" + game.name;
        gameCard.textContent += "\n" + game.genre;
        gameCard.textContent += "\n" + game.status;
        gameCard.textContent += "\n" + game.rating;

        const index = games.indexOf(game);

        const buttons = document.createElement("div");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editGame(game, games, index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteGame(game, games, index));

        gameCards.appendChild(gameCard);
        gameCard.appendChild(buttons);
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
    }
}

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
    saveGames(games);
    renderGames(games);
}

function deleteGame(game, games, index) {
    games.splice(index, 1);
    saveGames(games);
    renderGames(games);
}

function saveGames(games) {
    const save = JSON.stringify(games);
    localStorage.setItem("games", save);
}

function loadGames() {
    const save = localStorage.getItem("games");

    if (save != null) {
        games = JSON.parse(save);
    }
}

function filterGames(status) {
    const filteredGames = games.filter(game => {
        if (status === "all") {
            return true;
        }

        return game.status === status;
    });

    renderGames(filteredGames);
}

function searchGames(search) {
    const searchedGames = games.filter(game => {
        return game.name.toLowerCase().includes(search.toLowerCase());
    });

    renderGames(searchedGames);
}