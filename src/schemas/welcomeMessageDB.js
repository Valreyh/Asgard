const { Schema, model } = require('mongoose')
 
let welcomeschema = new Schema({
    Guild: String,
    Channel: String
})
 
module.exports = model('dbWelcomeMessage', welcomeschema);