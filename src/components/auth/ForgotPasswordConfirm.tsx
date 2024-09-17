import { Button, Input, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import GlobalStyles from '../../styles/GlobalStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { forgotPasswordConfirmApi } from '../../services/authApi';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const ForgotPasswordConfirm = ({}: {}) => {
  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: forgotPasswordConfirmApi,
    onSuccess: (_data: boolean) => {
      navigation.navigate('Login');
    },
  });
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
            password: '',
            confirmPassword: '',
          }}
          onSubmit={(values) => {
            mutate({ password: values.password });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
            return (
              <View style={{ display: 'flex', alignItems: 'center' }}>
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

                <Button
                  onPress={handleSubmit as any}
                  title="Confirm"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
                <Button
                  onPress={() => navigation.navigate('Login')}
                  title="Cancel"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoid>
  );
};

export default ForgotPasswordConfirm;
