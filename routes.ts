import express from "express";

const Router = express.Router();

import companyRoutes from "./routes/company";
import employeeRoutes from "./routes/employee";
import authRoutes from "./routes/auth";
import noRoutes from "./routes/404";

Router.use("/company", companyRoutes);
Router.use("/employee", employeeRoutes);
Router.use("/auth", authRoutes);
Router.use("*", noRoutes);

export default Router;
