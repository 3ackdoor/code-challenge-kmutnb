const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

const ticketRepository = require("./models/ticket.repository")

app.use(express.json())
app.use(cors())

mongoose
  .connect("mongodb://localhost:27017/ticket-blackpink", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))

app.get("/", (req, res) => {
  res
    .json({ message: "Hello!" })
    .status(200)
    .end()
})

app.get("/show", async (req, res) => {
  const result = await ticketRepository.find()
  res
    .json({ message: result })
    .status(200)
    .end()
})

app.post("/add", async (req, res) => {
  const payload = req.body
  const ticket = new ticketRepository(payload)

  await ticket.save().then(() => console.log("create !!!!"))
  res
    .json({
      payload,
    })
    .status(200)
    .end()
})

app.post("/get-ticket", async (req, res) => {
  const amount = await ticketRepository.findOneAndUpdate(
    { quantity: { $gt: 0 } },
    { $inc: { quantity: -1, ticketNumber: 1 } },
    { new: true, useFindAndModify: false }
  )

  if (!amount)
    return res.status(404).json({
      status: "error",
      message: "SOLD_OUT",
    })

  await amount.save().then(() => console.log("get ticket success!!!"))

  const zeroPad = (num, places) => String(num).padStart(places, "0")

  res.json({
    ticketNumber: `BP${zeroPad(amount.ticketNumber, 4)}`,
  })
})

app.listen(9000, () => {
  console.log("Application is running on port 9000")
})
