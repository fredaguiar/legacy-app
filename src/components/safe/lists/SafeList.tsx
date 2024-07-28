import { FlatList, View } from 'react-native';
import useUserStore from '../../../store/useUserStore';
import SafeInfo from './SafeInfo';

const SafeList = () => {
  const user = useUserStore((state) => state.user);

  return (
    <View style={{}}>
      <FlatList
        data={user?.safes}
        renderItem={({ item }) => <SafeInfo safe={item} />}
        keyExtractor={(item) => item._id || ''}
      />
    </View>
  );
};

export default SafeList;
