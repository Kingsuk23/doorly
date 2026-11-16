export const HEATING_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'central', label: 'Central heating' },
    { value: 'forced_air', label: 'Forced air' },
    { value: 'heat_pump', label: 'Heat pump' },
    { value: 'radiant', label: 'Radiant' },
    { value: 'electric', label: 'Electric heater' },
    { value: 'gas', label: 'Gas heater' },
    { value: 'solar', label: 'Solar water heating' },
    { value: 'other', label: 'Other' },
] as const;

export const COOLING_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'central_air', label: 'Central air' },
    { value: 'split_ac', label: 'Split AC' },
    { value: 'window_ac', label: 'Window AC' },
    { value: 'heat_pump', label: 'Heat pump' },
    { value: 'evaporative', label: 'Evaporative (desert) cooler' },
    { value: 'ceiling_fans', label: 'Ceiling fans only' },
    { value: 'other', label: 'Other' },
] as const;
