import express from "express";

const Router = express.Router();

import { login } from "../controller/auth";

Router.post("/login", login);
export default Router;
