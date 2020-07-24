 const express = require('express');
 const connectDatabase = require('./config/database');
 const bodyParser = require('body-parser');
 const app = express();

 connectDatabase();
 app.get('/', (req, res) => res.send('API running.'));
 
//initializing middleware
 app.use(express.json({ extended: false }));
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 app.use('/api/user', require('./routes/api/user'));
 app.use('/api/login', require('./routes/api/login'));
 app.use('/api/current_user', require('./routes/api/current_user'));
 const PORT = process.env.PORT || 5001;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
