import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'legacy-app',
  slug: 'legacy-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.fredaguiar.legacyapp',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'f5f59153-ff98-42f3-a6e3-5c91c0623b5a',
    },
  },
  plugins: ['expo-secure-store'],
});
