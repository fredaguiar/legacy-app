import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, Text, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import SwitchUI from '../../ui/SwitchUI';
import { getSafeApi, updateSafeApi } from '../../../services/safeApi';
import SpinnerUI from '../../ui/SpinnerUI';
import ErrorMessageUI from '../../ui/ErrorMessageUI';
import ContactList from './ContactList';

const AutoSharing = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<MenuDrawerParams, 'SafeOption'>>();
  const [autoSharing, setAutoSharing] = useState<boolean>(false);
  // const { user, updateSafe } = useUserStore();
  // const safe = SafeUtil.getSafe(user, safeId);
  const queryClient = useQueryClient();
  const {
    theme: { colors },
  } = useTheme();

  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  const {
    mutate: mutate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateSafeApi,
    onSuccess: (result: TSafeUpdate) => {
      const json: TSafe = { _id: result._id };
      if (result.fieldToUpdate === 'autoSharing') json.autoSharing = result.autoSharing;
      // updateSafe(json);
      queryClient.invalidateQueries({ queryKey: ['contactList', safeId] });
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['contactList', safeId],
    queryFn: () => getSafeApi({ safeId }),
  });

  useEffect(() => {
    if (data) {
      setAutoSharing(data.autoSharing || false);
    }
  }, [data]);

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />
        <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />

        <Text
          style={{
            fontSize: 16,
            marginRight: 10,
            marginBottom: 10,
          }}>
          You must add at least 1 email or mobile phone number in order to be able to turn ON this
          function
        </Text>
        <View style={[{ display: 'flex', flexDirection: 'row', marginBottom: 20 }]}>
          <Text
            style={{
              fontWeight: '800',
              fontSize: 20,
              marginRight: 10,
            }}>
            Auto-sharing:
          </Text>
          <SwitchUI
            on={autoSharing}
            onToggle={(on: boolean) => {
              mutate({
                _id: safeId,
                autoSharing: on,
                fieldToUpdate: 'autoSharing',
              });
            }}
          />
          <Text
            style={{
              fontWeight: '800',
              fontSize: 20,
            }}>
            {autoSharing ? 'On' : 'Off'}
          </Text>
        </View>
        <ButtonEditContact
          title="Edit email list"
          iconName="email-outline"
          onPress={() => {
            navigation.navigate('ContactListUpdate', {
              safeId,
              type: 'email',
            });
          }}
        />
        <View style={[{ marginBottom: 25, height: 250, width: '98%' }]}>
          <ContactList edit={false} type="email" contactList={data?.emails || []} />
        </View>
        <ButtonEditContact
          title="Edit phone list"
          iconName="phone-outline"
          onPress={() => {
            navigation.navigate('ContactListUpdate', {
              safeId,
              type: 'phone',
            });
          }}
        />
        <View style={[{ marginBottom: 25, height: 250, width: '98%' }]}>
          <ContactList edit={false} type="phone" contactList={data?.phones || []} />
        </View>
      </View>
    </View>
  );
};

const ButtonEditContact = ({
  onPress,
  title,
  iconName,
  style,
  containerStyle,
}: {
  onPress: () => void;
  title: string;
  iconName: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}) => (
  <Button
    onPress={onPress}
    title={title}
    color="primary"
    style={style}
    containerStyle={[{ margin: 5, width: 'auto' }, containerStyle]}
    radius="5"
    icon={<MaterialCommunityIcons name={iconName} size={30} style={{ marginRight: 5 }} />}
    iconPosition="left"
    titleStyle={{
      color: 'black',
      fontWeight: 'normal',
    }}
  />
);

export default AutoSharing;
