import { registerRootComponent } from 'expo';

import { App } from './ui/app';

function Root() {
  return <App />;
}

registerRootComponent(Root);
