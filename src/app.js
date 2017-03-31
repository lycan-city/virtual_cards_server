import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import { exec } from 'child_process';

const app = express();

app.set('port', (process.env.PORT || 3000));

const storage = {
  parties: {}
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
  res.json(storage)
);

app.post('/host', (req, res) => {
  const userId = req.body.userId || uuid.v4();
  const partyId = uuid.v4();
  storage.parties[partyId] = {
    host: userId,
    players: []
  };
  res.json({
    partyId: partyId,
    userId: userId
  });
});

app.post('/start', (req, res) => {
  const partyId = req.body.partyId;
  if (!partyId)
    return res.status(400).json({ error: 'partyId cannot be undefined' });

  if (!storage.parties[partyId])
    return res.status(400).json({ error: `no party with id ${partyId} found` });

  const party = shuffle(fakeGame.create(storage.parties[partyId].players.length));

  storage.parties[partyId].players.forEach((p, i) => p.card = party[i]);

  res.json(storage.parties[partyId]);
});

app.post('/join', (req, res) => {
  console.log(req);
  if (!req.body.partyId)
    return res.status(400).json({ error: 'partyId cannot be undefined' });

  if (!storage.parties[req.body.partyId])
    return res.status(400).json({ error: `no party with id ${req.body.partyId} found` });

  const userId = req.body.userId || uuid.v4();

  storage.parties[req.body.partyId].players.push({ id: userId });

  res.json({
    userId: userId,
    party: storage.parties[req.body.partyId]
  });
});

app.listen(app.get('port'));

console.log(`http://localhost:${app.get('port')}`);
