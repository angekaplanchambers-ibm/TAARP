/* eslint-disable i18next/no-literal-string */
/**
 * Incident Response Dashboard Showcase Config
 *
 * Maps the 6 Incident Response wireframe screens to their annotations
 * from PDR-004 (WireframePlan: Incident Response Dashboard).
 */
import type { ShowcaseConfig } from '../../src/types';

// -- Wireframe components (exported from story files) --
import {
  AlertIncomingWireframe,
  CorrelationCompleteWireframe,
  MultipleAlertsWireframe,
} from '@z/wireframes/IncidentAlert.stories';

import {
  TriageListWireframe,
  TriageSelectedWireframe,
  TriageAssignedWireframe,
} from '@z/wireframes/IncidentTriage.stories';

import {
  RootCauseRankingWireframe,
  CauseSelectedWireframe,
  RemediationProposedWireframe,
  RemediationWithRollbackWireframe,
} from '@z/wireframes/IncidentAnalysis.stories';

import {
  PendingApprovalWireframe,
  ApprovalGrantedWireframe,
  ApprovalRejectedWireframe,
  ApprovalEscalatedWireframe,
} from '@z/wireframes/IncidentApproval.stories';

import {
  ExecutionRunningWireframe,
  ExecutionCompleteWireframe,
  ExecutionFailedWireframe,
  ExecutionWithEventsWireframe,
} from '@z/wireframes/IncidentExecute.stories';

import {
  VerificationRunningWireframe,
  VerificationPassedWireframe,
  VerificationFailedWireframe,
  IncidentClosedWireframe,
} from '@z/wireframes/IncidentVerify.stories';

// -- Annotation HTML (inlined at build time via Vite ?raw) --
import alertCorrelationHtml from './annotations/alert-correlation.html?raw';
import triageHtml from './annotations/triage.html?raw';
import analysisRemediationHtml from './annotations/analysis-remediation.html?raw';
import approvalHtml from './annotations/approval.html?raw';
import executionHtml from './annotations/execution.html?raw';
import verifyCloseHtml from './annotations/verify-close.html?raw';
import preambleHtml from './preamble.html?raw';

// -- Config --
export const config: ShowcaseConfig = {
  title: 'Incident Response Dashboard',
  subtitle: 'Wireframe review for the 10-stage incident lifecycle. 6 screens, 22 state variants.',
  outputName: '002.IncidentResponse-Draft01',
  meta: {
    pdr: 'PDR-004',
    date: '2026-02-27',
  },
  theme: 'grayscale',
  preamble: preambleHtml,
  preambleNav: [
    { id: 'pt-the-job', label: 'The Problem' },
    { id: 'pt-approach', label: 'Approach' },
    { id: 'pt-principles', label: 'Principles' },
    { id: 'pt-jtbd', label: 'Jobs to Be Done' },
    { id: 'pt-execution-flow', label: 'Execution Flow' },
    { id: 'pt-state-machine', label: 'State Machine' },
    { id: 'pt-bridging-data', label: 'Bridging Data' },
  ],
  sections: [
    {
      id: 'alert-correlation',
      title: 'Alert & Correlation',
      subtitle: 'Agent ingests signals, correlates across workspaces, presents grouped incident.',
      stageNumber: '01-02',
      phase: 'interactive',
      states: {
        'Alert Incoming': AlertIncomingWireframe,
        'Correlation Complete': CorrelationCompleteWireframe,
        'Multiple Alerts': MultipleAlertsWireframe,
      },
      annotation: alertCorrelationHtml,
    },
    {
      id: 'triage',
      title: 'Triage',
      subtitle: 'Operator selects incident, reviews AI triage summary, accepts assignment.',
      stageNumber: '03',
      phase: 'interactive',
      states: {
        'Triage List': TriageListWireframe,
        'Triage Selected': TriageSelectedWireframe,
        'Triage Assigned': TriageAssignedWireframe,
      },
      annotation: triageHtml,
    },
    {
      id: 'analysis-remediation',
      title: 'Analysis & Remediation',
      subtitle: 'Agent ranks root causes. Operator confirms and reviews remediation runbook.',
      stageNumber: '04-05',
      phase: 'interactive',
      states: {
        'Root Cause Ranking': RootCauseRankingWireframe,
        'Cause Selected': CauseSelectedWireframe,
        'Remediation Proposed': RemediationProposedWireframe,
        'With Rollback': RemediationWithRollbackWireframe,
      },
      annotation: analysisRemediationHtml,
    },
    {
      id: 'approval',
      title: 'Approval & Authorization',
      subtitle: 'Incident Commander reviews plan, approves with conditions, RBAC enforced.',
      stageNumber: '06',
      phase: 'gate',
      states: {
        'Pending Approval': PendingApprovalWireframe,
        'Approved': ApprovalGrantedWireframe,
        'Rejected': ApprovalRejectedWireframe,
        'Escalated': ApprovalEscalatedWireframe,
      },
      annotation: approvalHtml,
    },
    {
      id: 'execution',
      title: 'Execution & Monitoring',
      subtitle: 'Agent executes playbook via terraform CLI. Operator monitors step-by-step progress.',
      stageNumber: '07-08',
      phase: 'execution',
      states: {
        'Running': ExecutionRunningWireframe,
        'Complete': ExecutionCompleteWireframe,
        'Failed': ExecutionFailedWireframe,
        'Event Log': ExecutionWithEventsWireframe,
      },
      annotation: executionHtml,
    },
    {
      id: 'verify-close',
      title: 'Verify & Close',
      subtitle: 'Post-remediation checks. Incident closure with full timeline and audit trail.',
      stageNumber: '09-10',
      phase: 'execution',
      states: {
        'Verification Running': VerificationRunningWireframe,
        'All Passed': VerificationPassedWireframe,
        'Check Failed': VerificationFailedWireframe,
        'Incident Closed': IncidentClosedWireframe,
      },
      annotation: verifyCloseHtml,
    },
  ],
};
