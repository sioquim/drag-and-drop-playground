'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef, useContext } from 'react';

import { Stack, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { getActionIcon, type ActionStep } from 'src/lib/actions';

import { Iconify } from 'src/components/iconify';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';

type Props = {
  item: ActionStep;
  isDraggable: boolean;
  variant?: 'default' | 'rounded';
  onAdd?: (referenceStepId: string, action?: string | null) => void;
};

const WorkflowItem: React.FC<Props> = ({ item, isDraggable, onAdd }: Props) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const workflowContext = useContext(WorkflowContext);
  const { selectedStep } = workflowContext as WorkflowContextProps;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? '0.5' : 1,
    bgcolor: 'background.neutral',
  };
  const handleAdd = () => {
    onAdd?.(item.id, null);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        {...attributes}
        {...(isDraggable ? listeners : {})}
        sx={{
          ...style,
          cursor: isDraggable ? 'move' : 'default',
          border: (theme) =>
            selectedStep?.id === item.id ? `1px solid ${theme.palette.divider}` : undefined,
          bgcolor: (theme) =>
            selectedStep?.id === item.id ? theme.palette.primary.dark : undefined,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {item.type && (
              <Iconify width={24} icon={getActionIcon(item.type)} color="text.secondary" />
            )}
            <Stack>
              <Typography variant="caption">{item.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {item.type}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={4} direction="row" justifyContent="center" sx={{ width: '100%' }}>
        <IconButton ref={anchorRef} onClick={handleAdd}>
          <Iconify icon="solar:add-circle-line-duotone" width={24} />
        </IconButton>
        {/*  <Popper
          open={openMenu.value}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={openMenu.value}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {TopActions.map((action, index) => (
                      <MenuItem key={action} onClick={() => onAdd?.(index, action)}>
                        {action}
                      </MenuItem>
                    ))}
                    <MenuItem onClick={() => onAdd?.(TopActions.length - 1)}>More...</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper> */}
      </Stack>
    </>
  );
};

export default WorkflowItem;
