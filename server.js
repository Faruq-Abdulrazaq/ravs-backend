const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./Private/ravs-53992-firebase-adminsdk-wet19-305bf28f9e.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
app.use(express.json());
app.use(cors({ origin: '*' , credentials :  true}));
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

app.get('/', (req, res) => {
    // postDummy(personalInformation, ContactInformation, NewAddress, witnessInformation, prove)
    res.json('Welcome to RAVS backend application')
})

app.post('/upload', async (req, res) => {
    const postData = await db.collection('RAVS').add({
        registeredData: req.body.registeredData,
        date: req.body.date,
        verified: req.body.verified
    });
    res.json('RAVs Post')
})

app.get('/getAll', async (req, res) => {
    const citiesRef = db.collection('RAVS');
    const snapshot = await citiesRef.get();
    const dataReturned = []
    snapshot.forEach(doc => {
        const predator = {
            _id: doc.id,
            fromDb: doc.data()
        }
        dataReturned.push(predator)
    });
    res.json( {
         message: "RAVs Get All",
         status: "SUCCESS",
         data: dataReturned
    })
})




