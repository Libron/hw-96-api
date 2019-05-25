const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    ingredients: [
        {name: String, amount: String, key: String}
    ],
    rating: [
        {user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }, rate: Number}
    ],
    recipe: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true,
    }
});

const Cocktail = mongoose.model('Cocktail', CocktailSchema);

module.exports = Cocktail;