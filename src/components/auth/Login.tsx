import { Button, Text, Input } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as yup from 'yup';
import GlobalStyles from '../../styles/GlobalStyles';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import { useEffect } from 'react';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { loginApi, testApi } from '../../services/authApi';
import { JWT_TOKEN } from '../../Const';
import useUserStore from '../../store/useUserStore';

const validationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const Login = ({}: {}) => {
  const setUser = useUserStore((state) => state.setUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: TUser) => {
      SecureStore.setItemAsync(JWT_TOKEN, data.token);
      setUser(data);
    },
  });

  // const { mutate, isPending, isError, error } = useMutation({
  //   mutationFn: testApi,
  //   onSuccess: (data: any) => {},
  // });

  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();

  useEffect(() => {
    // logout();
  });

  if (isPending) return <SpinnerUI />;

  return (
    <KeyboardAvoid>
      <View
        style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
        <Formik
          validationSchema={validationSchema}
          initialValues={
            process.env.NODE_ENV === 'development'
              ? {
                  email: 'fred.aguiar.teixeira@hotmail.com',
                  password: '11111111',
                }
              : {
                  email: '',
                  password: '',
                }
          }
          onSubmit={(values) => {
            mutate({ email: values.email, password: values.password });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <Input
                label="Email"
                placeholder="username@email.com"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                errorMessage={errors.email && touched.email ? errors.email : undefined}
              />
              <Input
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={true}
                errorMessage={errors.password && touched.password ? errors.password : undefined}
              />
              <ErrorMessageUI display={isError} message={error?.message} />
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onPress={handleSubmit as any}
                  title="Login"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')}
                  style={{ marginBottom: 40 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
                    Not a member yet? Sign up.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={{ marginBottom: 40 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 14, marginTop: 20 }}>Version description:</Text>
                <Text style={{ fontSize: 14 }}>Jun 9 2025 - migrando pra linux</Text>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoid>
  );
};

export default Login;
