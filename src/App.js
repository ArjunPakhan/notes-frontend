import React, { useEffect, useState } from 'react';

function App() {
  const [editingId, setEditingId] = useState(null);

  const [notes, setNotes] = useState([]);

  const [form, setForm] = useState({ title: '', content: '' });

  const fetchNotes = async () => {
    const res = await fetch('http://localhost:5000/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (editingId) {
    // Update existing note
    const res = await fetch(`http://localhost:5000/api/notes/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setNotes(notes.map((n) => (n._id === editingId ? updated : n)));
    setEditingId(null);
  } else {
    // Create new note
    const res = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newNote = await res.json();
    setNotes([newNote, ...notes]);
  }

  setForm({ title: '', content: '' });
};

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
    });
    setNotes(notes.filter(note => note._id !== id));
  };




  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1>📝 Notes Dashboard</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        {notes.length === 0 ? (
          <p>No notes yet...</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                background: '#fafafa',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <div>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{
                    marginTop: '5px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setForm({ title: note.title, content: note.content });
                    setEditingId(note._id);
                  }}
                  style={{
                    marginTop: '5px',
                    marginLeft: '10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  
}

export default App;
