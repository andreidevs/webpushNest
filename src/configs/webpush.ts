// import webpush from 'web-push';

const webpush = require('web-push');
const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

// GENERATE VPAID KEYS
// const vapidKeys = webPush.generateVAPIDKeys();
// console.log("KEYS", vapidKeys)


export default (): void => {
    webpush.setGCMAPIKey('603489961028');
    webpush.setVapidDetails(
        'mailto:test@test.com',
        publicVapidKey,
        privateVapidKey,
    );
};