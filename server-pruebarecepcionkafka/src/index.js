const express = require( 'express' );
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());




// Kafka

let listaEuropa = []
let listaAsia = []
let listaAmerica = []
let listaFallido = []

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],  
})

// Procesamiento Kafka

const consume = async () =>{

    const consumer = kafka.consumer({
       groupId: 'group-flink',
       heartbeatInterval: 5000
      })

    await consumer.connect()
    await consumer.subscribe({ topics: ['login'], fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse( message.value.toString() );
       
      let logeo = {
        "id_cuenta" : data.id_cuenta,
        "region": data.region,
        "success": data.success
      }

      if(data.region == 'Europa'){
        listaEuropa.push( logeo )
      }else if(data.region == 'Asia'){
        listaAsia.push( logeo )
      }else if(data.region == 'America'){
        listaAmerica.push( logeo )
      }else{
        listaFallido.push( logeo )
      }

      let logeos = {
        "Europa" : listaAmerica.length,
        "Asia" : listaAsia.length,
        "America" : listaAmerica.length,
        "Fallidos" : listaFallido.length
      }

      console.log( logeos )

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
