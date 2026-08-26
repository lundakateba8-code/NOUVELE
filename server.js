const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuration de Socket.io pour autoriser la connexion des clients
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Donnée initiale stockée en mémoire
let itemData = { title: "Article 1", price: 100 };

io.on('connection', (socket) => {
  console.log(`🟢 Client connecté : ${socket.id}`);

  // 1. Envoyer la donnée actuelle au client connecté
  socket.emit('initialData', itemData);

  // 2. Écouter la modification envoyée par l'ADMINISTRATEUR
  socket.on('adminUpdate', (newData) => {
    console.log("🛠️ Modification Admin reçue :", newData);
    
    // MAJ de la donnée (Ligne à vérifier/ajouter)
    itemData = { ...itemData, ...newData };

    // 3. Diffuser la nouvelle donnée à TOUS les clients connectés
    io.emit('dataUpdated', itemData);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Client déconnecté : ${socket.id}`);
  });
});

// Lancement du serveur sur le port 4000
server.listen(4000, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:4000`);
});