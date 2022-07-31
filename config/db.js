import mongoose from 'mongoose';
import config from 'config';
// getting values from config
const db = config.get('mongoURI');

// connecting to db
const connectDB = () => {
  try {
    mongoose.connect(db);

    console.log('Mongo db connected');
  } catch (e) {
    console.error(e.message);
    // Exit app process with failure
    process.exit(1);
  }
};

export { connectDB };
