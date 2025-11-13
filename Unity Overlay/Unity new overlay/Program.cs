using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// ---------- GLOBAL STATE ----------

// Each scene gets its own timer and duration
var timers = new Dictionary<string, (DateTime start, int duration)>();

// Reuse one instance of JsonSerializerOptions for consistency
var jsonOptions = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

// ---------- HELPERS ----------

string GetSceneFolder(string scene) =>
    Path.Combine(app.Environment.WebRootPath, scene);

string GetConfigPath(string scene)
{
    if (scene.Equals("controller"))
    {
        return Path.Combine(GetSceneFolder("GlobalShared"), "config.json");
    }
    return Path.Combine(GetSceneFolder(scene), "shared", "config.json");
}
    

void EnsureSceneFolders(string scene)
{
    var sharedFolder = Path.Combine(GetSceneFolder(scene), "shared");
    if (!Directory.Exists(sharedFolder))
        Directory.CreateDirectory(sharedFolder);
}

// ---------- STATIC FILES ----------

// Serve everything under wwwroot (controllers, overlays, images, etc.)
app.UseDefaultFiles();
app.UseStaticFiles();

// ---------- CONFIG ROUTES ----------

// GET scene config
app.MapGet("/api/{scene}/config", (string scene) =>
{
    var path = GetConfigPath(scene);

    if (!File.Exists(path))
        return Results.Json(new { error = "Config not found", scene });

    var json = File.ReadAllText(path);
    try
    {
        var data = JsonSerializer.Deserialize<object>(json);
        return Results.Json(data);
    }
    catch
    {
        return Results.Json(new { error = "Invalid JSON format", scene });
    }
});

// POST update config
app.MapPost("/api/{scene}/config", async (HttpContext ctx, string scene) =>
{
    using var reader = new StreamReader(ctx.Request.Body);
    var newJson = await reader.ReadToEndAsync();

    EnsureSceneFolders(scene);
    var path = GetConfigPath(scene);

    Dictionary<string, object> newData;

    try
    {
        newData = JsonSerializer.Deserialize<Dictionary<string, object>>(newJson)
                  ?? new Dictionary<string, object>();
    }
    catch (Exception ex)
    {
        return Results.Json(new { error = "Invalid JSON format in request", detail = ex.Message });
    }

    Dictionary<string, object> existingData = new();

    if (File.Exists(path))
    {
        try
        {
            var existingJson = await File.ReadAllTextAsync(path);
            existingData = JsonSerializer.Deserialize<Dictionary<string, object>>(existingJson)
                           ?? new Dictionary<string, object>();
        }
        catch
        {
            // if existing JSON is corrupted, start fresh
            existingData = new Dictionary<string, object>();
        }
    }

    // Merge: update existing keys or add new ones
    foreach (var kv in newData)
        existingData[kv.Key] = kv.Value;

    // Save merged JSON
    var mergedJson = JsonSerializer.Serialize(existingData, new JsonSerializerOptions { WriteIndented = true });
    await File.WriteAllTextAsync(path, mergedJson);

    return Results.Json(new { saved = true, scene, merged = true });
});


// ---------- TIMER ROUTES ----------

// POST start a timer for a scene
app.MapPost("/api/{scene}/startTimer", async (HttpContext ctx, string scene) =>
{
    using var reader = new StreamReader(ctx.Request.Body);
    var json = await reader.ReadToEndAsync();

    var payload = JsonSerializer.Deserialize<Dictionary<string, int>>(json, jsonOptions);
    if (payload == null || !payload.ContainsKey("duration"))
        return Results.BadRequest(new { error = "Missing 'duration' value." });

    var duration = payload["duration"];
    timers[scene] = (DateTime.UtcNow, duration);

    return Results.Json(new { started = true, scene, duration });
});

// GET current timer for a scene
app.MapGet("/api/{scene}/timer", (string scene) =>
{
    if (!timers.TryGetValue(scene, out var timer))
        return Results.Json(new { active = false, remaining = 0 });

    var (start, duration) = timer;
    var elapsed = (DateTime.UtcNow - start).TotalSeconds;
    var remaining = Math.Max(0, duration - elapsed);

    return Results.Json(new
    {
        active = remaining > 0,
        remaining = Math.Round(remaining, 1)
    });
});

// ---------- RUN ----------
app.Run("http://localhost:5000");