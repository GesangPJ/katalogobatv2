// ** Icon imports
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'

const navigation = () => {
  return [
    {
      sectionTitle: 'Data Obat'
    },
    {
      title: 'Obat Generik',
      icon: MedicationOutlinedIcon,
      path: '/'
    },
    {
      title: 'Obat Herbal',
      icon: SpaOutlinedIcon,
      path: '/obat-herbal'
    }
  ]
}

export default navigation
