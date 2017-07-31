const Sequelize = require('sequelize')
const db = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


const log_json = (json) => {
        let cache = [];
        const result = JSON.stringify(json, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, 4);
        cache = null; // Enable garbage collection
        console.log(result)
    }

db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        // const Enum_Type = require('./db_enum_type')(db)
        const Enum = require('./db_enum.js')(db)
        const Cage = require('./db_cage.js')(db, Enum.model)
        const Breed = require('./db_breed.js')(db, Enum.model)
        const Mouse = require('./db_mouse.js')(db, Cage.model, Breed.model, Enum.model)

        let enum_type_ids = {}

        Enum.model.sync({force:true})
            .then(()=>{
                return Promise.all([Cage.model.sync({force:true}), Breed.model.sync({force:true})])
            })
            .then(()=>{
                return Mouse.model.sync({force:true})
            })
            .then(()=>{
                console.log("creating enums: ")
                const create_promises = [
                    Enum.model.create({description: 'male', type: 'SEX'}),
                    Enum.model.create({description: 'female', type: 'SEX'}),
                    Enum.model.create({description: '0 breed_status', type: 'BREED_STATUS'}),
                    Enum.model.create({description: '1 breed_status', type: 'BREED_STATUS'}),
                    Enum.model.create({description: '0 mouse_status', type: 'MOUSE_STATUS'}),
                    Enum.model.create({description: '1 mouse_status', type: 'MOUSE_STATUS'}),
                    Enum.model.create({description: 'Goldenticket', type: 'MOUSE_GENOTYPE'}),
                    Enum.model.create({description: 'Rag2', type: 'MOUSE_GENOTYPE'}),
                    Enum.model.create({description: 'B6', type: 'MOUSE_GENOTYPE'}),
                    Enum.model.create({description: 'IRF 3/7 -/- dKO', type: 'MOUSE_GENOTYPE'}),
                    Enum.model.create({description: 'stock', type: 'CAGE_TYPE'}),
                    Enum.model.create({description: 'breeder', type: 'CAGE_TYPE'}),
                    Enum.model.create({description: 'experimental', type: 'CAGE_TYPE'}),
                    Enum.model.create({description: 'terminated', type: 'CAGE_TYPE'}),
                ]
                return Promise.all(create_promises)

            })

            .then(()=>{
                Cage.model.getTypes()

            })

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });