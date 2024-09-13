import { Button, Text } from '@rneui/themed';
import { useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import GlobalStyles from '../../styles/GlobalStyles';

const ConfirmEmail = ({}: {}) => {
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const [enable, setEnable] = useState(false);
  return (
    <View
      style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
      <Text>Check your email to confirm your email address.</Text>
    </View>
  );
};

export default ConfirmEmail;
