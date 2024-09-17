import { Button, Text, Input, ButtonGroup } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import GlobalStyles from '../../styles/GlobalStyles';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import { useEffect, useState } from 'react';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { forgotPasswordApi } from '../../services/authApi';

const emailValidationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email is Required'),
});

const smsValidationSchema = yup.object().shape({
  phone: yup.string().required('Phone is Required'),
  phoneCountry: yup.string().required('Required'),
});

const ForgotPassword = ({}: {}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (_data: boolean, variables) => {
      navigation.navigate('ForgotPasswordResetCode', {
        email: variables.email || '',
        phone: variables.phone || '',
        phoneCountry: variables.phoneCountry || '',
        method: variables.method || 'email',
      });
    },
  });

  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();

  useEffect(() => {});

  if (isPending) return <SpinnerUI />;

  return (
    <KeyboardAvoid>
      <View
        style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
        <ButtonGroup
          buttons={['Email', 'SMS']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
          containerStyle={{ marginBottom: 20 }}
        />

        <Formik
          validationSchema={selectedIndex === 0 ? emailValidationSchema : smsValidationSchema}
          initialValues={{
            email: '',
            phone: '',
            phoneCountry: '',
          }}
          onSubmit={(values) => {
            mutate({
              email: values.email,
              phone: values.phone,
              phoneCountry: values.phoneCountry,
              method: selectedIndex === 0 ? 'email' : 'sms',
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {selectedIndex === 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    label="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    errorMessage={errors.email && touched.email ? errors.email : undefined}
                  />
                </View>
              )}
              {selectedIndex === 1 && (
                <View
                  style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
              )}
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <ErrorMessageUI display={isError} message={error?.message} />
                <Button
                  onPress={handleSubmit as any}
                  title="Send recovery code"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoid>
  );
};

export default ForgotPassword;
