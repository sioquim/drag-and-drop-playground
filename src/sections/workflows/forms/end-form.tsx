import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Typography } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import type { ActionStep } from 'src/lib/actions';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import { useContext } from 'react';

export type ActionStepSchemaType = zod.infer<typeof ActionStepSchema>;

export const ActionStepSchema = zod.object({
  endMessage: zod.string().min(1, { message: 'Please enter your end call message' }),
});

type Props = {
  step: ActionStep;
};

export function EndForm({ step }: Props) {
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSteps } = workflowContext as WorkflowContextProps;
  const defaultValues = {
    endMessage: step?.metadata?.endMessage || '',
  };

  const methods = useForm<ActionStepSchemaType>({
    mode: 'all',
    resolver: zodResolver(ActionStepSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updatedSteps = steps.map((s: ActionStep) =>
        s.id === step.id ? { ...s, metadata: { endMessage: data.endMessage } } : s
      );
      setSteps(updatedSteps);
      toast.success('Workflow successfully updated');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="body2">End Call Message</Typography>
          <Field.Text name="endMessage" multiline rows={4} />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="primary">
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
