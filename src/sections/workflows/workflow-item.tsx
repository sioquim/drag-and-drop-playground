'use client';

import { useRef } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import Card from '@mui/material/Card';
import MenuList from '@mui/material/MenuList';
import CardContent from '@mui/material/CardContent';
import {
  Grow,
  Stack,
  Paper,
  Popper,
  MenuItem,
  IconButton,
  CardActions,
  ClickAwayListener,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { TopActions } from 'src/lib/actions';

import { Iconify } from 'src/components/iconify';

type Props = {
  item: { title: string; id: string };
};

const WorkflowItem: React.FC<Props> = ({ item }: Props) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const openMenu = useBoolean();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? '0.5' : 1,
    bgcolor: 'background.neutral',
  };
  const handleToggle = () => {
    console.log('entered here>>>');
    openMenu.onTrue();
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    openMenu.onFalse();
  };
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      openMenu.onFalse();
    } else if (event.key === 'Escape') {
      openMenu.onFalse();
    }
  };

  /* 
  {
    <AnimatePresence>
          {shadow.value && (
            <m.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Skeleton
                sx={{
                  width: '100%',
                  height: '128px',
                  bgcolor: 'background.paper',
                }}
              />
            </m.div>
          )}
        </AnimatePresence>
  }
 */
  return (
    <>
      <Card ref={setNodeRef} sx={style} {...attributes}>
        <CardContent {...listeners} sx={{ cursor: 'move' }}>
          {item.title}
        </CardContent>

        <CardActions>asd</CardActions>
      </Card>
      <Stack spacing={4} direction="row" justifyContent="center" sx={{ width: '100%' }}>
        <IconButton ref={anchorRef} onClick={handleToggle}>
          <Iconify icon="solar:add-circle-line-duotone" width={24} />
        </IconButton>
        <Popper
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
                    {TopActions.map((action) => (
                      <MenuItem key={action}>{action}</MenuItem>
                    ))}
                    <MenuItem>More...</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    </>
  );
};

export default WorkflowItem;
