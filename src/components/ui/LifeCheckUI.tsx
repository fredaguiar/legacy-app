import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import SwitchUI from './SwitchUI';
import useUserStore from '../../store/useUserStore';
import { updateLifeCheckApi } from '../../services/userApi';
import ErrorMessageUI from './ErrorMessageUI';
import SpinnerUI from './SpinnerUI';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';

type Props = { currentScreen: 'home' | 'setup'; style?: StyleProp<ViewStyle> };
const LifeCheckUI = ({ currentScreen, style }: Props) => {
  const { user } = useUserStore();
  const { updateUserLifeCheck } = useUserStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateLifeCheckApi,
    onSuccess: (result: TUserLifeCheckUpdate) => {
      updateUserLifeCheck({ lifeCheck: result.lifeCheck });
      // redirect to Life Check Setup screen if the user it is "on" but schedule has not been configured yet
      if (result?.lifeCheck.active && user?.lifeCheck.shareTime === undefined) {
        navigation.navigate('LifeCheckSetup');
      }
    },
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View style={style}>
      <ErrorMessageUI display={isError} message={error?.message} />
      <Text
        style={{
          fontWeight: '800',
          fontSize: 20,
          marginBottom: 0,
        }}>
        Life check
      </Text>
      <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
        <SwitchUI
          on={user?.lifeCheck.active || false}
          onToggle={(on: boolean) => {
            mutate({ lifeCheck: { active: on } });
          }}
          disabled={isPending}
        />
        <Text
          style={{
            fontWeight: '800',
            fontSize: 20,
          }}>
          {user?.lifeCheck ? 'On' : 'Off'}
        </Text>
      </View>
    </View>
  );
};

export default LifeCheckUI;
