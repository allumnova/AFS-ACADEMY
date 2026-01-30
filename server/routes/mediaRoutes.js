const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', mediaController.getAllMedia); // Publicly viewable
router.post('/', protect, authorize('admin'), mediaController.uploadMedia);
router.delete('/:id', protect, authorize('admin'), mediaController.deleteMedia);

module.exports = router;
