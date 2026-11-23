import { serve } from 'inngest/next';

import { sendAgentInviteEmail } from '@/lib/inngest/function';
import { inngest } from '@/lib/inngest/inngest-client';

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [sendAgentInviteEmail],
});
