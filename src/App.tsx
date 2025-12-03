//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Grid } from '@mui/material'
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './functions/useFetchData';

function App() {
  //const [count, setCount] = useState(0)
  const dataFetcherOutput = useFetchData();

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}><HeaderUI />Elemento: Encabezado</Grid>

      {/* Alertas */}
      <Grid size={12} container justifyContent="right" alignItems="center"><AlertUI description="No se preveen lluvias" />Elemento: Alertas</Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}><SelectorUI />Elemento: Selector</Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        <Grid size={{ xs: 12, md: 3 }}>
          {dataFetcherOutput && <IndicatorUI title='Temperatura (2m)' description={`${dataFetcherOutput.current.temperature_2m} ${dataFetcherOutput.current_units.temperature_2m}`} />
          }</Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {dataFetcherOutput && <IndicatorUI title='Temperatura Aparente' description={`${dataFetcherOutput.current.apparent_temperature} ${dataFetcherOutput.current_units.apparent_temperature}`} />
          }</Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {dataFetcherOutput && <IndicatorUI title='Humedad Relativa (2m)' description={`${dataFetcherOutput.current.relative_humidity_2m} ${dataFetcherOutput.current_units.relative_humidity_2m}`} />
          }</Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {dataFetcherOutput && <IndicatorUI title='Velocidad del Viento (10m)' description={`${dataFetcherOutput.current.wind_speed_10m} ${dataFetcherOutput.current_units.wind_speed_10m}`} />
          }</Grid>
      </Grid>

      {/* Gráfico */}
      <Grid
        sx={{ display: { xs: "none", md: "block" } }}>Elemento: Gráfico</Grid>

      {/* Tabla */}
      <Grid
        sx={{ display: { xs: "none", md: "block" } }}
      >Elemento: Tabla</Grid>

      {/* Información adicional */}
      <Grid>Elemento: Información adicional</Grid>

    </Grid>
  )
}

export default App
