import { Input, Text } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import GlobalStyles from '../../styles/GlobalStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COUNTRIES, COUNTRY_TIMEZONES, LANGUAGES } from '../../Const';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import PickerUI from '../ui/PickerUI';
import { getUserProfile, updateUserProfileApi } from '../../services/authApi';
import useUserStore from '../../store/useUserStore';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { useEffect, useState } from 'react';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Name is Required'),
  lastName: yup.string().required('Last name is Required'),
  phone: yup.string().required('Phone is Required'),
  phoneCountry: yup.string().required('Required'),
});

const UserProfile = ({}: {}) => {
  const { updateUserProfile } = useUserStore();
  const queryClient = useQueryClient();
  const [timezoneOptions, setTimezoneOptions] = useState<TTimezone[]>([]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(),
  });

  const {
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    mutate,
  } = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: (result: TUserUpdate) => {
      const { firstName, lastName, language, country, phoneCountry, phone, timezone } = result;
      const profile: Partial<TUserProfile> = {
        firstName,
        lastName,
        language,
        country,
        timezone,
        phoneCountry,
        phone,
      };

      updateUserProfile(profile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      navigation.navigate('Home');
    },
  });

  useEffect(() => {}, []);

  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  return (
    <KeyboardAvoid>
      <ScrollView style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground]}>
        <View>
          <ErrorMessageUI display={isError} message={error?.message} />
          <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />
        </View>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            firstName: data?.firstName,
            lastName: data?.lastName,
            language: data?.language,
            country: data?.country,
            timezone: data?.timezone,
            phoneCountry: data?.phoneCountry,
            phone: data?.phone,
          }}
          onSubmit={(values) => {
            mutate({
              firstName: values.firstName,
              lastName: values.lastName,
              language: values.language,
              country: values.country,
              timezone: values.timezone,
              phoneCountry: values.phoneCountry,
              phone: values.phone,
              lifeCheck: {},
              fieldsToUpdate: [
                'firstName',
                'lastName',
                'language',
                'country',
                'timezone',
                'phoneCountry',
                'phone',
              ],
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
            useEffect(() => {
              const timezones = COUNTRY_TIMEZONES[values.country as string] || [];
              setTimezoneOptions(timezones);

              // only select if it is not onload
              if (timezoneOptions.length > 0) {
                setFieldValue('timezone', timezones[0]?.value || '');
              }
            }, [values.country]);

            return (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={styles.inputLabel}>Language</Text>

                <PickerUI
                  selectedValue={values.language}
                  onValueChange={handleChange('language')}
                  items={LANGUAGES}
                />
                <Text style={styles.inputLabel}>Country</Text>
                <PickerUI
                  selectedValue={values.country}
                  onValueChange={handleChange('country')}
                  items={COUNTRIES}
                />
                <Text style={styles.inputLabel}>Fuso horário</Text>
                <PickerUI
                  selectedValue={values.timezone}
                  onValueChange={handleChange('timezone')}
                  items={timezoneOptions || []}
                  style={{ width: 300 }}
                />
                <Input
                  label="First name"
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                  errorMessage={
                    errors.firstName && touched.firstName ? errors.firstName : undefined
                  }
                />
                <Input
                  label="Last name"
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  errorMessage={errors.lastName && touched.lastName ? errors.lastName : undefined}
                />
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 30, fontWeight: '800', alignSelf: 'center' }}>+</Text>
                  <Input
                    containerStyle={{ width: 90 }}
                    label="Country"
                    onChangeText={handleChange('phoneCountry')}
                    onBlur={handleBlur('phoneCountry')}
                    value={values.phoneCountry}
                    keyboardType="phone-pad"
                    errorMessage={
                      errors.phoneCountry && touched.phoneCountry ? errors.phoneCountry : undefined
                    }
                  />
                  <Input
                    label="Phone"
                    containerStyle={{ width: 200 }}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    keyboardType="phone-pad"
                    errorMessage={errors.phone && touched.phone ? errors.phone : undefined}
                  />
                </View>

                <IconButtonsSaveCancel
                  onPressSave={handleSubmit}
                  onPressCancel={() => {
                    navigation.goBack();
                  }}
                  loading={isPending}
                />
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoid>
  );
};

const styles = StyleSheet.create({
  terms: {
    textDecorationLine: 'underline',
    marginHorizontal: 3,
    fontSize: 16,
  },
  termsLink: {
    textDecorationLine: 'underline',
    marginHorizontal: 3,
    fontWeight: '800',
    fontSize: 16,
  },

  inputLabel: { marginRight: 10, fontSize: 16 },
});

export default UserProfile;
