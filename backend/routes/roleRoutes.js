const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { verifyAccessToken } = require('../middlewares/verifyTokenMiddleware');
const { adminRoleAuth } = require('../middlewares/roleAuthMiddleware');

router.get('/getRoles', verifyAccessToken, adminRoleAuth, async (req, res) => {
    try {
        var roles = await Role.find({}, {_id: 0, type: 0, __v: 0});

        return res.json({roles: roles});
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;