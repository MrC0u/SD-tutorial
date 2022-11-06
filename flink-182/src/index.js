const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Kafka

const { Kafka } = require('kafkajs')
const { Partitioners } = require('kafkajs')
const paises = ["Chile", "Argentina","Brasil","USA","Inglaterra","Alemania","Francia","Italia","España","China","Japón","Rusia"]
const success = ["True","False"]
var i = 0
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

function lakong(){
  i++
  return ''+i
}
function putalawea(){
  return paises[Math.floor(Math.random()*paises.length)];
}
function fuuuck(){
  return success[Math.floor(Math.random()*success.length)];
}

//aer probemos denuevo xd

app.post("/run",async (req, res) =>{
  const { Partitioners } = require('kafkajs')
  const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
  const admin = kafka.admin()
  await admin.connect()
  await producer.connect()
  await admin.createTopics({
      waitForLeaders: true,
      topics: [
        { topic: 'login' },
        {topic: 'pais'},
        {topic: 'exitoso'}
      ],
  })

  await producer.sendBatch({
    topicMessages: [{topic: 'login',
    messages: [
      {value: lakong()}
    ],
    },{
    topic: 'pais',
    messages: [
      {value:  putalawea()}
    ],
    },{
    topic: 'exitoso',
    messages: [
      {value: fuuuck()}
    ],}] 
  })
  await producer.disconnect()
  await admin.disconnect()
  res.send('manda2')
})

// Test Response

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(3000, ()=>{
    console.log('Crud Server open on port 3000')
})
