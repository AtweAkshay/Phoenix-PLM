const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const fs = require('fs');

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile('requests.log', log, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
  next();
});

app.use(cors());
app.use(express.json());

const projectsRouter = require('./projects');
app.use('/api/projects', projectsRouter);


app.get('/', (req, res) => {
  res.send('Hello from the Agentic Supply Chain backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
