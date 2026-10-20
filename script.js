const form = document.getElementById("gameForm");
const gameList = document.getElementById("gameList");
const addGameSection = document.getElementById("addGameSection");
const gameCards = document.getElementById("gameCards");
const gameStatusFilter = document.getElementById("filter");
const gameSearch = document.getElementById("gameSearch");
const gameSort = document.getElementById("sort");
const formTitle = document.getElementById("formTitle");
const addGameButton = document.getElementById("addGameButton");
const resultCount = document.getElementById("resultCount");

let games = [];
let editingIndex = null;

loadGames();
gameStatusFilter.value = "all";
gameSort.value = "last";

document.querySelectorAll(".filter-tab").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));
        button.classList.add("active");
        gameStatusFilter.value = button.dataset.filter;
        updateGames();
    });
});

gameSort.addEventListener("change", updateGames);
gameStatusFilter.addEventListener("change", updateGames);
gameSearch.addEventListener("input", updateGames);
form.addEventListener("submit", addGame);
document.getElementById("addGameSectionButton").addEventListener("click", () => openForm());
document.getElementById("cancelGameButton").addEventListener("click", closeForm);
document.getElementById("cancelFormButton").addEventListener("click", closeForm);

if (games.length === 0) {
    renderGames([]);
    openForm();
} else {
    closeForm();
    updateGames();
}

function updateStatistics() {
    const completed = games.filter(game => game.status === "completed").length;
    const playing = games.filter(game => game.status === "playing").length;
    const backlog = games.filter(game => game.status === "backlog").length;
    const rated = games.filter(game => Number.isFinite(game.rating) && game.rating >= 1 && game.rating <= 10);
    const average = rated.length ? rated.reduce((sum, game) => sum + game.rating, 0) / rated.length : 0;

    document.getElementById("totalGames").textContent = games.length;
    document.getElementById("completedGames").textContent = completed;
    document.getElementById("playingGames").textContent = playing;
    document.getElementById("backlogGames").textContent = backlog;
    document.getElementById("averageRating").textContent = rated.length ? `${average.toFixed(1)}/10` : "No rating";
}

function addGame(event) {
    event.preventDefault();
    const game = {
        name: document.getElementById("gameName").value.trim(),
        genre: document.getElementById("gameGenre").value,
        status: document.getElementById("gameStatus").value,
        rating: parseInt(document.getElementById("gameRating").value, 10),
        addGameDate: editingIndex === null ? Date.now() : games[editingIndex].addGameDate
    };

    if (editingIndex === null) games.push(game);
    else games[editingIndex] = game;

    saveGames();
    form.reset();
    editingIndex = null;
    closeForm();
    updateGames();
}

function renderGames(gameArray) {
    gameCards.innerHTML = "";
    resultCount.textContent = `${gameArray.length} ${gameArray.length === 1 ? "game" : "games"}`;

    if (gameArray.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.innerHTML = `<div class="empty-state-icon">✦</div><h3>${games.length ? "No games found" : "Your library is empty"}</h3><p>${games.length ? "Try changing your search or filters." : "Add your first game to start building your collection."}</p>`;
        gameCards.appendChild(empty);
        updateStatistics();
        return;
    }

    gameArray.forEach(game => {
        const index = games.indexOf(game);
        const card = document.createElement("article");
        card.className = "game-card";
        card.innerHTML = `
            <div class="card-top"><div><h3></h3><p class="genre"></p></div><span class="status-badge status-${game.status}">${game.status}</span></div>
            <div class="card-meta"><span class="meta-label">Rating</span><span class="rating">★ ${game.rating}<span>/ 10</span></span></div>
            <div class="card-actions"><button class="card-action edit" type="button">Edit</button><button class="card-action delete" type="button">Delete</button></div>`;
        card.querySelector("h3").textContent = game.name;
        card.querySelector(".genre").textContent = game.genre;
        card.querySelector(".edit").addEventListener("click", () => editGame(index));
        card.querySelector(".delete").addEventListener("click", () => deleteGame(index));
        gameCards.appendChild(card);
    });
    updateStatistics();
}

function updateGames() {
    const status = gameStatusFilter.value;
    const search = gameSearch.value.trim().toLowerCase();
    const filtered = games.filter(game => (status === "all" || game.status === status) && game.name.toLowerCase().includes(search));
    const sorted = [...filtered];
    const sortType = gameSort.value;
    if (sortType === "last") sorted.sort((a, b) => b.addGameDate - a.addGameDate);
    if (sortType === "oldest") sorted.sort((a, b) => a.addGameDate - b.addGameDate);
    if (sortType === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    if (sortType === "best") sorted.sort((a, b) => b.rating - a.rating);
    if (sortType === "worst") sorted.sort((a, b) => a.rating - b.rating);
    renderGames(sorted);
}

function openForm(game = null, index = null) {
    editingIndex = index;
    formTitle.textContent = game ? "Edit game" : "Add a new game";
    addGameButton.textContent = game ? "Save changes" : "Add game";
    if (game) {
        document.getElementById("gameName").value = game.name;
        document.getElementById("gameGenre").value = game.genre;
        document.getElementById("gameStatus").value = game.status;
        document.getElementById("gameRating").value = game.rating;
    } else form.reset();
    addGameSection.classList.add("is-visible");
    gameList.style.display = "none";
    document.getElementById("gameName").focus();
}

function closeForm() {
    editingIndex = null;
    addGameSection.classList.remove("is-visible");
    gameList.style.display = "block";
}

function editGame(index) { openForm(games[index], index); }

function deleteGame(index) {
    games.splice(index, 1);
    saveGames();
    updateGames();
}

function saveGames() { localStorage.setItem("games", JSON.stringify(games)); }

function loadGames() {
    const saved = localStorage.getItem("games");
    if (saved) {
        try { games = JSON.parse(saved); }
        catch (error) { console.error("Unable to load saved games.", error); }
    }
}
