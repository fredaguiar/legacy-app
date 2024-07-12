import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Field, Formik } from 'formik';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import useSafeStore from '../../store/useSafeStore';
import useUserStore from '../../store/useUserStore';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import PickerUI from '../ui/PickerUI';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import { getItemApi, saveItemApi } from '../../services/safeApi';
import { SafeUtil } from '../../utils/SafeUtil';
import SpinnerUI from '../ui/SpinnerUI';

const validationSchema = yup.object().shape({
  fileName: yup.string().required('Title is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const SavePassword = ({}: {}) => {
  const [selectedSafeId, setSelectedSafeId] = useState<string>();

  const { safeId } = useSafeStore();
  const { user } = useUserStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const queryClient = useQueryClient();
  const {
    params: { fileId },
  } = useRoute<RouteProp<MenuDrawerParams, 'SavePassword'>>();
  const {
    theme: { colors },
  } = useTheme();

  // for conditional useQuery, use isFetching
  const { data, isError, error, isFetching } = useQuery({
    queryKey: ['passwords', fileId],
    queryFn: () => getItemApi({ safeId: selectedSafeId as string, fileId: fileId as string }),
    enabled: !!fileId,
  });

  useEffect(() => {
    setSelectedSafeId(SafeUtil.getSafeId({ safeId, user }));
  }, []);

  console.log('SavePassword fileId', fileId);

  const {
    mutate,
    isPending: isPendingSave,
    isError: isErrorSave,
    error: errorSave,
  } = useMutation({
    mutationFn: saveItemApi,
    onSuccess: (_result: boolean) => {
      console.log('savePasswordApi', _result);
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['passwords', fileId] });
      navigation.navigate('Home');
    },
  });

  if (isFetching || isPendingSave) {
    return <SpinnerUI />;
  }

  const initialValues = {
    fileName: '',
    username: '',
    password: '',
    confirmPassword: '',
    notes: '',
  };
  if (fileId && data) {
    initialValues.fileName = data.fileName;
    initialValues.username = data.username as string;
    initialValues.password = data.password as string;
    initialValues.confirmPassword = data.password as string;
    initialValues.notes = data.notes as string;
  }

  return (
    <KeyboardAvoid>
      <ScrollView style={{ backgroundColor: colors.background1 }}>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <ErrorMessageUI display={isError} message={error?.message} />
          <ErrorMessageUI display={isErrorSave} message={errorSave?.message} />
          <MaterialCommunityIcons name="lock-outline" size={50} style={{}} />
        </View>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            mutate({
              fileName: values.fileName,
              mimetype: 'text/pass',
              safeId: selectedSafeId || '',
              username: values.username,
              password: values.password,
              notes: values.notes,
              fileId,
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>Destination safe</Text>
              <PickerUI
                selectedValue={selectedSafeId}
                onValueChange={(val) => {
                  setSelectedSafeId(val as string);
                }}
                items={user?.safes as any}
                style={{ width: 400 }}
              />
              <Input
                label="Tittle (Website, Bank Name, etc)"
                onChangeText={handleChange('fileName')}
                onBlur={handleBlur('fileName')}
                value={values.fileName}
                errorMessage={errors.fileName && touched.fileName ? errors.fileName : undefined}
              />
              <Input
                label="User Name (Email, number, etc)"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errorMessage={errors.username && touched.username ? errors.username : undefined}
              />
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
              <Text style={{ fontSize: 16 }}>Notes / Other useful info</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={handleChange('notes')}
                value={values.notes}
                style={{
                  height: 100,
                  width: 350,
                  textAlignVertical: 'top',
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: 'white',
                  marginBottom: 20,
                  fontSize: 22,
                }}
              />
              <IconButtonsSaveCancel
                onPressSave={handleSubmit}
                onPressCancel={() => {
                  navigation.goBack();
                }}
                containerStyle={{}}
                loading={!!fileId && (isFetching || isPendingSave)}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoid>
  );
};

export default SavePassword;
