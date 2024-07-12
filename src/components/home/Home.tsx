import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, useTheme } from '@rneui/themed';
import SafeList from '../safe/lists/SafeList';
import Bottom from '../bottom/Bottom';
import SearchFiles from '../top/SearchFiles';
import { SafeUtil } from '../../utils/SafeUtil';
import FileList from '../safe/lists/FileList';
import useUserStore from '../../store/useUserStore';
import useSafeStore from '../../store/useSafeStore';
import useSearchStore from '../../store/useSearchStore';
import SearchSafesResult from '../safe/lists/SearchSafesResult';

const Home = () => {
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useUserStore();
  const { safeId } = useSafeStore();
  const { searchResult } = useSearchStore();
  const safe = SafeUtil.getSafe(user, safeId);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <SearchFiles />
      </View>
      <Divider style={{ borderWidth: 1, borderColor: colors.divider2 }} />
      <View style={[styles.containerScrollView, { backgroundColor: colors.background }]}>
        {searchResult && <SearchSafesResult />}
        {!searchResult && !safe && <SafeList />}
        {!searchResult && safe && <FileList />}
      </View>
      <Bottom />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    height: 'auto',
  },
  containerScrollView: {
    flex: 1,
  },
});

export default Home;
