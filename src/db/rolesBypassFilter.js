const { Schema, model } = require('mongoose');

let rolesBypassFilter = new Schema({
    roleID: Number
});

module.exports = model('dbRolesBypassFilrer', rolesBypassFilter);