import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';

const BackButton = () => {
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  return (
    <TouchableOpacity
      style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
      onPress={() => {
        navigation.goBack();
      }}>
      <MaterialCommunityIcons name="arrow-left-bold" size={40} style={{}} />
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
