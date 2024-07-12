import * as SecureStore from 'expo-secure-store';
import { JWT_TOKEN } from '../Const';

const getBearerToken = async () => {
  const token = await SecureStore.getItemAsync(JWT_TOKEN);
  if (token) {
    return `Bearer ${token}`;
  }
  return '';
};

const AuthUtil = {
  getBearerToken,
};

export default AuthUtil;
