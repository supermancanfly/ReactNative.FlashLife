import { firebase } from '../../firebase/config';
import { updateUser, getUserByID } from '../../firebase/auth';
import { ConstantValues } from '../../../utils/ConstantValues';

const notificationsRef = firebase.firestore().collection('notifications');

const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey =
  'AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu';

const handleUserBadgeCount = async (userID) => {
  const { badgeCount } = await getUserByID(userID);
  if (badgeCount !== null) {
    const newBadgeCount = badgeCount + 1;
    updateUser(userID, { badgeCount: newBadgeCount });
    return newBadgeCount;
  }
  return 0;
};

const sendPushNotification = async (
  toUser,
  title,
  body,
  type,
  metadata = {},
  updatedOppositeUserPushToken
) => {

  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return;
  };
  if (toUser.settings && toUser.settings.push_notifications_enabled == false) {
    return;
  };
  if (!toUser.pushToken) {
    return;
  };

  // console.log("PUSh_TOKEN :", JSON.stringify(updatedOppositeUserPushToken));
  const notification = {
    toUserID: toUser.id,
    title,
    body,
    metadata,
    toUser,
    type,
    seen: false,
  };

  const ref = await notificationsRef.add({
    ...notification,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  notificationsRef.doc(ref.id).update({ id: ref.id });

  const userBadgeCount = await handleUserBadgeCount(toUser.id || toUser.userID);
  // console.log("OPPSITE_TOKEN:", updatedOppositeUserPushToken);
  const pushNotification = {
    to: updatedOppositeUserPushToken,//toUser.pushToken,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: userBadgeCount,
    },
    data: { type, toUserID: toUser.id, ...metadata, title: "chat_notification" },
    priority: 'high',
  };
  // console.log("push_notification :", JSON.stringify(pushNotification));

  fetch(ConstantValues.FCM_GOOGLE_API, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + ConstantValues.FIREBASE_API_KEY,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  });
};

const sendCallNotification = async (
  sender,
  recipient,
  channelID,
  callType,
  callID,
) => {
  if (!recipient.pushToken) {
    return;
  }

  const pushNotification = {
    to: recipient.pushToken,
    priority: 'high',
    data: {
      channelID,
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  };

  try {
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    });
  } catch (error) {
    console.log(error);
  }
};

export const notificationManager = {
  sendPushNotification,
  sendCallNotification,
};
