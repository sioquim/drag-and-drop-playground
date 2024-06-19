'use client';

import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useEffect, useContext } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import { SessionProvider } from 'src/components/session/context';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext, WorkflowProvider } from 'src/components/workflow/context';
import { useVapiSession } from 'src/hooks/use-vapi-session';
import type { Action, ActionStep } from 'src/lib/actions';
import ReservedWorkflowItem from './reserved-work-item';
import WorkflowCode from './workflow-code';
import WorkflowItem from './workflow-item';
import WorkflowItemSkeleton from './workflow-item-skeleton';
import WorkflowStepDetails from './workflow-step-details';

export function WorkflowsBase({ sessionKey }: { sessionKey: string | null }) {
  const workflowContext = useContext(WorkflowContext);
  const { steps, setSelectedStep, settings } = workflowContext as WorkflowContextProps;
  const { setSteps } = workflowContext as WorkflowContextProps;
  const [activeStep, setActiveStep] = useState<ActionStep | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onClickReservedItem = (selected: ActionStep) => {
    const selectedStep = steps.find((step) => step.id === selected.id);
    if (selectedStep) {
      setActiveStep(selectedStep);
    }
  };

  const onDragStart = (event: any) => {
    const { active } = event;
    const selectedStep = steps.find((step) => step.id === active.id);
    if (selectedStep) {
      setActiveStep(selectedStep);
    }
  };

  useEffect(() => {
    if (activeStep) {
      setSelectedStep(activeStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active?.id && over?.id && active?.id !== over?.id) {
      setSteps((currentSteps) => {
        const oldIndex = currentSteps.findIndex((step) => step.id === active.id);
        const newIndex = currentSteps.findIndex((step) => step.id === over.id);
        return arrayMove(currentSteps, oldIndex, newIndex);
      });
    }

    setActiveStep(null);
  };

  const handleAddStep = async (stepId: string, stepName: string | null | undefined) => {
    if (sessionKey) {
      const newStep: ActionStep = {
        id: nanoid(),
        name: stepName || `Choose an action`,
        type: (stepName as Action) || undefined,
        description: 'Description of the new step',
        metadata: {},
      };

      // Find the index where the new step should be inserted
      const insertIndex = steps.findIndex((step) => step.id === stepId) + 1;

      // Insert the new step at the correct position
      const updatedSteps = [...steps.slice(0, insertIndex), newStep, ...steps.slice(insertIndex)];

      // Update the steps state
      setSteps(updatedSteps);
      setActiveStep(newStep);
    }
  };
  const [start, ...remainingStepsWithEnd] = steps;
  const end = remainingStepsWithEnd.length > 0 ? remainingStepsWithEnd.pop() : null;
  const remainingSteps = remainingStepsWithEnd ?? [];
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Grid
        container
        sx={{
          width: '100%',
          borderTop: `1px dashed`,
          borderColor: 'divider',
          minHeight: `100vh`,
          mt: 'var(--layout-header-desktop-height)',
          position: 'fixed',
          top: 0,
        }}
        spacing={8}
      >
        <Grid
          xs={8}
          sx={{
            borderRight: `1px dashed`,
            borderColor: 'divider',
            height: 'calc(100vh - var(--layout-header-desktop-height))',
            overflowY: 'auto',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" sx={{ px: 4 }}>
              {settings?.name || ` `}
            </Typography>
            <WorkflowCode />
          </Stack>
          <Container maxWidth="xs">
            <SortableContext
              items={steps.map((step) => step.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing={4}>
                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineConnector sx={{ opacity: 0 }} />
                      <TimelineDot />
                      <TimelineConnector sx={{ opacity: 1 }} />
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 4, pb: 0 }}>
                      {start ? (
                        <ReservedWorkflowItem
                          item={start}
                          onAdd={handleAddStep}
                          onClick={() => onClickReservedItem(start)}
                        />
                      ) : (
                        <WorkflowItemSkeleton />
                      )}
                    </TimelineContent>
                  </TimelineItem>
                  {remainingSteps?.length ? (
                    remainingSteps.map((step) => (
                      <TimelineItem key={step.id}>
                        <TimelineSeparator>
                          <TimelineConnector />
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ pt: 4, pb: 0 }}>
                          <WorkflowItem item={step} isDraggable onAdd={handleAddStep} />
                        </TimelineContent>
                      </TimelineItem>
                    ))
                  ) : (
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ pt: 4, pb: 0 }}>
                        <WorkflowItemSkeleton />
                      </TimelineContent>
                    </TimelineItem>
                  )}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineConnector sx={{ opacity: 1 }} />
                      <TimelineDot />
                      <TimelineConnector sx={{ opacity: 0 }} />
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 4, pb: 0 }}>
                      {end ? (
                        <ReservedWorkflowItem item={end} onClick={() => onClickReservedItem(end)} />
                      ) : (
                        <WorkflowItemSkeleton />
                      )}
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Stack>
            </SortableContext>
            <DragOverlay>
              {activeStep ? <WorkflowItem item={activeStep} isDraggable /> : null}
            </DragOverlay>
          </Container>
        </Grid>
        <Grid
          xs={4}
          sx={{
            height: 'calc(100vh - var(--layout-header-desktop-height))',
            overflowY: 'auto',
          }}
        >
          <WorkflowStepDetails />
        </Grid>
      </Grid>
    </DndContext>
  );
}

export function WorkflowsView() {
  const sessionKey = useVapiSession();
  return (
    <SessionProvider sessionKey={sessionKey}>
      <WorkflowProvider sessionKey={sessionKey}>
        <WorkflowsBase sessionKey={sessionKey} />
      </WorkflowProvider>
    </SessionProvider>
  );
}
