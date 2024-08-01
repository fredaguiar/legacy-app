import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { Divider, Input } from '@rneui/themed';
import * as yup from 'yup';
import { Formik } from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { useMutation } from '@tanstack/react-query';
import { createSafeApi } from '../../services/safeApi';
import useSafeStore from '../../store/useSafeStore';
import useUserStore from '../../store/useUserStore';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import SpinnerUI from '../ui/SpinnerUI';

const validationSchema = yup.object().shape({
  name: yup.string().required('Title is required'),
});

const CreateSafe = ({}: {}) => {
  const { addNewSafe } = useUserStore();
  const { setSafeId } = useSafeStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  useEffect(() => {}, []);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createSafeApi,
    onSuccess: (data: TSafe) => {
      addNewSafe(data);
      setSafeId(data._id);
      navigation.navigate('Home');
    },
  });

  if (isPending) {
    return <SpinnerUI />;
  }

  const initialValues = {
    name: '',
  };

  return (
    <View style={{ flex: 1 }}>
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
                  onPressSave={handleSubmit}
                  onPressCancel={() => {
                    navigation.goBack();
                  }}
                  containerStyle={{}}
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

export default CreateSafe;
