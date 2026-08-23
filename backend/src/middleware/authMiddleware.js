import admin from "../../firebase-admin.js";
import User from "../model/user.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("Firebase UID:", decoded.uid);
    console.log("Firebase Email:", decoded.email);

    // First find by Firebase UID
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    // If not found, try email
    if (!user) {
      user = await User.findOne({
        email: decoded.email.toLowerCase(),
      });
    }

    // If user exists, update Firebase UID if necessary
    if (user) {
      if (user.firebaseUid !== decoded.uid) {
        user.firebaseUid = decoded.uid;
      }

      // Update name/avatar if available
      if (decoded.name) {
        user.name = decoded.name;
      }

      if (decoded.picture) {
        user.avatar = decoded.picture;
      }

      await user.save();

      console.log("MongoDB user found/updated:", user.email);
    }

    // If user doesn't exist at all, create one
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email.toLowerCase(),
        name: decoded.name || decoded.email.split("@")[0],
        avatar: decoded.picture || "",
      });

      console.log("MongoDB user created:", user.email);
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};