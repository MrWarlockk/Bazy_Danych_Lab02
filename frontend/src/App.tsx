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
  const [searchTag, setSearchTag] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTag.trim() === "" ||
      (Array.isArray(note.tags) &&
        note.tags.some(
          (tag: any) =>
            typeof tag === "string" &&
            tag.toLowerCase().includes(searchTag.toLowerCase()),
        ));

    const matchesFavorite = !showFavorites || note.favorite === true;

    return matchesSearch && matchesFavorite;
  });

  const addNote = () => {
    fetch("http://localhost:5095/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newNote.title,
        text: newNote.text,
        tags: newNote.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        createdAt: new Date(),
        updatedAt: new Date(),
        favorite: false,
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

  const toggleFavorite = (id: number) => {
    fetch(`http://localhost:5095/api/notes/${id}/favorite`, {
      method: "PATCH",
    }).then(() => fetchNotes());
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

      <input
        className="searchBar"
        type="text"
        placeholder="Szukaj po tagach..."
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
      />

      <div className="topButtons">
        <button className="addButton" onClick={() => setIsAdding(!isAdding)}>
          {"Dodaj notatkę"}
        </button>

        <button
          className={`addButton ${showFavorites ? "favoriteFilterActive" : ""}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          ♥ Ulubione
        </button>
      </div>

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
        {filteredNotes.map((note) => (
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
            favorite={note.favorite}
            onFavorite={toggleFavorite}
          />
        ))}
      </div>
    </>
  );
}

export default App;
