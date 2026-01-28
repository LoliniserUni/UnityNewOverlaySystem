using System.Diagnostics;
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

// ---------- FILE UPLOAD (TEAM LOGO) ----------

app.MapPost("/api/upload/teamLogo/{teamId}", async (HttpContext ctx, string teamId) =>
{
    var form = await ctx.Request.ReadFormAsync();

    if (!form.Files.Any())
        return Results.BadRequest(new { error = "No file uploaded" });

    var file = form.Files[0];

    // Optional: validate image type
    var allowedTypes = new[] { "image/png", "image/jpeg" };
    if (!allowedTypes.Contains(file.ContentType))
        return Results.BadRequest(new { error = "Invalid image type" });

    // Create folder if needed
    var logoFolder = Path.Combine(app.Environment.WebRootPath, "TeamLogos");
    if (!Directory.Exists(logoFolder))
        Directory.CreateDirectory(logoFolder);

    // Keep original extension
    var ext = Path.GetExtension(file.FileName);
    var saveName = $"team_{teamId}_logo{ext}";
    var savePath = Path.Combine(logoFolder, saveName);

    // Save file
    using (var stream = File.Create(savePath))
    {
        await file.CopyToAsync(stream);
    }

    // Public URL (for <img src="...">)
    var publicUrl = $"/TeamLogos/{saveName}";

    return Results.Json(new
    {
        uploaded = true,
        teamId,
        url = publicUrl
    });
});

// Swap team logo images: team_1_logo.png <-> team_2_logo.png
app.MapPost("/api/upload/swapTeamLogos", () =>
{
    string folder = Path.Combine(app.Environment.WebRootPath, "TeamLogos");

    string t1 = Path.Combine(folder, "team_1_logo.png");
    string t2 = Path.Combine(folder, "team_2_logo.png");
    string temp = Path.Combine(folder, "team_temp_swap.png");

    // Ensure folder exists
    if (!Directory.Exists(folder))
        return Results.Json(new { error = "Logo folder not found" });

    // Ensure both logo files exist
    if (!File.Exists(t1) || !File.Exists(t2))
        return Results.Json(new { error = "One or both logo files missing" });

    try
    {
        // Swap files safely using a temp file
        File.Move(t1, temp, true);
        File.Move(t2, t1, true);
        File.Move(temp, t2, true);

        return Results.Json(new { swapped = true });
    }
    catch (Exception ex)
    {
        return Results.Json(new
        {
            swapped = false,
            error = "Swap failed",
            detail = ex.Message
        });
    }
});

var url = "http://localhost:5000";


var logger = app.Services.GetRequiredService<ILogger<Program>>();
try
{
    Process.Start(new ProcessStartInfo
    {
        FileName = url,
        UseShellExecute = true
    });
}
catch (Exception ex)
{
    Console.WriteLine($"Could not open browser: {ex.Message}");
}

// ---------- RUN ----------
app.Run(url);

