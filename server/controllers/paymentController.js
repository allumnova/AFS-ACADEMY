const { Payment, Enrollment } = require('../models');
const sendEmail = require('../utils/emailService');

exports.getMyPayments = async (req, res) => {
    try {
        const { Course } = require('../models');
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
        const { amount, currency } = req.body;

        // Mock Order Creation (e.g., Razorpay/Stripe would return an order_id here)
        const orderId = `order_${Date.now()}`;

        res.json({
            id: orderId,
            currency: currency || 'INR',
            amount: amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId, orderId, amount, courseId } = req.body;

        // Mock verification override
        const payment = await Payment.create({
            userId: req.user.id,
            courseId: courseId || null,
            amount,
            transactionId: paymentId || `pay_${Date.now()}`,
            status: 'completed',
            paymentMethod: 'mock_gateway'
        });

        // Create Enrollment if courseId is provided
        if (courseId) {
            await Enrollment.create({
                userId: req.user.id,
                courseId: courseId,
                status: 'active'
            });
        }

        // Send Confirmation Email
        try {
            const user = await Payment.findByPk(payment.id, {
                include: [{ model: require('../models').User, as: 'student', attributes: ['name', 'email'] }]
            });

            await sendEmail({
                email: req.user.email,
                subject: 'Payment Successful - AFS Academy',
                message: `Your payment of ${amount} for the course has been confirmed. Transaction ID: ${payment.transactionId}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #10b981;">Payment Confirmed</h2>
                        <p>Hello ${req.user.name},</p>
                        <p>We've successfully received your payment for the course.</p>
                        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px;"><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                            <p style="margin: 5px 0 0; font-size: 14px;"><strong>Amount Paid:</strong> ${payment.currency} ${amount}</p>
                        </div>
                        <p>You can now access your course from the student dashboard.</p>
                        <a href="http://localhost:3000/student/courses" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Go to Dashboard</a>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Mail Confirmation Error:', mailError);
        }

        res.json({ message: 'Payment verified and enrollment created', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
