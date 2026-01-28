import { getData } from "../../GlobalShared/Scripts/sb.js";
import { getTitleAsText, getGameNumAsText, getTeam1AsText, getTeam2AsText } from "../../GlobalShared/Scripts/functions.js";

var title = document.getElementById("gameInfo");
var bottomBar = document.getElementById("bottomBar");
var boostCircleParent = document.getElementById("boostCircleParent");
const playerPositions = {};
var lastActiveID;
var lastActiveCol;

//replay bar
var goalScorer = document.getElementById("goalScorer");
var goalSpeed = document.getElementById("goalSpeed");
var goalAssister = document.getElementById("goalAssister");
var replayBar = document.getElementById("replayBar");

//teams stuff
var blueTeamName = document.getElementById("blueTeamName");
var blueTeamScore = document.getElementById("blueScoreText");
var blueWins1 = document.getElementById("blueWinCheck1");
var blueWins2 = document.getElementById("blueWinCheck2");
var blueWins3 = document.getElementById("blueWinCheck3");
var blueWins4 = document.getElementById("blueWinCheck4");

var orangeTeamName = document.getElementById("orangeTeamName");
var orangeTeamScore = document.getElementById("orangeScoreText");
var orangeWins1 = document.getElementById("orangeWinCheck1");
var orangeWins2 = document.getElementById("orangeWinCheck2");
var orangeWins3 = document.getElementById("orangeWinCheck3");
var orangeWins4 = document.getElementById("orangeWinCheck4");

var firstTo = 0;

//game vars
var gameNum = document.getElementById("gameNum");
var totalGames = document.getElementById("seriesLen");
var timer = document.getElementById("timerText");

//active player
var line = document.getElementById("activePlayerLine");
var activePlayerName = document.getElementById("activePlayerText");
var activePlayerScore = document.getElementById("scoreText");
var activePlayerGoals = document.getElementById("goalsText");
var activePlayerAssists = document.getElementById("assistsText");
var activePlayerSaves = document.getElementById("savesText");
var activePlayerShots = document.getElementById("shotsText");

var activePlayerBoost = document.getElementById("boostAmountText");
var boostCircle = document.getElementById("boostVisualCircle");

//players stuff
var bluePlayer1 = document.getElementById("bluePlayer1Name");
var bluePlayer2 = document.getElementById("bluePlayer2Name");
var bluePlayer3 = document.getElementById("bluePlayer3Name");
var bluePlayer1Boost = document.getElementById("bluePlayer1Boost");
var bluePlayer2Boost = document.getElementById("bluePlayer2Boost");
var bluePlayer3Boost = document.getElementById("bluePlayer3Boost");
var bluePlayer1boostVisual = document.getElementById("bluePlayer1BoostVis");
var bluePlayer2boostVisual = document.getElementById("bluePlayer2BoostVis");
var bluePlayer3boostVisual = document.getElementById("bluePlayer3BoostVis");

var orangePlayer1 = document.getElementById("orangePlayer1Name");
var orangePlayer2 = document.getElementById("orangePlayer2Name");
var orangePlayer3 = document.getElementById("orangePlayer3Name");
var orangePlayer1Boost = document.getElementById("orangePlayer1Boost");
var orangePlayer2Boost = document.getElementById("orangePlayer2Boost");
var orangePlayer3Boost = document.getElementById("orangePlayer3Boost");
var orangePlayer1boostVisual = document.getElementById("orangePlayer1BoostVis");
var orangePlayer2boostVisual = document.getElementById("orangePlayer2BoostVis");
var orangePlayer3boostVisual = document.getElementById("orangePlayer3BoostVis");

var sbUpdated = false;
var t1Name, t2Name;
// title stuff
var sbtitle = document.getElementById("sb-titleText");
var gameNumber = document.getElementById("sb-gameNumber");
var sbtotalGames = document.getElementById("sb-totalGames");

// team stuff
var sbblueTeamName = document.getElementById("sb-blueTeamName");
var blueTeamLogo = document.getElementById("sb-blueLogo");
var sbblueTeamScore = document.getElementById("sb-blueScore");

var sborangeTeamName = document.getElementById("sb-orangeTeamName");
var orangeTeamLogo = document.getElementById("sb-orangeLogo");
var sborangeTeamScore = document.getElementById("sb-orangeScore");

var blueTotScore, blueTotGoals, blueTotAssists, blueTotShots, blueTotSaves, blueTotTouches, blueTotDemos;
var orangeTotScore, orangeTotGoals, orangeTotAssists, orangeTotShots, orangeTotSaves, orangeTotTouches, orangeTotDemos;

document.addEventListener("DOMContentLoaded", () => {
    setInterval(updateOverlay, 33);
});

async function updateOverlay(){
    const data = await getData();
    const games = await getGameNumAsText();

    firstTo = getFirstTo(games);
    const titleText = await getTitleAsText();

    gameNum.textContent = "GAME " + (data.gameNumber);

    var t1Name = await getTeam1AsText();
    var t2Name = await getTeam2AsText();

    blueTeamName.textContent = t1Name;
    orangeTeamName.textContent = t2Name;
    totalGames.textContent = "BEST OF " + games;
    title.textContent = titleText;
    
    if (data.lastMatchEnded != null) {
        document.getElementById("gameOverlay").style.visibility = "hidden";
        document.getElementById("scoreBoardScreen").style.visibility = "visible";

        if (sbUpdated == false) {
            sbUpdated = true;
            updateOverlaySB();
        }
    }
    else {
        document.getElementById("gameOverlay").style.visibility = "visible";
        document.getElementById("scoreBoardScreen").style.visibility = "hidden";
        sbUpdated = false;
    }


    updateCentreBoard(data);
    updatePlayers(data);
    updateActivePlayer(data);

    updateTeams(data);
    replayOverlay(data);
}

function replayOverlay(data) {
    resetTotals();
    if (data.state.isReplay) {
        updateReplayBar(data);
        bottomBar.style.visibility = "hidden";
        boostCircleParent.style.visibility = "hidden";
        replayBar.style.visibility = "visible";
    }
    else {
        bottomBar.style.visibility = "visible";
        boostCircleParent.style.visibility = "visible";
        replayBar.style.visibility = "hidden";
    }
}
function updateReplayBar(data) {
    var goal = data.lastGoal;

    var lStatFeed = data.lastStatFeed;

    goalScorer.textContent = goal.scorer ? goal.scorer.name : "N/A";
    goalSpeed.textContent = goal.goalSpeed ? Math.round(goal.goalSpeed) + " KPH" : "N/A";

    if (lStatFeed.eventName == "Assist") {
        goalAssister.textContent = lStatFeed.mainTarget ? lStatFeed.mainTarget.name : "N/A";

        document.getElementById("replayStatsBox").classList.add("active");
        document.getElementById("replayStats").classList.add("active");
    } else {

        document.getElementById("replayStatsBox").classList.remove("active");
        document.getElementById("replayStats").classList.remove("active");
    }
}
function updateTeams(data) {

    const blueTeam = data.teams.get("0");
    const orangeTeam = data.teams.get("1");

    console.log(blueTeam);
    console.log(orangeTeam);

    updateWinBoxes(0, blueTeam.gameWins);
    updateWinBoxes(1, orangeTeam.gameWins);

}
function getFirstTo(bestOf) {
    bestOf = Number(bestOf);
    if (!Number.isFinite(bestOf) || bestOf < 1) return 1;

    // Even BO → half
    if (bestOf % 2 === 0) {
        return Math.min(bestOf / 2, 4);
    }

    // Odd BO → majority
    return Math.min(Math.floor(bestOf / 2) + 1, 4);
}

function updateWinBoxes(team, wins) {
    if (team === 0) team = "blue";
    if (team === 1) team = "orange";

    const boxes = document.querySelectorAll(`.${team}WinCheck`);
    if (!boxes.length) return;

    const safeWins = Math.min(wins, firstTo);

    boxes.forEach((box, index) => {
        box.style.display = index < firstTo ? "block" : "none";
        box.classList.toggle("active", index < safeWins);
    });
}



function updateActivePlayer(data) {
    if (lastActiveCol == 1) {
        setPlayerActive(lastActiveID, false);
    } else {
        setPlayerActive(lastActiveID, false);
    }

    var cPlayer = getPlayerByID(data.currentPlayerID, data);

    if (cPlayer == null || cPlayer.name == null || cPlayer.name=="") {

        bottomBar.style.visibility = "hidden";
        boostCircleParent.style.visibility = "hidden";

        return null;
    }
    var cTeam = getTeamByPlayerName(cPlayer.name, data);


    bottomBar.style.visibility = "visible";
    boostCircleParent.style.visibility = "visible";

    activePlayerName.textContent = cPlayer.name;
    activePlayerScore.textContent = cPlayer.score;
    activePlayerGoals.textContent = cPlayer.goals;
    activePlayerAssists.textContent = cPlayer.assists;
    activePlayerSaves.textContent = cPlayer.saves;
    activePlayerShots.textContent = cPlayer.shots;
    activePlayerBoost.textContent = cPlayer.boost;
    boostCircle.style.setProperty('--boost', cPlayer.boost * 0.75);

    if (cTeam == 1) {
        line.style.backgroundColor = 'var(--OrangeCol)';
        boostCircle.style.background = 'conic-gradient( from -90deg, var(--OrangeCol) calc(var(--boost) * 1%), transparent 0 )';
        activePlayerBoost.style.color = 'var(--OrangeCol)';


        setPlayerActive(cPlayer.id, true);
    } else {
        line.style.backgroundColor = 'var(--BlueCol)';
        boostCircle.style.background = 'conic-gradient( from -90deg, var(--BlueCol) calc(var(--boost) * 1%), transparent 0 )';
        activePlayerBoost.style.color = 'var(--BlueCol)';

        setPlayerActive(cPlayer.id, true);
    }

    lastActiveID = cPlayer.id;

}
function updateCentreBoard(data) {
    blueTeamScore.textContent = data.teams.get("0").score;
    orangeTeamScore.textContent = data.teams.get("1").score;

    if (data.state.isOT) {
        timer.textContent = "+"+formatTime(data.lastTime);
    }
    else {
        timer.textContent = formatTime(data.lastTime);
    }
}

function updatePlayers(data) {
    if (data.teams.has("0") && data.teams.has("1")) {
        const t1 = data.teams.get("0"); // Blue
        const t2 = data.teams.get("1"); // Orange

        // -------------------
        // BLUE TEAM: slots 3,2,1
        // -------------------
        let maxBlueSlots = 3;
        // Track which slots are filled
        const filledBlueSlots = new Set();

        let x = 3;
        for (const player of t1.players) {
            if (x === 0) break;
            if (player != null) {
                playerPositions[player.id] = { team: "blue", slot: x };
                updatePlayer(player);
                filledBlueSlots.add(x);
            }
            x--;
        }

        // Hide unused blue slots
        for (let slot = 1; slot <= maxBlueSlots; slot++) {
            if (!filledBlueSlots.has(slot)) {
                const container = document.getElementById(`bluePlayer${slot}`);
                if (container) container.style.display = "none";
            }
        }

        // -------------------
        // ORANGE TEAM: slots 1,2,3
        // -------------------
        let maxOrangeSlots = 3;
        const filledOrangeSlots = new Set();

        x = 1;
        for (const player of t2.players) {
            if (x === 4) break;
            if (player != null) {
                playerPositions[player.id] = { team: "orange", slot: x };
                updatePlayer(player);
                filledOrangeSlots.add(x);
            }
            x++;
        }

        // Hide unused orange slots
        for (let slot = 1; slot <= maxOrangeSlots; slot++) {
            if (!filledOrangeSlots.has(slot)) {
                const container = document.getElementById(`orangePlayer${slot}`);
                if (container) container.style.display = "none";
            }
        }
    }
}



function updatePlayer(player) {
    const info = playerPositions[player.id];
    if (!info) return; // player not in dictionary yet

    const { team, slot } = info;

    // Build DOM element IDs dynamically
    const playerContainer = document.getElementById(`${team}Player${slot}`);
    const nameEl = document.getElementById(`${team}Player${slot}Name`);
    const boostEl = document.getElementById(`${team}Player${slot}Boost`);
    const boostVisualEl = document.getElementById(`${team}Player${slot}BoostVis`);

    if (playerContainer) {
        // Show or hide the slot based on whether a player exists
        playerContainer.style.display = player ? "block" : "none";
    }

    if (!player) return; // nothing else to update if player doesn't exist

    if (nameEl) nameEl.textContent = player.name;
    if (boostEl) boostEl.textContent = player.boost;

    if (boostVisualEl) {
        if (team === "blue") {
            boostVisualEl.style.transform = `translateX(${player.boost * 4 - 400}px)`;
        } else if (team === "orange") {
            boostVisualEl.style.transform = `translateX(${player.boost * -4 + 400}px)`;
        }
    }
}



function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getPlayerByID(ID, data) {
    if (data.teams.has("0") && data.teams.has("1")) {
        var t1 = data.teams.get("0");
        var t2 = data.teams.get("1");

        for (var player of t1.players) {
            if (player != null) {
                if (player.id == ID) {
                    return player;
                }
            }
        }

        for (var player of t2.players) {
            if (player != null) {
                if (player.id == ID) {
                    return player;
                }
            }
        }
    }

    return null;
}

function getTeamByPlayerName(name, data) {
    if (data.teams.has("0") && data.teams.has("1")) {
        var t1 = data.teams.get("0");
        var t2 = data.teams.get("1");

        for (var player of t1.players) {
            if (player != null) {
                if (player.name == name) {
                    return 0;
                }
            }
        }

        for (var player of t2.players) {
            if (player != null) {
                if (player.name == name) {
                    return 1;
                }
            }
        }
    }
}

function setPlayerActive(playerID, isActive) {
    const info = playerPositions[playerID];
    if (!info) {
        //console.warn(`Player ID ${playerID} not found in playerPositions!`);
        return;
    }

    // Build element ID dynamically
    const boostLineID = `${info.team}Player${info.slot}BoostVis`;
    const boostVis = document.getElementById(boostLineID);
    if (!boostVis) {
        console.warn(`Boost element ${boostLineID} not found!`);
        return;
    }

    const playerElement = boostVis.closest(`.${info.team}Player`);
    if (!playerElement) return;

    if (isActive) playerElement.classList.add("active");
    else playerElement.classList.remove("active");
}

async function updateOverlaySB() {

    const data = await getData();
    const games = await getGameNumAsText();
    const sbtitleText = await getTitleAsText();

    gameNumber.textContent = "GAME " + (data.gameNumber);
    updatePlayersSB(data);

    t1Name = await getTeam1AsText();
    t2Name = await getTeam2AsText();

    sbblueTeamName.textContent = t1Name;
    sborangeTeamName.textContent = t2Name;
    sbtotalGames.textContent = "OF " + games;
    sbtitle.textContent = sbtitleText;

    const timestamp = Date.now(); // unique key every second

    blueTeamLogo.src = `/TeamLogos/team_1_logo.png?t=${timestamp}`;
    orangeTeamLogo.src = `/TeamLogos/team_2_logo.png?t=${timestamp}`;
}

function updatePlayersSB(data) {
    resetTotals();
    if (data.teams.has("0") && data.teams.has("1")) {
        var t1 = data.teams.get("0");
        var t2 = data.teams.get("1");

        sbblueTeamScore.textContent = t1.score;
        sborangeTeamScore.textContent = t2.score;

        t1Name = getTeam1AsText();
        if (t1Name === "") blueTeamName.textContent = t1.name;

        t2Name = getTeam2AsText();
        if (t2Name === "") orangeTeamName.textContent = t2.name;

        var x = 3;
        for (var player of t1.players) {
            if (x == 0) break;
            if (player != null) {
                updatePlayerSB(player, x, "blue");
            }
            x--;
        }

        x = 1;
        for (var player of t2.players) {
            if (x == 4) break;
            if (player != null) {
                updatePlayerSB(player, x, "orange");
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
    var elem = document.getElementById("sb-" + element + "Skew");

    elem.style.transform = "";

    elem.style.transform = "translate(" + (offset) + "px," + (0) + "px)";
}
function updatePlayerSB(player, pos, col) {
    // Update DOM
    document.getElementById("sb-" + col + "Player" + pos).textContent = player.name;
    document.getElementById("sb-" + col + "Score" + pos).textContent = player.score;
    document.getElementById("sb-" + col + "Goals" + pos).textContent = player.goals;
    document.getElementById("sb-" + col + "Assists" + pos).textContent = player.assists;
    document.getElementById("sb-" + col + "Shots" + pos).textContent = player.shots;
    document.getElementById("sb-" + col + "Saves" + pos).textContent = player.saves;
    document.getElementById("sb-" + col + "Touches" + pos).textContent = player.touches;
    document.getElementById("sb-" + col + "Demos" + pos).textContent = player.demos;

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