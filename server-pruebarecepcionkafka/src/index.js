const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Kafka

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

// Procesamiento Kafka

const consume = async () =>{

    const consumer = kafka.consumer({
       groupId: 'group-miembros',
       heartbeatInterval: 5000
      })

    await consumer.connect()
    await consumer.subscribe({ topics: ['login','pais','exitoso'], fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if(topic=='login'){
          console.log('id: ',{value: message.value.toString()})
        }
        if(topic=='pais'){
          console.log('país: ',{value: message.value.toString()})
        }
        if(topic=='exitoso'){
          console.log('success: ',{value: message.value.toString()})
        }
       },
    })
  }


// Responses

app.get('/', (req, res) => {
    
    res.send('Test')

});

app.listen(5000, ()=>{
  console.log('Server Miembros open on port 5000')
  // Inicio Kafka
  consume().catch((err) => {
    console.error("error in consumer: ", err)
  })
})
