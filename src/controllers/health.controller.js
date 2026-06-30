import { checkDatabaseHealth } from "../services/health.services.js";

export const getHealth = async (req, res) => {
  try {
    const timestamp = await checkDatabaseHealth();
    
    res.json({
      status: "UP",
      api: "Healthy",
      database: {
        status: "Healthy",
        timestamp,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      api: "Healthy",
      database: {
        status: "Unhealthy",
        error: error.message,
      },
    });
  }
};
