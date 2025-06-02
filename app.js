const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors')
const apiRoutes = require('./routes/api');

app.use(cors())
app.use(express.json());

// Mount the API routes under /api
app.use('/api', apiRoutes);

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});

app.get('/', (req, res) => {
  res.send('University API is running!');
});
