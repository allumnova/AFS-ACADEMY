// Basic Generic SMS Service
// Currently using console.log for development. 
// Can be easily swapped with Twilio, AWS SNS, or Msg91.

class SMSService {
    constructor() {
        this.provider = process.env.SMS_PROVIDER || 'mock'; // 'twilio', 'msg91'
    }

    async sendOTP(phoneNumber, otp) {
        if (!phoneNumber) throw new Error("Phone number is required");

        const message = `Your Verification Code for AFS Academy is ${otp}. Valid for 10 minutes.`;

        return this.sendSMS(phoneNumber, message);
    }

    async sendSMS(to, message) {
        console.log(`[SMS Service] Sending to ${to}: ${message}`);

        if (this.provider === 'mock') {
            return { success: true, messageId: 'mock-id-' + Date.now() };
        }

        // Implementation for other providers would go here
        // if (this.provider === 'twilio') { ... }

        return { success: false, error: 'Provider not implemented' };
    }
}

module.exports = new SMSService();
