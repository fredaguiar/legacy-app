import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Input, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type TTextSaveUI = {
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onPress: (e: GestureResponderEvent) => void;
  value: string | undefined;
  label?: string;
  errorMessage?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const TextSaveUI: React.FC<TTextSaveUI> = ({
  onChangeText,
  onBlur,
  onPress,
  value,
  label,
  errorMessage,
  style,
  containerStyle,
}) => {
  const [editTitle, setEditTitle] = useState(false);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Input
      label={label}
      style={style}
      containerStyle={containerStyle}
      onChangeText={onChangeText}
      disabled={!editTitle}
      onBlur={onBlur}
      selectTextOnFocus={true}
      value={value}
      errorMessage={errorMessage}
      rightIcon={
        editTitle ? (
          <TouchableOpacity
            onPress={(e) => {
              setEditTitle(false);
              onPress(e);
            }}>
            <MaterialCommunityIcons name={'checkbox-outline'} size={30} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setEditTitle(true);
            }}>
            <MaterialCommunityIcons name={'lead-pencil'} size={30} />
          </TouchableOpacity>
        )
      }
    />
  );
};

export default TextSaveUI;
