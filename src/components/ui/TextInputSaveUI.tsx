import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SmallButtonSaveCancel } from './IconButtons';
import ErrorMessageUI from './ErrorMessageUI';

type TTextInputSaveUI = {
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onPressSave?: () => void;
  onPressCancel?: () => void;
  value: string | undefined;
  numberOfLines?: number;
  errorMessage?: string;
  style?: StyleProp<TextStyle>;
};

const TextInputSaveUI: React.FC<TTextInputSaveUI> = ({
  onChangeText,
  onBlur,
  onPressSave,
  onPressCancel,
  value,
  numberOfLines = 4,
  errorMessage,
  style,
}) => {
  const [edit, setEdit] = useState(false);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={{}}>
      <ErrorMessageUI display={errorMessage} message={errorMessage} />
      <TextInput
        value={value}
        multiline
        editable={edit}
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={[
          {
            height: 100,
            width: 350,
            textAlignVertical: 'top',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: 'white',
            marginBottom: 5,
            fontSize: 22,
          },
          style,
        ]}
      />
      {edit ? (
        <SmallButtonSaveCancel
          style={{ fontSize: 22 }}
          containerStyle={{ marginBottom: 8 }}
          onPressSave={onPressSave}
          onPressCancel={() => {
            setEdit(false);
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setEdit(true);
          }}>
          <MaterialCommunityIcons name={'lead-pencil'} size={30} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputSaveUI;
