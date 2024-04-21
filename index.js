const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));


app.use(express.static(path.join(__dirname, 'public')));

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('id = ', socket.id);
  socket.on('sender-join', (msg) => {
    socket.join(msg)
  });
  socket.on('reciever-join',(msg)=>{
    if(io.sockets.adapter.rooms.get(`${msg}`)){
      socket.join(msg)
      io.to(msg).emit('init',{message:'Receiver Connected',id:socket.id})
      io.to(socket.id).emit('join-sucess',{message:'Room Joined',id:msg})
    }else{
      socket.emit('error',{'message':'Invalid Room Name'})
    }
  })
  socket.on('metadata',(data)=>{
    console.log(data);
    io.to(socket.id).emit('metadata',data)
  })
  socket.on('file',(data)=>{
    console.log(data);
    io.to(socket.id).emit('file',data)
  })
})

//Setting up EJS Template Engine
app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
  res.render(__dirname+'/public/signup');
})

app.get('/send', (req, res) => {
  res.render(__dirname + '/public/sender');
})

app.get('/receive', (req, res) => {
  res.render(__dirname + '/public/receiver');
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/signup', (req, res) => {
  res.render(__dirname + '/public/signup');
})

app.post('/signup', (req, res) => {
  const newUser = new User({
      username: req.body.username,
      password: req.body.password
  });
  newUser.save()
      .then(() => {
        res.render(__dirname + '/public/login');
      })
      .catch((err) => {
          res.status(400).send('Unable to save to database');
      });
});

app.get('/login', (req, res) => {
  res.render(__dirname + '/public/login');
})

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  User.findOne({ username: username, password: password })
      .then((user) => {
          if (user) {
              // res.send('Login successful.');
              res.render(__dirname+'/public/home');
            } else {
              res.status(401).send('Invalid username or password.');
          }
      })
      .catch((err) => {
          res.status(500).send('Internal server error.');
      });
});

app.post('/logout', (req, res) => {
  res.render(__dirname + '/public/signup');
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
})