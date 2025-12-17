import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export interface CityConfig {
    name: string;
    latitude: number;
    longitude: number;
}

const CITIES: Record<string, CityConfig> = {
    guayaquil: { name: "Guayaquil", latitude: -2.170998, longitude: -79.922359 },
    quito: { name: "Quito", latitude: -0.180653, longitude: -78.467838 },
    manta: { name: "Manta", latitude: -0.947083, longitude: -80.708506 },
    cuenca: { name: "Cuenca", latitude: -2.90055, longitude: -79.00472 },
};

interface SelectorUIProps {
    onCityChange: (city: CityConfig) => void;
}

export default function SelectorUI({ onCityChange }: SelectorUIProps) {

    const [selectedKey, setSelectedKey] = useState('guayaquil');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const cityKey = event.target.value;
        setSelectedKey(cityKey);

        const cityConfig = CITIES[cityKey];
        if (cityConfig) {
            onCityChange(cityConfig);
        };
        }
        
        return (
            <FormControl fullWidth>
                <InputLabel id="city-select-label">Ciudad</InputLabel>
                <Select
                    labelId="city-select-label"
                    id="city-simple-select"
                    label="Ciudad"
                    onChange={handleChange}
                    value={selectedKey}>
                    <MenuItem value="" disabled><em>Seleccione una ciudad</em></MenuItem>
                    <MenuItem value={"guayaquil"}>Guayaquil</MenuItem>
                    <MenuItem value={"quito"}>Quito</MenuItem>
                    <MenuItem value={"manta"}>Manta</MenuItem>
                    <MenuItem value={"cuenca"}>Cuenca</MenuItem>
                </Select>
            </FormControl>
        );
};