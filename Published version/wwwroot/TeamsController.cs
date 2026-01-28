public class TeamsController : Controller
{
    [HttpPost]
    public ActionResult UploadTeam1Logo(HttpPostedFileBase logo)
    {
        if (logo == null || logo.ContentLength == 0)
            return new HttpStatusCodeResult(400, "No file uploaded");

        // Ensure folder exists
        string folder = Server.MapPath("~/GlobalShared/assets/teamLogos/");
        Directory.CreateDirectory(folder);

        // Force the filename to "team1Logo" + original extension
        string ext = Path.GetExtension(logo.FileName);
        string savePath = Path.Combine(folder, "team1Logo" + ext);

        logo.SaveAs(savePath);

        // Return the public path for use in UI
        string publicUrl = Url.Content("~/GlobalShared/assets/teamLogos/team1Logo" + ext);
        return Content(publicUrl);
    }
}
