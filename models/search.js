const fs = require('fs');
const axios = require('axios');

class Searchs{

    historial = [];
    pathBD = './db/database.json';

    constructor(){
        // Leer BD si existe
        this.readBD();
    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX,
            'limit': 5,
            'lenguage': 'es'
        }
    }

    get paramsWeatherPlace(){
        return {            
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historyCapitalized(){

        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }

    async city( lugar = ''){

        try {
            //Peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            })); // retornar los lugares
        } catch (error) {
            return [];
        }
    }

    async weatherPlace(lat, lon){

        try {

            // Peticion HTTP Axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeatherPlace, lat,lon}
            })
            
            const resp = await instance.get();
            const { weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    addHistory( lugar = ''){

        if(this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        };

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase() );

        //Grabar en BD
        this.saveBD();
    }

    saveBD(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.pathBD, JSON.stringify(payload));
    }

    readBD(){
        // debe existir...
        if(!fs.existsSync(this.pathBD)) return;

        // cargar la informacion datos a mandar{ path, encoding}
        const info = fs.readFileSync(this.pathBD, {encoding: 'utf-8'});
         
        const data = JSON.parse( info );

        this.historial = data.historial;
    }
}

module.exports = Searchs;