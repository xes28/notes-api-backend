const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

app.use(cors())
// Para poder recuperar el body de la request y hacer peticiones post
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: 3,
    content: 'Repasar los retos de JS de midudev',
    date: '2019-05-30T19:20:14:098Z',
    important: true
  },
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en Youtube y Twitch',
    date: '2019-05-30T19:17:30:098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases del FullStack Bootcamp',
    date: '2019-05-30T18:37:30:098Z',
    important: false
  }
]

// Generamos las rutas que va a tener nuestra aplicación con express
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.body) {
    return response.status(400).json({
      error: 'body is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    userId: 1,
    title: note.title,
    body: note.body
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

// Puerto de escucha
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
