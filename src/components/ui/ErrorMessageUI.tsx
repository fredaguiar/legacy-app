import { Text } from '@rneui/themed';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type TErrorMessageUI = { message?: string; display: any };

const ErrorMessageUI = ({ message, display }: TErrorMessageUI) => {
  if (display) {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
        }}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={30}
          color="red"
          style={{
            marginRight: 10,
          }}
        />
        <Text style={{ color: 'red' }}>{message}</Text>
      </View>
    );
  }
  return <></>;
};

export default ErrorMessageUI;
