import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users";
import accountRoutes from "./routes/accounts";
import sessionRoutes from "./routes/sessions";
import verificationTokenRoutes from "./routes/verificationTokens";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/accounts", accountRoutes);
app.use("/sessions", sessionRoutes);
app.use("/verification-tokens", verificationTokenRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
