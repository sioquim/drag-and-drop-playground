'use client';

import { forwardRef } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const WorkflowItemRef = forwardRef(({ item, ...props }: any, ref) => (
  <Card ref={ref} {...props}>
    <CardContent>{item.title}</CardContent>
  </Card>
));

export default WorkflowItemRef;
