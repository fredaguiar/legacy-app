import { Switch, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type TSwitchProps = {
  on: boolean;
  onToggle: (val: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const SwitchUI = ({ on = false, onToggle, style, disabled = false }: TSwitchProps) => {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Switch
      style={style}
      trackColor={{ false: colors.input2, true: colors.input2 }}
      thumbColor={on ? colors.highlight : colors.disabled}
      value={on}
      onValueChange={onToggle}
      disabled={disabled}
    />
  );
};

export default SwitchUI;
