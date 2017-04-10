import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import pushr from './pushr';
import config from '../config';

const app = express();

app.set('port', (config.port));

const storage = {
    parties: {}
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) =>
    res.json(storage)
);

app.post('/host', (req, res) => {
    console.log(req.body);

    if(!req.body.user)
        return res.status(400)
            .json({ error: 'user cannot be undefined' });
    if(!req.body.user.id)
        return res.status(400)
            .json({ error: 'user.id cannot be undefined' });
    if(!req.body.user.name)
        return res.status(400)
            .json({ error: 'user.name cannot be undefined' });

    const partyId = uuid.v4().substr(0,4);

    const { id, name } = req.body.user;

    const party = {
        id: partyId,
        players: [{
            id,
            name,
            host: true
        }]
    };

    pushr.trigger('host', party);

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

    pushr.trigger('join', {partyId: req.body.partyId, userId});

    res.json(storage.parties[req.body.partyId]);
});

app.listen(app.get('port'));

console.log(`http://localhost:${app.get('port')}`);