'use client';

import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import { useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Iconify } from 'src/components/iconify';
import { IconButton, Typography } from '@mui/material';
import { type ActionStep } from 'src/lib/actions';
import { WorkflowStepForm } from './workflow-step-form';
import WorkflowActions from './workflow-actions';
import { WorkflowSettings } from './workflow-settings';
import { StartForm } from './forms/start-form';
import { EndForm } from './forms/end-form';
import { RequestInformationForm } from './forms/request-information-form';
import { EvaluateForm } from './forms/evaluate-form';
import { ForwardCallForm } from './forms/forward-call-form';
import { ProvideOptionsForm } from './forms/provide-options';
import { ConfirmInformationForm } from './forms/confirm-information-form';

const WorkflowFormSelector = ({ step }: { step: ActionStep }) => {
  if (step.name === 'Start') {
    return <StartForm step={step} />;
  }

  if (step.name === 'End') {
    return <EndForm step={step} />;
  }

  switch (step.type) {
    case 'Collect Info':
      return <RequestInformationForm step={step} />;
    case 'Evaluate & Trigger':
      return <EvaluateForm step={step} />;
    case 'Forward Calls':
      return <ForwardCallForm step={step} />;
    case 'Provide Options':
      return <ProvideOptionsForm step={step} />;
    case 'Confirmation':
      return <ConfirmInformationForm step={step} />;

    default:
      return <WorkflowStepForm step={step} />;
  }
};
const WorkflowStepDetails: React.FC = () => {
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSelectedStep, selectedStep } = workflowContext as WorkflowContextProps;

  const realTimeStep = steps.find((s) => s.id === selectedStep?.id);

  const handleGoBack = () => {
    setSelectedStep(null);
  };

  if (!realTimeStep) {
    return <WorkflowSettings />;
  }

  if (
    realTimeStep &&
    !realTimeStep?.type &&
    realTimeStep?.name !== 'Start' &&
    realTimeStep?.name !== 'End'
  ) {
    return (
      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ mb: 0 }} variant="h5">
            Choose an action
          </Typography>

          <IconButton size="small" onClick={handleGoBack}>
            <Iconify icon="mingcute:close-line" width={24} />
          </IconButton>
        </Stack>
        <WorkflowActions step={realTimeStep || selectedStep} />
      </Stack>
    );
  }

  const type = realTimeStep?.type || selectedStep?.type;
  const name = realTimeStep?.name || selectedStep?.name;

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Typography sx={{ mb: 0 }} variant="h5">
            Edit Step
          </Typography>
          <Typography sx={{ mb: 0 }} variant="caption" color="text.secondary">
            {type || name}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={handleGoBack}>
          <Iconify icon="mingcute:close-line" width={24} />
        </IconButton>
      </Stack>
      <WorkflowFormSelector step={realTimeStep || setSelectedStep} key={realTimeStep.id} />
    </Stack>
  );
};

export default WorkflowStepDetails;
