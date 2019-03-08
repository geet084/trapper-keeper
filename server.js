//import the app.js file
import app from './app'

//set the port for the server to 3001
app.set('port', 3001);

//listens for the server to start and informs what port the app is running on
app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`)
})