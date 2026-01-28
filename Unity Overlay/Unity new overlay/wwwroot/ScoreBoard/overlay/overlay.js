import { getData } from "../../GlobalShared/Scripts/sb.js";
import { getTitleAsText, getGameNumAsText, getTeam1AsText, getTeam2AsText } from "../../GlobalShared/Scripts/functions.js";

var t1Name, t2Name;
// title stuff
var title = document.getElementById("sb-titleText");
var gameNumber = document.getElementById("sb-gameNumber");
var totalGames = document.getElementById("sb-totalGames");

// team stuff
var blueTeamName = document.getElementById("sb-blueTeamName");
var blueTeamLogo = document.getElementById("sb-blueLogo");
var blueTeamScore = document.getElementById("sb-blueScore");

var orangeTeamName = document.getElementById("sb-orangeTeamName");
var orangeTeamLogo = document.getElementById("sb-orangeLogo");
var orangeTeamScore = document.getElementById("sb-orangeScore");

var blueTotScore, blueTotGoals, blueTotAssists, blueTotShots, blueTotSaves, blueTotTouches, blueTotDemos;
var orangeTotScore, orangeTotGoals, orangeTotAssists, orangeTotShots, orangeTotSaves, orangeTotTouches, orangeTotDemos;

document.addEventListener("DOMContentLoaded", () => {
    
    resetTotals();
    setInterval(updateOverlay, 1000);
});

async function updateOverlay() {

    const data = await getData();
    const games = await getGameNumAsText();
    const titleText = await getTitleAsText();

    gameNumber.textContent = "GAME " + (data.gameNumber);
    updatePlayers(data);

    t1Name = await getTeam1AsText();
    t2Name = await getTeam2AsText();

    blueTeamName.textContent = t1Name;
    orangeTeamName.textContent = t2Name;
    totalGames.textContent = "OF " + games;
    title.textContent = titleText;

    const timestamp = Date.now(); // unique key every second

    blueTeamLogo.src = `/TeamLogos/team_1_logo.png?t=${timestamp}`;
    orangeTeamLogo.src = `/TeamLogos/team_2_logo.png?t=${timestamp}`;
}

function updatePlayers(data) {
    resetTotals();
    if (data.teams.has("0") && data.teams.has("1")) {
        var t1 = data.teams.get("0");
        var t2 = data.teams.get("1");

        blueTeamScore.textContent = t1.score;
        orangeTeamScore.textContent = t2.score;

        t1Name = getTeam1AsText();
        if (t1Name === "") blueTeamName.textContent = t1.name;

        t2Name = getTeam2AsText();
        if (t2Name === "") orangeTeamName.textContent = t2.name;

        var x = 3;
        for (var player of t1.players) {
            if (x == 0) break;
            if (player != null) {
                updatePlayer(player, x, "blue");
            }
            x--;
        }

        x = 1;
        for (var player of t2.players) {
            if (x == 4) break;
            if (player != null) {
                updatePlayer(player, x, "orange");
            }
            x++;
        }

        updateSliders()
    }
}

function updateSliders() {
    updateSlider(blueTotScore, orangeTotScore, "score");
    updateSlider(blueTotGoals, orangeTotGoals, "goals");
    updateSlider(blueTotAssists, orangeTotAssists, "assists");
    updateSlider(blueTotShots, orangeTotShots, "shots");
    updateSlider(blueTotSaves, orangeTotSaves, "saves");
    updateSlider(blueTotTouches, orangeTotTouches, "touches");
    updateSlider(blueTotDemos, orangeTotDemos, "demos");
}

function updateSlider(val1, val2, element) {
    var offset = getSliderPos(val1, val2);
    var elem = document.getElementById("sb-"+element + "Skew");

    elem.style.transform = "";

    elem.style.transform = "translate(" + (offset) + "px," + (0) + "px)";
}
function updatePlayer(player, pos, col) {
    // Update DOM
    document.getElementById("sb-"+col + "Player" + pos).textContent = player.name;
    document.getElementById("sb-"+col + "Score" + pos).textContent = player.score;
    document.getElementById("sb-"+col + "Goals" + pos).textContent = player.goals;
    document.getElementById("sb-"+col + "Assists" + pos).textContent = player.assists;
    document.getElementById("sb-"+col + "Shots" + pos).textContent = player.shots;
    document.getElementById("sb-"+col + "Saves" + pos).textContent = player.saves;
    document.getElementById("sb-"+col + "Touches" + pos).textContent = player.touches;
    document.getElementById("sb-"+col + "Demos" + pos).textContent = player.demos;

    // Update totals
    if (col === "blue") {
        blueTotScore += player.score;
        blueTotGoals += player.goals;
        blueTotAssists += player.assists;
        blueTotShots += player.shots;
        blueTotSaves += player.saves;
        blueTotTouches += player.touches;
        blueTotDemos += player.demos;
    } else if (col === "orange") {
        orangeTotScore += player.score;
        orangeTotGoals += player.goals;
        orangeTotAssists += player.assists;
        orangeTotShots += player.shots;
        orangeTotSaves += player.saves;
        orangeTotTouches += player.touches;
        orangeTotDemos += player.demos;
    }
}

function resetTotals() {
    blueTotScore = 0;
    blueTotGoals = 0;
    blueTotAssists = 0;
    blueTotShots = 0;
    blueTotSaves = 0;
    blueTotTouches = 0;
    blueTotDemos = 0;

    orangeTotScore = 0;
    orangeTotGoals = 0;
    orangeTotAssists = 0;
    orangeTotShots = 0;
    orangeTotSaves = 0;
    orangeTotTouches = 0;
    orangeTotDemos = 0;
}


function getSliderPos(val1, val2) {
    if (val1 === 0 && val2 === 0) return 0;
    if (val1 === 0) return -97.5;
    if (val2 === 0) return 97.5;

    const diff = val1 - val2;
    const total = val1 + val2;
    const ratio = diff / total; // -1 → 1
    return ratio * 97.5;
}