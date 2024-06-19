'use client';

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { useContext } from 'react';
import { Iconify } from 'src/components/iconify';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import type { Action, ActionStep } from 'src/lib/actions';
import { Actions, getActionIcon, getActionDescription } from 'src/lib/actions';

type Props = {
  step: ActionStep;
};

const WorkflowActions: React.FC<Props> = ({ step }: Props) => {
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSteps } = workflowContext as WorkflowContextProps;

  const handleCardClick = (type: Action) => {
    const updatedSteps = steps.map((s: ActionStep) => (s.id === step.id ? { ...s, type } : s));
    setSteps(updatedSteps);
  };

  return (
    <Grid container spacing={2}>
      {Actions.map((action: Action) => (
        <Grid xs={12} sm={6} key={action}>
          <Card
            onClick={() => handleCardClick(action)}
            sx={{
              cursor: 'pointer',
              height: '100%',
              bgcolor: 'background.paper',
              border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              transition: 'background-color 0.3s ease',
              '&:hover': {
                bgcolor: 'background.neutral',
              },
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify width={24} icon={getActionIcon(action)} color="text.secondary" />
                <Stack>
                  <Typography variant="caption">{action}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getActionDescription(action)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WorkflowActions;
