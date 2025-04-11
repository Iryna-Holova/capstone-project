FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install express for the combined server
RUN npm install express http-proxy-middleware

# Create a combined server file
RUN echo 'import express from "express";' > server.js && \
    echo 'import { createProxyMiddleware } from "http-proxy-middleware";' >> server.js && \
    echo 'import { dirname, join } from "path";' >> server.js && \
    echo 'import { fileURLToPath } from "url";' >> server.js && \
    echo 'import { spawn } from "child_process";' >> server.js && \
    echo '' >> server.js && \
    echo 'const __dirname = dirname(fileURLToPath(import.meta.url));' >> server.js && \
    echo 'const app = express();' >> server.js && \
    echo 'const PORT = process.env.PORT || 1234;' >> server.js && \
    echo '' >> server.js && \
    echo '// Start JSON Server' >> server.js && \
    echo 'const jsonServer = spawn("npx", ["json-server", "--host", "0.0.0.0", "--watch", "db.json", "--port", "3001"]);' >> server.js && \
    echo 'jsonServer.stdout.on("data", (data) => console.log(`JSON Server: ${data}`));' >> server.js && \
    echo 'jsonServer.stderr.on("data", (data) => console.error(`JSON Server error: ${data}`));' >> server.js && \
    echo '' >> server.js && \
    echo '// Set up API proxy' >> server.js && \
    echo 'app.use("/api", createProxyMiddleware({ target: "http://localhost:3001", changeOrigin: true, pathRewrite: {"/api": ""} }));' >> server.js && \
    echo '' >> server.js && \
    echo '// Serve static files' >> server.js && \
    echo 'app.use(express.static(join(__dirname, "dist")));' >> server.js && \
    echo '' >> server.js && \
    echo '// For SPA routing - catch all routes and redirect to index.html' >> server.js && \
    echo 'app.get("*", (req, res) => {' >> server.js && \
    echo '  res.sendFile(join(__dirname, "dist", "index.html"));' >> server.js && \
    echo '});' >> server.js && \
    echo '' >> server.js && \
    echo 'app.listen(PORT, () => {' >> server.js && \
    echo '  console.log(`Server running on port ${PORT}`);' >> server.js && \
    echo '});' >> server.js

RUN npm run build

EXPOSE 1234

CMD ["node", "server.js"]