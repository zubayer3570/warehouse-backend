//requires
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb')
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())
//port
const port = process.env.PORT || 5000
//root get request
app.get('/', (req, res) => {
    res.send('server is working fine')
})
//mongodb
const uri = `mongodb+srv://database-user-1:databaseofzubayer@cluster0.1f3iy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri)
const run = () => {
    try {
        client.connect()
        app.get('/items', async (req, res) => {
            const collection = client.db('warehouse').collection('car-collection')
            const cursor = collection.find({})
            const cars = await cursor.toArray()
            res.send(cursor)
        })
    } finally {

    }
}
run()
//listen
app.listen(port)