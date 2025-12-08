import './App.css'
import { Grid } from '@mui/material'
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './functions/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';

function App() {

  const { data, loading, error } = useFetchData();

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
        Elemento: Encabezado
      </Grid>

      {/* Alertas */}
      <Grid size={12} container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias" />
        Elemento: Alertas
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}>
        <SelectorUI />
        Elemento: Selector
      </Grid>

      {/* Loading */}
      {loading && (
        <Grid size={12}>
          <p>Cargando datos...</p>
        </Grid>
      )}

      {/* Error */}
      {error && (
        <Grid size={12}>
          <p>Error al cargar datos: {error}</p>
        </Grid>
      )}

      {/* Indicadores */}
      {data && (
        <Grid container size={{ xs: 12, md: 9 }} >

          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Temperatura (2m)'
              description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Temperatura Aparente'
              description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Humedad Relativa (2m)'
              description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <IndicatorUI
              title='Velocidad del Viento (10m)'
              description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`}
            />
          </Grid>

        </Grid>
      )}

      {/* Gráfico */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>
        <ChartUI />
        Elemento: Gráfico
      </Grid>

      {/* Tabla */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>
        <TableUI />
        Elemento: Tabla
      </Grid>

      {/* Información adicional */}
      <Grid>Elemento: Información adicional</Grid>

    </Grid>
  );
}

export default App;
