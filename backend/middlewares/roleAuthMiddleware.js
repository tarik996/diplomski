const Role = require('../models/Role');
const { ROLES } = require('../constants/authorizationConstants');

const adminRoleAuth = async (req, res, next) => {
    const role = await Role.findById({ _id: req.user.roleId });
    
    if(role.type === ROLES.ADMINISTRATOR) next();

    else return res.status(401).send('Pristup nije dozvoljen!');
}

const accountantRoleAuth = async (req, res, next) => {
    const role = await Role.findById({ _id: req.user.roleId });

    if(role.type === ROLES.ACCOUNTANT) next();

    else return res.status(401).send('Pristup nije dozvoljen!');
}

const adminAccountantRoleAuth = async (req, res, next) => {
    const role = await Role.findById({ _id: req.user.roleId });

    if(role.type === ROLES.ACCOUNTANT || role.type === ROLES.ADMINISTRATOR) next();

    else return res.status(401).send('Pristup nije dozvoljen!');
}

module.exports = {
    adminRoleAuth,
    accountantRoleAuth,
    adminAccountantRoleAuth
} 