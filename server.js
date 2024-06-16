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

const getLast24Hours = () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const year = twentyFourHoursAgo.getFullYear();
  const month = String(twentyFourHoursAgo.getMonth() + 1).padStart(2, "0");
  const day = String(twentyFourHoursAgo.getDate()).padStart(2, "0");
  const hours = String(twentyFourHoursAgo.getHours()).padStart(2, "0");
  const minutes = String(twentyFourHoursAgo.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getLast7Days = () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const year = sevenDaysAgo.getFullYear();
  const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, "0");
  const day = String(sevenDaysAgo.getDate()).padStart(2, "0");
  const hours = String(sevenDaysAgo.getHours()).padStart(2, "0");
  const minutes = String(sevenDaysAgo.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getLast14Days = () => {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const year = fourteenDaysAgo.getFullYear();
  const month = String(fourteenDaysAgo.getMonth() + 1).padStart(2, "0");
  const day = String(fourteenDaysAgo.getDate()).padStart(2, "0");
  const hours = String(fourteenDaysAgo.getHours()).padStart(2, "0");
  const minutes = String(fourteenDaysAgo.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const postActivity = async ({ activity, lga, role, name, userId }) => {
  const { error } = await supabase.from("RAVS_ACTIVITIES").insert({
    activity: activity,
    lga: lga,
    role: role,
    name: name,
    userId: userId,
  });
  if (!error) {
    return true;
  } else {
    return false;
  }
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
    postActivity({
      activity: "Entry",
      lga: req.body.lgaOfResidence,
      role: req.body.uploadedByRole,
      name: req.body.uploadedByName,
      userId: req.body.uploadedBy,
    });
    res.json("RAVs Post");
  } else {
    res.json("RAVs error" + error);
  }
});

//Update address
app.post("/updateAddress", async (req, res) => {
  const { error } = await supabase
    .from("RAVS_DATA")
    .update({
      kyct_id: "",
      message: req.body.data.message,
      uploadedBy: req.body.data.uploadedBy,
      status: req.body.data.status,
      surname: req.body.data.surname,
      othernames: req.body.data.othernames,
      dob: req.body.data.dateOfBirth,
      gender: req.body.data.gender,
      nationality: req.body.data.nationality,
      stateOfOrigin: req.body.data.stateOfOrigin,
      localGovernmentArea: req.body.data.localGovernmentArea,
      homeAddress: req.body.data.homeAddress,
      occupation: req.body.data.occupation,
      phoneNumber: req.body.data.phoneNumber,
      alternativePhoneNumber: req.body.data.alternativePhoneNumber,
      emailAddress: req.body.data.emailAddress,
      dependencyCount: req.body.data.dependencyCount,
      buildingType: req.body.data.buildingType,
      propertyType: req.body.data.propertyType,
      street: req.body.data.street,
      stateOfResidence: req.body.data.stateOfResidence,
      lgaOfResidence: req.body.data.lgaOfResidence,
      zipCode: req.body.data.zipCode,
      geoLocation: req.body.data.geoLocation,
      lengthOfResidency: req.body.data.lengthOfResidency,
      firstWitnessFullName: req.body.data.firstWitnessFullName,
      firstWitnessRelationshipType: req.body.data.firstWitnessRelationshipType,
      firstWitnessPhoneNumber: req.body.data.firstWitnessPhoneNumber,
      secondWitnessFullName: req.body.data.secondWitnessFullName,
      secondWitnessRelationshipType:
        req.body.data.secondWitnessRelationshipType,
      secondWitnessPhoneNumber: req.body.data.secondWitnessPhoneNumber,
      nin: req.body.data.nin,
      registrationCenter: req.body.data.registrationCenter,
    })
    .eq("id", req.body.id);
  if (!error) {
    postActivity({
      activity: "Edit Entry",
      lga: req.body.data.lgaOfResidence,
      role: req.body.data.uploadedByRole,
      name: req.body.data.uploadedByName,
      userId: req.body.data.uploadedBy,
    });
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
    postActivity({
      activity: "Approval",
      lga: req.body.lga,
      role: req.body.role,
      name: req.body.name,
      userId: req.body.uploadedBy,
    });
    return res.status(200).json({ error: "Address approved" });
  }
});

//Query  address
app.post("/queryAddress", async (req, res) => {
  const { error } = await supabase
    .from("RAVS_DATA")
    .update({ status: "queried", message: req.body.message })
    .eq("id", req.body.id);

  if (error) {
    return res.status(401).json({ error: "Error querying data" });
  } else {
    postActivity({
      activity: "Query",
      lga: req.body.lga,
      role: req.body.role,
      name: req.body.name,
      userId: req.body.uploadedBy,
    });
    return res.status(200).json({ error: "Queried" });
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

//Get all staffs
app.get("/getOneStaff", async (req, res) => {
  try {
    const { data, error } = await secretbase.auth.admin.getUserById(
      req.query.id
    );
    if (error) throw error;
    res.json(data.user.user_metadata);
  } catch (error) {
    res.json(error);
  }
});

//Update staff data
app.post("/updateStaff", async (req, res) => {
  try {
    const { data: user, error } = await secretbase.auth.admin.updateUserById(
      req.body.id,
      req.body.data
    );
    if (error) throw error;
    if (req.body.name) {
      postActivity({
        activity: "Update staff",
        lga: req.body.lga,
        role: req.body.role,
        name: req.body.name,
        userId: req.body.uploadedBy,
      });
    }
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

//Get summary data
app.get("/getSummaryData", async (req, res) => {
  try {
    const results = await Promise.all([
      supabase
        .from("RAVS_DATA")
        .select("stateOfResidence")
        .gte("created_at", getLast24Hours()),
      supabase
        .from("RAVS_DATA")
        .select("stateOfResidence")
        .gte("created_at", getLast7Days()),
      supabase.from("RAVS_DATA").select("stateOfResidence"),
      supabase
        .from("RAVS_DATA")
        .select("stateOfResidence")
        .gte("created_at", getLast14Days()),
      supabase
        .from("RAVS_ACTIVITIES")
        .select()
        .order("created_at", { ascending: false })
        .limit(2),
    ]);

    // if (error) throw error;
    const last24Hours = results[0];
    const last7Days = results[1];
    const stateCount = results[2];
    const last14Days = results[3];
    const activity = results[4];
    res.json([last24Hours, last7Days, stateCount, last14Days, activity]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Get activity
app.get("/getActivity", async (req, res) => {
  const { data, error } = await supabase
    .from("RAVS_ACTIVITIES")
    .select()
    .order("created_at", { ascending: false });

  if (data) {
    const formattedData = data.map((item) => {
      const createdAt = new Date(item.created_at);
      const formattedCreatedAt = createdAt.toLocaleString();
      return {
        ...item,
        created_at: formattedCreatedAt,
      };
    });
    res.json(formattedData);
  } else {
    return res.status(401).json({ error: "Error getting data" });
  }
});

//Update staff password
app.post("/updatePassword", async (req, res) => {
  try {
    const { data: user, error } = await secretbase.auth.admin.updateUserById(
      req.body.id,
      req.body.data
    );
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
    postActivity({
      activity: "Onboard staff",
      lga: req.body.lga,
      role: req.body.role,
      name: req.body.name,
      userId: req.body.uploadedBy,
    });
    res.json(data);
  } else {
    return res.status(401).json({ error: "An error occured" });
  }
});
