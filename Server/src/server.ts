import express from 'express';

const app = express();

app.post('/users', (request, response) => {
  const { name, email } = request.body;

  const user = {
    name,
    email,
  };

  response.json(user);
});

app.listen(3333, () => {
  console.log('Server is running');
});
