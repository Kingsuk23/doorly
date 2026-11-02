import { HeroPin } from '@/constants/heroPin';
import Image from 'next/image';

interface MapPinProps {
    pin: HeroPin;
}

const MapPin: React.FC<MapPinProps> = ({ pin }) => {
    return (
        <button
            aria-label={pin.title}
            className="size-8 overflow-hidden rounded-full border-2 border-white shadow-md transition hover:scale-110 cursor-pointer"
        >
            <Image
                src={pin.image}
                alt={pin.title}
                width={32}
                height={32}
                className="size-full object-cover"
            />
        </button>
    );
};

export default MapPin;
