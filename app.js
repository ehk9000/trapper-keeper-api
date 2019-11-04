const express = require('express');
const cors = require('cors'); 

const app = express();

app.use(cors());
app.use(express.json());

app.locals.notes = [
  { 
    title: 'What you can do with Trapper Keeper', 
    list: [
      { 
        item: 'Create a new note',
        completed: false,
        id: 1
      },
      { 
        item: 'Add list items to your note',
        completed: false,
        id: 2
      },
      { 
        item: 'Edit or delete items on your note',
        completed: false,
        id: 3
      },
      { 
        item: 'Delete your note',
        completed: false,
        id: 4
      },
      { 
        item: 'View completed items',
        completed: true,
        id: 5
      }
    ],
    id: Date.now(),
    background:'#FFF'
  }
]

app.get('/', (request, response) => {
  return response.status(200).json('Hello! Welcome to Trapper-Keeper');
});

app.get('/api/v1/notes', (request, response) => {
  return response.status(200).json(app.locals.notes);
});

app.post('/api/v1/notes', (request, response) => {
  const { title, list } = request.body;

  if (!title || !list) {
    return response.status(422).json('Please provide title and at least one list item');
  }

  const newNote = request.body;

  app.locals.notes.push(newNote);
  response.status(201).json(newNote);
});

app.get('/api/v1/notes/:id', (request, response) => {
  const note = app.locals.notes.find(note => note.id == request.params.id);

  if (!note) {
    return response.status(404).json('Note not found');
  } else {
    return response.status(200).json(note);
  }
});

app.delete('/api/v1/notes/:id', (request, response) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id);

  if (noteIndex === -1) {
    return response.status(404).json('Note not found');
  } else {
    app.locals.notes.splice(noteIndex, 1);

    return response.sendStatus(204);
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
  const { title, list, background } = request.body;
  let { id } = request.params;
  id = parseInt(id);
  let noteWasFound = false;
  const newNotes = app.locals.notes.map(note => {
    if (note.id == id) {
      noteWasFound = true;
      return { title, list, id, background }
    } else {
      return note
    }
  });

  if (!title || !list) {
    return response.status(422).json('Please provide a title and a list item');
  }

  if (!noteWasFound) {
    return response.status(404).json('Note not found');
  }

  app.locals.notes = newNotes

  return response.sendStatus(204);
});

module.exports = app;