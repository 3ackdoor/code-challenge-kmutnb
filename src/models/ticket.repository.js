const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ticketsSchema = new Schema({
  name: String,
  quantity: Number,
  ticketNumber: Number,
})

const ticketModel = mongoose.model("Ticket", ticketsSchema)

module.exports = ticketModel
