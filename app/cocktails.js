const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const permit = require('../middleware/permit');

const Cocktail = require('../models/Cocktail');

const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', auth, async (req, res) => {
    let criteria = {
        $or: [{published: true}, {user: req.user._id}]
        };

    if (req.user.role === 'admin') {
        criteria = {};
    }

    if (req.query.uid) {
        criteria = {user: req.query.uid};
    }

    try {
        const cocktails = await Cocktail.find(criteria);
        res.send(cocktails);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.id);
        res.send(cocktail);
    } catch(e) {
        res.sendStatus(500);
    }
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
    const cocktailData = {
        name: req.body.name,
        recipe: req.body.recipe,
        user: req.user._id
    };

    if (req.file) {
        cocktailData.image = req.file.filename;
    }

    try {
        cocktailData.ingredients = JSON.parse(req.body.ingredients);
        const cocktail = new Cocktail(cocktailData);
        await cocktail.save();
        return res.send(cocktail);
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.post('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.id);
        if (!cocktail) {
            return res.sendStatus(404);
        }
        cocktail.published = !cocktail.published;
        await cocktail.save();

        const cocktails = await Cocktail.find();
        return res.send(cocktails);
    } catch (e) {
       res.sendStatus(500);
    }
});

router.delete('/', [auth, permit('admin')], async (req, res) => {
    try {
        const id = req.query.id;
        const cocktail = await Cocktail.findById(id);

        if (cocktail) {
            await cocktail.remove();
            const coctails = await Cocktail.find();
            return res.status(200).send(coctails);
        } else {
            return res.status(404).send('Not found !');
        }

    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;