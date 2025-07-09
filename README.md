please don't use this in production anywhere as it's jank as hell secret treatment just POC loading images from a shared drive folder


https://console.cloud.google.com/apis/credentials

Create an apikey and scope it to drive.

Set drive folder to shareable by anyone with link and yoink the ID from the arse end of the string

Create src/.env and feed it these two:
  REACT_APP_API_KEY=whatever
  REACT_APP_DIR_ID=someotherthing

then from terminal hit up

  npm install
  npm start