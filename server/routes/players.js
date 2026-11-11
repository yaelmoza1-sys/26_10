
import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/search', async (req, res) => {
    try {
        const db = await readDb();
        const player = db.players.find(
            p => p.name.toLowerCase() === req.query.name?.toLowerCase()
        );

        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const player = db.players.find(p => String(p.id) === req.params.id);

        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const db = await readDb();
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: 'Player name is required' });

        const newPlayer = {
            id: db.players.length
                ? Math.max(...db.players.map(p => Number(p.id))) + 1
                : 1,
            name,
            lowestTime: null
        };

        db.players.push(newPlayer);
        await writeDb(db);
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const index = db.players.findIndex(p => String(p.id) === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Player not found' });

        db.players[index] = { ...db.players[index], ...req.body, id: db.players[index].id };
        await writeDb(db);
        res.json(db.players[index]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const index = db.players.findIndex(p => String(p.id) === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Player not found' });

        const [deleted] = db.players.splice(index, 1);
        await writeDb(db);
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
