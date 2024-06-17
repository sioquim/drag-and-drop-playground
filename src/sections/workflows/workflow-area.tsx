'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import Box from '@mui/material/Box';

type Props = React.PropsWithChildren & {
  id: string;
};

const WorkflowArea: React.FC<Props> = ({ children, id }: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    opacity: isOver ? 1 : 0.5,
  };

  return (
    <Box ref={setNodeRef} sx={{ style }}>
      {children}
    </Box>
  );
};

export default WorkflowArea;
