const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const config = require('../config');
const axios = require('axios');
const nanoid = require('nanoid');


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

router.post('/', upload.single('avatarImage'), async (req, res) => {
    const userData = req.body;

    if (req.file) {
        userData.avatarImage = req.file.filename;
    }

    const user = new User(userData);

    user.generateToken();

    try {
        await user.save();
        return res.send({token: user.token});
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'User does not exist'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Password incorrect'});
    }

    user.generateToken();

    await user.save();

    res.send({message: "Login successful", user});
});

router.post('/facebookLogin', async (req, res) => {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    try {
        const response = await axios.get(debugTokenUrl);
        const responseData = response.data;
        if (responseData.data.error) {
            return res.status(500).send({message: 'Token Incorrect'});
        }

        if (responseData.data.user_id !== req.body.id) {
            return res.status(500).send({error: 'User is wrong'});
        }

        let user = await User.findOne({facebookId: req.body.id});

        if (!user) {
            user = new User({
                username: req.body.email || req.body.id,
                password: nanoid(),
                facebookId: req.body.id,
                avatarImage: req.body.picture.data.url,
                displayName: req.body.name
            });
        }
        user.generateToken();
        await user.save();

        return res.send({message: 'Login or Register successfully', user});
    } catch (e) {
        console.log('3');
        return res.status(500).send({message: 'Something went wrong'});
    }
});

module.exports = router;