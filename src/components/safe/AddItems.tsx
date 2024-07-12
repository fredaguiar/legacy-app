import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import { capitalizeFirstLetter } from '../../utils/StringUtil';
import useUploadFiles from '../../hooks/useUploadFiles';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import PickerUI from '../ui/PickerUI';
import useUserStore from '../../store/useUserStore';
import useSafeStore from '../../store/useSafeStore';
import { useQueryClient } from '@tanstack/react-query';
import useCamera from '../../hooks/useCamera';
import { SafeUtil } from '../../utils/SafeUtil';

const TFileTypeMap: Record<TFileType, TFileTypeValues> = {
  photo: {
    label: 'photo',
    iconName: 'camera',
  },
  video: {
    label: 'video',
    iconName: 'video-box',
  },
  audio: {
    label: 'audio',
    iconName: 'microphone',
  },
  text: {
    label: 'text',
    iconName: 'text-box-outline',
  },
  file: {
    label: 'file',
    iconName: 'file-outline',
  },
  password: {
    label: 'password',
    iconName: 'key-outline',
  },
};

const AddItems = ({}: {}) => {
  const {
    params: { itemType },
  } = useRoute<RouteProp<MenuDrawerParams, 'AddItems'>>();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { user } = useUserStore();
  const { safeId, setSafeId } = useSafeStore();
  const [selectedSafeId, setSelectedSafeId] = useState<string>();
  const { uploadFiles, data, isPending, error } = useUploadFiles();
  const { launchCameraDevice, cameraData, isPendingCamera, errorCamera } = useCamera();
  const queryClient = useQueryClient();

  const {
    theme: { colors },
  } = useTheme();

  const { label, iconName } = TFileTypeMap[itemType];

  useEffect(() => {
    navigation.setOptions({
      title: capitalizeFirstLetter(label),
    });
    setSelectedSafeId(SafeUtil.getSafeId({ safeId, user }));
    queryClient.invalidateQueries({ queryKey: ['files'] });
    if (data || cameraData) {
      navigation.navigate('Home');
    }
  }, [data, cameraData]);

  if (isPending || isPendingCamera) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background2 }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <MaterialCommunityIcons
          name={iconName}
          size={50}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Add {label} </Text>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Text style={{ fontSize: 20 }}>Destination safe</Text>
          <PickerUI
            selectedValue={selectedSafeId}
            onValueChange={(val) => {
              setSelectedSafeId(val as string);
            }}
            items={user?.safes as any}
            style={{ width: 400 }}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <ErrorMessageUI display={error} message={error} />
          <ErrorMessageUI display={errorCamera} message={errorCamera} />
          <ButtonImport
            onPress={() => {
              setSafeId(selectedSafeId);
              uploadFiles();
            }}
            title="Import from phone"
          />
          {itemType === 'photo' && (
            <ButtonImport
              onPress={() => {
                setSafeId(selectedSafeId);
                launchCameraDevice('photo');
              }}
              title="Take picture"
            />
          )}
          {itemType === 'video' && (
            <ButtonImport
              onPress={() => {
                setSafeId(selectedSafeId);
                launchCameraDevice('video');
              }}
              title="Record new video"
            />
          )}
          {itemType === 'text' && (
            <ButtonImport
              onPress={() => {
                setSafeId(selectedSafeId);
                navigation.navigate('TextEditor', { fileId: undefined });
              }}
              title="Write new text"
            />
          )}
          {itemType === 'audio' && (
            <ButtonImport
              onPress={() => {
                setSafeId(selectedSafeId);
                navigation.navigate('AudioRecord', { fileName: undefined, mode: 'record' });
              }}
              title="Record new audio"
            />
          )}
        </View>

        <View style={{ alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="close-circle"
            size={50}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const ButtonImport = ({
  onPress,
  title,
  width,
}: {
  onPress: () => void;
  title: string;
  width?: number;
}) => {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Button
      onPress={onPress}
      title={title}
      color={colors.primary}
      containerStyle={{ margin: 5, width: width ? width : 200 }}
      radius="5"
      titleStyle={{
        color: 'black',
        fontWeight: 'normal',
      }}
    />
  );
};

export default AddItems;
