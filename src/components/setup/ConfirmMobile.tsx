import { Button, Input, Text, makeStyles } from '@rneui/themed';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import GlobalStyles from '../../styles/GlobalStyles';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { useMutation } from '@tanstack/react-query';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import useUserStore from '../../store/useUserStore';
import { confirmMobileApi } from '../../services/userApi';

const ConfirmMobile = ({}: {}) => {
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { updateUserProfile } = useUserStore();
  const styles = useStyles();

  const CODES = { code1: '', code2: '', code3: '', code4: '', code5: '' };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: confirmMobileApi,
    onSuccess: (_response: boolean) => {
      const profile: Partial<TUserProfile> = { mobileVerified: true };
      updateUserProfile(profile);
      navigation.navigate('Home');
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
          mutate({ code });
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

export default ConfirmMobile;
