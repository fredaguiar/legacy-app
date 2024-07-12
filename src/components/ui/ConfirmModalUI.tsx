import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { IconButtonsSaveCancel } from './IconButtons';

const ConfirmModalUI = ({
  isVisible,
  onCancel,
  onConfirm,
}: {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View
        style={{
          width: 300,
          height: 200,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text style={{ fontSize: 24, marginBottom: 30 }}>Confirm delete?</Text>
        <IconButtonsSaveCancel
          typeSave="yes"
          typeCancel="no"
          onPressSave={onConfirm}
          onPressCancel={onCancel}
        />
      </View>
    </Modal>
  );
};

export default ConfirmModalUI;
