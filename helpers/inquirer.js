const inquirer = require('inquirer');
require('colors');

const questions = [{
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar un Lugar`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial de busqueda`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
];

const pausa = async() => {
    
    const question = [{
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'Enter'.green} para continuar`
        }
    ]
    console.log('\n');
    await inquirer.prompt(question);
    
}

const readInput = async( message) => {

    const question = [{
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor escribir una tarea'
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const confirm = async(message) => {
    
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const inquirerMenu = async() => {

    console.clear();
    console.log('==========================='.green);
    console.log('   Seleccione una opcion   '.green);
    console.log('============================\n'.green);

    const {opcion} = await inquirer.prompt(questions);

    return opcion;
}

const listCities = async( lugares = []) =>{
    
    const choices = lugares.map( (lugar, i) => {

        const idx = `${i + 1}.`.green ;
        return{
            value: lugar.id,
            name: `${idx} ${ lugar.nombre } `
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Volver al menu anterior'
    })

    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccionar..',
        choices
    }
    ]
    const { id } = await inquirer.prompt(preguntas);

    return id;
}

const  listadoCheckBox = async( tareas = []) =>{
    
    const choices = tareas.map( (tarea, i) => {

        const idx = `${i + 1}.`.green ;
        return{
            value: tarea.id,
            name: `${idx} ${ tarea.desc } `,
            checked: (tarea.completadaEn) ? true : false
        }
    });


    const pregunta = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices
    }
    ]
    const { ids } = await inquirer.prompt(pregunta);

    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    readInput,
    listCities,
    confirm,
    listadoCheckBox
}