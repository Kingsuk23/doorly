import { getAgent } from '@/features/agent/actions/agent-actions';
import DesktopNav from './desktop/desktop-nav';
import MobileNav from './mobile/mobile-nav';

const NavbarActions = async () => {
    const result = await getAgent();
    const agentId = result.success ? (result.data?.agent.id ?? null) : null;

    return (
        <>
            <DesktopNav agentId={agentId} />
            <MobileNav agentId={agentId} />
        </>
    );
};

export default NavbarActions;
