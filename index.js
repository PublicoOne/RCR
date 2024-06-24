const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Puerto 3000 como valor por defecto

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});
