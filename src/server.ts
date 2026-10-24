import { AppDataSource } from "./config/database";
import app from "./app";

const PORT = process.env.PORT || 3000;

// الاتصال بقاعدة البيانات أولاً ثم تشغيل السيرفر
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully! ");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
