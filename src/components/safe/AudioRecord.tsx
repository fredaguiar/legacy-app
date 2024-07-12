import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RNFS from 'react-native-fs';
import { Slider, Text, useTheme } from '@rneui/themed';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import { uploadFilesApi } from '../../services/filesApi';
import SpinnerUI from '../ui/SpinnerUI';
import { SafeUtil } from '../../utils/SafeUtil';
import useSafeStore from '../../store/useSafeStore';
import useUserStore from '../../store/useUserStore';

const AudioRecord = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState<Audio.Sound>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState<Audio.Recording>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSafeId, setSelectedSafeId] = useState<string>();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { safeId } = useSafeStore();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();

  const {
    params: { fileName, mode, localFilePath, title },
  } = useRoute<RouteProp<MenuDrawerParams, 'AudioRecord'>>();
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    setSelectedSafeId(SafeUtil.getSafeId({ safeId, user }));

    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      if (recording) {
        console.log('Unloading recording');
        recording.stopAndUnloadAsync();
      }
    };
  }, [sound, recording]);

  const checkPermission = async () => {
    if (permissionResponse?.status === 'granted') {
      return true;
    }
    const requestResponse = await requestPermission();
    return requestResponse;
  };

  const playSound = async () => {
    try {
      if (!checkPermission()) {
        setError('Not allowed');
        return;
      }

      // const localFilePath = `${RNFS.DocumentDirectoryPath}/song.mp3`;
      console.log('localFilePath', localFilePath);
      console.log('localFilePath song', `${RNFS.DocumentDirectoryPath}/song.mp3`);

      if (!localFilePath) {
        setError('File not found');
        return;
      }
      const exists = await RNFS.exists(localFilePath);
      if (!exists) {
        setError('File not found');
        return;
      }

      console.log('localFilePath exists', exists);

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: localFilePath });

      setSound(newSound);
      setIsPlaying(true);

      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      newSound.setOnPlaybackStatusUpdate(updatePlayStatus);

      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (err: any) {
      console.log(`Play sound error${err?.message}`);
      setError('Play sound error');
    }
  };

  const updatePlayStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0); // Reset the position
      }
    }
  };

  const startRecording = async () => {
    try {
      if (!checkPermission()) {
        setError('Not allowed');
        return;
      }

      if (recording) {
        // If there's an existing recording, resume it (recording paused)
        await recording.startAsync();
        setIsRecording(true);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      newRecording.setOnRecordingStatusUpdate(updateRecordStatus);
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const updateRecordStatus = (status: Audio.RecordingStatus) => {
    if (status.isRecording) {
      setDuration(status.durationMillis || 0);
    }
  };

  const {
    mutate,
    isPending,
    isError,
    error: errorUpload,
  } = useMutation({
    mutationFn: uploadFilesApi,
    onSuccess: (_result: TUploadFilesResult) => {
      setError(undefined);
      queryClient.invalidateQueries({ queryKey: ['files'] });
      navigation.navigate('Home');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(undefined);
    setIsRecording(false);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    const name = `audio - ${moment().format('MMMM DD YYYY h-mma')}.mp4`;

    if (!uri) {
      setError('Audio file not found');
      return;
    }

    mutate({ name, type: 'audio/mp4', uri, safeId: selectedSafeId as string, fileName });
  };

  const pauseRecording = async () => {
    if (!recording) return;
    await recording.pauseAsync();
    setIsRecording(false);
  };

  const handleSliderChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handlePlay = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        const status = await sound.getStatusAsync();
        if (
          status.isLoaded &&
          status.durationMillis &&
          status.positionMillis === status.durationMillis
        ) {
          // If playback has reached the end, reset the position to start
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
        setIsPlaying(true);
        console.log('playAsync');
      }
    } else if (!sound && !isPlaying) {
      playSound();
    }
  };

  const formatDuration = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (isPending) return <SpinnerUI />;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.background1,
        padding: 10,
      }}>
      <Text>{title}</Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: colors.background2,
          borderColor: colors.black,
          borderWidth: 1,
          padding: 20,
          borderRadius: 20,
        }}>
        {(mode === 'audio' || (mode === 'record' && !isRecording && duration > 0)) && (
          <View style={{ marginVertical: 20 }}>
            <Text>{`${Math.round(position / 1000)}s / ${Math.round(duration / 1000)}s`}</Text>
            <Slider
              style={{ width: 300, height: 50, backgroundColor: colors.background2 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor={'black'}
              maximumTrackTintColor={colors.divider1}
              thumbTintColor={'black'}
            />
          </View>
        )}
        {mode === 'record' && (
          <Text style={{ fontSize: 40, textAlign: 'center' }}>{formatDuration(duration)}</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.background2,
          }}>
          <ErrorMessageUI display={error || isError} message={error || errorUpload?.message} />
          {mode === 'audio' && (
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={50}
              onPress={handlePlay}
            />
          )}
          {mode === 'record' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.background2,
              }}>
              {duration > 0 && (
                <MaterialCommunityIcons name={'stop'} size={100} onPress={stopRecording} />
              )}
              <MaterialCommunityIcons
                name={isRecording ? 'pause' : 'record-circle'}
                size={100}
                style={{ color: 'red' }}
                onPress={isRecording ? pauseRecording : startRecording}
              />
              {!isRecording && duration > 0 && (
                <MaterialCommunityIcons
                  name={isPlaying ? 'pause' : 'play'}
                  size={100}
                  onPress={handlePlay}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AudioRecord;
