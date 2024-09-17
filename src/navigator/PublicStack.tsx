import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ForgotPassword from '../components/auth/ForgotPassword';
import ForgotPasswordResetCode from '../components/auth/ForgotPasswordResetCode';
import ForgotPasswordConfirm from '../components/auth/ForgotPasswordConfirm';

export type PublicRootStackParams = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ForgotPasswordResetCode: {
    email: string;
    phone: string;
    phoneCountry: string;
    method: 'email' | 'sms';
  };
  ForgotPasswordConfirm: undefined;
};

const PublicNativeStackNav = createNativeStackNavigator<PublicRootStackParams>();

const PublicStack = () => (
  <PublicNativeStackNav.Navigator>
    <PublicNativeStackNav.Screen
      name="Login"
      component={Login}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Login',
        headerTitleAlign: 'center',
      }}
    />
    <PublicNativeStackNav.Screen
      name="Signup"
      component={Signup}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Create new profile',
        headerTitleAlign: 'center',
      }}
    />
    <PublicNativeStackNav.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Forgot password',
        headerTitleAlign: 'center',
      }}
    />
    <PublicNativeStackNav.Screen
      name="ForgotPasswordResetCode"
      component={ForgotPasswordResetCode}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Enter recovery code',
        headerTitleAlign: 'center',
      }}
    />
    <PublicNativeStackNav.Screen
      name="ForgotPasswordConfirm"
      component={ForgotPasswordConfirm}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Enter new password',
        headerTitleAlign: 'center',
      }}
    />
  </PublicNativeStackNav.Navigator>
);

export default PublicStack;
