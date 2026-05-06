import { useEffect, useState } from "react";
import "./App.css";
import Note from "./components/Note";

function App() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
    tags: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingNote, setEditingNote] = useState<any>(null);

  const addNote = () => {
    fetch("http://localhost:5095/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newNote.title,
        text: newNote.text,
        tags: newNote.tags.split(",").map((t) => t.trim()),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }).then(() => {
      setIsAdding(false);
      setNewNote({ title: "", text: "", tags: "" });
      fetchNotes();
    });
  };
  const deleteNote = (id: number) => {
    fetch(`http://localhost:5095/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    });
  };

  const updateNote = (id: number) => {
    fetch(`http://localhost:5095/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editingNote.title,
        text: editText,
        tags: editingNote.tags,
        createdAt: editingNote.createdAt,
        updatedAt: new Date(),
      }),
    }).then(() => {
      setEditingId(null);
      setEditingNote(null);
      fetchNotes();
    });
  };
  const fetchNotes = () => {
    fetch("http://localhost:5095/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewNote({ title: "", text: "", tags: "" });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5095/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <div className="title">
        <h1>Notatnik</h1>
      </div>

      <button className="addButton" onClick={() => setIsAdding(!isAdding)}>
        {"Dodaj Notatkę"}
      </button>

      {isAdding && (
        <div className="addOverlay">
          <div className="addModal">
            <input
              placeholder="Tytuł"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />

            <textarea
              placeholder="Tekst"
              value={newNote.text}
              onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
            />

            <input
              placeholder="Tagi (oddzielane przecinkiem)"
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
            />
            <div className="formButtons">
              <button className="noteRemove" onClick={cancelAdd}>
                Anuluj
              </button>

              <button className="noteEdit" onClick={addNote}>
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <div className="editOverlay">
          <div className="editModal">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button className="noteEdit" onClick={() => updateNote(editingId)}>
              Save
            </button>
          </div>
        </div>
      )}

      <div className="notesContainer">
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            text={note.text}
            tags={note.tags || []}
            createdAt={note.createdAt}
            updatedAt={note.updatedAt}
            onDelete={deleteNote}
            onEdit={(id) => {
              setEditingId(id);
              setEditingNote(note);
              setEditText(note.text);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
