const express = require('express');
const drugController = require('../controllers/drugController');
const util = require('../middleware/util');

const router = express.Router();

router.post('/search2', drugController.search2);
router.get('/symptomSearch', drugController.symptomSearch);
router.get('/symptom-search', drugController.symptomSearch2);
router.post('/save', drugController.saveDrug);
// router.delete('/delete', drugController.deleteMyDrug);

module.exports = router;