import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@rneui/themed';
import React, { ChangeEvent, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export type TPickerItem = {
  _id?: string;
  name?: string;
  label: string;
  value: string | number;
};

type TPickerUIProps = {
  selectedValue?: string;
  onValueChange: (e: string | ChangeEvent<any>) => void;
  items: Array<TPickerItem>;
  style?: StyleProp<TextStyle>;
};

const PickerUI: React.FC<TPickerUIProps> = ({ selectedValue, onValueChange, items, style }) => {
  // const [selected, setSelected] = useState(selectedValue);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Picker
      style={[
        {
          marginVertical: 10,
          backgroundColor: colors.input1,
          height: 60,
          width: 200,
        },
        style,
      ]}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      mode="dropdown">
      {items.map((item: TPickerItem) => (
        <Picker.Item
          key={item._id || item.value}
          label={item.name || item.label}
          value={item._id || item.value}
          style={{ fontSize: 22 }}
        />
      ))}
    </Picker>
  );
};

export default PickerUI;
