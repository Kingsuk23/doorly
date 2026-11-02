import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroPin } from '@/constants/heroPin';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface PropertyPopupCardProps {
    pin: HeroPin;
}

const PropertyPopupCard: React.FC<PropertyPopupCardProps> = ({ pin }) => {
    return (
        <Card className="p-2 gap-2">
            <CardHeader className="relative aspect-video w-50 overflow-hidden rounded-lg">
                <Image
                    src={pin.image}
                    alt={pin.title}
                    sizes="200px"
                    fill
                    className="object-cover"
                />
            </CardHeader>
            <CardContent className="p-0 space-y-1">
                <CardTitle className="font-semibold text-black">
                    {pin.title}
                </CardTitle>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {pin.city}
                </p>
                <p className="text-xs text-muted-foreground">
                    {pin.sqft} sq.ft · {pin.beds} bed · {pin.baths} bath
                </p>

                <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold">
                        ${pin.price.toLocaleString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default PropertyPopupCard;
