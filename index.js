const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let db;
const filePath = path.join(__dirname, "product-list.db");

const initializeDBandServer = async () => {
  try {
    db = await sqlite.open({
      filename: filePath,
      driver: sqlite3.Database
    });

    // Create user table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    
    // Start server only after DB is initialized
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

//Get Users
// API 3: Get All Users
app.get("/users/", async (request, response) => {
    try {
        const getAllUsersQuery = `SELECT * FROM user`;
        const users = await db.all(getAllUsersQuery);
        response.send(users)
    } catch (error) {
        console.error("Error fetching users:", error);
        response.status(500).json({ message: "Internal server error" });
    }
});

// API 1: Register User
app.post("/register/", async (request, response) => {
    const { username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = `SELECT * FROM user WHERE username = ?`;
    const dbUser = await db.get(selectUserQuery, [username]);
    if (dbUser === undefined) {
      if (username !== "" && password !== "") {
        const createUserQuery = `
        INSERT INTO 
          user (username, password) 
        VALUES 
          ('${username}', '${hashedPassword}')
      `;
        await db.run(createUserQuery);
        response.status(200);
        response.send({ message: "User created successfully" });
      } else {
        response.status(400);
        response.send({ message: "Username or password should not be empty" });
      }
    } else {
      response.status(400);
      response.send({ message: "User already exists" });
    }
});

// API 2: Login User
app.post("/login/", async (request, response) => {
    try {
        const { username, password } = request.body;
        const selectUserQuery = `SELECT * FROM user WHERE username = ?`;
        const dbUser = await db.get(selectUserQuery, [username]);
        
        if (!dbUser) {
            response.status(401);
            response.send({ message: "Invalid user" });
            return;
        }

        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if (isPasswordMatched) {
            const payload = { username: username };
            const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
            response.send({ jwtToken });
        } else {
            response.status(401);
            response.send({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        response.status(500);
        response.send({ message: "Internal server error" });
    }
});