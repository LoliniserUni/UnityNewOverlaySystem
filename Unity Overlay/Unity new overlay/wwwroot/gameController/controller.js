import { getTeam1, getTeam2, getTitleAsText, getGameNumAsText } from "/GlobalShared/scripts/functions.js";

document.getElementById("team1LogoPreview").src = "../../TeamLogos/team_1_logo.png";
getTeam1("t1Name");
getTeam2("t2Name");
document.getElementById("titleInput").value = "" + await getTitleAsText();
document.getElementById("numGames").value = await getGameNumAsText();

document.getElementById("saveGames").addEventListener("click", async () => {
    const totalGamesInput = document.getElementById("numGames").value;

    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalGames: totalGamesInput })
        });

        if (!response.ok) throw new Error("Server error");
    } catch (err) {
        console.error(err);
    }
});

document.getElementById("titleSave").addEventListener("click", async () => {
    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: document.getElementById("titleInput").value })
        });
    } catch (err) {
        console.error(err);
    }
});
document.getElementById("saveT1").addEventListener("click", async () => {
    
    const fileInput = document.getElementById("t1Image");
    const team1NameInput = document.getElementById("t1Name");
    
    const file = fileInput.files[0];
    if (file) {

        console.log("saving");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/teamLogo/1", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log("Saved URL:", data.url);

        document.getElementById("team1LogoPreview").src = data.url;
    }
    
    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team1: team1NameInput.value })
        });

        if (!response.ok) throw new Error("Server error");

    } catch (err) {
        console.error(err);
    }
});


document.getElementById("team2LogoPreview").src = "../../TeamLogos/team_2_logo.png";

document.getElementById("saveT2").addEventListener("click", async () => {

    const fileInput = document.getElementById("t2Image");
    const team2NameInput = document.getElementById("t2Name");

    const file = fileInput.files[0];
    if (file) {

        console.log("saving");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/teamLogo/2", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log("Saved URL:", data.url);

        document.getElementById("team2LogoPreview").src = data.url;
    }

    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team2: team2NameInput.value })
        });

        if (!response.ok) throw new Error("Server error");

    } catch (err) {
        console.error(err);
    }
});

document.getElementById("swapTeams").addEventListener("click", async () => {

    // -----------------------------
    // Swap UI Text
    // -----------------------------
    const t1Name = document.getElementById("t1Name");
    const t2Name = document.getElementById("t2Name");

    const tmpName = t1Name.value;
    t1Name.value = t2Name.value;
    t2Name.value = tmpName;

    // -----------------------------
    // Swap UI Images
    // -----------------------------
    const t1Logo = document.getElementById("team1LogoPreview");
    const t2Logo = document.getElementById("team2LogoPreview");

    const tmpLogo = t1Logo.src;
    t1Logo.src = t2Logo.src;
    t2Logo.src = tmpLogo;

    // -----------------------------
    // Swap Saved Image Files
    // -----------------------------
    try {
        const res = await fetch("/api/upload/swapTeamLogos", { method: "POST" });
        const data = await res.json();
        if (!data.swapped) console.error(data);
    } catch (e) {
        console.error("Failed to swap images:", e);
    }

    // -----------------------------
    // Swap Saved JSON Config
    // -----------------------------
    try {
        const response = await fetch(`/api/controller/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                team1: t1Name.value,
                team2: t2Name.value
            })
        });

        if (!response.ok)
            throw new Error("Failed to save swapped team names");

    } catch (err) {
        console.error("Config save failed:", err);
    }

});
