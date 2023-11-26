const { Schema, model } = require('mongoose');

let rolesBypassFilter = new Schema({
    Guild: String,
    RoleID: String
});

module.exports = model('dbRolesBypassFilter', rolesBypassFilter);