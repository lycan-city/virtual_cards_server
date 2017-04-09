import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';

const app = express();

app.set('port', (process.env.PORT || 3000));

const storage = {
    parties: {}
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
    res.json(storage)
);

app.post('/host', (req, res) => {
    if(!req.body.userId)
        return res.status(400)
            .json({ error: 'userId cannot be undefined' });

    const partyId = uuid.v4().substr(0,4);

    const party = {
        partyId: partyId,
        players: [{
            id: req.body.userId,
            name: req.body.userId,
            host: true
        }]
    };

    storage.parties[partyId] = party;

    res.json(party);
});

app.post('/join', (req, res) => {
    if (!req.body.partyId)
        return res.status(400).json({ error: 'partyId cannot be undefined' });

    if(!req.body.userId)
        return res.status(400).json({ error: 'userId cannot be undefined' });

    if (!storage.parties[req.body.partyId])
        return res.status(404).json({ error: `no party with id ${req.body.partyId} found` });

    storage.parties[req.body.partyId].players.push({
        id: req.body.userId,
        name: req.body.userId,
    });

    res.json(storage.parties[req.body.partyId]);
});

app.listen(app.get('port'));

console.log(`http://localhost:${app.get('port')}`);