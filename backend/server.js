const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./db/connectDB");
const authRoutes = require("./routes/auth.routes");

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port: ${port}`);
});
