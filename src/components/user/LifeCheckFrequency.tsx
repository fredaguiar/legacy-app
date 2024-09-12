import { TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme, ButtonGroup } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import useUserStore from '../../store/useUserStore';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import PickerUI from '../ui/PickerUI';
import { SHARE_COUNT, SHARE_COUNT_TYPE, SHARE_COUNT_NOT_ANSWERED } from '../../Const';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateLifeCheckApi } from '../../services/userApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import {
  convertIndexesToWeekday,
  convertTimeToDate,
  convertWeekdayToIndexes,
} from '../../utils/DateUtil';

const validationSchema = yup.object().shape({
  // shareWeekdays: yup.array().min(1, 'Select 1 or more weekdays'),
  shareWeekdays: yup.array().min(1, 'Weekday is required'),
});

const LifeCheckFrequency = () => {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { updateUserLifeCheck } = useUserStore();
  const [time, setTime] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['lifeCheckFrequency'],
    queryFn: () => getUserProfile(),
  });

  useEffect(() => {
    if (data) {
      if (data.lifeCheck.shareTime) {
        setTime(convertTimeToDate(data.lifeCheck.shareTime));
      }
    }
  }, [data]);

  const {
    mutate: mutate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateLifeCheckApi,
    onSuccess: (result: TUserLifeCheckUpdate) => {
      const { shareTime, shareWeekdays, shareCount, shareCountType, shareCountNotAnswered } =
        result.lifeCheck;
      updateUserLifeCheck({
        lifeCheck: {
          shareTime,
          shareWeekdays,
          shareCount,
          shareCountType,
          shareCountNotAnswered,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['lifeCheckFrequency'] });
      navigation.navigate('LifeCheckSetup');
    },
  });

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
      <ErrorMessageUI display={isError} message={error?.message} />
      <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          justifyContent: 'center',
          marginVertical: 30,
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

      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          shareTime: convertTimeToDate(data?.lifeCheck.shareTime),
          shareWeekdays: convertWeekdayToIndexes(data?.lifeCheck.shareWeekdays),
          shareCount: data?.lifeCheck.shareCount || 2,
          shareCountType: data?.lifeCheck.shareCountType || 'days',
          shareCountNotAnswered: data?.lifeCheck.shareCountNotAnswered || 5,
        }}
        onSubmit={(values) => {
          console.log('selectedWeekdays', values);
          mutate({
            lifeCheck: {
              shareTime: moment(time).format('HH:mm'),
              shareWeekdays: convertIndexesToWeekday(values.shareWeekdays),
              shareCount: values.shareCount,
              shareCountType: values.shareCountType,
              shareCountNotAnswered: values.shareCountNotAnswered,
            },
          });
        }}>
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.background2,
                width: '100%',
                paddingVertical: 20,
              }}>
              <Text>Send life-checking every</Text>
              <ButtonGroup
                buttons={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                // selectMultiple
                // selectedIndexes={values.shareWeekdays}
                selectedIndex={values.shareWeekdays[0]}
                onPress={(values) => {
                  // setFieldValue('shareWeekdays', values);
                  setFieldValue('shareWeekdays[0]', values);
                }}
              />
              {errors.shareWeekdays && touched.shareWeekdays && (
                <Text style={{ color: 'red' }}>{errors.shareWeekdays}</Text>
              )}
              <View style={{ alignItems: 'center', gap: 5, flexDirection: 'row', marginTop: 10 }}>
                <Text>At: </Text>
                <Button
                  title={moment(time).format('hh-mm a') + ' '}
                  onPress={() => setOpen(true)}
                  icon={
                    <MaterialCommunityIcons name="clock-time-eight-outline" size={30} style={{}} />
                  }
                  iconRight={true}
                />
                <DatePicker
                  modal
                  mode="time"
                  open={open}
                  date={time}
                  onConfirm={(date) => {
                    setOpen(false);
                    setTime(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                <Text>Share safes</Text>
                <PickerUI
                  selectedValue={values.shareCount?.toString()}
                  onValueChange={handleChange('shareCount')}
                  items={SHARE_COUNT}
                  style={{ width: 120 }}
                />
                <PickerUI
                  selectedValue={values.shareCountType}
                  onValueChange={handleChange('shareCountType')}
                  items={SHARE_COUNT_TYPE}
                  style={{ width: 150 }}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                  <Text>after</Text>
                  <PickerUI
                    selectedValue={values.shareCountNotAnswered?.toString()}
                    onValueChange={handleChange('shareCountNotAnswered')}
                    items={SHARE_COUNT_NOT_ANSWERED}
                    style={{ width: 120 }}
                  />
                </View>
                <Text style={{ marginBottom: 20 }}>consecutive unanswered life-checks.</Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: colors.background2, width: '100%', paddingVertical: 20 }}>
              <IconButtonsSaveCancel
                onPressSave={handleSubmit}
                onPressCancel={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default LifeCheckFrequency;
