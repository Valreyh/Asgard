const { Schema, model } = require('mongoose');

let chatFilter = new Schema({
    word: String
});

module.exports = model('dbChatFilter', chatFilter);