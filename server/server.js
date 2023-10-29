const express = require('express')
const { connectToMongoDB } = require('./mongoDB')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const logDirectory = 'logs'
const winston = require('winston')
const expressWinston = require('express-winston')
const session = require('express-session')
const dayjs = require('dayjs')
const path = require('path')
const PREFLIGHT = process.env.PREFLIGHT
dotenv.config()

const app = express()

// Menentukan izin akses ke server API
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: PREFLIGHT,
    optionsSuccessStatus: 204,
  }
  
app.use(cors(corsOptions))
app.use(express.json())

// Logging--------------------------------------------------------------------------------
const logsDirectory = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory)
}

const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')

const logFileName = path.join(logsDirectory, `Kasbon-backend-${timestamp}.log`)

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`
})

winston.configure({
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: logFileName }),
  ],
})

winston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      customFormat
    ),
  })
)

app.use(expressWinston.logger({
  winstonInstance: winston,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}))

app.use(expressWinston.errorLogger({
  winstonInstance: winston,
}))

app.use((err, req, res, next) => {
  // Handle errors and log them as needed
  winston.error(err.message, err)

  // Send an error response to the client
  res.status(500).json({ error: 'Internal Server Error' })
})

const logFileStream = fs.createWriteStream(logFileName, { flags: 'a' })
console.log = function (message) {
  const logMessage = `${dayjs().format()} [info]: ${message}`
  logFileStream.write(logMessage + '\n')
  winston.info(message) 
}

//---------------------------------------------------------------------------------------------------------

//Bcrypt cek password
const CekPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

// API Auth pakai API KEY
function CekAPIKey(req, res, next) {
    const apiKey = req.header('Key-Api')
  
    if (!apiKey) {
      return res.status(401).json({ error: 'Access Denied' })
    }
  
    // Cek apakah API Dari frontend sama 
    const validApiKey = process.env.API_ACCESS_KEY // Ambil API KEY Dari ENV
  
    // Jika Key tidak sama, larang akses
    if (apiKey !== validApiKey) {
      return res.status(403).json({ error: 'Access Denied' })
    }
  
    // Jika valid, lanjut
    next()
  }

// Cek Status koneksi MongoDB
app.get('/api/mongodb-status', CekAPIKey, async (req, res) => {
    try {
      // Cek koneksi ke MongoDB pake MongoDB Driver
      await connectToMongoDB() // Call the correct function to check MongoDB status
  
      // Respon status pake JSON
      res.json({ isConnected: true })
    } catch (error) {
      console.error('Error checking MongoDB status:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  
  // Kirim status server
app.get('/api/server-status', (req, res) => {
    res.json({ status: 'Online' })
})

// Ambil data obat generik dari MongoDB
app.get('/api/ambil-obat-generik', CekAPIKey, async (req, res) => {
    try {
        const db = await connectToMongoDB()
        const obatGenerikCollection = db.collection('obat_generik')
        const data = await obatGenerikCollection.find({}).toArray()
        res.json(data)
    } catch (error) {
        console.error('Error fetching obat generik data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Ambil data obat herbal dari MongoDB
app.get('/api/ambil-obat-herbal', CekAPIKey, async (req, res) => {
    try {
        const db = await connectToMongoDB()
        const obatHerbalCollection = db.collection('obat_herbal')
        const data = await obatHerbalCollection.find({}).toArray()
        res.json(data)
    } catch (error) {
        console.error('Error fetching obat herbal data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Kirim (POST) data obat_generik ke MongoDB
app.post('/api/tambah-obat-generik', CekAPIKey, async (req, res) => {
  
    const { namaobat, kategori, manfaat, bentuk, peringatan, formula, efeksamping } = req.body
  
    try {
      const db = await connectToMongoDB()
      const obatGenerikCollection = db.collection('obat_generik')
  
      // Masukkan data obat generik ke collection MongoDB
      await obatGenerikCollection.insertOne({ namaobat, kategori, manfaat, bentuk, peringatan, formula, efeksamping })
  
      res.status(201).json({ message: 'Obat generik berhasil ditambahkan' })
      console.log( `Obat Generik ${namaobat} Berhasil ditambahkan`)
    } catch (error) {
      console.error('Error adding obat:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Kirim (POST) data obat_herbal ke MongoDB
app.post('/api/tambah-obat-herbal', CekAPIKey, async (req, res) => {

    const { namaobat, namailmiah, kategori, manfaat, peringatan, efeksamping } = req.body
  
    try {
      const db = await connectToMongoDB()
      const obatHerbalCollection = db.collection('obat_herbal')
  
      // memasukkan data Obat Herbal ke Collection MongoDB
      await obatHerbalCollection.insertOne({ namaobat, namailmiah, kategori, manfaat, peringatan, efeksamping })
  
      res.status(201).json({ message: 'Obat herbal berhasil ditambahkan' })
      console.log( `Obat Herbal ${namaobat} Berhasil ditambahkan`)
    } catch (error) {
      console.error('Error adding obat herbal:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Tambah Akun
app.post('/api/tambah-akun', CekAPIKey, async (req, res) => {

    const { nama, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const db = await connectToMongoDB()
        const akunCollection = db.collection('akun')

        await akunCollection.insertOne({ nama, email, hashedPassword })

        res.status(201).json({ message: `Akun ${nama} berhasil ditambahkan` })
        console.log(`Akun ${nama} berhasil ditambahkan`)
    }
    catch (error) {
        res.status(500).json({ error: `Error Server tidak dapat menambahkan akun` })
        console.error(`Error Server tidak dapat menambahkan akun ${nama}`)
    }

})

  // Set Port buat server
const port = process.env.PORT || 3001
server.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`)

  await connectToMongoDB()

  server.on('connection', (socket) => {
    // Handle incoming connections
  })
})