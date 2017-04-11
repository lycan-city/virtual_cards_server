import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'node-uuid';
import pushr from './pushr';
import config from '../config';
import _ from 'lodash';

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

    storage.parties[partyId] = party;

    res.json(party);
});

app.post('/join', (req, res) => {
    if (!req.body.partyId)
        return res.status(400).json({ error: 'partyId cannot be undefined' });

    if(!req.body.user || !req.body.user.id || !req.body.user.name)
        return res.status(400).json({ error: 'user cannot be undefined' });

    if (!storage.parties[req.body.partyId])
        return res.status(404).json({ error: `no party with id ${req.body.partyId} found` });

    storage.parties[req.body.partyId].players.push(req.body.user);

    pushr.trigger(req.body.partyId, 'joined', req.body.user);

    res.json(storage.parties[req.body.partyId]);
});

app.post('/flee', (req, res) => {
    if (!req.body.partyId)
        return res.status(400).json({ error: 'partyId cannot be undefined' });

    if(!req.body.userId)
        return res.status(400).json({ error: 'userId cannot be undefined' });

    if (!storage.parties[req.body.partyId])
        return res.status(404).json({ error: `no party with id ${req.body.partyId} found` });

    pushr.trigger(req.body.partyId, 'fled', {id: req.body.userId});
    
    const players = storage.parties[req.body.partyId].players;

    const fleeingIndex = _.findIndex(players, user => user.id == req.body.userId);

    players.splice(fleeingIndex, 1);

    storage.parties[req.body.partyId].players = players;

    res.sendStatus(200);
});

app.listen(app.get('port'));

console.log(`http://localhost:${app.get('port')}`);