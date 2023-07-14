# solar-monitoring
ep4ever solar monitoring web app

## Getting started

```bash
npm install
```

```bash
# creates the dist folder (location of the web app)
npm run build
```

Next step is to:
 - unsure http-service has .env file edited correctly (path to the dist folder of this project)

Then you must use http-service project to run the web app.

(!) Web app does not hold any configuration. All configuration are readed from the **http-service** app through the API interface (/api).
