// Define action name constants
const REQUEST_INFO = 'Request Info';
const EVALUATE_INFO = 'Evaluate Info';
const PROVIDE_OPTIONS = 'Provide Options';
const CONFIRMATION = 'Confirmation';
const HTTP_REQUEST = 'HTTP Request';
const FORWARD_CALLS = 'Forward Calls';
const END_CALL = 'End Call';
const TRIGGER_WORKFLOW = 'Trigger Workflow';
const HANDLE_SPECIAL_CONDITIONS = 'Handle Special Conditions';
const COLLECT_FEEDBACK = 'Collect Feedback';
const VERIFY_INFORMATION = 'Verify Information';
const FOLLOW_UP = 'Follow-Up';

export type InsertActionStep = {
  name: string;
  type?: Action;
  description: string;
  order: number | null;
  metadata: any;
};

export type ActionStep = {
  id: string;
  name: string;
  type?: Action;
  description: string;
  order: number | null;
  metadata: any;
};
// Define the type for actions using the constants
export type Action =
  | typeof REQUEST_INFO
  | typeof EVALUATE_INFO
  | typeof PROVIDE_OPTIONS
  | typeof CONFIRMATION
  | typeof HTTP_REQUEST
  | typeof FORWARD_CALLS
  | typeof END_CALL
  | typeof TRIGGER_WORKFLOW
  | typeof HANDLE_SPECIAL_CONDITIONS
  | typeof COLLECT_FEEDBACK
  | typeof VERIFY_INFORMATION
  | typeof FOLLOW_UP;

// Complete list of actions
export const Actions: Action[] = [
  REQUEST_INFO,
  EVALUATE_INFO,
  PROVIDE_OPTIONS,
  CONFIRMATION,
  HTTP_REQUEST,
  FORWARD_CALLS,
  END_CALL,
  TRIGGER_WORKFLOW,
  HANDLE_SPECIAL_CONDITIONS,
  COLLECT_FEEDBACK,
  VERIFY_INFORMATION,
  FOLLOW_UP,
];

// Top 5 most common actions
export const TopActions: Action[] = [REQUEST_INFO, HTTP_REQUEST, END_CALL];

// Example function to get the description of an action
export const getActionDescription = (action: Action): string => {
  const descriptions: Record<Action, string> = {
    [REQUEST_INFO]: 'Collect information from the user',
    [EVALUATE_INFO]: 'Assess the provided information',
    [PROVIDE_OPTIONS]: 'Provide options or alternatives',
    [CONFIRMATION]: 'Confirm the information or action',
    [HTTP_REQUEST]: 'Send or receive HTTP requests',
    [FORWARD_CALLS]: 'Forward the call to another party',
    [END_CALL]: 'End the current call',
    [TRIGGER_WORKFLOW]: 'Trigger a follow-up workflow',
    [HANDLE_SPECIAL_CONDITIONS]: 'Handle any special conditions or emergencies',
    [COLLECT_FEEDBACK]: 'Collect feedback from the user',
    [VERIFY_INFORMATION]: 'Verify the provided information',
    [FOLLOW_UP]: 'Schedule or perform follow-up actions',
  };
  return descriptions[action];
};
