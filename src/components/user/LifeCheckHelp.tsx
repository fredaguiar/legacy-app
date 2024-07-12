import { TouchableOpacity, View } from 'react-native';
import { Text, makeStyles, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';

const LifeCheckHelp = () => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles({});
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  return (
    <View style={{ backgroundColor: colors.background1, justifyContent: 'center', flex: 1 }}>
      <View
        style={{
          alignItems: 'center',
          gap: 20,
          justifyContent: 'center',
          marginHorizontal: 20,
          marginBottom: 20,
        }}>
        <Text>
          Legado automaticaly send <Text style={styles.bold}>LIFE-CHECK MESSAGES</Text> are sent
          simultaneously to your registered email and phone via SMS and APP Notification.
        </Text>
        <Text>These messages have a simple question:</Text>
        <Text style={styles.bold}>
          "ARE YOU ALIVE? <Text style={styles.boldBlue}>YES</Text> or{' '}
          <Text style={styles.boldBlue}>NO</Text> ?"
        </Text>
        <Text>
          All you have to do is to click on the <Text style={styles.bold}>YES</Text> button so the
          application cancels its sharing process.
        </Text>
        <Text>
          If the user doesn't answer a set number of consecutive{' '}
          <Text style={styles.bold}>LIFE-CHECKs</Text> for the set waiting time, then Legado will
          automatically share by <Text style={styles.bold}>E-MAIL or SMS</Text> a link to the user's
          SAFES' content with the list of contacts set for each safe. This content will be available
          online for download for a limited period of time, between 1 month and 1 year.
        </Text>
      </View>

      <TouchableOpacity
        style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
        onPress={() => {
          navigation.goBack();
        }}>
        <MaterialCommunityIcons name="arrow-left-bold" size={40} style={{}} />
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  bold: {
    fontWeight: 'bold',
  },
  boldBlue: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: 'blue',
  },
}));

export default LifeCheckHelp;
