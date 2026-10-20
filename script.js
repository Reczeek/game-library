const form = document.getElementById("gameForm");
const gameList = document.getElementById("gameList");
const addGameSection = document.getElementById("addGameSection");
const gameCards = document.getElementById("gameCards");
const gameStatusFilter = document.getElementById("filter");
const gameSearch = document.getElementById("gameSearch");
const gameSort = document.getElementById("sort");

gameSort.addEventListener("change", () => {
    sortGames(gameSort.value);
});

let games = [];

loadGames();
gameStatusFilter.value = "all";
gameSort.value = "last";
sortGames(gameSort.value);

gameStatusFilter.addEventListener("change", () => {
    updateGames();
});

gameSearch.addEventListener("input", () => {
    updateGames();
});

if (games.length === 0) {
    loadScene(addGameSection);
} else {
    sortGames(gameSort.value);
    loadScene(gameList);
}


function updateStatistics() {
    const totalGames = games.length;

    const completedGames = games.filter(
        game => game.status === "completed"
    ).length;

    const playingGames = games.filter(
        game => game.status === "playing"
    ).length;

    const backlogGames = games.filter(
        game => game.status === "backlog"
    ).length;

    const ratedGames = games.filter(
        game => Number.isFinite(game.rating) && game.rating >= 1 && game.rating <= 10
    );

    const averageRating = ratedGames.length > 0
        ? ratedGames.reduce((sum, game) => sum + game.rating, 0) / ratedGames.length
        : 0;

    document.getElementById("totalGames").textContent = totalGames;
    document.getElementById("completedGames").textContent = completedGames;
    document.getElementById("playingGames").textContent = playingGames;
    document.getElementById("backlogGames").textContent = backlogGames;
    document.getElementById("averageRating").textContent =
        ratedGames.length > 0 ? `${averageRating.toFixed(1)}/10` : "Brak ocen";
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
    updateStatistics();
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

function updateGames() {
    const status = gameStatusFilter.value;
    const search = gameSearch.value;

    const filteredGames = games.filter(game => {
        return (status === "all" || game.status === status) && game.name.toLowerCase().includes(search.toLowerCase());
    });

    renderGames(filteredGames);
}

function sortGames(sortType) {
    const sortedGames = [...games];

    if (sortType === "last") {
        sortedGames.sort((a, b) => b.addGameDate - a.addGameDate);
    }

    else if (sortType === "oldest") {
        sortedGames.sort((a, b) => a.addGameDate - b.addGameDate);
    }

    else if (sortType === "az") {
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    }

    else if (sortType === "za") {
        sortedGames.sort((a, b) => b.name.localeCompare(a.name));
    }

    else if (sortType === "best") {
        sortedGames.sort((a, b) => b.rating - a.rating);
    }

    else if (sortType === "worst") {
        sortedGames.sort((a, b) => a.rating - b.rating);
    }

    renderGames(sortedGames);
}