const express = require('express');
const { getAsync } = require('../redis/index');
const router = express.Router();

/* GET number of added todos */
router.get('/', async (req, res) => {
  const added_todos = (await getAsync('added_todos')) | 0;
  res.send({ added_todos });
});

module.exports = router;
