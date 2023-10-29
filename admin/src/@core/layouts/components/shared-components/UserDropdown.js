// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'

require('dotenv').config()

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState({ nama: '' })
  const [admin, setAdmin] = useState({ nama: '' })
  const router = useRouter()

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const [sessionData, setSessionData] = useState(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      // Ambil SessionData dari Session Storage
      const sessionDataStr = sessionStorage.getItem('sessionData')
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        setSessionData(sessionData)
      }
    }
    fetchSessionData()
  }, [])



  // Fungsi Tombol Logout
  const handleLogout = async () => {
    const id_akun = sessionData.id_akun
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/keluar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_akun }) // Pass id_akun as an object
      })
      if (response.ok) {
        // hapus session storage saat logout
        sessionStorage.clear()
        // Arahkan ke login
        router.push('/')
        console.log(`Akun ${id_akun} Berhasil keluar`)
      } else {
        console.log(`Error Keluar, cek server`)
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
    setAnchorEl(null); // tutup dropdown
  }

  return (
    <Fragment>

    </Fragment>
  )
}

export default UserDropdown
