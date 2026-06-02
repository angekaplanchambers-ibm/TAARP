import type { ComponentType } from 'react';

export interface ShowcaseSection {
  id: string;
  title: string;
  subtitle?: string;
  stageNumber?: string;
  phase?: 'interactive' | 'execution' | 'gate';
  states: Record<string, ComponentType>;
  annotation: string;
}

export interface PreambleNavItem {
  id: string;
  label: string;
}

export interface ShowcaseConfig {
  title: string;
  subtitle: string;
  meta: { pdr: string; date: string };
  /** Output filename. Format: {seq}.{FeatureName}-{Published|Archived} (e.g., '006.AzureTerraformRP-TabbedForm-Published') */
  outputName: string;
  /** Raw HTML rendered as context before wireframe sections (e.g., PDR journey content). */
  preamble?: string;
  /** Nav items for the preamble section. Each id must match an anchor in the preamble HTML. */
  preambleNav?: PreambleNavItem[];
  sections: ShowcaseSection[];
}
