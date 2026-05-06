using LiteDB;

public class Note
{
    [BsonId]
    public int Id { get; set; }

    public string Title { get; set; } = "";
    public string Text { get; set; } = "";
    public List<string> Tags { get; set; } = new();

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}