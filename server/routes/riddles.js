
import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';

const router = express.Router();

// GET - Get all riddles
router.get('/', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.riddles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const riddle = db.riddles.find(r => String(r.id) === req.params.id);

        if (!riddle) return res.status(404).json({ message: 'Riddle not found' });
        res.json(riddle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const db = await readDb();
        const newRiddle = req.body;

        if (!newRiddle || typeof newRiddle !== 'object' || Array.isArray(newRiddle))
            return res.status(400).json({ message: 'Invalid riddle data' });

        newRiddle.id = db.riddles.length
            ? Math.max(...db.riddles.map(r => Number(r.id))) + 1
            : 1;

        db.riddles.push(newRiddle);
        await writeDb(db);
        res.status(201).json(newRiddle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const index = db.riddles.findIndex(r => String(r.id) === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Riddle not found' });

        db.riddles[index] = { ...db.riddles[index], ...req.body, id: db.riddles[index].id };
        await writeDb(db);
        res.json(db.riddles[index]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const db = await readDb();
        const index = db.riddles.findIndex(r => String(r.id) === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Riddle not found' });

        const [deleted] = db.riddles.splice(index, 1);
        await writeDb(db);
        res.json(deleted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
