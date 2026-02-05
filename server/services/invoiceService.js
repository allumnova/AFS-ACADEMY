const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceService {
    constructor() {
        this.uploadsDir = path.join(__dirname, '../uploads/invoices');
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    async generateInvoice(payment, user, course) {
        return new Promise((resolve, reject) => {
            const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const fileName = `invoice-${payment.id}.pdf`;
            const filePath = path.join(this.uploadsDir, fileName);

            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fontSize(20).text('INVOICE', { align: 'right' });
            doc.fontSize(10).text(`Invoice Number: ${invoiceNumber}`, { align: 'right' });
            doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'right' });
            doc.moveDown();

            // Sender Details
            doc.fontSize(14).text('AFS Academy', { align: 'left' });
            doc.fontSize(10).text('123, Tech Park, Bangalore', { align: 'left' });
            doc.text('Karnataka, India - 560001', { align: 'left' });
            doc.text('Email: info@allumnova.com', { align: 'left' });
            doc.moveDown();

            // Bill To
            doc.fontSize(12).text('Bill To:', { align: 'left' });
            doc.fontSize(10).text(user.name, { align: 'left' });
            doc.text(user.email, { align: 'left' });
            doc.moveDown();

            // Item Table Header
            const tableTop = 250;
            doc.font('Helvetica-Bold');
            doc.text('Description', 50, tableTop);
            doc.text('Amount', 400, tableTop, { align: 'right' });
            doc.font('Helvetica');

            // Separator
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Item Details
            const itemTop = tableTop + 30;
            doc.text(`Course: ${course.title}`, 50, itemTop);

            // Currency formatting with Rupee Symbol
            // Note: PDFKit might not support the symbol directly without a font, 
            // so we use "INR " or a compatible font. For simplicity using "INR".
            const amount = parseFloat(payment.amount).toFixed(2);
            doc.text(`INR ${amount}`, 400, itemTop, { align: 'right' });

            // Total
            doc.moveTo(50, itemTop + 20).lineTo(550, itemTop + 20).stroke();
            doc.font('Helvetica-Bold');
            doc.text('Total', 300, itemTop + 35, { align: 'right' });
            doc.text(`INR ${amount}`, 400, itemTop + 35, { align: 'right' });

            // Footer
            doc.fontSize(10).text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });
            doc.text('This is a computer generated invoice.', { align: 'center', width: 500 });

            doc.end();

            stream.on('finish', () => {
                resolve({
                    filePath,
                    fileName,
                    invoiceNumber
                });
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}

module.exports = new InvoiceService();
