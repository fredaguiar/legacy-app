import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp } from '@react-navigation/native';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import useSafeStore from '../../../store/useSafeStore';

const SafeInfo = ({
  safeName,
  safeId,
  navigation,
}: {
  safeName: string;
  safeId: string;
  navigation: NavigationProp<MenuDrawerParams>;
}) => {
  const { setSafeId } = useSafeStore();
  const {
    theme: { colors },
  } = useTheme();
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          alignItems: 'center',
          borderWidth: 1,
          backgroundColor: colors.row1,
          borderRadius: 10,
          margin: 5,
        }}
        onPress={() => {
          setSafeId(safeId);
        }}>
        <MaterialCommunityIcons name="treasure-chest" size={50} style={{ marginHorizontal: 5 }} />
        <Text style={{ maxWidth: '70%' }}>{safeName}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SafeOption', { safeId });
        }}>
        <MaterialCommunityIcons name="dots-horizontal" size={50} style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
    </View>
  );
};

export default SafeInfo;
