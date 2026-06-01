import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ShowcasePage } from './ShowcasePage';
import { config } from '../showcases/azure-terraform-rp/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <ShowcasePage config={config} />
    </FluentProvider>
  </StrictMode>,
);
