import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Button, Typography } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import type { ActionStep } from 'src/lib/actions';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import { useContext } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';

import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { isEmergencyNumber } from 'src/utils/validation';

export type ActionStepSchemaType = zod.infer<typeof ActionStepSchema>;

export const ActionStepSchema = zod.object({
  name: zod.string().min(1, { message: 'Please enter the step name' }),
  phone: zod.string().refine(
    (value) => {
      console.log('value', value);
      return isValidPhoneNumber(value) || isEmergencyNumber(value);
    },
    {
      message: 'Please enter a valid phone number',
    }
  ),
});

type Props = {
  step: ActionStep;
};

export function ForwardCallForm({ step }: Props) {
  const confirm = useBoolean();
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSteps } = workflowContext as WorkflowContextProps;
  const defaultValues = {
    name: step.name,
    phone: step.metadata?.phone || ``,
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
        s.id === step.id
          ? {
              ...s,
              name: data.name,
              metadata: {
                phone: data.phone,
              },
            }
          : s
      );
      setSteps(updatedSteps);
      toast.success('Workflow successfully updated');
    } catch (error) {
      console.error(error);
    }
  });

  const onRemove = () => {
    try {
      const updatedSteps = steps.filter((s: ActionStep) => s.id !== step.id);
      const normalizedSteps = updatedSteps.map((s, index) => {
        if (index === updatedSteps.length - 1) {
          return { ...s, order: null }; // Set the last step's order to null
        }
        return { ...s, order: index };
      });
      setSteps(normalizedSteps);
      confirm.onFalse(); // Close the confirmation dialog
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="body2">Name</Typography>
            <Field.Text name="name" />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2">Phone</Typography>
            <Field.Phone name="phone" />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="primary">
              Save
            </LoadingButton>
            <Button variant="outlined" color="error" onClick={confirm.onTrue}>
              Remove Step
            </Button>
          </Stack>
        </Stack>
      </Form>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this step?"
        action={
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        }
      />
    </>
  );
}
