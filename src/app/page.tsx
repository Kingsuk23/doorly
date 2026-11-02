import FeaturedProperties from '@/components/featured-properties/FeaturedProperties';
import Hero from '@/components/home/hero/Hero';

const Home = () => {
    return (
        <main className="max-w-7xl mx-auto flex flex-col justify-between">
            <Hero />
            <FeaturedProperties />
        </main>
    );
};

export default Home;
