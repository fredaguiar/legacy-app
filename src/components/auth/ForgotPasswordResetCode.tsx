import { Button, Input, Text, makeStyles } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as SecureStore from 'expo-secure-store';
import GlobalStyles from '../../styles/GlobalStyles';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PublicRootStackParams } from '../../navigator/PublicStack';
import { forgotPasswordResetCodeApi } from '../../services/authApi';
import { JWT_TOKEN } from '../../Const';

const ForgotPasswordResetCode = ({}: {}) => {
  const { setUser } = useUserStore();
  const styles = useStyles();
  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();
  const route = useRoute<RouteProp<PublicRootStackParams, 'ForgotPasswordResetCode'>>();

  const { email, phone, phoneCountry, method } = route.params;
  const CODES = { code1: '', code2: '', code3: '', code4: '', code5: '' };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: forgotPasswordResetCodeApi,
    onSuccess: (data: TForgotPasswordToken) => {
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
        initialValues={{ code1: '', code2: '', code3: '', code4: '', code5: '' }}
        onSubmit={(values) => {
          const codeStr = Object.keys(CODES).map((code) => values[code as keyof typeof CODES]);
          const code = parseInt(codeStr.join(''));
          mutate({ email, phone, phoneCountry, method, code });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={styles.inputTextView}>
              {Object.keys(CODES).map((code) => (
                <Input
                  key={code}
                  containerStyle={styles.inputText}
                  onChangeText={handleChange(code)}
                  onBlur={handleBlur(code)}
                  value={values[code as keyof typeof CODES]}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
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
