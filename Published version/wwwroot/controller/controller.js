document.getElementById("save").addEventListener("click", async () => {
    const message = document.getElementById("message").value;
    await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    document.getElementById("status").textContent = "Overlay updated!";
});
