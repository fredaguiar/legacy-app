import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import useUserStore from '../../store/useUserStore';
import { updateUserProfileApi } from '../../services/userApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';

const Introduction = ({}: {}) => {
  const { updateUserProfile } = useUserStore();
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: (result: TUserUpdate) => {
      const { introductionViewed } = result;
      const profile: Partial<TUserProfile> = { introductionViewed };

      updateUserProfile(profile);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      navigation.navigate('Home');
    },
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Video
          ref={video}
          style={{ width: 300, height: 300 }}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <ErrorMessageUI display={isError} message={error?.message} />

        <TouchableOpacity
          onPress={() => {
            mutate({ introductionViewed: true, fieldsToUpdate: ['introductionViewed'] });
          }}
          style={{ marginBottom: 40 }}>
          <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>Skip/Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Introduction;
