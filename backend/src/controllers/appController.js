import { createBootstrapPayload } from "../../../shared/fitnessData.js";

export const getBootstrap = (req, res) => {
  res.json({
    success: true,
    data: createBootstrapPayload(),
  });
};

