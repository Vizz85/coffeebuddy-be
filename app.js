const express = require('express')
const cors = require('cors')
const storage = require('node-persist');
const Hashids = require('hashids/cjs')
const hashids = new Hashids('coffeebuddy')

const app = express()
const port = 4000

app.use(cors())
app.use(express.json());

const initStorage = async () => {
  await storage.init();
}

app.post('/order', async (req, res) => {
  console.log(req.body)
  const time = Date.now()
  const hash = hashids.encode(time)
  const url = `http://localhost:3000/${req.body.coffee}-${req.body.milk}/${hash}`
  console.log('time',time)
  console.log('hash',hash)

  const order = {
    url: url,
    valid: true
  }

  await storage.setItem(hash, order)

  res.json({
    url: url,
    hash: hash
  })
})

app.get('/confirm/:hash', async (req, res) => {
  console.log(req.params)
  const hash = req.params.hash

  const order = await storage.getItem(hash)

  if (order.valid) {
    order.valid = false
    await storage.setItem(hash, order)
    res.json({
      valid: true,
      msg: 'Coffee confirmed!'
    })
  } else {
    res.json({
      valid: false,
      msg: 'Order already taken or invalid'
    })
  }
})

app.get('/query/:hash', async (req, res) => {
  console.log(req.params)
  const hash = req.params.hash

  const order = await storage.getItem(hash)

  if (!order.valid) {
    res.json({
      confirmed: true
    })
  } else {
    res.json({
      confirmed: false
    })
  }
})

initStorage()

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})