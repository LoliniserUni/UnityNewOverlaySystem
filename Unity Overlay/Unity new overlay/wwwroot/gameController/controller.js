import { getTeam1, getTeam2, getTitleAsText, getGameNumAsText } from "/GlobalShared/scripts/functions.js";

getTeam1("t1Name");
getTeam2("t2Name");
loadLogo("team1LogoPreview", "../../TeamLogos/team_1_logo.png");
loadLogo("team2LogoPreview", "../../TeamLogos/team_2_logo.png");


document.getElementById("titleInput").value = "" + await getTitleAsText();
document.getElementById("numGames").value = await getGameNumAsText();
function updateLogo(imgId, url) {
    document.getElementById(imgId).src = `${url}?v=${Date.now()}`;
}
function loadLogo(imgId, basePath) {
    document.getElementById(imgId).src =
        `${basePath}?v=${Date.now()}`;
}

// Save Team 1
document.getElementById("saveT1").addEventListener("click", async () => {
    const status = document.getElementById("team1Status");
    const fileInput = document.getElementById("t1Image");
    const team1NameInput = document.getElementById("t1Name");

    status.textContent = "Saving...";
    try {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload/teamLogo/1", { method: "POST", body: formData });
            const data = await res.json();
            updateLogo("team1LogoPreview", data.url);
        }

        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team1: team1NameInput.value })
        });

        if (!response.ok) throw new Error("Server error");

        status.textContent = "✅ Team 1 saved successfully!";
    } catch (err) {
        console.error(err);
        status.textContent = "⚠️ Failed to save Team 1.";
    }
});

// Save Team 2
document.getElementById("saveT2").addEventListener("click", async () => {
    const status = document.getElementById("team2Status");
    const fileInput = document.getElementById("t2Image");
    const team2NameInput = document.getElementById("t2Name");

    status.textContent = "Saving...";
    try {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload/teamLogo/2", { method: "POST", body: formData });
            const data = await res.json();
            updateLogo("team2LogoPreview", data.url);
        }

        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team2: team2NameInput.value })
        });

        if (!response.ok) throw new Error("Server error");

        status.textContent = "✅ Team 2 saved successfully!";
    } catch (err) {
        console.error(err);
        status.textContent = "⚠️ Failed to save Team 2.";
    }
});

// Swap Teams
document.getElementById("swapTeams").addEventListener("click", async () => {
    const status = document.getElementById("swapStatus");
    status.textContent = "Swapping...";
    try {
        const t1Name = document.getElementById("t1Name");
        const t2Name = document.getElementById("t2Name");
        const t1Logo = document.getElementById("team1LogoPreview");
        const t2Logo = document.getElementById("team2LogoPreview");

        // Swap UI
        [t1Name.value, t2Name.value] = [t2Name.value, t1Name.value];
        [t1Logo.src, t2Logo.src] = [t2Logo.src, t1Logo.src];

        // Swap files on server
        const res = await fetch("/api/upload/swapTeamLogos", { method: "POST" });
        const data = await res.json();
        if (!data.swapped) throw new Error("Server failed swap");

        // Save new names
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team1: t1Name.value, team2: t2Name.value })
        });
        if (!response.ok) throw new Error("Failed to save swapped names");

        status.textContent = "✅ Teams swapped successfully!";
    } catch (err) {
        console.error(err);
        status.textContent = "⚠️ Failed to swap teams.";
    }
});

// Save Games
document.getElementById("saveGames").addEventListener("click", async () => {
    const status = document.getElementById("gamesStatus");
    const totalGamesInput = document.getElementById("numGames").value;
    status.textContent = "Saving...";
    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalGames: totalGamesInput })
        });
        if (!response.ok) throw new Error("Server error");
        status.textContent = "✅ Games saved successfully!";
    } catch (err) {
        console.error(err);
        status.textContent = "⚠️ Failed to save games.";
    }
});

// Save Title
document.getElementById("titleSave").addEventListener("click", async () => {
    const status = document.getElementById("titleStatus");
    const titleInput = document.getElementById("titleInput").value;
    status.textContent = "Saving...";
    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: titleInput })
        });
        if (!response.ok) throw new Error("Server error");
        status.textContent = "✅ Title saved successfully!";
    } catch (err) {
        console.error(err);
        status.textContent = "⚠️ Failed to save title.";
    }
});
