try {
    console.log('Attempting require...');
    const cf = require('cashfree-pg');
    console.log('Require success. Type:', typeof cf);
    console.log('Keys:', Object.keys(cf));
    if (cf.Cashfree) console.log('cf.Cashfree keys:', Object.keys(cf.Cashfree));
    console.log('Full Dump:', JSON.stringify(cf, null, 2));
} catch (e) {
    console.error('Require failed:', e);
}
