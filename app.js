const express = require('express');
// importing the express library from dependencies
const cors = require('cors'); 
// importing cors from dependencies. Cors is a protocol that prevents domains to make requests to other domains

const app = express();
// app variable that is the invocation of express method. allows us access to express libray 

app.use(cors());
// invoking cors with our app
app.use(express.json());
// invoking express with our app. 

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
// an array of objects that our server will have when it is spun up each time

app.get('/api/v1/notes', (request, response) => {
  // handling for get requests to the route /api/v1/notes. 
  return response.status(200).json(app.locals.notes);
  // it should give the response handling of 200 and return json.app.locals.notes
});


app.post('/api/v1/notes', (request, response) => {
  // handling for post reuests to notes route. 
  const { title, list } = request.body;
  // destructuring the request body 

  if (!title || !list) {
    return response.status(422).json('Please provide title and at least one list item');
  }
  // handling if when the body comes in the title or list is missing. if that is the case, return response code 422 with message Please provide title and at least one list item'

  const newNote = request.body;
  // setting request body to a variable 

  app.locals.notes.push(newNote);
  // pushing the newNote object to locals.notes array 
  response.status(201).json(newNote);
  // returning status code 201 if successfully added note to server array
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