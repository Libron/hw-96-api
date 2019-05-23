const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const auth = require('../middleware/auth');
const permit = require('../middleware/permit');

const Coctail = require('../models/Cocktail');

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

router.get('/', async (req, res) => { // GET /products?category=lajdlfkjdlf
    try {
        const criteria = {};

        if (req.query.category) {
            criteria.category = req.query.category;
        }

        const products = await Coctail.find(criteria);
        res.send(products);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id', (req, res) => {
    Coctail.findById(req.params.id)
        .then(product => {
            if (product) res.send(product);
            else res.sendStatus(404);
        })
        .catch(() => res.sendStatus(500));
});

router.post('/', [auth, permit('admin'), upload.single('image')], (req, res) => {
    const productData = req.body;

    if (req.file) {
        productData.image = req.file.filename;
    }

    const product = new Coctail(productData);

    product.save()
        .then(result => res.send(result))
        .catch(error => res.status(400).send(error));
});


module.exports = router;