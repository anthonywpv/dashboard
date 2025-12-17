import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { MapPin } from 'lucide-react'; // Usamos iconos modernos

export interface CityConfig {
    name: string;
    lat: number;
    lon: number;
}

const CITIES: Record<string, CityConfig> = {
    guayaquil: { name: "Guayaquil", lat: -2.1962, lon: -79.8862 },
    quito: { name: "Quito", lat: -0.1807, lon: -78.4678 },
    manta: { name: "Manta", lat: -0.9621, lon: -80.7127 },
    cuenca: { name: "Cuenca", lat: -2.9001, lon: -79.0059 },
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
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ 
                position: 'absolute', 
                left: '20px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 10,
                color: 'var(--color-primary)',
                pointerEvents: 'none' 
            }}>
                <MapPin size={24} />
            </div>

            <Select
                value={selectedKey}
                onChange={handleChange}
                displayEmpty
                sx={{
                    width: '100%',
                    borderRadius: '16px', 
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-dark)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    paddingLeft: '35px', 
                    boxShadow: '0 8px 20px -5px rgba(31, 189, 237, 0.25)', 
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    
                    '&:hover': {
                        backgroundColor: '#ffffff',
                        boxShadow: '0 10px 25px -5px rgba(31, 189, 237, 0.4)',
                        transform: 'translateY(-2px)'
                    },
                    
                    '&.Mui-focused': {
                        border: '2px solid var(--color-primary)',
                        boxShadow: '0 0 0 4px var(--color-highlight)', 
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: '16px',
                            marginTop: '8px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            '& .MuiMenuItem-root': {
                                padding: '12px 20px',
                                fontSize: '1rem',
                                color: 'var(--text-muted)',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-body-start)',
                                    color: 'var(--color-primary)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--color-highlight)',
                                    color: 'var(--text-dark)',
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    }
                }}
            >
                {Object.keys(CITIES).map((key) => (
                    <MenuItem key={key} value={key}>
                        {CITIES[key].name}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}