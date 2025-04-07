import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);

// For web support
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  if (rootTag) {
    AppRegistry.runApplication(appName, { rootTag });
  }
} 