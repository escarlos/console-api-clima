require('dotenv').config();

const { readInput,
        inquirerMenu, 
        pausa,
        listCities} = require("./helpers/inquirer");
const Searchs = require("./models/search");



const main = async() =>{
    
    const busquedas = new Searchs();
    let opt;

    do {

        opt = await inquirerMenu();

        switch(opt){
            case 1:
                // Mostrar mensaje
                const lugarBuscar = await readInput('Ciudad a buscar: ');
                
                // Buscar Lugares
                const lugares = await busquedas.city(lugarBuscar);

                // Seleccionar lugar
                const id = await listCities(lugares);

                if(id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id === id);
                busquedas.addHistory(lugarSel.nombre);

                // Clima del lugar
                const clima = await busquedas.weatherPlace(lugarSel.lat, lugarSel.long);

                // Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Log: ', lugarSel.long);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ',clima.min);
                console.log('Maxima: ',clima.max);
                console.log('Clima: ',clima.desc);
                break;
            case 2:
                busquedas.historyCapitalized.forEach( (lugar,i) =>{
                    const idx = `${i + 1 }.`.green;
                    console.log(` ${ idx } ${ lugar }`);
                });

                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

main();