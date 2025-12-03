import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

export default function useFetchData(): OpenMeteoResponse {
    const URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago';

    const [data, setData] = useState<OpenMeteoResponse | null>();

    useEffect(() => {
            const fetchData = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json: OpenMeteoResponse = await response.json(); 
        setData(json); 
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };
    fetchData();
     }, []); // El array vacío asegura que el efecto se ejecute solo una vez después del primer renderizado

    
    return data;

}