import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ConfirmMobile from '../components/setup/ConfirmMobile';
import ConfirmEmail from '../components/setup/ConfirmEmail';

export type SetupRootStackParams = {
  ConfirmMobile: undefined;
  ConfirmEmail: undefined;
};

const SetupNativeStackNav = createNativeStackNavigator<SetupRootStackParams>();

const SetupStack = ({ initialRouteName }: { initialRouteName?: keyof SetupRootStackParams }) => (
  <SetupNativeStackNav.Navigator initialRouteName={initialRouteName || 'ConfirmMobile'}>
    <SetupNativeStackNav.Screen
      name="ConfirmMobile"
      component={ConfirmMobile}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Confirm mobile phone #',
        headerTitleAlign: 'center',
      }}
    />
    <SetupNativeStackNav.Screen
      name="ConfirmEmail"
      component={ConfirmEmail}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Confirm email',
        headerTitleAlign: 'center',
      }}
    />
  </SetupNativeStackNav.Navigator>
);

export default SetupStack;
