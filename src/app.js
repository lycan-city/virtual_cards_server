import express from 'express';

const app = express();

app.get('/', (req, res) =>
    res.send('hello world')
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  console.log('http://localhost:3000');
})