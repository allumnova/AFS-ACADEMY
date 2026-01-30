const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, paymentController.getMyPayments);
router.post('/orders', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/:id/invoice', protect, paymentController.generateInvoice);

module.exports = router;
