import express from 'express';
import { getProfileByUsername } from '../controllers/userControllers/getProfileByUsername.js';

const profileRoutes = express.Router();

// Public route to get user profile by username
profileRoutes.get('/api/user/:username', getProfileByUsername);

export default profileRoutes;
