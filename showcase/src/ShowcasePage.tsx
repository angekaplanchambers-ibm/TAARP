import { makeStyles, tokens } from '@fluentui/react-components';
import type { ShowcaseConfig } from './types';

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    '& [style*="overflow-x: auto"]': {
      overflowX: 'visible !important',
    },
    '& .azure-terraform-body > form, & .azure-terraform-body form': {
      width: '100% !important',
      maxWidth: 'none !important',
    },
    '& table': {
      width: '100% !important',
      minWidth: '0 !important',
      maxWidth: '100% !important',
      tableLayout: 'fixed',
    },
    '& th, & td': {
      whiteSpace: 'normal !important',
      overflowWrap: 'anywhere',
      wordBreak: 'normal',
    },
    '& th:first-child, & td:first-child': {
      width: '44px',
    },
    '& [aria-labelledby="confirm-selections-heading"] table th, & [aria-labelledby="confirm-selections-heading"] table td': {
      width: '20% !important',
    },
    '& [aria-labelledby="terraform-stacks-heading"] table th, & [aria-labelledby="terraform-stacks-heading"] table td': {
      width: '20% !important',
    },
  },
});

export interface ShowcasePageProps {
  config: ShowcaseConfig;
}

export function ShowcasePage({ config }: ShowcasePageProps) {
  const styles = useStyles();
  const section = config.sections[0];
  const stateName = section ? Object.keys(section.states)[0] : undefined;
  const ActiveComponent = stateName ? section.states[stateName] : undefined;

  return (
    <main className={styles.page} aria-label={config.title}>
      {ActiveComponent && <ActiveComponent />}
    </main>
  );
}
