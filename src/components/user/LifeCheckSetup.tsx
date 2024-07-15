import { TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import useUserStore from '../../store/useUserStore';
import { convertTimeToDate } from '../../utils/DateUtil';
import { capitalizeFirstLetter } from '../../utils/StringUtil';

const LifeCheckSetup = () => {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { user } = useUserStore();

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          justifyContent: 'center',
          marginVertical: 20,
        }}
        onPress={() => {
          navigation.navigate('LifeCheckHelp');
        }}>
        <Text>Help</Text>
        <MaterialCommunityIcons
          name="comment-question-outline"
          size={30}
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>

      <Button
        onPress={() => {
          navigation.navigate('LifeCheckFrequency');
        }}
        title="Life check frequency"
        color={colors.primary}
        containerStyle={{ margin: 5, width: '80%', marginBottom: 20, alignSelf: 'center' }}
        icon={
          <MaterialCommunityIcons
            name="calendar-multiple-check"
            size={30}
            style={{ marginRight: 5 }}
          />
        }
      />
      {user?.lifeCheck.shareTime && (
        <View style={{ marginBottom: 20, backgroundColor: colors.background2 }}>
          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              padding: 20,
            }}>
            Send Life-check messages every
            <Text style={{ fontWeight: 'bold' }}>
              {' '}
              {user?.lifeCheck.shareWeekdays
                ?.map((weekday) => capitalizeFirstLetter(weekday))
                .join(', ')}
            </Text>
            , at
            <Text style={{ fontWeight: 'bold' }}>
              {' '}
              {moment(convertTimeToDate(user?.lifeCheck.shareTime)).format('h:mm a')}
            </Text>
            .
          </Text>
          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              paddingBottom: 20,
            }}>
            Share safe(s){' '}
            <Text style={{ fontWeight: 'bold' }}>
              {user?.lifeCheck.shareCount} {user?.lifeCheck.shareCountType}
            </Text>{' '}
            after{' '}
            <Text style={{ fontWeight: 'bold' }}>{user?.lifeCheck.shareCountNotAnswered}</Text>{' '}
            consecutive unanswered life-check messages
          </Text>
        </View>
      )}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, alignSelf: 'center', fontWeight: 'bold' }}>
          Phone: +{user?.phoneCountry} {user?.phone}
        </Text>
        <Text style={{ fontSize: 16, alignSelf: 'center', fontWeight: 'bold' }}>
          Email: {user?.email}
        </Text>
      </View>
      <Text style={{ fontSize: 18, alignSelf: 'center', marginBottom: 20, marginHorizontal: 20 }}>
        Please make sure you have access to the email and SMS inboxes.
      </Text>
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

export default LifeCheckSetup;
