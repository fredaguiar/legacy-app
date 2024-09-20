import { Button, Input, Text, makeStyles } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from '@tanstack/react-query';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import GlobalStyles from '../../styles/GlobalStyles';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import { forgotPasswordResetCodeApi } from '../../services/authApi';
import { JWT_TOKEN } from '../../Const';

const validationSchema = yup.object().shape({
  code: yup.string().required('Code is Required'),
});

const ForgotPasswordResetCode = ({}: {}) => {
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();
  const route = useRoute<RouteProp<PublicRootStackParams, 'ForgotPasswordResetCode'>>();

  const { email, phone, phoneCountry, method } = route.params;

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: forgotPasswordResetCodeApi,
    onSuccess: (data: TForgotPasswordToken) => {
      console.log('🚀 ~ ForgotPasswordResetCode ~ data:', data);
      SecureStore.setItemAsync(JWT_TOKEN, data.token);
      navigation.navigate('ForgotPasswordConfirm');
    },
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View
      style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
      <Text>
        A number code was sent to your registered PHONE NUMBER via SMS. Please fill the space below
        with that code. The code will be expired in 10 minutes.
      </Text>
      <Formik
        initialValues={{ code: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          mutate({ email, phone, phoneCountry, method, code: parseInt(values.code) });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={styles.inputTextView}>
              <Input
                label="Recovery code"
                onChangeText={handleChange('code')}
                onBlur={handleBlur('code')}
                value={values.code}
                keyboardType="number-pad"
                errorMessage={errors.code && touched.code ? errors.code : undefined}
              />
            </View>

            <ErrorMessageUI display={isError} message={error?.message} />
            <Button
              onPress={handleSubmit as any}
              title="Confirm"
              containerStyle={{ width: 300, marginBottom: 20 }}
            />
          </View>
        )}
      </Formik>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}
        style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
          Haven't received a code yet? Try again.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  inputText: {
    width: 70,
    textAlign: 'center',
  },
  inputTextView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
}));

export default ForgotPasswordResetCode;
