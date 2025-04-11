FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .

# Create a script to start both services
RUN echo '#!/bin/sh\n\
npx json-server --host 0.0.0.0 --watch db.json --port 3001 & \n\
serve -s dist -l 1234 \n\
' > start.sh && chmod +x start.sh

RUN npm run build

EXPOSE 1234

CMD ["./start.sh"]
