const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const userFound = users.find(user => user.username === username)


  if (!userFound) {
    response.status(400).json({ error: 'User not found!'})
  }

  request.user = userFound

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  if (users.some(user => user.username === username)) {
    return response.status(400).json({ error: 'Username already exists' })
  }

  const infosNewUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(infosNewUser)

  return response.status(201).send(infosNewUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  // if (!user.todos.length) {
  //   return response.status(400).json({ error: 'User has nothing todos' })
  // }

  return response.send(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { user } = request

  const newTodo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).send(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { title, deadline } = request.body
  const { user } = request

  let todoIndex = user.todos.findIndex(todo => todo.id === id)

  if (todoIndex === -1) {
    return response.status(404).json({ error: 'To do not found.'})
  }

  const changeFieldsTodo = {
    ...user.todos[todoIndex],
    deadline: new Date(deadline) ?? user.todos[todoIndex].deadline,
    title: title,
  }

  user.todos[todoIndex] = changeFieldsTodo

  return response.send(changeFieldsTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { user } = request

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if (todoIndex === -1) {
    return response.status(404).json({ error: 'To do not found'})
  }

  todoUpdated = {
    ...user.todos[todoIndex],
    done: true
  }

  user.todos[todoIndex] = todoUpdated

  return response.send(todoUpdated)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { user } = request

  const toDoDeleted = user.todos.find((todo) => todo.id === id)

  if (!toDoDeleted) {
    return response.status(404).json({ error: 'Non exists todo'})
  }

  user.todos.splice(toDoDeleted, 1)

  return response.status(204).send()
  
});

module.exports = app;