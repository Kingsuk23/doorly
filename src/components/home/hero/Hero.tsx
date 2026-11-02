import HeroHeader from './HeroHeader';
import HeroMap from './HeroMap';
import HeroSearchBar from './HeroSearchBar';

const Hero = () => {
    return (
        <section className="relative isolate min-h-screen overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <HeroMap />
                <div className="absolute inset-0 bg-linear-to-b from-white via-white/70 to-transparent" />
            </div>
            <div className="max-w-3xl mx-auto pt-16 text-center md:px-4 p-2">
                <HeroHeader />
                <HeroSearchBar />
            </div>
        </section>
    );
};

export default Hero;
