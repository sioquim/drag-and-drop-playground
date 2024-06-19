'use client';

import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { Card, Button, CardHeader, CardActions, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export interface DataItem {
  uuid: string;
  description: string;
  unitPrice: number;
  quantity: number;
}

type Props = {
  items: DataItem[];
};

const WorkflowItems: React.FC<Props> = ({ items }: Props) => {
  const [value, setValue] = useState('settings');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Settings" value="settings" />
            <Tab label="Actions" value="actions" />
          </TabList>
        </Box>
        <TabPanel value="settings">Settings</TabPanel>
        <TabPanel value="actions">
          <Card>
            <CardHeader title="Collect Info" />
            <CardContent>Work</CardContent>

            <CardActions>
              <Button startIcon={<Iconify icon="solar:add-circle-line-duotone" width={24} />}>
                Use
              </Button>
            </CardActions>
          </Card>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default WorkflowItems;
