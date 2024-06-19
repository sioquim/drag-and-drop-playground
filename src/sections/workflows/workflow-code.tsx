import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import type { WorkflowContextProps } from 'src/components/workflow/context';
import { WorkflowContext } from 'src/components/workflow/context';

import beautify from 'json-beautify';
import { Iconify } from 'src/components/iconify';
import { Container } from '@mui/material';
import { Markdown } from 'src/components/markdown';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { toast } from 'sonner';
import { useMemo, useState, useContext, useCallback } from 'react';

export default function WorkflowCode() {
  const [open, setOpen] = useState(false);
  const { copy } = useCopyToClipboard();

  const workflowContext = useContext(WorkflowContext);
  const { steps } = workflowContext as WorkflowContextProps;

  const onCopy = useCallback(
    (text: string) => {
      if (text) {
        toast.success('Copied!');
        copy(text);
      }
    },
    [copy]
  );
  const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(inOpen);
  };

  const formattedSteps = useMemo(() => beautify(steps || [], null as any, 2, 100), [steps]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Button
        variant="outlined"
        onClick={toggleDrawer(true)}
        startIcon={<Iconify icon="solar:code-bold" width={24} />}
      >
        Code
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <Container maxWidth="md" sx={{ p: 4 }}>
            <Button
              onClick={() => onCopy(formattedSteps)}
              startIcon={<Iconify icon="eva:copy-fill" width={24} />}
              variant="outlined"
              size="small"
              sx={{ mb: 4 }}
            >
              Copy
            </Button>
            <Markdown
              children={`
<pre><code class="language-javascript">
${formattedSteps}</code></pre>
            `}
            />
          </Container>
        </Box>
      </Drawer>
    </Box>
  );
}
