// ** Icon imports
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

const navigation = () => {
  return [
    {
      sectionTitle: 'Data Obat'
    },
    {
      title: 'Obat Generik',
      icon: MedicationOutlinedIcon,
      path: '/obat-generik'
    },
    {
      title: 'Obat Herbal',
      icon: SpaOutlinedIcon,
      path: '/obat-herbal'
    },
    {
      sectionTitle: 'Admin'
    },
    {
      title: 'Tambah Obat Generik',
      icon: AddCircleOutlineOutlinedIcon ,
      path:'/tambah-obat-generik'
    },
    {
      title: 'Tambah Obat Herbal',
      icon: AddCircleOutlineOutlinedIcon ,
      path:'/tambah-obat-herbal'
    }
  ]
}

export default navigation
