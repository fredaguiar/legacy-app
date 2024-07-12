import { View } from 'react-native';
import { Button, Text, makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import useUserStore from '../../store/useUserStore';

const Bottom = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParams, 'CreateSafe'>>();
  const styles = useStyles({});
  const { user } = useUserStore();
  const {
    theme: { colors },
  } = useTheme();

  const goTo = (itemType: TFileType) => {
    navigation.navigate('AddItems', { itemType });
  };

  const hasSafe = (user?.safes && user.safes.length > 0) || false;

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          marginBottom: 10,
        }}>
        <ButtonAddItem
          onPress={() => {
            navigation.navigate('CreateSafe');
          }}
          title="Create new safe"
          width={200}
          iconName="treasure-chest"
        />
      </View>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Add new item:</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <ButtonAddItem
          onPress={() => goTo('photo')}
          color={colors.secondary}
          title="Photo"
          disabled={!hasSafe}
          iconName="camera-outline"
        />
        <ButtonAddItem
          onPress={() => goTo('video')}
          color={colors.secondary}
          title="Video"
          disabled={!hasSafe}
          iconName="video-outline"
        />
        <ButtonAddItem
          onPress={() => goTo('audio')}
          color={colors.secondary}
          title="Audio"
          disabled={!hasSafe}
          iconName="microphone-outline"
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <ButtonAddItem
          onPress={() => goTo('text')}
          color={colors.secondary}
          title="Text"
          disabled={!hasSafe}
          iconName="note-text-outline"
        />
        <ButtonAddItem
          onPress={() => goTo('file')}
          color={colors.secondary}
          title="File"
          disabled={!hasSafe}
          iconName="file-document-outline"
        />
        <ButtonAddItem
          onPress={() => navigation.navigate('SavePassword', {})}
          color={colors.secondary}
          title="Password"
          disabled={!hasSafe}
          iconName="lock-outline"
        />
      </View>
    </View>
  );
};

const ButtonAddItem = ({
  onPress,
  title,
  width,
  color,
  iconName,
  disabled,
}: {
  onPress: () => void;
  title: string;
  width?: number;
  color?: string;
  iconName: string;
  disabled?: boolean;
}) => {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Button
      onPress={onPress}
      title={title}
      color={color}
      containerStyle={{
        margin: 5,
        width: width ? width : 125,
      }}
      disabled={disabled}
      radius="5"
      titleStyle={{
        color: 'black',
        fontWeight: 'normal',
        fontSize: 18,
      }}
      icon={
        <MaterialCommunityIcons
          color={disabled ? '#cecece' : 'black'}
          name={iconName}
          size={30}
          style={{ marginRight: 5 }}
        />
      }
    />
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  container: {
    height: 210,
    backgroundColor: theme.colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default Bottom;
