'use client';

import { useRef } from 'react';

import {
  CardActions,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuList from '@mui/material/MenuList';

import { useBoolean } from 'src/hooks/use-boolean';

import { ActionStep, TopActions } from 'src/lib/actions';

import { Iconify } from 'src/components/iconify';

type Props = {
  item: ActionStep;
  variant?: 'default' | 'rounded';
  onAdd?: (order: number, action?: string | null) => void;
};

const ReservedWorkflowItem: React.FC<Props> = ({ item, onAdd }: Props) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const openMenu = useBoolean();
  const handleToggle = () => {
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

  return (
    <>
      <Card>
        <CardContent>{item.name}</CardContent>

        <CardActions>{item.description}</CardActions>
      </Card>
      {onAdd && (
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
          </Popper>
        </Stack>
      )}
    </>
  );
};

export default ReservedWorkflowItem;
