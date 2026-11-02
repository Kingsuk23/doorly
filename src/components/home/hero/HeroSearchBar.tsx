'use client';

import FilterSelect from '@/components/common/FilterSelect';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    getPriceRange,
    SALE_PRICE_FILTER_OPTIONS,
    SALE_PRICE_RANGES,
} from '@/constants/priceRanges';
import { PROPERTY_TYPE_FILTER_OPTIONS } from '@/constants/propertyTypes';
import { SearchFilters, serialize } from '@/lib/search-params';
import { LoaderCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface HeroSearchValues {
    location: string;
    property_type: SearchFilters['property_type'];
    budget: string;
}

const HeroSearchBar = () => {
    const route = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<HeroSearchValues>({
        defaultValues: { property_type: 'all', budget: 'all', location: '' },
    });

    const onSubmit: SubmitHandler<HeroSearchValues> = async ({
        budget,
        location,
        property_type,
    }) => {
        const { max, min } = getPriceRange(budget, SALE_PRICE_RANGES);

        const url = serialize(`/location/${location}`, {
            min_price: min,
            mix_price: max,
            property_type,
        });

        route.push(url);
    };
    return (
        <form
            className="mx-auto mt-8 flex md:gap-2 gap-4 md:p-2 p-4 rounded-md shadow-lg items-end md:flex-row flex-col bg-white"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2 flex-1 w-full">
                <Label htmlFor="location" className="text-muted-foreground">
                    Location
                </Label>
                <Input
                    placeholder="Street, City, Zipcode"
                    className="py-2"
                    {...register('location')}
                />
            </div>
            <Divider className="hidden md:block" />
            <div className="flex flex-col gap-2 md:w-30 w-full">
                <Label
                    htmlFor="property-type"
                    className="text-muted-foreground"
                >
                    Property
                </Label>
                <Controller
                    control={control}
                    name="property_type"
                    render={({ field }) => (
                        <FilterSelect
                            options={PROPERTY_TYPE_FILTER_OPTIONS}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                            ariaLabel="property_type"
                            triggerProps={{ id: 'property_type' }}
                        />
                    )}
                />
            </div>
            <Divider className="hidden md:block" />
            <div className="flex flex-col gap-2 md:w-30 w-full">
                <Label htmlFor="budget" className="text-muted-foreground">
                    Budget
                </Label>
                <Controller
                    control={control}
                    name="budget"
                    render={({ field }) => (
                        <FilterSelect
                            options={SALE_PRICE_FILTER_OPTIONS}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                            ariaLabel="budget"
                            triggerProps={{ id: 'budget' }}
                        />
                    )}
                />
            </div>

            <Button
                size="icon-lg"
                type="submit"
                className="max-md:w-full gap-2"
            >
                <span className="md:hidden">Search</span>
                {isSubmitting ? (
                    <LoaderCircle className="animate-spin max-md:hidden" />
                ) : (
                    <Search className="max-md:hidden" />
                )}
            </Button>
        </form>
    );
};

export default HeroSearchBar;
