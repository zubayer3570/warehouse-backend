//requires
const express = require('express')
const app = express()
const cors = require('cors')
//middleware
app.use(cors())
app.use(express.json())
//port
const port = process.env.PORT || 5000
//root get request
app.get('/', (req, res) => {
    res.send('server is working fine')
})
//listen
app.listen(port)