import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export async function initNotifications() {
  const messaging = getMessaging();
  try {
    const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    console.log('FCM Token:', token);
  } catch (err) {
    console.error('Permission denied', err);
  }
  onMessage(messaging, payload => {
    console.log('Message reçu en foreground', payload);
    new Notification(payload.notification.title, { body: payload.notification.body });
  });
}

export function subscribeToTopics(topics) {
  console.log('Abonné aux topics:', topics);
}
