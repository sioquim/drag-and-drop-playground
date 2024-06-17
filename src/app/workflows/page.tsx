import { CONFIG } from 'src/config-global';

import { WorkflowsView } from 'src/sections/workflows/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Coming soon - ${CONFIG.site.name}` };

export default function Page() {
  return <WorkflowsView />;
}
