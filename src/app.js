import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';

const app = express();
const storage = {
  games: {}
};

const fakeGame = {
  create: players => [...Array(players).keys()]
};

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

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

app.post('/start', (req, res) => {
  const gameId = req.body.gameId;
  if (!gameId)
    return res.status(400).json({ error: 'gameId cannot be undefined' });

  if (!storage.games[gameId])
    return res.status(400).json({ error: `no game with id ${gameId} found` });

  const game = shuffle(fakeGame.create(storage.games[gameId].players.length));

  storage.games[gameId].players.forEach((p, i) => p.card = game[i]);

  res.json(storage.games[gameId]);
});

app.post('/join', (req, res) => {
  if (!req.body.gameId)
    return res.status(400).json({ error: 'gameId cannot be undefined' });

  if (!storage.games[req.body.gameId])
    return res.status(400).json({ error: `no game with id ${req.body.gameId} found` });

  const userId = req.body.userId || uuid.v4();

  storage.games[req.body.gameId].players.push({ id: userId });

  res.json({
    userId: userId,
    game: storage.games[req.body.gameId]
  });
});

app.listen(3000);

console.log('http://localhost:3000');
