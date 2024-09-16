import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Text } from '@rneui/themed';
import * as yup from 'yup';
import { NavigationProp, StackActions, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import GlobalStyles from '../../styles/GlobalStyles';
import useNotification from '../../hooks/useNotification';
import useUserStore from '../../store/useUserStore';
import { resendConfirmEmailApi } from '../../services/userApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';

const validationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
});

const ConfirmEmail = ({}: {}) => {
  const { notification, setNotification } = useNotification();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const [notified, setNotified] = useState(false);
  const [resend, setResend] = useState(false);
  const { user, setSkipEmailConfirm } = useUserStore();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: resendConfirmEmailApi,
    onSuccess: (_data: boolean) => {
      setResend(true);
    },
  });

  useEffect(() => {
    // alert('notification: ' + notification + '     Email:' + user?.email);
    setNotified(notification ? true : false);
  }, [notification]);

  if (isPending) return <SpinnerUI />;

  return (
    <View
      style={[
        GlobalStyles.AndroidSafeArea,
        GlobalStyles.SkyBackground,
        GlobalStyles.Container,
        { marginTop: 60 },
      ]}>
      <View>
        <Text>Please check your inbox to verify your email address.</Text>

        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: user?.email }}
          onSubmit={(values) => {
            mutate({ email: values.email || '' });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ marginTop: 40 }}>
              <Input
                label="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                errorMessage={errors.email && touched.email ? errors.email : undefined}
              />
              <ErrorMessageUI display={isError} message={error?.message} />
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onPress={handleSubmit as any}
                  title="Resend email"
                  containerStyle={{ width: 200 }}
                />
                {resend && <Text>Email sent.</Text>}

                <TouchableOpacity
                  onPress={() => {
                    setSkipEmailConfirm(true);
                  }}
                  style={{ marginTop: 80 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
                    Skip email confirmation &gt;&gt;
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ConfirmEmail;
