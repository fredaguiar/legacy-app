import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, Input } from '@rneui/themed';
import * as yup from 'yup';
import { Formik } from 'formik';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { useMutation } from '@tanstack/react-query';
import { createSafeApi } from '../../services/safeApi';
import useSafeStore from '../../store/useSafeStore';
import useUserStore from '../../store/useUserStore';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is Required'),
});

const CreateSafe = ({}: {}) => {
  const addNewSafe = useUserStore((state) => state.addNewSafe);
  const setSafeId = useSafeStore((state) => state.setSafeId);
  const navigation = useNavigation();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createSafeApi,
    onSuccess: (data: TSafe) => {
      addNewSafe(data);
      setSafeId(data._id);
      navigation.goBack();
    },
  });

  const initialValues = { name: '' };

  return (
    <View style={styles.container}>
      <Divider style={{ borderWidth: 1, borderColor: 'gray' }} />
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
        }}>
        <MaterialCommunityIcons name="treasure-chest" size={50} style={{}} />
        <Text style={{ fontSize: 20 }}>Create new safe</Text>
        <View style={{ marginTop: 20 }}>
          <Formik
            enableReinitialize={true}
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values) => {
              mutate(values.name);
            }}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  label="Safe name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  containerStyle={{ width: 350 }}
                  value={values.name}
                  errorMessage={errors.name && touched.name ? errors.name : undefined}
                />
                <ErrorMessageUI display={isError} message={error?.message} />
                <IconButtonsSaveCancel
                  onPressSave={handleSubmit as any}
                  onPressCancel={() => {
                    navigation.goBack();
                  }}
                  loading={isPending}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    height: 'auto',
  },
  containerScrollView: {
    flex: 1,
  },
});

export default CreateSafe;
