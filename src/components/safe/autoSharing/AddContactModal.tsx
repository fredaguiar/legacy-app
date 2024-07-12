import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Input } from '@rneui/themed';
import Modal from 'react-native-modal';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as yup from 'yup';
import { IconButtonsSaveCancel } from '../../ui/IconButtons';
import { updateContactsApi } from '../../../services/safeApi';
import ErrorMessageUI from '../../ui/ErrorMessageUI';

const emailSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
});

const phoneSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
});

const AddContactModal = ({
  isVisible,
  onClose,
  onAddContactSuccess,
  safeId,
  contact,
  type,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAddContactSuccess?: (result: boolean) => void;
  safeId: string;
  contact?: TContactInfo | undefined;
  type: TContactInfoType;
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setError('');
    }
  }, [isVisible]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateContactsApi,
    onSuccess: onAddContactSuccess,
    onError: (err) => {
      setError(err.message);
    },
  });

  const initialValues = { name: '', email: '', phone: '' };
  if (contact) {
    initialValues.name = contact.name || '';
    if (type === 'email') initialValues.email = contact.contact || '';
    else if (type === 'phone') initialValues.phone = contact.contact || '';
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
          validationSchema={type === 'email' ? emailSchema : phoneSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log('updateContacts1111', [
              { ...contact, ...{ name: values.name, contact: values.phone } },
            ]);
            if (type === 'email') {
              mutate({
                safeId,
                contactType: 'emails',
                contactList: [{ ...contact, ...{ name: values.name, contact: values.email } }],
                deleteContactList: [],
              });
            } else if (type === 'phone') {
              mutate({
                safeId,
                contactType: 'phones',
                contactList: [{ ...contact, ...{ name: values.name, contact: values.phone } }],
                deleteContactList: [],
              });
            }
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ width: '100%' }}>
              <Input
                label="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                errorMessage={errors.name && touched.name ? errors.name : undefined}
              />
              {type === 'email' && (
                <Input
                  label="Email"
                  placeholder="username@email.com"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  errorMessage={errors.email && touched.email ? errors.email : undefined}
                />
              )}
              {type === 'phone' && (
                <Input
                  label="Phone"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  keyboardType="phone-pad"
                  errorMessage={errors.phone && touched.phone ? errors.phone : undefined}
                />
              )}
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

export default AddContactModal;
