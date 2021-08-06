const express = require('express')
const cors = require('cors')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('coffeebuddy')

const app = express()
const port = 4000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/order', (req, res) => {
  console.log(req.body)
  const time = Date.now()
  const hash = hashids.encode(time)
  const url = `http://localhost:${port}/${req.body.coffee}-${req.body.milk}/${hash}`
  console.log('time',time)
  console.log('hash',hash)
  res.json({
    url: url
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})