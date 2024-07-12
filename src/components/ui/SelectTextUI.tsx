import { Text } from '@rneui/themed';
import { StyleProp, TextStyle } from 'react-native';

const HighlightedTextUI = ({
  text,
  highlightedText,
  style,
  highlightedTextStyle,
  maxLength,
}: {
  text: string;
  highlightedText: string;
  style?: StyleProp<TextStyle>;
  highlightedTextStyle?: StyleProp<TextStyle>;
  maxLength?: number;
}) => {
  const ini = text?.indexOf(highlightedText as string) || 0;
  const end = ini + (highlightedText?.length || 0) - 1;
  const s1 = text?.slice(0, ini);
  const s2 = text?.slice(ini, end + 1) || '';
  const s3 = text?.slice(end + 1);
  console.log('text, highlightedText', text, highlightedText);
  return (
    <Text style={[{}, style]} numberOfLines={1}>
      {s1}
      <Text
        style={[{ fontStyle: 'italic', fontWeight: 'bold', color: 'red' }, highlightedTextStyle]}>
        {s2}
      </Text>
      {s3}
    </Text>
  );
};

export default HighlightedTextUI;
