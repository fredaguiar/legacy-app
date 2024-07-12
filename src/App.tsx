import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@rneui/themed';
import RootNavigator from './navigator/RootNavigator';
import { theme } from './styles/theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <ThemeProvider theme={theme}>
          <RootNavigator />
        </ThemeProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent('main', () => App);

/* 
To move App.tsx from ./ to ./src/
  - package.json: "main": "src/App.tsx",
  - Override node_modules\expo\AppEntry.js 
*/
registerRootComponent(App);
