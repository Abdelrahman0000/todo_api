const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./module/Todo');
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
  .connect('mongodb+srv://spotify:spotify@cluster0.ntoqbjl.mongodb.net/mern-todo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(console.error);

app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);

});
app.get('/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
})
app.post('/todos/new',(req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
 
  todo.save();
  res.json(todo);
});

app.put('/todos/edit/:id', async (req, res) => {
	const todoId = req.params.id;
	const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, { new: true });
	res.json(updatedTodo);
  });

  app.delete('/todos/delete/:id', async (req, res) => {
	try {
	  const todoId = req.params.id;
	  await Todo.deleteOne({ _id: todoId });
	  res.json({ message: 'TODO item deleted successfully' });
	} catch (error) {
	  res.status(500).json({ error: 'Failed to delete the TODO item' });
	}
  });



  app.delete('/todos/delete/', async (req, res) => {
	try {
	 
	  await Todo.deleteMany()
	  res.json({ message: 'TODO items deleted successfully' });
	} catch (error) {
	  res.status(500).json({ error: 'Failed to delete the TODO item' });
	}
  });

app.listen(4000, () => console.log('server is running'));
