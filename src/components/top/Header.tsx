import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Button, useTheme } from '@rneui/themed';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LifeCheckUI from '../ui/LifeCheckUI';
import useUserStore from '../../store/useUserStore';

// import useNotification from '../../hooks/useNotification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const Header = () => {
  const { user } = useUserStore();
  const navigation = useNavigation();
  // const { notification, expoPushToken, sendPushNotification } = useNotification();
  const {
    theme: { colors },
  } = useTheme();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (notification) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <Text>Your Expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
      </View>
    );
  }

  return (
    <View style={[{ backgroundColor: colors.background3 }]}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            justifyContent: 'space-between',
          },
        ]}>
        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <MaterialCommunityIcons name="menu-down" size={50} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, width: 210 }} numberOfLines={1} ellipsizeMode="tail">
            {`${user?.firstName} ${user?.lastName}`}
          </Text>
        </View>
        <LifeCheckUI currentScreen="home" style={{ marginRight: 10 }} />
      </View>
    </View>
  );
};

export default Header;
