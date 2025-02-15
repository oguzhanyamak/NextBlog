const mongoose = require("mongoose");

const ClientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName:'NextBlog'
};

const connecDb = async (connectionURI) => {
  try {
    await mongoose.connect(connectionURI, ClientOptions);
    console.log('Connect')
  } catch (error) {
    console.error('Connection Error',error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnect');
  } catch (error) {
    console.error('Disconnect Error',error.message);
    throw error;
  }
};

module.exports = {
    connecDb,
    disconnectDB
}
