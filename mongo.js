const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://grumpycat:${password}@fullstackopen2020.sacd5.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log('give password as argument')
  // eslint-disable-next-line no-undef
  process.exit(1)
}
if (process.argv.length === 3) {
  Person.find().then((result) => {
    console.log('phonebook:')
    for (let person of result) {
      console.log(person.name, person.number)
    }
    mongoose.connection.close()
    // eslint-disable-next-line no-undef
    process.exit(1)
  })
}
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
  const person = new Person({
    // eslint-disable-next-line no-undef
    name: process.argv[3],
    // eslint-disable-next-line no-undef
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(
      // eslint-disable-next-line no-undef
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    )
    mongoose.connection.close()
    // eslint-disable-next-line no-undef
    process.exit(1)
  })
}

// eslint-disable-next-line no-undef
if (process.argv.length > 5 || process.argv.length === 4) {
  console.log('pls read the instructions:D')
  // eslint-disable-next-line no-undef
  process.exit(1)
}
