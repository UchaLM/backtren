import {
  findAllUsers,
  findUserById,
  findUserByEmail,
  createUserService,
  updateUserService,
  deleteUserService
} from "../services/user.services.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!role || (role !== 'profesor' && role !== 'alumno')) {
    return res.status(400).json({ message: "Invalid or missing role" });
  }
  try {
    // Check if user exists
    const userExists = await findUserByEmail(email);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await createUserService(name, email, password, role);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  if (!role || (role !== 'profesor' && role !== 'alumno')) {
    return res.status(400).json({ message: "Invalid or missing role" });
  }
  try {
    const updatedUser = await updateUserService(id, name, email, password, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const rowCount = await deleteUserService(id);
    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
