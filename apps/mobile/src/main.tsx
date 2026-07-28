import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { Alert } from 'react-native';

import { App } from './ui/app';
import { createMobileDependencies } from './ui/di-container';

const dependencies = createMobileDependencies({
  storage: AsyncStorage,
  alertHandler: (title, message) => Alert.alert(title, message),
});

function Root() {
  return <App dependencies={dependencies} />;
}

registerRootComponent(Root);
