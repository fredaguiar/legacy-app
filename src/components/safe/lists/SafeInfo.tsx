import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import useSafeStore from '../../../store/useSafeStore';

const SafeInfo = ({ safe }: { safe: TSafe }) => {
  const { setSafeId } = useSafeStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { _id: safeId, name } = safe;

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
        <Text style={{ maxWidth: '70%' }}>{name}</Text>
        {safe.autoSharing && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 5,
            }}>
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={20}
              color={colors.highlight2}
            />
            <Text style={{ fontSize: 14, color: colors.highlight2 }}>To share</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SafeOption', { safeId: safeId || '', pageLoad: 'list' });
        }}>
        <MaterialCommunityIcons name="dots-horizontal" size={50} style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
    </View>
  );
};

export default SafeInfo;
