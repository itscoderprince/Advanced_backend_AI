import express from "express";
import {
  login,
  register,
  logout,
  getAllUsers,
  getSingleUser,
  getAllUsersWithRedis,
} from "./auth.controller.js";
import rateLimiter from "../../middleware/ratelimit.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/", rateLimiter, getAllUsers);
router.get("/get-with-redis", getAllUsersWithRedis);
router.get("/:id", getSingleUser);

export default router;
