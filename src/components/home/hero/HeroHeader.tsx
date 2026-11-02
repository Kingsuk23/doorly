const HeroHeader = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">
                <span className="size-4 rounded-full bg-orange-500" />
                What is Doorly?
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Find a Home You&apos;ll Love
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground md:text-base">
                Search homes for sale and rent, save your favorites, and book
                tours with local agents.
            </p>
        </div>
    );
};

export default HeroHeader;
