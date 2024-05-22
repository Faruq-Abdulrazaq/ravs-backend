import PocketBase from "pocketbase";
import express from "express";
import cors from "cors";
const PORT = 8000;
const app = express();
const getApiBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment
    ? process.env.POCKETBASE_URL_DEV
    : process.env.POCKETBASE_URL_PROD;
};

const allowedOrigins = [process.env.CORS_ALLOW_1, process.env.CORS_ALLOW_2];

const pb = new PocketBase(`${getApiBaseUrl()}`);

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow specific origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      // Deny all other origins
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
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

//Get all staffs
app.get("/getAllStaffs", async (req, res) => {
  const records = await pb.collection("ravs_users").getFullList({
    sort: "-created",
  });
  res.json(records);
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
