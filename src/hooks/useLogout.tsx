import * as SecureStore from 'expo-secure-store';
import useUserStore from '../store/useUserStore';
import useSafeStore from '../store/useSafeStore';
import { JWT_TOKEN } from '../Const';

const useLogout = () => {
  const { setUser } = useUserStore();
  const { setSafeId } = useSafeStore();

  const logout = () => {
    setUser(undefined);
    setSafeId(undefined);
    SecureStore.setItemAsync(JWT_TOKEN, '');
  };

  return { logout };
};

export default useLogout;
