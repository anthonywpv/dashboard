import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}


export default function ChartUI({ data, loading, error }: ChartUIProps) {

    if (loading) return <p>Cargando gráfico...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No hay datos para graficar</p>;

    const arrLabels = data.hourly.time;
    const arrValues1 = data.hourly.temperature_2m;
    const arrValues2 = data.hourly.wind_speed_10m;

    return (
        <>
            <Typography variant="h5" component="div">
                Horas vs Temperatura & Velocidad de Viento
            </Typography>
            <LineChart
                height={300}
                series={[
                    { data: arrValues1, label: 'value1' },
                    { data: arrValues2, label: 'value2' },
                ]}
                xAxis={[{ scaleType: 'point', data: arrLabels }]}
            />
        </>
    );
}