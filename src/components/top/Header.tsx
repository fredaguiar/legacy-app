import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Button, useTheme } from '@rneui/themed';
import useUserStore from '../../store/useUserStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LifeCheckUI from '../ui/LifeCheckUI';
// import useNotification from '../../hooks/useNotification';

const Header = () => {
  const { user } = useUserStore();
  const navigation = useNavigation();
  // const { notification, expoPushToken, sendPushNotification } = useNotification();
  const {
    theme: { colors },
  } = useTheme();

  // if (notification) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
  //       <Text>Your Expo push token: {expoPushToken}</Text>
  //       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  //         <Text>Title: {notification && notification.request.content.title} </Text>
  //         <Text>Body: {notification && notification.request.content.body}</Text>
  //         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
  //       </View>
  //       <Button
  //         title="Press to Send Notification"
  //         onPress={async () => {
  //           await sendPushNotification(expoPushToken);
  //         }}
  //       />
  //     </View>
  //   );
  // }

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
