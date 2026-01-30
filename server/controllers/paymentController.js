const { Payment, Enrollment, Course } = require('../models');
const sendEmail = require('../utils/emailService');
const cfPkg = require('cashfree-pg');
const Cashfree = cfPkg.Cashfree || cfPkg;
const Environment = cfPkg.Environment || Cashfree.Environment;

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Environment.SANDBOX;

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            where: { userId: req.user.id },
            include: [{ model: Course, as: 'course', attributes: ['title'] }],
            order: [['paymentDate', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const request = {
            order_amount: parseFloat(course.price),
            order_currency: 'INR',
            order_id: orderId,
            customer_details: {
                customer_id: req.user.id,
                customer_name: req.user.name || 'Student',
                customer_email: req.user.email,
                customer_phone: '9999999999' // Mandatory for Cashfree, using dummy if not available
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_API_URL}/payments/verify?order_id={order_id}`
            }
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        const orderData = response.data;

        // Save pending payment record
        await Payment.create({
            userId: req.user.id,
            courseId: course.id,
            amount: course.price,
            cfOrderId: orderData.order_id,
            paymentSessionId: orderData.payment_session_id,
            status: 'pending'
        });

        res.json(orderData);

    } catch (error) {
        console.error('Cashfree Create Order Error:', error.response?.data?.message || error.message);
        res.status(500).json({ message: error.response?.data?.message || 'Payment initiation failed' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        const payments = response.data;

        const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');

        if (successfulPayment) {
            const paymentRecord = await Payment.findOne({ where: { cfOrderId: orderId } });

            if (paymentRecord) {
                // Update payment status
                paymentRecord.status = 'completed';
                paymentRecord.cfPaymentId = successfulPayment.cf_payment_id;
                paymentRecord.paymentMethod = successfulPayment.payment_group; // credit_card, upi, etc.
                await paymentRecord.save();

                // Enroll student
                await Enrollment.findOrCreate({
                    where: { userId: paymentRecord.userId, courseId: paymentRecord.courseId },
                    defaults: { status: 'active' }
                });

                return res.json({ status: 'success', message: 'Payment verified and enrolled' });
            }
        }

        res.status(400).json({ status: 'failed', message: 'Payment verification failed' });

    } catch (error) {
        console.error('Cashfree Verify Error:', error.response?.data?.message || error.message);
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { Course, User } = require('../models');

        const payment = await Payment.findByPk(id, {
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Course, as: 'course', attributes: ['title', 'price'] }
            ]
        });

        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        // Check ownership
        if (payment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate a simple HTML invoice for now
        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; padding: 40px; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .company-info { text-align: right; }
                    .invoice-details { margin-top: 40px; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table th, .table td { border: 1px solid #eee; padding: 12px; text-align: left; }
                    .table th { background: #f9f9f9; }
                    .total { text-align: right; margin-top: 20px; font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>INVOICE</h1>
                        <p>Invoice #: INV-${payment.transactionId.substring(0, 8).toUpperCase()}</p>
                        <p>Date: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div class="company-info">
                        <h2>AFS ACADEMY</h2>
                        <p>123 Academy Lane</p>
                        <p>Tech City, TC 45678</p>
                    </div>
                </div>
                <div class="invoice-details">
                    <p><strong>Billed To:</strong> ${payment.student.name} (${payment.student.email})</p>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Course: ${payment.course ? payment.course.title : 'General Training Fee'}</td>
                            <td>${payment.currency} ${payment.amount}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total">
                    Total PAID: ${payment.currency} ${payment.amount}
                </div>
                <p style="margin-top: 40px; color: #888; font-size: 0.8em; text-align: center;">
                    This is a computer generated invoice and does not require a signature.
                </p>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(invoiceHtml);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
