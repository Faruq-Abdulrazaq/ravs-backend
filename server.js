import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

dotenv.config();
const supabase = createClient(
  process.env.SUPERBASE_URL,
  process.env.SUPERBASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const secretbase = createClient(
  process.env.SUPERBASE_URL,
  process.env.SUPERBASE_SECRET,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
const PORT = 8000;
const app = express();
const allowedOrigins = [process.env.CORS_ALLOW_1, process.env.CORS_ALLOW_2];

const generateRandomString = (length) => {
  return crypto
    .randomBytes(length)
    .toString("base64") // Convert to base64 string
    .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters
    .slice(0, length); // Return the first 'length' characters
};

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

//DashboardIndicators
app.get("/DashboardIndicators", async (req, res) => {
  try {
    const results = await Promise.all([
      supabase.from("RAVS_DATA").select("*", { count: "exact", head: true }),
      supabase.from("RAVS_DATA").select().eq("status", "pending"),
      supabase.from("RAVS_DATA").select().eq("status", "approved"),
      supabase
        .from("RAVS_DATA")
        .select(
          `
        surname,
        street,
        nationality,
        buildingType,
        propertyType,
        stateOfResidence,
        lgaOfResidence
      `
        )
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    const count = results[0].count;
    const pendingData = Object.values(results[1].data).length;
    const approvedData = Object.values(results[2].data).length;
    const selectedData = results[3].data;

    res.json([count, pendingData, approvedData, selectedData]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Add Address
app.post("/uploadAddress", async (req, res) => {
  const { error } = await supabase.from("RAVS_DATA").insert({
    kyct_id: "",
    message: req.body.message,
    uploadedBy: req.body.uploadedBy,
    status: req.body.status,
    surname: req.body.surname,
    othernames: req.body.othernames,
    dob: req.body.dateOfBirth,
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
  });
  if (!error) {
    res.json("RAVs Post");
  } else {
    res.json("RAVs error" + error);
  }
});

//Approve  address
app.post("/approveAddress", async (req, res) => {
  const { error } = await supabase
    .from("RAVS_DATA")
    .update({ status: "approved", kyct_id: generateRandomString(12) })
    .eq("id", req.body.id);

  if (error) {
    return res.status(401).json({ error: "Error getting data" });
  } else {
    return res.status(200).json({ error: "Address approved" });
  }
});

//Get all address
app.get("/getAll", async (req, res) => {
  const { data, error } = await supabase
    .from("RAVS_DATA")
    .select()
    .order("created_at", { ascending: false });
  if (data) {
    res.json(data);
  } else {
    return res.status(401).json({ error: "Error getting data" });
  }
});

//Get one address
app.get("/getOneData", async (req, res) => {
  const { data, error } = await supabase
    .from("RAVS_DATA")
    .select()
    .eq("kyct_id", req.query.id);
  if (data) {
    res.json(data);
  } else {
    console.log(error);
    return res.status(401).json({ error: "Could not find data" });
  }
});

//Get all staffs
app.get("/getAllStaffs", async (req, res) => {
  try {
    const { data, error } = await secretbase.auth.admin.listUsers();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

//Auth users
app.post("/authContext", async (req, res) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password,
  });
  if (data) {
    res.json(data);
  }
  if (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

//Add Supervisor
app.post("/addSupervisor", async (req, res) => {
  const { data, error } = await supabase.auth.signUp({
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    options: req.body.options,
  });
  if (data) {
    res.json(data);
  } else {
    return res.status(401).json({ error: "An error occured" });
  }
});
