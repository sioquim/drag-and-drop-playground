'use client';

import { useRef, useContext } from 'react';

import { Stack, IconButton, Typography } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';

import type { ActionStep } from 'src/lib/actions';

import { Iconify } from 'src/components/iconify';

type Props = CardProps & {
  item: ActionStep;
  onAdd?: (referenceStepId: string, action?: string | null) => void;
};

const ReservedWorkflowItem: React.FC<Props> = ({ item, onAdd, ...cardProps }: Props) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const workflowContext = useContext(WorkflowContext);
  const { selectedStep } = workflowContext as WorkflowContextProps;

  const handleAdd = () => {
    onAdd?.(item.id, null);
  };
  return (
    <>
      <Card
        {...cardProps}
        sx={{
          cursor: 'pointer',
          border: (theme) =>
            selectedStep?.id === item.id ? `1px solid ${theme.palette.divider}` : undefined,
          bgcolor: (theme) =>
            selectedStep?.id === item.id ? theme.palette.primary.dark : undefined,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography variant="caption">{item.name}</Typography>
        </CardContent>
      </Card>
      {onAdd && (
        <Stack spacing={4} direction="row" justifyContent="center" sx={{ width: '100%' }}>
          <IconButton ref={anchorRef} onClick={handleAdd}>
            <Iconify icon="solar:add-circle-line-duotone" width={24} />
          </IconButton>
        </Stack>
      )}
    </>
  );
};

export default ReservedWorkflowItem;
