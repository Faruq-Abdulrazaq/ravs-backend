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
        dateTime: new Date(),
        verified: req.body.verified,
        uploadedBy: req.body.uploadedBy,
        queriedBy: "",
        approvedBy: "",
        queryMessage: "",
        queried: false
    });
    res.json('RAVs Post')
})

app.get('/getAll', async (req, res) => {
    const RAVSRef = db.collection('RAVS');
    const snapshot = await RAVSRef.get();
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

app.post('/getOneData', async (req, res) => {
    const RAVSRef = db.collection('RAVS').doc(`${req.body.docId}`);
    const doc = await RAVSRef.get();
    if (!doc.exists) {
        res.json( {
            message: "RAVs Get Query || No such document!",
            status: "ERROR",
            data: {}
        })
    } else {
        res.json( {
            message: "RAVs Get Query || Document data",
            status: "SUCCESS",
            data: {
                _id : doc.id,
                fromDb: doc.data()
            }
        })
    }
})

app.post('/getQuery', async (req, res) => {
    const RAVSRef = db.collection('RAVS');
    const snapshot = await RAVSRef.where('uploadedBy', '==', `${req.body.uploadedBy}`).get();
    const dataReturned = []
    if (snapshot.empty) {
        res.json( {
            message: "RAVs Get Query || No matching documents",
            status: "ERROR",
            data: {}
        })
        return;
    }

    snapshot.forEach(doc => {
        if (doc.data().queried) {
            const predator = {
                _id: doc.id,
                fromDb: doc.data()
            }
            dataReturned.push(predator)
            res.json( {
                message: "RAVs Get Query || No matching documents",
                status: "ERROR",
                data: dataReturned
            })
        } else {
            res.json( {
                message: "RAVs Get Query || No query for this user",
                status: "SUCCESS",
                data: {}
            })
        }
    });
})




