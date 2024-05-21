import PocketBase from "pocketbase";
import express from "express";
import cors from "cors";
const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

app.get("/", (req, res) => {
  // postDummy(personalInformation, ContactInformation, NewAddress, witnessInformation, prove)
  res.json("Welcome to RAVS backend application");
});

app.post("/upload", async (req, res) => {
  const postData = await db.collection("RAVS").add({
    registeredData: req.body.registeredData,
    dateTime: new Date(),
    verified: req.body.verified,
    uploadedBy: req.body.uploadedBy,
    queriedBy: "",
    approvedBy: "",
    queryMessage: "",
    queried: false,
  });
  res.json("RAVs Post");
});

app.get("/getAll", async (req, res) => {
  const citiesRef = db.collection("RAVS");
  const snapshot = await citiesRef.get();
  const dataReturned = [];
  snapshot.forEach((doc) => {
    const predator = {
      _id: doc.id,
      fromDb: doc.data(),
    };
    dataReturned.push(predator);
  });
  res.json({
    message: "RAVs Get All",
    status: "SUCCESS",
    data: dataReturned,
  });
});

app.post("/getQuery", async (req, res) => {
  const citiesRef = db.collection("RAVS");
  const snapshot = await citiesRef
    .where("uploadedBy", "==", `${req.body.uploadedBy}`)
    .get();
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
