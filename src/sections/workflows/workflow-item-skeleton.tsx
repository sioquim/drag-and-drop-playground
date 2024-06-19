'use client';

import { Stack, Skeleton } from '@mui/material';

const WorkflowItemSkeleton: React.FC = () => (
  <Stack spacing={1}>
    <Skeleton width="100%" height={64} />
    <Stack justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
      <Skeleton height={24} width={24} variant="circular" />
    </Stack>
  </Stack>
);

export default WorkflowItemSkeleton;
