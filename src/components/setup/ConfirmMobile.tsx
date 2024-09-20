import { Button, Input, Text, makeStyles } from '@rneui/themed';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import GlobalStyles from '../../styles/GlobalStyles';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '../../store/useUserStore';
import { confirmMobileApi } from '../../services/userApi';

const validationSchema = yup.object().shape({
  code: yup.string().required('Code is Required'),
});

const ConfirmMobile = ({}: {}) => {
  const { setUser } = useUserStore();
  const styles = useStyles();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: confirmMobileApi,
    onSuccess: (data: TUser) => {
      setUser(data);
    },
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View
      style={[
        GlobalStyles.AndroidSafeArea,
        GlobalStyles.SkyBackground,
        GlobalStyles.Container,
        { marginTop: 60 },
      ]}>
      <Text>
        A number code was sent to your registered PHONE NUMBER via SMS. Please fill the space below
        with that code. The code will be expired in 10 minutes.
      </Text>
      <Formik
        initialValues={{ code: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          mutate({ code: parseInt(values.code) });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <View style={styles.inputTextView}>
              <Input
                label="Code"
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
