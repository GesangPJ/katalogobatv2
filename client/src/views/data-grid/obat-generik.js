import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import id from 'dayjs/locale/id'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'

dayjs.locale(id)

require('dotenv').config()

const AksesKunci = process.env.NEXT_PUBLIC_SECRET_API_KEY
const headers = { 'Key-Api': process.env.NEXT_PUBLIC_SECRET_API_KEY, }

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

// SSR Biar bisa ambil data waktu production build
export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`, {
    headers: headers,
  })
  const data = await response.json()

  return {
    props: {
      data,
    },
    revalidate: 5, // ambil setiap X detik
  }
}

const columns = [
  { field: 'id', headerName: 'No.', width: 50 },
  {
    field: 'namaobat',
    headerName: 'Nama Obat',
    width: 180,
    editable: true,
  },
  {
    field: 'kategori',
    headerName: 'Kategori',
    width: 120,
    editable: true,
  },
  {
    field: 'manfaat',
    headerName: 'Manfaat Utama',
    width: 80,
    editable: true,
  },
  {
    field: 'bentuk',
    headerName: 'Bentuk',
    width: 120,
    align: 'left',
    editable: true,
  },
  {
    field: 'detail',
    headerName: 'Detail',
    width: 90,
    editable: true,
  },
]

const ObatGenerik = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalbentuk, setTotalbentuk] = useState(0)
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`, {
          headers: headers,
        })
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else if (response.status === 403) {
          const router = useRouter()
          router.push('/401')
        } else {
          console.error('Error mengambil dashboard admin.')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {

    return <div>Loading...</div>
  }

  if (data.length === 0) {
    // Handle the case when there are no data
    return <Alert severity="info">No data available.</Alert>
  }

  const rows = data.map((row, index) => ({
    id: row.id_request || `row-${index}`,
    namaobat: row.namaobat,
    kategori: row.kategori,
    manfaat: row.manfaat,
    bentuk: row.bentuk,
  }))

  return (
    <div>
      <Box sx={{ height: 660, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}

        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </div>

  )
}

export default ObatGenerik
