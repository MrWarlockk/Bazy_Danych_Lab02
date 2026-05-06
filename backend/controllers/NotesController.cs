using Microsoft.AspNetCore.Mvc;
using LiteDB;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private LiteDatabase GetDb()
    {
        return new LiteDatabase("Notes.db");
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        using var db = GetDb();
        var notes = db.GetCollection<Note>("notes")
                      .FindAll()
                      .ToList();

        return Ok(notes);
    }

    [HttpPost]
    public IActionResult Create(Note note)
    {
        using var db = new LiteDB.LiteDatabase("Notes.db");
        var col = db.GetCollection<Note>("notes");

        note.CreatedAt = DateTime.Now;
        note.UpdatedAt = DateTime.Now;

        col.Insert(note);

        return Ok(note);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        using var db = new LiteDB.LiteDatabase("Notes.db");
        var col = db.GetCollection<Note>("notes");

        var deleted = col.Delete(id);

        if (!deleted)
            return NotFound();

        return Ok();
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Note updated)
    {
        using var db = new LiteDB.LiteDatabase("Notes.db");
        var col = db.GetCollection<Note>("notes");

        var note = col.FindById(id);
        if (note == null) return NotFound();

        note.Title = updated.Title;
        note.Text = updated.Text;
        note.Tags = updated.Tags;
        note.UpdatedAt = DateTime.Now;

        col.Update(note);

        return Ok(note);
    }

}