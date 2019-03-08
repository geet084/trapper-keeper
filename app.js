//imports the express framework to simplify response code
import express from 'express'
//imports cors to allow fetch request from the front-end application
import cors from 'cors'
//assign express execution to variable app, also allows for express methods to be used
const app = express();
//direct app to use cors to allow fetching
app.use(cors())
//direct app to automatically json.parse() incoming data
app.use(express.json())

//set up local server storage with a title
app.locals.title = 'Trapper Keeper';
//set up initial local server storage with an empty notes array
app.locals.notes = [];
//set up initial local server storage with an empty items array
app.locals.items = [];

//handle a get request to the server to path /api/v1/notes 
//which will get all notes currently stored in the local server storage
app.get('/api/v1/notes', (request, response) => {
//destructuring local server storage variables....
  const notes = app.locals.notes;
  const items = app.locals.items;
//returns a status of 200 and stringifies the response with both stored notes and items
  return response.status(200).json({ notes, items })
});

//handle a post request to the server to path /api/v1/notes
//adds a new note to the local server storage 
app.post('/api/v1/notes', (request, response) => {
//destructuring incoming request body information....
  const { id, title, items } = request.body;
//if there is not a title, the response will be to inform that no title was given 
//and the post did not complete successfully
  if (!title) {
    return response.status(422).json('No note title provided');
  } else {
//otherwise the notes and items will be added to the local server storage
//and the response  will be a status 201 and will also return the note that was added
//adding the notes and items to the local server storage arrays
    app.locals.notes.push({ id, title })
    app.locals.items.push(...items)
    return response.status(201).json({ id, title, items });
  }
});

//handle a get request to the server to path /api/v1/notes/:id
//gets a specific note by the id from the url path
app.get('/api/v1/notes/:id', (request, response) => {
//destructuring incoming request params information (url path/note id)....
  const { id } = request.params;
//looks through the local server storage notes to find the note with the correct id
  const note = app.locals.notes.find(note => note.id == id);
//looks through the local server storage items to find the items that match the correct note id
  const items = app.locals.items.filter(item => item.noteID == id)

//if there is a note in storage that matches
//returns a status of 200 and stringifies the response with the correct note and its items
  if (note) {
    return response.status(200).json({ note, items })
  } else {
//otherwise returns a status of 404 and a message indicating that the note/items were not found
    return response.status(404).json('That note does not exist!')
  }
});

//handle a delete request to the server to path /api/v1/notes/:id
//deletes a specific note by the id from the url path
app.delete('/api/v1/notes/:id', (request, response) => {
//destructuring incoming request params information (url path/note id)....
  const { id } = request.params;
//looks through the local server storage notes to find the note with the correct id
//that id is then not included in the updated array (removed)
  const updatedNotes = app.locals.notes.filter(note => note.id != id)
//looks through the local server storage items to find the items with the correct note id
//those id(s) are then not included in the updated array (removed)
  const updatedItems = app.locals.items.filter(item => item.noteID != id)

//if the updated array is not the same (smaller) that the original array
//reassign the original notes and items to their updated versions
//and return a status of 202 and a message indicating that note was deleted
  if (updatedNotes.length !== app.locals.notes.length) {
    app.locals.notes = updatedNotes
    app.locals.items = updatedItems
    return response.status(202).json(`Note ${id} has been deleted successfully`)
  } else {
//otherwise return a status of 404 and a message indicating that the note was not found and deleted
    return response.status(404).json('That note does not exist, nothing was deleted')
  }
});

//handle a put request to the server to path /api/v1/notes/:id
//edits a specific note by the id from the url path
app.put('/api/v1/notes/:id', (request, response) => {
//destructuring incoming request params information (url path/note id)....
  const { id } = request.params;
//destructuring incoming request body information....
  const { title, items } = request.body
//looks through the local server storage notes to find the note with the correct id
  const note = app.locals.notes.find(note => note.id == id);

//if there is a note in storage that matches
  if (note) {
//an updated copy is made of the existing notes array
//and the correct note's title is reassigned to the one passed in the request
    const updatedNotes = app.locals.notes.map(note => {
      if (note.id == id) {
        note.title = title
      }
      return note
    })
//reassign the original notes the updated version
    app.locals.notes = updatedNotes
//look through all local server storage items and remove the current note items
    const cleanedItems = app.locals.items.filter(item => item.noteID != id)
//reassign the original items to the updated items along with the items passed in with the request
    app.locals.items = [...cleanedItems, ...items]
//return a status of 202 and a message indicating that the note and its items were updated
    return response.status(202).json(`Note ${id} has been updated`)
  } else {
//otherwise return a status of 404 and a message indicating that the note was not found or updated
    return response.status(404).json('That note does not exist, nothing was edited')
  }
});

//exporting the app to be accessible
export default app