const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ivLength = 16;

// Create 32-byte key from secret
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.PASSWORD_SECRET)
  .digest("base64")
  .substring(0, 32);

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
