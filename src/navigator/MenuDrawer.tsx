import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Divider, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useUserStore from '../store/useUserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { JWT_TOKEN } from '../Const';
import useSafeStore from '../store/useSafeStore';
import Header from '../components/top/Header';
import Home from '../components/home/Home';
import LifeCheckSetup from '../components/user/LifeCheckSetup';
import UserProfile from '../components/user/UserProfile';
import AutoSharing from '../components/safe/autoSharing/AutoSharing';
import ContactListUpdate from '../components/safe/autoSharing/ContactListUpdate';
import LifeCheckHelp from '../components/user/LifeCheckHelp';
import SafeOption from '../components/safe/SafeOption';
import AudioRecord from '../components/safe/AudioRecord';
import SavePassword from '../components/safe/SavePassword';
import TextEditor from '../components/safe/TextEditor';
import AddItems from '../components/safe/AddItems';
import CreateSafe from '../components/safe/CreateSafe';
import LifeCheckFrequency from '../components/user/LifeCheckFrequency';
import ConfirmEmail from '../components/setup/ConfirmEmail';
import ConfirmMobile from '../components/setup/ConfirmMobile';
import Introduction from '../components/setup/Introduction';

const Drawer = createDrawerNavigator();

type MenuDrawerItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
};

const MenuDrawerItem = (props: MenuDrawerItemProps) => {
  return (
    <DrawerItem
      {...props}
      style={{ padding: 5 }}
      labelStyle={{ fontSize: 20 }}
      icon={() => <MaterialCommunityIcons name={props.icon} size={40} />}
    />
  );
};

export type MenuDrawerParams = {
  Home: undefined;
  CreateSafe: undefined;
  SafeOption: { safeId: string; pageLoad: TPageLoadType };
  LifeCheckSetup: undefined;
  LifeCheckHelp: undefined;
  LifeCheckFrequency: undefined;
  UserProfile: undefined;
  AutoSharing: { safeId: string };
  ContactListUpdate: { safeId: string; type: TContactInfoType };
  AddItems: { itemType: TFileType };
  TextEditor: { fileId?: string };
  SavePassword: { safeId?: string; fileId?: string };
  AudioRecord: {
    fileName?: string;
    localFilePath?: string;
    title?: string;
    mode: 'audio' | 'record';
  };
  Tab: undefined;
};

const MenuDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { user, setUser } = useUserStore();
  const { setSafeId } = useSafeStore();
  const {
    theme: { colors },
  } = useTheme();
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.row1 }}
      contentContainerStyle={{ width: 300 }}>
      <View style={{ backgroundColor: colors.background3, padding: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text>{user?.email} </Text>
      </View>
      <MenuDrawerItem
        label="Home"
        icon="home"
        onPress={() => {
          setSafeId(undefined);
          navigation.navigate('Home');
        }}
      />
      <MenuDrawerItem
        label="User profile"
        icon="account-edit"
        onPress={() => navigation.navigate('UserProfile')}
      />
      <MenuDrawerItem
        label="Life check setup"
        icon="bell-ring"
        onPress={() => navigation.navigate('LifeCheckSetup')}
      />
      <Divider style={{ borderWidth: 1, borderColor: colors.divider }} />
      <MenuDrawerItem
        label="Logout"
        icon="logout"
        onPress={() => {
          setUser(undefined);
          setSafeId(undefined);
          SecureStore.setItemAsync(JWT_TOKEN, '');
        }}
      />
      <Divider style={{ borderWidth: 1, borderColor: colors.divider }} />
    </DrawerContentScrollView>
  );
};

const MenuDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={MenuDrawerContent}
      screenOptions={{
        drawerHideStatusBarOnOpen: true,
        header: () => (
          <SafeAreaView>
            <Header />
          </SafeAreaView>
        ),
      }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="LifeCheckSetup" component={LifeCheckSetup} />
      <Drawer.Screen name="LifeCheckHelp" component={LifeCheckHelp} />
      <Drawer.Screen name="LifeCheckFrequency" component={LifeCheckFrequency} />
      <Drawer.Screen name="SafeOption" component={SafeOption} />
      <Drawer.Screen name="AutoSharing" component={AutoSharing} />
      <Drawer.Screen name="ContactListUpdate" component={ContactListUpdate} />
      <Drawer.Screen name="CreateSafe" component={CreateSafe} />
      <Drawer.Screen name="AddItems" component={AddItems} />
      <Drawer.Screen name="TextEditor" component={TextEditor} />
      <Drawer.Screen name="SavePassword" component={SavePassword} />
      <Drawer.Screen name="AudioRecord" component={AudioRecord} />
      <Drawer.Screen name="UserProfile" component={UserProfile} />
      <Drawer.Screen name="ConfirmEmail" component={ConfirmEmail} />
      <Drawer.Screen name="ConfirmMobile" component={ConfirmMobile} />
      <Drawer.Screen name="Introduction" component={Introduction} />
    </Drawer.Navigator>
  );
};

export default MenuDrawer;
