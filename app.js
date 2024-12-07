const express = require("express");
const invitationRoutes = require("./routes/invitationRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use("/api/v1/invitations", invitationRoutes);
app.use("/api/v1/auth", authRoutes);

module.exports = app;
