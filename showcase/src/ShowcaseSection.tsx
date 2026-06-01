import { useState } from 'react';
import {
  Card,
  Text,
  Title2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import type { ShowcaseSection as SectionType } from './types';
import { StateToggle } from './StateToggle';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  stageNumber: {
    display: 'block',
    marginBottom: tokens.spacingVerticalXS,
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0',
    textTransform: 'uppercase',
  },
  title: {
    display: 'block',
    margin: 0,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    display: 'block',
    marginTop: tokens.spacingVerticalXS,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  wireframeCard: {
    position: 'relative',
    height: '700px',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow16,
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.padding(0),
  },
  chromeBar: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    columnGap: tokens.spacingHorizontalS,
    height: '36px',
    userSelect: 'none',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderBottom(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.padding(0, tokens.spacingHorizontalM),
  },
  dot: {
    width: '10px',
    height: '10px',
    backgroundColor: tokens.colorNeutralStroke1,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  spacer: {
    width: '12px',
  },
  tabGroup: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXXS,
  },
  browserTab: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase100,
    ...shorthands.borderRadius(tokens.borderRadiusMedium, tokens.borderRadiusMedium, 0, 0),
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalM),
  },
  tabPlus: {
    color: tokens.colorNeutralForeground4,
    fontSize: tokens.fontSizeBase100,
    ...shorthands.padding(tokens.spacingVerticalXXS, tokens.spacingHorizontalS),
  },
  urlBar: {
    flex: 1,
    maxWidth: '480px',
    height: '20px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  rightChromeSpace: {
    width: '48px',
  },
  content: {
    position: 'relative',
    height: 'calc(100% - 37px)',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  toggleArea: {
    marginTop: tokens.spacingVerticalL,
  },
  annotation: {
    marginTop: tokens.spacingVerticalXXL,
    paddingTop: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase500,
    ...shorthands.borderTop(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
  },
  annotationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '32px',
    rowGap: tokens.spacingVerticalXXL,
    '& h3': {
      marginTop: 0,
      marginBottom: tokens.spacingVerticalS,
      color: tokens.colorNeutralForeground3,
      fontFamily: tokens.fontFamilyBase,
      fontSize: tokens.fontSizeBase200,
      fontWeight: tokens.fontWeightSemibold,
      letterSpacing: '0',
      textTransform: 'uppercase',
    },
    '& p': {
      marginTop: 0,
      marginBottom: tokens.spacingVerticalS,
      color: tokens.colorNeutralForeground2,
      fontSize: tokens.fontSizeBase300,
      fontWeight: tokens.fontWeightRegular,
      lineHeight: tokens.lineHeightBase500,
    },
    '& ul': {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    '& li': {
      position: 'relative',
      marginBottom: tokens.spacingVerticalXS,
      paddingLeft: tokens.spacingHorizontalM,
      color: tokens.colorNeutralForeground2,
      fontSize: tokens.fontSizeBase300,
      fontWeight: tokens.fontWeightRegular,
      lineHeight: tokens.lineHeightBase400,
    },
    '& li::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '0.6em',
      width: '4px',
      height: '4px',
      backgroundColor: tokens.colorBrandBackground,
      ...shorthands.borderRadius(tokens.borderRadiusCircular),
    },
    '& strong': {
      color: tokens.colorNeutralForeground1,
      fontWeight: tokens.fontWeightSemibold,
    },
  },
});

export interface ShowcaseSectionProps {
  section: SectionType;
}

export function ShowcaseSection({ section }: ShowcaseSectionProps) {
  const styles = useStyles();
  const stateNames = Object.keys(section.states);
  const [active, setActive] = useState(stateNames[0] ?? '');

  const ActiveComponent = section.states[active];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        {section.stageNumber && (
          <Text as="span" className={styles.stageNumber}>{section.stageNumber}</Text>
        )}
        <Title2 as="h2" className={styles.title}>{section.title}</Title2>
        {section.subtitle && <Text as="p" className={styles.subtitle}>{section.subtitle}</Text>}
      </div>

      <Card className={styles.wireframeCard} appearance="filled-alternative">
        <div className={styles.chromeBar}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.dot} />
          ))}
          <div className={styles.spacer} />
          <div className={styles.tabGroup}>
            <span className={styles.browserTab}>Platform</span>
            <span className={styles.tabPlus}>+</span>
          </div>
          <div className={styles.urlBar} />
          <div className={styles.rightChromeSpace} />
        </div>

        <div className={styles.content}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </Card>

      {stateNames.length > 1 && (
        <div className={styles.toggleArea}>
          <StateToggle
            states={stateNames}
            active={active}
            onSelect={setActive}
          />
        </div>
      )}

      {section.annotation && (
        <div className={styles.annotation}>
          <div className={styles.annotationGrid} dangerouslySetInnerHTML={{ __html: section.annotation }} />
        </div>
      )}
    </section>
  );
}
