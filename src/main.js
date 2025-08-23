import { web } from "./application/web.js";
import { logger } from "./application/logging.js";
import cors from "cors";
const PORT = 3000;

// Start server
web.listen(PORT, () => {
  logger.info(`App Start, server berjalan pada port ${PORT}`);
});
