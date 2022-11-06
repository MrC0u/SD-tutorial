const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Sleep

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Kafka

const { Kafka } = require('kafkajs')
const { Partitioners } = require('kafkajs')
const regiones = ["Asia","Europa","America"]
const success = ["True","False"]
var i = 0
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

//aer probemos denuevo xd

app.post("/run",async (req, res) =>{
  
  const { Partitioners } = require('kafkajs')
  const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
  const admin = kafka.admin()
  await admin.connect()
  await producer.connect()
  // await admin.createTopics({
  //     waitForLeaders: true,
  //     topics: [
  //       { topic: 'login' },
  //     ],
  // })

  let logeo = {
    "id_cuenta" : 'test',
    "region": regiones[Math.floor(Math.random()*regiones.length)],
    "success": success[Math.floor(Math.random()*success.length)]
  }

  await producer.send(
    {
      topic: 'login',
      messages: [{ value: JSON.stringify( logeo ) }],
    },
  )
  await producer.disconnect()
  await admin.disconnect()
  res.send('mandado')
})

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.post("/envio50",async (req, res) =>{

  let max = 50

  for (let index = 0; index < max; index++) {
   

    const { Partitioners } = require('kafkajs')
    const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
    const admin = kafka.admin()
    await admin.connect()
    await producer.connect()
    // await admin.createTopics({
    //     waitForLeaders: true,
    //     topics: [
    //       { topic: 'login' },
    //     ],
    // })

    let logeo = {
      "id_cuenta" : i,
      "region": regiones[Math.floor(Math.random()*regiones.length)],
      "success": success[Math.floor(Math.random()*success.length)]
    }

    i++
    
    
    await producer.send(
      {
        topic: 'login',
        messages: [{ value: JSON.stringify( logeo ) }],
      },
    )
    await producer.disconnect()
    await admin.disconnect()
  
    // Timer
    await sleep(100);
  }

  

  res.send('mandado')
})

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});


app.listen(3000, ()=>{
    console.log('Crud Server open on port 3000')
})
