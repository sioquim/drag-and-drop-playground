'use client';

import { useState } from 'react';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  PointerSensor,
  closestCenter,
  KeyboardSensor,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import WorkflowItem from './workflow-item';
import WorkflowItems from './workflow-items';

export interface DataItem {
  id: string;
  description: string;
  unitPrice: number;
  quantity: number;
}

export function WorkflowsView() {
  const [activeItem, setActiveItem] = useState<{ title: string; id: string } | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [items, setItems] = useState([
    { title: 'Test 1', id: '1' },
    { title: 'Test 2', id: '2' },
    {
      title: 'Test 3',
      id: '3',
    },
  ]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const selectedItem = items.find((item) => item.id === active.id);
    if (selectedItem) {
      setActiveItem(selectedItem);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active?.id && over?.id && active?.id !== over?.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);

        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
  };

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
        <Grid xs={8} sx={{ borderRight: `1px dashed`, borderColor: 'divider' }}>
          <Container maxWidth="xs">
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <Stack spacing={4}>
                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  {items.map((item, index) => (
                    <TimelineItem key={item.id}>
                      <TimelineSeparator>
                        <TimelineConnector sx={{ opacity: index ? 1 : 0 }} />
                        <TimelineDot />
                        <TimelineConnector
                          sx={{ opacity: items?.length && items.length - 1 === index ? 0 : 1 }}
                        />
                      </TimelineSeparator>
                      <TimelineContent sx={{ pt: 4, pb: 0 }}>
                        <WorkflowItem item={item} />
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Stack>
            </SortableContext>
            <DragOverlay>{activeItem ? <WorkflowItem item={activeItem} /> : null}</DragOverlay>
          </Container>
        </Grid>
        <Grid xs={4}>
          <WorkflowItems items={[]} />
        </Grid>
      </Grid>
    </DndContext>
  );
}
