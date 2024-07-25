import { StyleProp, TextStyle, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as yup from 'yup';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import PickerUI from '../ui/PickerUI';
import useUserStore from '../../store/useUserStore';
import SpinnerUI from '../ui/SpinnerUI';
import { getSafeApi, updateSafeApi } from '../../services/safeApi';
import TextSaveUI from '../ui/TextSaveUI';
import TextInputSaveUI from '../ui/TextInputSaveUI';
import SwitchUI from '../ui/SwitchUI';
import { deleteSafeListApi } from '../../services/safeApi';
import StorageUsage from '../ui/StorageUsage';
import ConfirmModalUI from '../ui/ConfirmModalUI';
import BackButton from '../ui/BackButton';

const validationName = yup.object().shape({
  name: yup.string().required('Name is required'),
});
const validationDescription = yup.object().shape({
  description: yup.string().max(100, 'Max 100 characters'),
});

const SafeOption = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<MenuDrawerParams, 'SafeOption'>>();
  const { user } = useUserStore();
  const { updateSafe, deleteSafes } = useUserStore();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const [safeName, setSafeName] = useState('');
  const [safeNameError, setSafeNameError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [selectedSafeId, setSelectedSafeId] = useState(safeId);
  const [autoSharing, setAutoSharing] = useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const {
    theme: { colors },
  } = useTheme();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['safeOptions', selectedSafeId],
    queryFn: () => getSafeApi({ safeId: selectedSafeId }),
  });

  const {
    mutate: mutateUpdate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateSafeApi,
    onSuccess: (result: TSafeUpdate) => {
      const json: TSafe = { _id: result._id };
      if (result.fieldToUpdate === 'name') json.name = result.name;
      if (result.fieldToUpdate === 'description') json.description = result.description;
      if (result.fieldToUpdate === 'autoSharing') json.autoSharing = result.autoSharing;
      updateSafe(json);
      queryClient.invalidateQueries({ queryKey: ['safeOptions', selectedSafeId] });
    },
  });

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteSafeListApi,
    onSuccess: ({ safeIdList }: TSafeIdList) => {
      deleteSafes({ safeIdList });
      setDeleteModalVisible(false);
      navigation.navigate('Home');
    },
  });

  useEffect(() => {
    if (data) {
      setSafeName(data.name || '');
      setDescription(data.description || '');
      setSelectedSafeId(data._id || '');
      setAutoSharing(data.autoSharing || false);
      console.log('data.autoSharing', data.autoSharing);
      setSafeNameError('');
      setDescriptionError('');
    }
    if (isErrorDelete) {
      setDeleteModalVisible(false);
    }
  }, [data, isErrorDelete]);

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const onConfirmDelete = () => {
    mutateDelete({ safeIdList: [safeId] });
  };

  if (isPending || isPendingUpdate || isPendingDelete) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />
        <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />
        <ErrorMessageUI display={isErrorDelete} message={errorDelete?.message} />

        <PickerUI
          selectedValue={selectedSafeId}
          onValueChange={(val) => {
            setSelectedSafeId(val as string);
          }}
          items={user?.safes as any}
          style={{ width: 300 }}
        />

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
              mutateUpdate({
                _id: selectedSafeId,
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
        <View
          style={{
            marginBottom: 30,
          }}>
          <ButtonSafe
            onPress={() => {
              navigation.navigate('AutoSharing', { safeId });
            }}
            title="Auto-sharing setup"
            iconName="share-variant-outline"
          />
        </View>

        <TextSaveUI
          label="Safe name"
          containerStyle={{ width: 350 }}
          onChangeText={setSafeName}
          value={safeName}
          errorMessage={safeNameError}
          onPress={async () => {
            try {
              await validationName.validate({ name: safeName });
              mutateUpdate({
                _id: selectedSafeId,
                name: safeName,
                fieldToUpdate: 'name',
              });
            } catch (err: any) {
              setSafeNameError(err.errors);
            }
          }}
        />
        <TextInputSaveUI
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
          errorMessage={descriptionError}
          onPressSave={async () => {
            try {
              await validationDescription.validate({ description });
              mutateUpdate({
                _id: selectedSafeId,
                description: description,
                fieldToUpdate: 'description',
              });
            } catch (err: any) {
              setDescriptionError(err.errors);
            }
          }}
        />
        <View
          style={{
            marginBottom: 30,
          }}>
          <ButtonSafe title="Delete safe" iconName="delete-outline" onPress={toggleDeleteModal} />
        </View>
        <BackButton />
        <StorageUsage />
        <ConfirmModalUI
          // safeId={selectedSafeId}
          isVisible={isDeleteModalVisible}
          onCancel={toggleDeleteModal}
          onConfirm={onConfirmDelete}
        />
      </View>
    </View>
  );
};

const ButtonSafe = ({
  onPress,
  title,
  iconName,
  style,
}: {
  onPress: () => void;
  title: string;
  iconName: string;
  style?: StyleProp<TextStyle>;
}) => (
  <Button
    onPress={onPress}
    title={title}
    color="primary"
    style={style}
    containerStyle={{ margin: 5, width: 'auto' }}
    radius="5"
    icon={<MaterialCommunityIcons name={iconName} size={30} style={{}} />}
    iconPosition="left"
    titleStyle={{
      color: 'black',
      fontWeight: 'normal',
    }}
  />
);

export default SafeOption;
