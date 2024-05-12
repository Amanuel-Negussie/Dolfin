const crypto = require('crypto');

function encryptData(text, secretKey) {
    // Generate a random IV
    let iv;
    try {
        iv = crypto.randomBytes(16); // 16 bytes for AES IV
    } catch (error) {
        throw new Error('Failed to generate IV:', error);
    }
    
    // Create a cipher with the IV
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend the IV to the encrypted data
    const encryptedWithIV = iv.toString('hex') + encrypted;
    
    return encryptedWithIV;
}

// Example usage:
// const plaintext = 'my_secret_data';
// const secretKey = 'my_secret_key'; // Should be a secure, randomly generated key
// const iv = crypto.randomBytes(16); // Initialization vector
// const encryptedData = encryptData(plaintext, secretKey, iv);
// console.log('Encrypted data:', encryptedData);

module.exports = {
    encryptData
};
