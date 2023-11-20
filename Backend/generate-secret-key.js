const crypto = require('crypto');

// Generate 32 bytes (256 bits) of random data for the secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);
