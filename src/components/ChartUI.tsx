import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import useFetchData from '../functions/useFetchData';


export default function ChartUI() {

    const { data, loading, error } = useFetchData();

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No hay datos</p>;

    
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