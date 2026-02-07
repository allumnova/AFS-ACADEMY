const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All batch routes are admin-only for now
router.use(protect);
router.use(authorize('admin', 'super-admin'));

router.post('/', batchController.createBatch);
router.get('/', batchController.getAllBatches);
router.get('/:id', batchController.getBatchById);
router.put('/:id', batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);
router.post('/add-student', batchController.addStudentToBatch);

module.exports = router;
