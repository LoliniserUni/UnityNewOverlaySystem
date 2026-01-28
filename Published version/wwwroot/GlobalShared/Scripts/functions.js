export async function loadPlayers(field1, field2, field3, field4) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const players = data.players || [];
        if (!Array.isArray(players)) {
            console.log("⚠️ Invalid data format in config.");
            return;
        }

        document.getElementById(field1).value = players[0] || "";
        document.getElementById(field2).value = players[1] || "";
        document.getElementById(field3).value = players[2] || "";
        document.getElementById(field4).value = players[3] || "";
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
    }
}

export async function getPlayers() {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return null;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return null;
        }

        const players = data.players || [];
        if (!Array.isArray(players)) {
            console.log("⚠️ Invalid data format in config.");
            return null;
        }

        return players;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
        return null;
    }
}

export async function getTeam1(field) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.team1;


        document.getElementById(field).value = retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t1.");
    }
}

export async function getTeam2(field) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.team2;

        document.getElementById(field).value = retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t2.");
    }
}

export async function getTeam1AsText(field) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.team1;

        return retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t1.");
    }
}

export async function getGameNumAsText() {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.totalGames;

        return retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t1.");
    }
}

export async function getTitleAsText() {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.title;

        return retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t1itile.");
    }
}

export async function getTeam2AsText() {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.team2;

        return retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load t2.");
    }
}
export async function getScrollText(field) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const retText = data.scrollText;

        document.getElementById(field).value = retText;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
    }
}

export async function getCasters(field1, field2) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const c1 = data.caster1;


        document.getElementById(field1).value = c1;

        const c2 = data.caster2;


        document.getElementById(field2).value = c2;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
    }
}

export async function get3Casters(field1, field2, field3) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("⚠️ Response was not valid JSON.");
            return;
        }

        if (data.error) {
            console.log(`⚠️ ${data.error}`);
            return;
        }

        const c1 = data.caster1;


        document.getElementById(field1).value = c1;

        const c2 = data.caster2;


        document.getElementById(field2).value = c2;

        const c3 = data.caster3;


        document.getElementById(field3).value = c3;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
    }
}