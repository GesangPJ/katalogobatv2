// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormAdmin from 'src/views/tambah-admin'

const RegisterAdminPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormAdmin/>
      </Grid>
    </Grid>
  )
}

export default RegisterAdminPage
