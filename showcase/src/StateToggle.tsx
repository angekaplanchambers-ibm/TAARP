import { Tab, TabList, makeStyles, tokens } from '@fluentui/react-components';

export interface StateToggleProps {
  states: string[];
  active: string;
  onSelect: (s: string) => void;
}

const useStyles = makeStyles({
  tabList: {
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalXS,
    rowGap: tokens.spacingVerticalXS,
  },
  tab: {
    minHeight: '32px',
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0',
    textTransform: 'uppercase',
    transitionDuration: tokens.durationNormal,
    transitionProperty: 'background-color, color, border-color',
    transitionTimingFunction: tokens.curveEasyEase,
  },
});

export function StateToggle({ states, active, onSelect }: StateToggleProps) {
  const styles = useStyles();

  return (
    <TabList
      aria-label="Wireframe state"
      className={styles.tabList}
      selectedValue={active}
      onTabSelect={(_, data) => onSelect(String(data.value))}
    >
      {states.map((name) => (
        <Tab
          key={name}
          value={name}
          className={styles.tab}
        >
          {name}
        </Tab>
      ))}
    </TabList>
  );
}
