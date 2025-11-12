async function updateOverlay() {
    const res = await fetch("/api/config");
    const data = await res.json();
    document.getElementById("text").textContent = data.message;
}

setInterval(updateOverlay, 500); // Poll every 500ms
updateOverlay();
