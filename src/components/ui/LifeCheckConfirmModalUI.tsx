import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import Modal from 'react-native-modal';
import { IconButton } from './IconButtons';
import useNotification from '../../hooks/useNotification';
import { confirmLifeCheckApi } from '../../services/userApi';
import ErrorMessageUI from './ErrorMessageUI';

const LifeCheckConfirmModalUI = ({}: {}) => {
  const { notification, setNotification } = useNotification();
  const [visible, setVisible] = useState(false);

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: confirmLifeCheckApi,
    onSuccess: (_result: boolean) => {
      setNotification(undefined);
    },
  });

  useEffect(() => {
    setVisible(notification ? true : false);
  }, [notification]);

  const onConfirm = async () => {
    mutate();
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onConfirm}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text style={{ fontSize: 24, marginBottom: 30 }}>{notification?.request.content.body}</Text>
        <IconButton type="lifeCheck" onPress={onConfirm} loading={isPending} disabled={false} />
        <ErrorMessageUI display={isError} message={error?.message} />
      </View>
    </Modal>
  );
};

export default LifeCheckConfirmModalUI;
