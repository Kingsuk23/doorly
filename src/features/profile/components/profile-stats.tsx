import { Stat } from '../types';

const ProfileStats = ({ stats }: { stats: Stat[] }) => {
    return (
        <div className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-muted/30">
            {stats.map((s) => (
                <div key={s.label} className="px-4 py-3 text-center">
                    <p className="text-xl font-semibold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
            ))}
        </div>
    );
};

export default ProfileStats;
