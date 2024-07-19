import { Button, Input, Text, CheckBox } from '@rneui/themed';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from '@tanstack/react-query';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import GlobalStyles from '../../styles/GlobalStyles';
import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import { COUNTRIES, COUNTRY_TIMEZONES, JWT_TOKEN, LANGUAGES, TIMEZONE_BRAZIL } from '../../Const';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import PickerUI from '../ui/PickerUI';
import { signupApi } from '../../services/authApi';
import useUserStore from '../../store/useUserStore';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('Name is Required'),
  lastName: yup.string().required('Last name is Required'),
  phone: yup.string().required('Phone is Required'),
  phoneCountry: yup.string().required('Required'),
  email: yup.string().email('Please enter valid email').required('Email is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const Signup = ({}: {}) => {
  const setUser = useUserStore((state) => state.setUser);
  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: signupApi,
    onSuccess: (data: TUser) => {
      SecureStore.setItemAsync(JWT_TOKEN, data.token);
      setUser(data);
    },
  });
  const [terms, setTerms] = useState(false);
  const [timezoneOptions, setTimezoneOptions] = useState<TTimezone[]>();
  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();

  if (isPending) return <SpinnerUI />;

  return (
    <KeyboardAvoid>
      <ScrollView style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground]}>
        <View>
          <ErrorMessageUI display={isError} message={error?.message} />
        </View>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: '',
            lastName: '',
            language: 'br',
            country: 'pt',
            timezone: '',
            email: '',
            phoneCountry: '',
            phone: '',
            password: '',
            confirmPassword: '',
          }}
          // initialValues={{
          //   firstName: 'Lupita',
          //   lastName: 'Navalha',
          //   language: 'pt',
          //   country: 'br',
          //   timezone: '',
          //   email: 'a@gmail.com',
          //   phoneCountry: '1',
          //   phone: '7788720124',
          //   password: '11111111',
          //   confirmPassword: '11111111',
          // }}
          onSubmit={(values) => {
            // console.log(values);
            mutate({
              firstName: values.firstName,
              lastName: values.lastName,
              language: values.language,
              country: values.country,
              timezone: values.timezone,
              email: values.email,
              phoneCountry: values.phoneCountry,
              phone: values.phone,
              password: values.password,
              safes: [],
              lifeCheck: {},
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
            useEffect(() => {
              const timezones = COUNTRY_TIMEZONES[values.country] || [];
              setTimezoneOptions(timezones);
              setFieldValue('timezone', timezones[0]?.value || '');
            }, [values.country]);

            return (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={styles.inputLabel}>Language</Text>

                <PickerUI
                  selectedValue={values.language}
                  onValueChange={handleChange('language')}
                  items={LANGUAGES}
                  style={{ width: 300 }}
                />
                <Text style={styles.inputLabel}>Country</Text>
                <PickerUI
                  selectedValue={values.country}
                  onValueChange={handleChange('country')}
                  items={COUNTRIES}
                  style={{ width: 300 }}
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
                <Input
                  label="Email"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  errorMessage={errors.email && touched.email ? errors.email : undefined}
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
                <Input
                  label="Password"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={true}
                  errorMessage={errors.password && touched.password ? errors.password : undefined}
                />
                <Input
                  label="confirmPassword"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={true}
                  errorMessage={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                />

                <View>
                  <CheckBox
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0.0)' }}
                    title={
                      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.terms}>I agree with the</Text>
                        <Text onPress={() => alert('terms of use')} style={styles.termsLink}>
                          Terms of use
                        </Text>
                        <Text style={styles.terms}>and</Text>
                        <Text onPress={() => alert('privacy police')} style={styles.termsLink}>
                          privacy police
                        </Text>
                      </View>
                    }
                    checked={terms}
                    onPress={() => {
                      setTerms(!terms);
                    }}
                    size={25}
                  />
                </View>
                <Button
                  onPress={handleSubmit as any}
                  title="Save and Sign up"
                  disabled={!terms}
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
                <Button
                  onPress={() => navigation.navigate('Login')}
                  title="Cancel"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
                <TouchableOpacity onPress={() => {}} style={{ marginBottom: 40 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
                    First time? Click here for an introduction.
                  </Text>
                </TouchableOpacity>
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

export default Signup;
