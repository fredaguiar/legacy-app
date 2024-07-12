import { FlatList, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import useUserStore from '../../../store/useUserStore';
import SafeInfo from './SafeInfo';

const SafeList = () => {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  return (
    <View style={{}}>
      <FlatList
        data={user?.safes}
        renderItem={({ item }) => (
          <SafeInfo safeName={item.name || ''} safeId={item._id || ''} navigation={navigation} />
        )}
        keyExtractor={(item) => item._id || ''}
      />
    </View>
  );
};

export default SafeList;
