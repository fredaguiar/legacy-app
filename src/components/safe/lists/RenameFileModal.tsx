import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Input } from '@rneui/themed';
import Modal from 'react-native-modal';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as yup from 'yup';
import { IconButtonsSaveCancel } from '../../ui/IconButtons';
import ErrorMessageUI from '../../ui/ErrorMessageUI';
import { renameFileApi } from '../../../services/filesApi';

const validationSchema = yup.object().shape({
  fileName: yup.string().required('File name is required'),
});

const RenameFileModal = ({
  isVisible,
  onClose,
  onRenameFileSuccess,
  safeId,
  file,
}: {
  isVisible: boolean;
  onClose: () => void;
  onRenameFileSuccess?: (result: boolean) => void;
  safeId: string;
  file?: TFileInfo | undefined;
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setError('');
    }
  }, [isVisible]);

  const { mutate, isPending } = useMutation({
    mutationFn: renameFileApi,
    onSuccess: onRenameFileSuccess,
    onError: (err) => {
      setError(err.message);
    },
  });

  const initialValues = { fileName: '' };
  if (file) {
    initialValues.fileName = file.fileName || '';
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View
        style={{
          width: '100%',
          height: 300,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ErrorMessageUI display={error} message={error} />
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            mutate({ safeId, fileId: file?._id || '', fileName: values.fileName });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ width: '100%' }}>
              <Input
                label="File name"
                onChangeText={handleChange('fileName')}
                onBlur={handleBlur('name')}
                value={values.fileName}
                errorMessage={errors.fileName && touched.fileName ? errors.fileName : undefined}
              />
              <IconButtonsSaveCancel
                typeSave="save"
                typeCancel="cancel"
                onPressSave={handleSubmit}
                onPressCancel={onClose}
                loading={isPending}
              />
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

export default RenameFileModal;
