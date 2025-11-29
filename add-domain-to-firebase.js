#!/usr/bin/env node
/**
 * Script to automatically add current Vercel deployment domain to Firebase Authorized Domains
 * 
 * SETUP:
 * 1. Install Firebase Admin SDK: npm install --save-dev firebase-admin
 * 2. Get your Firebase service account key:
 *    - Go to Firebase Console → Project Settings → Service Accounts
 *    - Click "Generate New Private Key"
 *    - Save it as `service-account-key.json` in project root
 * 3. Run: node add-domain-to-firebase.js
 * 
 * This script will:
 * - Read your Firebase project ID from vercel.json
 * - Detect your current Vercel deployment domain (from VERCEL_URL env var)
 * - Add it to Firebase's Authorized Domains list
 */

const fs = require('fs');
const path = require('path');

async function addDomainToFirebase() {
  try {
    // Check if service account key exists
    const keyPath = path.join(process.cwd(), 'service-account-key.json');
    if (!fs.existsSync(keyPath)) {
      console.error('❌ service-account-key.json not found.');
      console.log('\nTo set up:');
      console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('2. Click "Generate New Private Key"');
      console.log('3. Save it as service-account-key.json in project root');
      console.log('4. Add service-account-key.json to .gitignore');
      process.exit(1);
    }

    // Import Firebase Admin SDK
    const admin = require('firebase-admin');
    const serviceAccount = require(keyPath);

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const projectId = serviceAccount.project_id;
    const vercelDomain = process.env.VERCEL_URL || 'localhost:5173';

    console.log(`📋 Project ID: ${projectId}`);
    console.log(`🌐 Domain to add: ${vercelDomain}`);

    // Get the auth config from Firebase
    const authConfig = await admin.auth().getProjectConfig();
    console.log(`✅ Current authorized domains: ${authConfig.authorizedDomains.join(', ')}`);

    // Check if domain already exists
    if (authConfig.authorizedDomains.includes(vercelDomain)) {
      console.log(`✓ Domain ${vercelDomain} is already authorized.`);
      return;
    }

    // Add the new domain
    const newAuthConfig = {
      authorizedDomains: [...authConfig.authorizedDomains, vercelDomain],
    };

    await admin.auth().updateProjectConfig(newAuthConfig);
    console.log(`✅ Successfully added ${vercelDomain} to authorized domains!`);
    console.log('⏳ Changes should take effect within 1-2 minutes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addDomainToFirebase();
