#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { generateToken } = require("../src/middleware/auth");

console.log("🔑 Generating authentication token...\n");

// Generate token
const token = generateToken(
  {
    username: process.env.JWT_USERNAME,
    id: 1,
    role: "admin",
  },
  "30d",
);

// Update .env file
const envPath = path.join(__dirname, "../.env");
let envContent = fs.readFileSync(envPath, "utf8");

// Remove existing TOKEN line if exists
envContent = envContent.replace(/^TOKEN=.*$/m, "");

// Add new TOKEN line
envContent += `\nTOKEN=${token}\n`;

// Write back to .env file
fs.writeFileSync(envPath, envContent);

console.log("✅ Token generated successfully!");
console.log("📝 Token saved to .env file");
console.log("\n🔐 Your token:");
console.log(token);
console.log("\n📋 Usage:");
console.log("Authorization: Bearer " + token);
console.log("\n🌐 Test with:");
console.log(
  'curl -H "Authorization: Bearer ' +
    token +
    '" http://localhost:3000/api/cards',
);
console.log("\n📊 Token details:");
console.log("- Username:", process.env.JWT_USERNAME);
console.log("- Role: admin");
console.log("- Expires: 30 days from now");
