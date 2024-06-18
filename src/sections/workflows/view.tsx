'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { useVapiSession } from 'src/hooks/use-vapi-session';

import { addSteps, getStepsBySessionKey } from 'src/actions/steps';
import { ActionStep, InsertActionStep } from 'src/lib/actions';
import ReservedWorkflowItem from './reserved-work-item';
import WorkflowItem from './workflow-item';

export function WorkflowsView() {
  const sessionId = useVapiSession();
  const [steps, setSteps] = useState<ActionStep[]>([]);
  console.log('🚀 ~ WorkflowsView ~ steps:', steps);
  const [activeStep, setActiveStep] = useState<ActionStep | null>(null);

  useEffect(() => {
    const initialiseSteps = async (key: string) => {
      const existingData = await getStepsBySessionKey(key);
      if (!existingData) {
        await addSteps(
          key,
          [
            {
              name: 'Start',
              description: 'Start of the workflow',
              order: 0,
              metadata: {},
            },
            {
              name: 'First Step',
              description: 'Start of the workflow',
              order: 1,
              metadata: {},
            },
            {
              name: 'End',
              description: 'End of the workflow',
              order: null,
              metadata: {},
            },
          ],
          '/'
        );
      }
      const newSteps = await getStepsBySessionKey(key);
      setSteps(newSteps || []);
    };

    if (sessionId) {
      initialiseSteps(sessionId);
    }
  }, [sessionId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    console.log('🚀 ~ handleDragStart ~ active:', active);
    const selectedStep = steps.find((step) => step.id === active.id);
    if (selectedStep) {
      setActiveStep(selectedStep);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    console.log('🚀 ~ handleDragEnd ~ over:', over);
    console.log('🚀 ~ handleDragEnd ~ active:', active);

    if (active?.id && over?.id && active?.id !== over?.id) {
      setSteps((currentSteps) => {
        const oldIndex = currentSteps.findIndex((step) => step.id === active.id);
        const newIndex = currentSteps.findIndex((step) => step.id === over.id);

        return arrayMove(currentSteps, oldIndex, newIndex);
      });
    }

    setActiveStep(null);
  };

  const handleAddStep = async (order: number, stepName: string | null | undefined) => {
    if (sessionId) {
      const newStep: InsertActionStep = {
        name: stepName || `Step ${steps.length + 1}`,
        description: 'Description of the new step',
        order: order + 0.5,
        metadata: {},
      };
      const updatedSteps = await addSteps(sessionId, [newStep], '/');
      setSteps(updatedSteps);
    }
  };
  const [start, ...remainingStepsWithEnd] = steps;
  const end = remainingStepsWithEnd.pop(); // Remove the last element which should be 'end'
  const remainingSteps = remainingStepsWithEnd;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
                      {start && <ReservedWorkflowItem item={start} onAdd={handleAddStep} />}
                    </TimelineContent>
                  </TimelineItem>
                  {remainingSteps.map((step, index) => (
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
                  ))}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineConnector sx={{ opacity: 1 }} />
                      <TimelineDot />
                      <TimelineConnector sx={{ opacity: 0 }} />
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 4, pb: 0 }}>
                      {end && <ReservedWorkflowItem item={end} />}
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
        <Grid xs={4}>test</Grid>
      </Grid>
    </DndContext>
  );
}
