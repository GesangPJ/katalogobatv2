// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import ObatHerbal from 'src/views/data-grid/obat-herbal'

const DataGridGenerik = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography variant='h5'>
          <Link href=''>
            Obat Herbal
          </Link>
        </Typography>
        <Typography variant='body2'></Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='' titleTypographyProps={{ variant: 'h6' }} />
          <ObatHerbal />
        </Card>
      </Grid>
    </Grid>
  )
}

export default DataGridGenerik
