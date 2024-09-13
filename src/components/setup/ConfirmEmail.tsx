import { Button, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import GlobalStyles from '../../styles/GlobalStyles';
import useNotification from '../../hooks/useNotification';

const ConfirmEmail = ({}: {}) => {
  const { notification, setNotification } = useNotification();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    setNotified(notification ? true : false);
  }, [notification]);

  return (
    <View
      style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
      {!notified ? (
        <Text>Check your email to confirm your email address.</Text>
      ) : (
        <View>
          <Text>Email confirmed!</Text>
          <Button
            onPress={() => {
              navigation.navigate('Home');
            }}
            title="Continue >>"
            containerStyle={{ width: 300, marginBottom: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default ConfirmEmail;
