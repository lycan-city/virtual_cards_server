import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';

const app = express();
const storage = {
  games: {}
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
    res.send('hello world')
);

app.post('/host', (req, res) => {
  const userId = req.body.userId || uuid.v4();
  const gameId = uuid.v4();
  storage.games[gameId] = {
    host: userId,
    players: []
  };
  res.json({
    gameId: gameId,
    userId: userId
  });
});

app.post('/join', (req, res) => {
  if(!req.body.gameId)
    return res.status(400).json({ error: 'gameId cannot be undefined' });

  if (!storage.games[req.body.gameId])
    return res.status(400).json({ error: `no game with id ${req.body.gameId} found` });

  const userId = req.body.userId || uuid.v4();

  storage.games[req.body.gameId].players.push(userId);

  res.json({
    userId: userId,
    game: storage.games[req.body.gameId]
  });
});

app.listen(3000);

console.log('http://localhost:3000');
