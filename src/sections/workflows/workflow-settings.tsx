import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Typography } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';
import { useEffect, useContext } from 'react';

export type ActionStepSchemaType = zod.infer<typeof ActionStepSchema>;

export const ActionStepSchema = zod.object({
  name: zod.string().min(1, { message: 'Please enter the step name' }),
  description: zod.string().min(1, { message: 'Please enter the description' }),
});

// ----------------------------------------------------------------------

export function WorkflowSettings() {
  const workflowContext = useContext(WorkflowContext);
  const { settings, setSettings } = workflowContext as WorkflowContextProps;
  console.log('🚀 ~ WorkflowSettings ~ settings:', settings);
  const defaultValues = {
    name: settings?.name ?? '',
    description: settings?.description ?? '',
  };

  const methods = useForm<ActionStepSchemaType>({
    mode: 'all',
    resolver: zodResolver(ActionStepSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
  } = methods;

  useEffect(() => {
    const currentValues = getValues();
    if (
      currentValues.name !== settings?.name ||
      currentValues.description !== settings?.description
    ) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, reset, getValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSettings({ ...data });
      toast.success('Workflow successfully updated');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Typography variant="h4">Workflow Settings</Typography>
        <Stack spacing={1}>
          <Typography variant="body2">Name</Typography>
          <Field.Text name="name" />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body2">Description</Typography>
          <Field.Text name="description" multiline rows={4} />
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
