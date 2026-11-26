export const listingStatuses = [
    { label: 'Draft', value: 'draft' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Sold', value: 'sold' },
    { label: 'Rented', value: 'rented' },
    { label: 'Withdrawn', value: 'withdrawn' },
    { label: 'Expired', value: 'expired' },
];

export type ListingStatus =
    | 'draft'
    | 'active'
    | 'pending'
    | 'sold'
    | 'rented'
    | 'withdrawn'
    | 'expired';

export const listingStatusStyles: Record<ListingStatus, string> = {
    draft: 'text-yellow-600 bg-yellow-200',
    active: 'text-green-600 bg-green-200',
    pending: 'text-orange-600 bg-orange-200',
    sold: 'text-blue-600 bg-blue-200',
    rented: 'text-purple-600 bg-purple-200',
    withdrawn: 'text-gray-600 bg-gray-200',
    expired: 'text-red-600 bg-red-200',
};
