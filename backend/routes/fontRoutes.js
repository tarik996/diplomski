const express = require('express');
const router = express.Router();
const { encodeFunction } = require('../helpers/convertTTF');

router.get('/getAmiriFont', async (req,res) => {
    const file = 'backend/assets/Amiri_400Regular.ttf';
    const encode = encodeFunction(file);
    
    return res.json({encode: encode});
}); 

module.exports = router;