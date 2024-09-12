import { useTheme } from '@rneui/themed';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import React from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, View } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSafeStore from '../../store/useSafeStore';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { saveTextTitleApi } from '../../services/safeApi';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { getItemApi, saveItemApi } from '../../services/safeApi';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import TextSaveUI from '../ui/TextSaveUI';
import SpinnerUI from '../ui/SpinnerUI';

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z0-9 ._-]+$/,
      'Invalid title. Use only letters, numbers, periods(.), underscores(_), and hyphens(-)',
    )
    .required('Title is Required'),
});

const TextEditor = () => {
  const richText = React.useRef<RichEditor>(null);
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { safeId } = useSafeStore();
  const queryClient = useQueryClient();
  const {
    theme: { colors },
  } = useTheme();
  const {
    params: { fileId },
  } = useRoute<RouteProp<MenuDrawerParams, 'TextEditor'>>();

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['textEditor', fileId],
    queryFn: () => getItemApi({ safeId: safeId as string, fileId: fileId as string }),
    enabled: !!fileId,
  });

  const {
    mutate,
    isPending: isPendingSave,
    isError: isErrorSave,
    error: errorSave,
  } = useMutation({
    mutationFn: saveItemApi,
    onSuccess: (_result: boolean) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['textEditor', fileId] });
      navigation.navigate('Home');
    },
  });

  const {
    mutate: mutateTitle,
    isPending: isPendingTitle,
    isError: isErrorTitle,
    error: errorTitle,
  } = useMutation({
    mutationFn: saveTextTitleApi,
    onSuccess: (result: boolean) => {
      queryClient.invalidateQueries({ queryKey: ['textEditor', fileId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  if (isFetching || isPendingTitle || isPendingSave) {
    return <SpinnerUI />;
  }

  const initialValues = { fileName: '', notes: '' };
  if (fileId && data) {
    initialValues.fileName = data.fileName;
    initialValues.notes = data.notes as string;
  }

  let currentTitle = `doc - ${moment().format('MMMM DD YYYY h-mma')}`;
  if (fileId && data) {
    currentTitle = data.fileName;
  }
  let saveTitleOnly = false;

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize={true}
            initialValues={{ title: currentTitle, text: data?.notes }}
            onSubmit={(values) => {
              console.log('saveTitleOnly', {
                title: values.title,
                safeId: safeId as string,
                fileId,
              });
              if (saveTitleOnly && fileId) {
                mutateTitle({ title: values.title, safeId: safeId as string, fileId });
              } else if (!saveTitleOnly) {
                // uploadTextEditorFiles({ title: values.title, text: values.text, fileId });
                mutate({
                  fileName: values.title as string,
                  mimetype: 'text/editor',
                  safeId: safeId as string,
                  notes: values.text,
                  fileId,
                });
              }
            }}>
            {({ handleChange, handleBlur, values, errors, touched, submitForm }) => (
              <View>
                <View style={{ paddingVertical: 20, backgroundColor: colors.background2 }}>
                  <IconButtonsSaveCancel
                    onPressSave={() => {
                      saveTitleOnly = false;
                      submitForm();
                    }}
                    onPressCancel={() => {
                      navigation.goBack();
                    }}
                    containerStyle={{ backgroundColor: colors.background2 }}
                    loading={isFetching || isPendingTitle}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    marginVertical: 20,
                  }}>
                  <ErrorMessageUI display={isErrorTitle} message={errorTitle?.message} />
                  <ErrorMessageUI display={isError} message={error?.message} />
                  <ErrorMessageUI display={isErrorSave} message={errorSave?.message} />
                  <TextSaveUI
                    label="Title"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    value={values.title}
                    errorMessage={errors.title && touched.title ? errors.title : undefined}
                    onPress={() => {
                      saveTitleOnly = true;
                      submitForm();
                    }}
                  />
                </View>
                <View style={{ marginBottom: 40 }}>
                  <RichToolbar
                    editor={richText}
                    onPressAddImage={() => {}}
                    actions={[
                      actions.setBold,
                      actions.setItalic,
                      actions.setUnderline,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      // actions.insertImage,
                      actions.checkboxList,
                      actions.undo,
                      actions.redo,
                      // actions.insertLink,
                    ]}
                  />
                </View>
                <View style={{ height: 300 }}>
                  <RichEditor
                    ref={richText}
                    initialHeight={300}
                    containerStyle={{
                      backgroundColor: 'black',
                      borderColor: 'black',
                      borderWidth: 1,
                      marginHorizontal: 10,
                    }}
                    style={{ flex: 1 }}
                    onChange={handleChange('text')}
                    // onLoadEnd={async () => {
                    //   richText.current?.setContentHTML(values.text || 'PUTZ');
                    // }}
                    initialContentHTML={values.text}
                  />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextEditor;
