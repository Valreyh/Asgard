const { Schema, model } = require('mongoose');

let customEmbedColor = new Schema({
    Guild: String,
    Color: String
});

module.exports = model('dbCustomEmbedColor', customEmbedColor);