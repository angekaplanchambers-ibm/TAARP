import { Link, Text, makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components';
import type { ShowcaseSection, PreambleNavItem } from './types';

const useStyles = makeStyles({
  nav: {
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1,
    boxSizing: 'border-box',
    width: '220px',
    height: '100vh',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRight(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalL, 0),
    boxShadow: tokens.shadow4,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  groupLabel: {
    display: 'block',
    marginTop: tokens.spacingVerticalXXL,
    marginBottom: tokens.spacingVerticalSNudge,
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0',
    textTransform: 'uppercase',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    minHeight: '32px',
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    textDecorationLine: 'none',
    transitionDuration: tokens.durationNormal,
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: tokens.curveEasyEase,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    ':hover': {
      color: tokens.colorNeutralForeground1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
      textDecorationLine: 'none',
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: tokens.strokeWidthThick,
      outlineColor: tokens.colorStrokeFocus2,
      outlineOffset: '2px',
    },
  },
  activeLink: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  dot: {
    width: '6px',
    height: '6px',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralStroke1,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  activeDot: {
    backgroundColor: tokens.colorBrandBackground,
  },
});

export interface ShowcaseNavProps {
  sections: ShowcaseSection[];
  activeId?: string;
  preambleNav?: PreambleNavItem[];
}

export function ShowcaseNav({ sections, activeId, preambleNav }: ShowcaseNavProps) {
  const styles = useStyles();

  function renderLink(id: string, label: string, phase?: string) {
    const isActive = id === activeId;

    return (
      <Link
        href={`#${id}`}
        className={mergeClasses(styles.link, isActive && styles.activeLink)}
        aria-current={isActive ? 'location' : undefined}
      >
        <span className={mergeClasses(styles.dot, (phase || isActive) && styles.activeDot)} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <nav className={styles.nav} aria-label="Showcase navigation">
      <ul className={styles.list}>
        {preambleNav && preambleNav.length > 0 && (
          <>
            <li><Text as="span" className={styles.groupLabel}>Product Thinking</Text></li>
            {preambleNav.map((item) => (
              <li key={item.id}>
                {renderLink(item.id, item.label)}
              </li>
            ))}
            <li><Text as="span" className={styles.groupLabel}>Wireframes</Text></li>
          </>
        )}
        {sections.map((section) => (
          <li key={section.id}>
            {renderLink(section.id, section.title, section.phase)}
          </li>
        ))}
      </ul>
    </nav>
  );
}
