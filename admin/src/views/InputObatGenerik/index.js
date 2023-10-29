import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'

const FormObatGenerik = () => {
  const [namaobat, setnamaobat] = useState('')
  const [kategori, setkategori] = useState('')
  const [formula, setFormula] = useState('')
  const [manfaat, setmanfaat] = useState('')
  const [bentuk, setbentuk] = useState('')
  const [peringatan, setperingatan] = useState('')
  const [deskripsi, setdeskripsi] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleFormulaChange = (e) => setFormula(e.target.value)
  const handlenamaobatChange = (e) => setnamaobat(e.target.value)
  const handlekategoriChange = (e) => setkategori(e.target.value)
  const handlemanfaatChange = (e) => setmanfaat(e.target.value)
  const handlebentukChange = (e) => setbentuk(e.target.value)
  const handleperingatanChange = (e) => setperingatan(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create an object with all the input data
    const obatData = {
      namaobat,
      kategori,
      manfaat,
      bentuk,
      peringatan,
      deskripsi,
      formula,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tambah-obat-generik`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Key-Api': process.env.NEXT_PUBLIC_SECRET_API_KEY,
        },
        body: JSON.stringify(obatData),
      })

      if (response.ok) {
        // Data sukses ditambah ke MongoDB
        // Popup sukses dan hapus input field
        setSuccessMessage(`Obat ${namaobat} berhasil ditambahkan.`)
        setnamaobat('')
        setkategori('')
        setFormula('')
        setmanfaat('')
        setbentuk('')
        setperingatan('')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      } else {
        // Kalo Error
        console.error('Error adding obat.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Card>
      <CardHeader title='Form Tambah Obat Generik' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Nama Obat'
                name='namaobat'
                placeholder='Nama Obat'
                helperText='Masukkan Nama Obat'
                value={namaobat}
                onChange={handlenamaobatChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='kategori'
                name='kategori'
                placeholder='kategori'
                helperText='Masukkan kategori Obat'
                value={kategori}
                onChange={handlekategoriChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Formula'
                name='formula'
                placeholder='Formula'
                helperText='Masukkan Formula Obat'
                value={formula}
                onChange={handleFormulaChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Manfaat Utama'
                name='manfaat'
                placeholder='Manfaat Utama'
                helperText='Masukkan Manfaat utama obat'
                value={manfaat}
                onChange={handlemanfaatChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Bentuk Obat'
                name='bentuk'
                placeholder='Bentuk Obat'
                helperText='Masukkan berbagai bentuk obat yang beredar'
                value={manfaat}
                onChange={handlebentukChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Peringatan'
                name='peringatan'
                placeholder='Masukkan peringatan atau detail mengenai Obat'
                value={peringatan}
                onChange={handleperingatanChange}
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Deskripsi'
                name='deskripsi'
                placeholder='Masukkan deskripsi obat'
                value={peringatan}
                onChange={handledeskripsiChange}
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Tambah Obat
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default FormObatGenerik
