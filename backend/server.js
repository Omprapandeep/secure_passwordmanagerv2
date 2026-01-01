const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authMiddleware = require("./middleware/auth");
const { encrypt, decrypt } = require("./utils/crypto");



const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");



const app = express();
const port = process.env.PORT || 3000;

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://secure-passwordmanagerv2.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

/* ------------------ MONGOOSE (FOR AUTH) ------------------ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Mongoose connected (Users)"))
  .catch((err) => console.error(" Mongoose error:", err));

/* ------------------ ROUTES ------------------ */
app.use("/api/auth", authRoutes);

/* ------------------ MONGODB NATIVE (FOR PASSWORDS) ------------------ */
const dbName = "passop";
const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(" MongoDB Native connected (Passwords)");
  } catch (err) {
    console.error(" MongoDB Native connection failed:", err);
  }
}

/* ------------------ PASSWORD ROUTES ------------------ */

app.get("/", authMiddleware, async (req, res) => {
  try {
    const collection = db.collection("passwords");

    const userPasswords = await collection
      .find({ userId: req.userId }) // 🔐 ONLY USER DATA
      .toArray();

    const decryptedPasswords = userPasswords.map(p => ({
      ...p,
      password: decrypt(p.password)  // 🔓 DECRYPT HERE
    }));

    res.json(decryptedPasswords);

  } catch (err) {
    res.status(500).json({ message: "Error fetching passwords" });
  }
});

//add password
app.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("USER ID FROM TOKEN 👉", req.userId); // 👈 ADD THIS
    const { site, username, password } = req.body;

    const collection = db.collection("passwords");
    const encryptedPassword = encrypt(password);  // 🔐 ENCRYPT HERE

    const result = await collection.insertOne({
      site,
      username,
      password: encryptedPassword,  // ✅ encrypted password
      userId: req.userId
    });
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// DELETE password
app.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const collection = db.collection("passwords");
    await collection.deleteOne({
      _id: new ObjectId(id),
      userId: req.userId   // 🔐 SECURITY CHECK
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// UPDATE password
app.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;

    const collection = db.collection("passwords");
    const encryptedPassword = encrypt(password);  // 🔐 ENCRYPT

    await collection.updateOne(
      { _id: new ObjectId(id), userId: req.userId },
      { $set: { site, username, password: encryptedPassword } }
    );


    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------ START SERVER ------------------ */
connectDB().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(` Server running at http://localhost:${port}`);
  });
});
