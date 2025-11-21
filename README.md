# MERN Blog

A simple MERN (MongoDB, Express, React, Node) blog application.

This repository contains two subprojects:

- `client/` — React front-end built with Vite.
- `server/` — Node/Express back-end.

## Features

- React + Vite front end
- Express server with routes and Mongoose models
- Axios for client-server requests

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

## Environment

Create `.env` files for the `server` and (optionally) `client` if you store environment variables locally.

Common server env variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_if_applicable
```

## Setup

From the repository root, install dependencies for both projects.

PowerShell:

```powershell
# Install root (if any) then client and server
cd .\client; npm install; cd ..\server; npm install; cd ..
```

Or run separately in two terminals:

```powershell
cd .\client
npm install
# in another terminal
cd .\server
npm install
```

## Running the app

PowerShell commands to run both dev servers (two terminals):

Terminal 1 — start server:

```powershell
cd .\server
# use nodemon for auto-reload during development (if installed globally or available via npm scripts)
npm run start
# or if you prefer to use nodemon from devDependencies:
# npx nodemon server.js
```

Terminal 2 — start client:

```powershell
cd .\client
npm run dev
```

The client default Vite server will typically run on http://localhost:5173 and the server on http://localhost:5000 (if configured that way).

## Build for production

Build the client and deploy the server as needed.

```powershell
cd .\client
npm run build
# then serve the built files from your production server or host on a static hosting provider
```

## Project structure

```
/ (repo root)
  README.md
  .gitignore
  client/
    package.json
    src/
  server/
    package.json
    server.js
    models/
    routes/
```

## Useful scripts

- Client
  - `npm run dev` — start Vite dev server
  - `npm run build` — build production client
  - `npm run preview` — preview production build
- Server
  - `npm run start` — start the Node server (server.js)

## Contributing

- Fork the repo and open a PR.
- Keep changes small and focused.
- Add tests where applicable.

## License

This project is provided without a license. Add a LICENSE file if you want to set one (e.g., MIT).

## Contact

If you need help, open an issue or contact the maintainer.
