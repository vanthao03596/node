const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
  },
]
beforeEach(done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos)
    })
    .then(() => done())
})

describe('POST /todos', () => {
  it('should create new todo', done => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({text})
      .expect(201)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find({text})
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2)
            done()
          })
          .catch(e => done(e))
      })
  })
})

describe('GET /todos', () => {
  it('Should get all todos', done => {
    request(app)
      .get('/todos')
      .send({})
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
  it('should return 404 if todo not found', done => {
    let hexId = new ObjectID().toHexString()

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete todo', done => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1)
            done()
          })
          .catch(e => done(e))
      })
  })
  it('should return 404 if todo not found', done => {
    let hexId = new ObjectID().toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', done => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update todo text', done => {
    let text = 'Test todo text'
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .send({text, completed: true})
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(true)
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done)
  })

  it('should clear todo completedAt if todo is not completed', done => {
    let text = 'Test todo text'
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .send({text, completed: false})
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toBeFalsy()
      })
      .end(done)
  })

  it('should return 404 if todo not found', done => {
    let hexId = new ObjectID().toHexString()

    request(app)
      .patch(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', done => {
    request(app)
      .patch('/todos/123abc')
      .expect(404)
      .end(done)
  })
})
