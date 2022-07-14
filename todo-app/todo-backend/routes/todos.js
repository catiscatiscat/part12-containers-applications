const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, incrAsync } = require('../redis/index');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  await incrAsync('added_todos');
  res.send(todo);
});

/* GET number of added todos */
router.get('/statistics', async (req, res) => {
  const added_todos = (await getAsync('added_todos')) | 0;
  res.send({ added_todos });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const { todo } = req;
  res.send(todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { body, todo } = req;
  const updated = await Todo.findByIdAndUpdate(todo._id, body, { new: true });
  res.send(updated);
});

router.use('/:id', findByIdMiddleware, singleRouter);

module.exports = router;
