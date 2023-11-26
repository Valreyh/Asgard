const { Schema, model } = require('mongoose');

let chatFilter = new Schema({
    Guild: String,
    Word: String
});

module.exports = model('dbChatFilter', chatFilter);