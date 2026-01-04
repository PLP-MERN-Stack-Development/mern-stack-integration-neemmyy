# MERN Blog ⚡

**A simple MERN (MongoDB, Express, React, Node) blog application** with a Vite-powered React client and an Express/MongoDB backend.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Development Tips](#development-tips)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

> A local development setup runs the client (Vite) and server (Express) on separate ports by default.

- Client: http://localhost:5173
- Server: http://localhost:5000 (default)

---

## Features ✅

- Create, read, update, delete (CRUD) blog posts
- Pagination and search on the posts listing
- Simple, easy-to-extend codebase for learning and prototypes

---

## Tech Stack 🧰

- Frontend: React + Vite, Tailwind CSS (optional)
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Request client: axios

---

## Project Structure 🔧

```
/ (repo root)
  README.md
  client/        # React + Vite app
    package.json
    src/
  server/        # Express API
    package.json
    server.js
    routes/
    controllers/
    models/
```

---

## Prerequisites ⚠️

- Node.js v16+ (recommended)
- npm or yarn
- MongoDB (local instance or a cloud DB like MongoDB Atlas)

---

## Environment Variables 🔒

Create a `.env` file in the `server/` folder with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
# (optional)
# JWT_SECRET=your_jwt_secret
```

> Keep secrets out of version control. Use `.env.local` or your host's secret management for production.

---

## Installation 🛠️

From the repository root, install dependencies for both the client and server:

```powershell
# Install client dependencies
cd client
npm install

# In a different terminal, install server dependencies
cd ../server
npm install
```

---

## Running the App ▶️

Development (two terminals):

Terminal 1 — Server

```powershell
cd server
# start server
npm run start
# for auto-reload during development (nodemon is a devDependency):
# npx nodemon server.js
```

Terminal 2 — Client

```powershell
cd client
npm run dev
```

Build & serve production client:

```powershell
cd client
npm run build
# serve from a static host or have your server serve the build folder
```

---

## API Reference 📡

Base path: `/api/posts`

- GET `/api/posts` — list posts (supports `page`, `limit`, `search`, `category` query params)
- POST `/api/posts` — create a new post (expects `{ title, content }`)
- GET `/api/posts/:id` — retrieve a single post by id
- PUT `/api/posts/:id` — update a post
- DELETE `/api/posts/:id` — delete a post

Responses are returned as JSON. See `server/routes/postRoutes.js` and `server/controllers/postController.js` for details.

---

## Development Tips 💡

- Use `npx nodemon server.js` for automatic server restarts while developing.
- Add validation and authentication when expanding beyond prototype scope.
- Write small, focused commits and provide clear PR descriptions.

---

## Contributing 🤝

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Make changes and add tests where applicable
4. Open a Pull Request describing your changes

Please follow the existing code style and keep PRs small and focused.

---

## License

This project currently has **no license** specified. Add a `LICENSE` file (e.g., MIT) if you want to make the terms explicit.

---

## Contact

If you have questions or need assistance, please open an issue or contact the maintainer.
