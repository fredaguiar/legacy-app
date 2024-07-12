import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  SkyBackground: {
    backgroundColor: '#DFE9ED',
  },
  SkyBackgroundDark: {
    backgroundColor: '#96d5ee',
  },
  Container: {
    paddingHorizontal: 10,
  },
  Picker: {
    backgroundColor: 'white',
    height: 65,
  },
});
