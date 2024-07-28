import { LinearProgress } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { getStorageInfoApi } from '../../services/userApi';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SpinnerUI from './SpinnerUI';
import ErrorMessageUI from './ErrorMessageUI';

const formatByteSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return '1 KB'; // display 1k for anything < 1k
  }
  const sizeInKB = sizeInBytes / 1024;
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`;
  }
  const sizeInMB = sizeInKB / 1024;
  if (sizeInMB < 1024) {
    return `${sizeInMB.toFixed(2)} Mb`; // Display as MB if less than 1024MB
  }
  const sizeInGB = sizeInMB / 1024;
  return `${sizeInGB.toFixed(2)} Gb`; // Convert to GB if 1024MB or more
};

const formatTotalSize = (sizeInMB: number): string => {
  const sizeInGB = sizeInMB / 1024;
  return `${sizeInGB.toFixed(2)} Gb`; // Convert to GB if 1024MB or more
};

const StorageUsage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['storageInfo'],
    queryFn: () => getStorageInfoApi(),
  });

  if (isPending) return <SpinnerUI />;

  if (
    // accept 0
    data?.storageUsedInBytes === undefined ||
    data?.storageQuotaInMB === undefined ||
    data?.storageFileCount === undefined ||
    data?.storageUsedInBytes === null ||
    data?.storageQuotaInMB === null ||
    data?.storageFileCount === null
  ) {
    return <ErrorMessageUI display={isError} message={'Missing storage quota data'} />;
  }
  const usedStorageInMB = data.storageUsedInBytes / (1024 * 1024);
  const almostFull = usedStorageInMB / data.storageQuotaInMB > 0.9; // 90% full

  return (
    <View>
      <ErrorMessageUI display={isError} message={error?.message} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="cloud" size={50} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 20,
              marginRight: 10,
            }}>
            Storage
          </Text>
        </View>
        {almostFull && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={30}
              style={{ marginRight: 5 }}
              color="red"
            />
            <Text
              style={{
                fontSize: 20,
                color: 'red',
                fontWeight: 'bold',
                marginRight: 10,
              }}>
              Almost full
            </Text>
          </View>
        )}
      </View>

      <LinearProgress
        value={usedStorageInMB / data.storageQuotaInMB}
        variant="determinate"
        color={almostFull ? 'red' : '#555555'}
        trackColor="white"
        style={{ width: 350, height: 20, borderRadius: 5 }}
      />
      <Text style={{ fontSize: 20 }}>
        {`${formatByteSize(data?.storageUsedInBytes)}  of  ${formatTotalSize(
          data.storageQuotaInMB,
        )}  used`}
      </Text>
    </View>
  );
};

export default StorageUsage;
