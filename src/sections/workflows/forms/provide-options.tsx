import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useForm, useFieldArray } from 'react-hook-form';
import { z as zod } from 'zod';

import { Button, Typography, IconButton } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import type { ActionStep } from 'src/lib/actions';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import { useContext } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';

export type ActionStepSchemaType = zod.infer<typeof ActionStepSchema>;

export const ActionStepSchema = zod.object({
  name: zod.string().min(1, { message: 'Please enter the step name' }),
  prompt: zod.string().min(1, { message: 'Please enter prompt/instructions' }),
  options: zod
    .array(zod.string().min(1, { message: 'Options cannot be empty' }))
    .max(5, { message: 'You can add up to 5 options' })
    .optional(),
});

// ----------------------------------------------------------------------

type Props = {
  step: ActionStep;
};

export function ProvideOptionsForm({ step }: Props) {
  const confirm = useBoolean();
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSteps } = workflowContext as WorkflowContextProps;
  const defaultValues = {
    name: step.name,
    prompt: step.metadata?.prompt || ``,
    options: step.metadata?.options || [],
  };

  const methods = useForm<ActionStepSchemaType>({
    mode: 'all',
    resolver: zodResolver(ActionStepSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray<any>({
    control: methods.control,
    name: 'options',
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
                prompt: data.prompt || ``,
                options: data.options,
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
            <Typography variant="body2">Prompt</Typography>
            <Typography variant="caption" color="text.secondary">
              Instructions for the prompt when providing the options
            </Typography>
            <Field.Text name="prompt" multiline rows={4} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2">
              Specify Options{' '}
              <Typography variant="body2" component="span" color="text.secondary">
                (Optional)
              </Typography>
            </Typography>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" alignItems="center" spacing={1}>
                <Field.Text name={`options.${index}`} />
                <IconButton onClick={() => remove(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Stack>
            ))}
            {fields.length < 5 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append('')}
              >
                Add Options
              </Button>
            )}
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
