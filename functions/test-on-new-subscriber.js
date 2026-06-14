
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to create this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

db.collection('newsletterSubscribers').doc('test-subscriber-4@example.com').set({
  email: 'test-subscriber-4@example.com',
  status: 'active',
  source: 'manual-script',
  createdAt: new Date(),
}).then(() => {
  console.log('New subscriber created successfully!');
  process.exit(0);
}).catch(error => {
  console.error('Error creating new subscriber:', error);
  process.exit(1);
});
