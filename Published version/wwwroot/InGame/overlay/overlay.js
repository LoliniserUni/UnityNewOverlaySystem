import { getData } from "../../GlobalShared/Scripts/sb.js";
import { getTitleAsText, getGameNumAsText, getTeam1AsText, getTeam2AsText } from "../../GlobalShared/Scripts/functions.js";

var title = document.getElementById("gameInfo");
var bottomBar = document.getElementById("bottomBar");
var boostCircleParent = document.getElementById("boostCircleParent");
const playerPositions = {};
var lastActiveID;

const icons = [
    document.getElementById("goalReplayStat"),
    document.getElementById("shotReplayStat"),
    document.getElementById("assistReplayStat")
];

const overlayCache = {
    gameNumber: null,
    title: null,
    team1: null,
    team2: null,
    bestOf: null,
};

const assistStats = document.getElementById("assistStats");
const gameOverlayEl = document.getElementById("gameOverlay");
const scoreboardEl = document.getElementById("scoreBoardScreen");

let isScoreboardVisible = false;

//replay bar
var goalScorer = document.getElementById("goalScorer");
var goalSpeed = document.getElementById("goalSpeed");
var goalAssister = document.getElementById("goalAssister");
var replayBar = document.getElementById("replayBar");
var replayStatsBox = document.getElementById("replayStatsBox");
var replayStats = document.getElementById("replayStats");

//teams stuff
var blueTeamName = document.getElementById("blueTeamName");
var blueTeamScore = document.getElementById("blueScoreText");

var orangeTeamName = document.getElementById("orangeTeamName");
var orangeTeamScore = document.getElementById("orangeScoreText");

const winBoxes = {
    blue: [
        document.getElementById("blueWinCheck1"),
        document.getElementById("blueWinCheck2"),
        document.getElementById("blueWinCheck3"),
        document.getElementById("blueWinCheck4"),
    ],
    orange: [
        document.getElementById("orangeWinCheck1"),
        document.getElementById("orangeWinCheck2"),
        document.getElementById("orangeWinCheck3"),
        document.getElementById("orangeWinCheck4"),
    ]
};


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
const playerDets = {
    blue: {
        1: {
            name: document.getElementById("bluePlayer1Name"),
            boost: document.getElementById("bluePlayer1Boost"),
            boostVis: document.getElementById("bluePlayer1BoostVis"),
            container: document.getElementById("bluePlayer1")
        },
        2: {
            name: document.getElementById("bluePlayer2Name"),
            boost: document.getElementById("bluePlayer2Boost"),
            boostVis: document.getElementById("bluePlayer2BoostVis"),
            container: document.getElementById("bluePlayer2")
        },
        3: {
            name: document.getElementById("bluePlayer3Name"),
            boost: document.getElementById("bluePlayer3Boost"),
            boostVis: document.getElementById("bluePlayer3BoostVis"),
            container: document.getElementById("bluePlayer3")
        },
        4: {
            name: document.getElementById("bluePlayer4Name"),
            boost: document.getElementById("bluePlayer4Boost"),
            boostVis: document.getElementById("bluePlayer4BoostVis"),
            container: document.getElementById("bluePlayer4")
        },
    },
    orange: {
        1: {
            name: document.getElementById("orangePlayer1Name"),
            boost: document.getElementById("orangePlayer1Boost"),
            boostVis: document.getElementById("orangePlayer1BoostVis"),
            container: document.getElementById("orangePlayer1")
        },
        2: {
            name: document.getElementById("orangePlayer2Name"),
            boost: document.getElementById("orangePlayer2Boost"),
            boostVis: document.getElementById("orangePlayer2BoostVis"),
            container: document.getElementById("orangePlayer2")
        },
        3: {
            name: document.getElementById("orangePlayer3Name"),
            boost: document.getElementById("orangePlayer3Boost"),
            boostVis: document.getElementById("orangePlayer3BoostVis"),
            container: document.getElementById("orangePlayer3")
        },
        4: {
            name: document.getElementById("orangePlayer4Name"),
            boost: document.getElementById("orangePlayer4Boost"),
            boostVis: document.getElementById("orangePlayer4BoostVis"),
            container: document.getElementById("orangePlayer4")
        },
    }
};

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

var playerIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    setInterval(updateOverlay, 33);
});
async function updateOverlay() {
    const data = await getData();

    playerIndex = buildPlayerIndex(data);

    // GAME NUMBER
    const gameText = "GAME " + data.gameNumber;
    if (overlayCache.gameNumber !== gameText) {
        overlayCache.gameNumber = gameText;
        gameNum.textContent = gameText;
    }

    // TITLE
    const titleText = await getTitleAsText();
    if (overlayCache.title !== titleText) {
        overlayCache.title = titleText;
        title.textContent = titleText;
    }

    // TEAMS
    const t1Name = await getTeam1AsText();
    const t2Name = await getTeam2AsText();

    if (overlayCache.team1 !== t1Name) {
        overlayCache.team1 = t1Name;
        blueTeamName.textContent = t1Name;
    }

    if (overlayCache.team2 !== t2Name) {
        overlayCache.team2 = t2Name;
        orangeTeamName.textContent = t2Name;
    }

    // BEST OF
    const games = await getGameNumAsText();
    if (overlayCache.bestOf !== games) {
        overlayCache.bestOf = games;
        totalGames.textContent = "BEST OF " + games;
        firstTo = getFirstTo(games);
    }

    // Match end toggle
    handleOverlayVisibility(data);

    // Fast-changing systems
    updateCentreBoard(data);
    updatePlayers(data);
    updateActivePlayer(data);
    updateTeams(data);
    replayOverlay(data);
}

function handleOverlayVisibility(data) {
    const shouldShowScoreboard = data.lastMatchEnded != null;

    // No state change → do nothing
    if (shouldShowScoreboard === isScoreboardVisible) return;

    isScoreboardVisible = shouldShowScoreboard;

    if (shouldShowScoreboard) {
        gameOverlayEl.style.visibility = "hidden";
        //scoreboardEl.style.visibility = "visible";
        scoreboardEl.classList.add("show");

        if (!sbUpdated) {
            sbUpdated = true;
            updateOverlaySB();
        }
    } else {
        gameOverlayEl.style.visibility = "visible";
        scoreboardEl.classList.remove("show");
        sbUpdated = false;
    }
}

function buildPlayerIndex(data) {
    const index = new Map();

    for (const team of data.teams.values()) {
        for (const player of team.players) {
            if (player?.id) {
                index.set(player.id, player);
            }
        }
    }

    return index;
}

function replayOverlay(data) {
    const isReplay = data.state?.isReplay;
    const hasTarget = data.state?.hasTarget;

    updateReplayBar(data);

    const showBottomBar = hasTarget && !isReplay;

    bottomBar.style.visibility = showBottomBar ? "visible" : "hidden";
    boostCircleParent.style.visibility = showBottomBar ? "visible" : "hidden";
    replayBar.style.visibility = isReplay ? "visible" : "hidden";
}

function updateReplayBar(data) {
    const { lastGoal: goal, lastStatFeed: stat } = data;
    if (!goal || !goal.scorer) return;

    const isOrange = goal.scorer.teamNum === 1;

    const teamColorVar = isOrange ? "var(--OrangeCol)" : "var(--BlueCol)";

    // Text
    goalScorer.textContent = goal.scorer.name ?? "N/A";
    goalSpeed.textContent = goal.goalSpeed
        ? `${Math.round(goal.goalSpeed)} KPH`
        : "N/A";

    const hasAssist = stat?.eventName === "Assist";

    if (hasAssist) {
        goalAssister.textContent = stat.mainTarget.name;
        assistStats.style.display = "flex";
    } else {
        goalAssister.textContent = "";
        assistStats.style.display = "none";
    }

    // Border color
    replayStats.style.borderTop = `5px solid ${teamColorVar}`;

    // Active state
    replayStatsBox.classList.toggle("active", hasAssist);
    replayStats.classList.toggle("active", hasAssist);

    // SVG colouring
    setReplayStatIconColor(isOrange);
}

function setReplayStatIconColor(colorVar) {
    const filter =
        colorVar === true
            ? "invert(54%) sepia(91%) saturate(748%) hue-rotate(345deg)"
            : "invert(38%) sepia(96%) saturate(748%) hue-rotate(190deg)";

    icons.forEach(icon => {
        if (icon) icon.style.filter = filter;
    });
}

function updateTeams(data) {

    const blueTeam = data.teams.get("0");
    const orangeTeam = data.teams.get("1");

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

    const boxes = winBoxes[team];
    if (!boxes) return;

    const safeWins = Math.min(wins, firstTo);

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];

        // Show only required amount
        box.style.display = i < firstTo ? "block" : "none";

        // Activate based on wins
        box.classList.toggle("active", i < safeWins);
    }
}

function updateActivePlayer(data) {
    if (!data.state?.hasTarget) {
        if (lastActiveID != null) {
            setPlayerActive(lastActiveID, false);
            lastActiveID = null;
        }
        return;
    }

    const cPlayer = getPlayerByID(data.currentPlayerID, data);
    if (!cPlayer || !cPlayer.name) return;

    const cTeam = getTeamByPlayerID(cPlayer.id);
    const isOrange = cTeam === "orange";

    const teamColor = isOrange ? 'var(--OrangeCol)' : 'var(--BlueCol)';

    if (lastActiveID && lastActiveID !== cPlayer.id) {
        setPlayerActive(lastActiveID, false);
    }

    activePlayerName.textContent = cPlayer.name;
    activePlayerScore.textContent = cPlayer.score;
    activePlayerGoals.textContent = cPlayer.goals;
    activePlayerAssists.textContent = cPlayer.assists;
    activePlayerSaves.textContent = cPlayer.saves;
    activePlayerShots.textContent = cPlayer.shots;
    activePlayerBoost.textContent = cPlayer.boost;

    boostCircle.style.setProperty('--boost', cPlayer.boost * 0.75);
    line.style.backgroundColor = teamColor;
    activePlayerBoost.style.color = teamColor;

    boostCircle.style.background =
        `conic-gradient(from -90deg, ${teamColor} calc(var(--boost) * 1%), transparent 0)`;

    setPlayerActive(cPlayer.id, true);
    lastActiveID = cPlayer.id;
}

function updateCentreBoard(data) {
    const blue = data.teams?.get("0");
    const orange = data.teams?.get("1");

    if (!blue || !orange) return;

    blueTeamScore.textContent = blue.score ?? 0;
    orangeTeamScore.textContent = orange.score ?? 0;

    const time = Number.isFinite(data.lastTime) ? data.lastTime : 0;
    const isOT = data.state?.isOT === true;

    timer.textContent = isOT
        ? "+" + formatTime(time)
        : formatTime(time);
}

function updatePlayers(data) {
    const blueTeam = data.teams.get("0");
    const orangeTeam = data.teams.get("1");

    if (!blueTeam || !orangeTeam) return;

    updateTeamPlayers(blueTeam.players, "blue", false);
    updateTeamPlayers(orangeTeam.players, "orange", false);
}

function updateTeamPlayers(players, team, reverseOrder) {
    const slots = playerDets[team];
    const maxSlots = Object.keys(slots).length;

    let slotIndex = reverseOrder ? maxSlots : 1;

    for (let i = 0; i < maxSlots; i++) {
        const player = players[i];
        const slot = slots[slotIndex];

        if (player && slot) {
            slot.container.style.display = "block";
            slot.name.textContent = player.name;
            slot.boost.textContent = player.boost;

            if (slot.boostVis) {
                slot.boostVis.style.transform =
                    team === "blue"
                        ? `translateX(${player.boost * 4 - 400}px)`
                        : `translateX(${player.boost * -4 + 400}px)`;
            }

            playerPositions[player.id] = { team, slot: slotIndex };
        } else if (slot) {
            slot.container.style.display = "none";
        }

        reverseOrder ? slotIndex-- : slotIndex++;
    }
}

function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getPlayerByID(id) {
    return playerIndex.get(id) ?? null;
}

function getTeamByPlayerID(playerID) {
    return playerPositions[playerID]?.team ?? null;
}

function setPlayerActive(playerID, isActive) {
    const info = playerPositions[playerID];
    if (!info) return;

    const dets = playerDets[info.team]?.[info.slot];
    if (!dets?.container) return;

    dets.container.classList.toggle("active", isActive);
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