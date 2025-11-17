export async function loadPlayers(field1, field2, field3, field4) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text
        console.log("Raw response:", text);

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
        console.log("Raw response:", text);

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

export async function getScrollText(field) {
    const scene = "controller";

    try {
        const res = await fetch(`/api/${scene}/config`);
        const text = await res.text(); // <-- get raw text
        console.log("Raw response:", text);

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

        console.log(retText);

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
        console.log("Raw response:", text);

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

        console.log(c1);

        document.getElementById(field1).value = c1;

        const c2 = data.caster2;

        console.log(c2);

        document.getElementById(field2).value = c2;
    } catch (err) {
        console.error(err);
        console.log("⚠️ Failed to load roster.");
    }
}