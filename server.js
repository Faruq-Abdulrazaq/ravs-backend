import PocketBase from "pocketbase";
import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const PORT = 8000;
const app = express();
const serviceAccount =
  "./Private/ravs-53992-firebase-adminsdk-wet19-305bf28f9e.json";
const pb = new PocketBase("http://127.0.0.1:8090");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

app.get("/", (req, res) => {
  res.json("Welcome to RAVS backend application");
});

//Add Address
app.post("/uploadAddress", async (req, res) => {
  const data = {
    message: req.body.message,
    uploadedBy: req.body.uploadedBy,
    status: req.body.status,
    surname: req.body.surname,
    othernames: req.body.othernames,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    nationality: req.body.nationality,
    stateOfOrigin: req.body.stateOfOrigin,
    localGovernmentArea: req.body.localGovernmentArea,
    homeAddress: req.body.homeAddress,
    occupation: req.body.occupation,
    phoneNumber: req.body.phoneNumber,
    alternativePhoneNumber: req.body.alternativePhoneNumber,
    emailAddress: req.body.emailAddress,
    dependencyCount: req.body.dependencyCount,
    buildingType: req.body.buildingType,
    propertyType: req.body.propertyType,
    street: req.body.street,
    stateOfResidence: req.body.stateOfResidence,
    lgaOfResidence: req.body.lgaOfResidence,
    zipCode: req.body.zipCode,
    geoLocation: req.body.geoLocation,
    lengthOfResidency: req.body.lengthOfResidency,
    firstWitnessFullName: req.body.firstWitnessFullName,
    firstWitnessRelationshipType: req.body.firstWitnessRelationshipType,
    firstWitnessPhoneNumber: req.body.firstWitnessPhoneNumber,
    secondWitnessFullName: req.body.secondWitnessFullName,
    secondWitnessRelationshipType: req.body.secondWitnessRelationshipType,
    secondWitnessPhoneNumber: req.body.secondWitnessPhoneNumber,
    nin: req.body.nin,
    registrationCenter: req.body.registrationCenter,
  };

  const record = await pb.collection("ravs_data").create(data);
  res.json("RAVs Post" + record);
});

//Auth users
app.post("/authContext", async (req, res) => {
  try {
    const authData = await pb
      .collection("ravs_users")
      .authWithPassword(req.body.email, req.body.password);
    res.json(authData);
  } catch (err) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

//Add Supervisor
app.post("/addSupervisor", async (req, res) => {
  const data = {
    username: "",
    email: req.body.email,
    emailVisibility: true,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    createdBy: req.body.createdBy,
    state: req.body.state,
    address: req.body.address,
  };

  const record = await pb.collection("ravs_users").create(data);
  res.json(record);
});

//Get all address
app.get("/getAll", async (req, res) => {
  const records = await pb.collection("ravs_data").getFullList({
    sort: "-created",
  });
  res.json(records);
});

//Get one address
app.post("/getOneData", async (req, res) => {});

app.post("/getQuery", async (req, res) => {
  const RAVSRef = db.collection("RAVS");
  const snapshot = await RAVSRef.where(
    "uploadedBy",
    "==",
    `${req.body.uploadedBy}`
  ).get();
  const dataReturned = [];
  if (snapshot.empty) {
    res.json({
      message: "RAVs Get Query || No matching documents",
      status: "ERROR",
      data: {},
    });
    return;
  }

  snapshot.forEach((doc) => {
    if (doc.data().queried) {
      const predator = {
        _id: doc.id,
        fromDb: doc.data(),
      };
      dataReturned.push(predator);
      res.json({
        message: "RAVs Get Query || No matching documents",
        status: "ERROR",
        data: dataReturned,
      });
    } else {
      res.json({
        message: "RAVs Get Query || No query for this user",
        status: "SUCCESS",
        data: {},
      });
    }
  });
});
