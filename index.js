//requires
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb')
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
const uri = `mongodb+srv://database-user-1:${process.env.DATABASE_PASSWORD}@cluster0.1f3iy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri)
const run = () => {
    try {
        client.connect()
        const collection = client.db('watch-geek').collection('watches')
        //get
        app.get('/items/:amount', async (req, res) => {
            const amount = req.params.amount
            if (amount === 'all') {
                cursor = collection.find({})
            } else {
                cursor = collection.find({}).limit(parseInt(amount))
            }
            const cars = await cursor.toArray()
            res.send(cars)
        })
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const result = await collection.findOne(query)
            res.send(result)
        })
        //post
        app.post('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: ObjectId(id)
            }
            const itemToUpdate = await collection.findOne(query)
            const result = await collection.updateOne(query, {
                $set: { quantity: itemToUpdate.quantity - 1 }
            })
            res.send(result)

        })
        app.post('/restock', async (req, res) => {
            const { increaseBy, id } = req.body
            const query = { _id: ObjectId(id) }
            const item = await collection.findOne(query)
            const newQuantity = item.quantity + parseInt(increaseBy)
            await collection.updateOne(query, {
                $set: { quantity: newQuantity }
            })
            res.send({})
        })
        app.post('/delete', async (req, res) => {
            const query = {
                _id: ObjectId(req.body.id)
            }
            await collection.deleteOne(query)
        })
        app.post('/add-item', async (req, res) => {
            const { doc } = req.body;
            await collection.insertOne(doc)
        })
        app.post('/my-items', async (req, res) => {
            const { email } = req.body;
            const query = { email }
            const cursor = collection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/login', (req, res) => {
            const email = req.body;
            const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, {
                expiresIn: '1h'
            })
            res.send({ accessToken })
        })
    } finally { }
}
run()
//listen
app.listen(port)