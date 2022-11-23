const express = require('express')
const app = express()
const path = require('path')
const https = require('https') 
const { engine  } = require('express-handlebars') 
const port = 3000 

app.engine('.hbs', engine({
    extname: '.hbs', 
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); 



// Body parser
app.use(
    express.urlencoded ({
        extended: true,
    }),
)

let query = "Ho Chi Minh"

app.get('/', (req, res) =>{    
    const apiKey = "93e9949624402cc497139d12dff1e349"
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}` 
    https.get(url,  (response) => { 
        // Get data from response
        response.on('data', (data) => { 
            const weatherData = JSON.parse(data)
            if (weatherData.cod == "404") { 
                res.redirect('/page-not-found')
                query = "Ho Chi Minh" 
                return
            } 
            const temp = Number.parseFloat(weatherData.main.temp).toFixed(0)
            const weatherDesc = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
            const humidity = weatherData.main.humidity
            const clouds = weatherData.clouds.all
            const wind =(Number.parseFloat(weatherData.wind.speed) * 3.6).toFixed(2)
            const country = weatherData.sys.country; 
            const Weather = {
                name: query,
                temp: temp,
                desc: weatherDesc,
                icon: iconUrl, 
                wind: wind,
                clouds:clouds,
                humidity: humidity, 
                country : country,
            }  
            res.render('home', {weather : Weather})
        })
    })
}) 

app.post('/', (req, res) =>{  
    query = req.body.cityName 
    query = query.trim()
    res.redirect('/') 
})

app.get('/page-not-found', (req,res) => { 
    res.render('pageNotFound')
})


app.use(express.static(path.join(__dirname, 'public')))

app.listen(port,() => {
    console.log(`Sever is listen to ${port}`)
})