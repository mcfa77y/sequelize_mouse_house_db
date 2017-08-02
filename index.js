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

        Enum.model.sync({force:true})
            .then(()=>{
                return Promise.all([
                    Cage.model.sync({force:true}),
                    Breed.model.sync({force:true})
                    ]).catch(err => console.log("\n\n00" + err))
            })
            .then(()=>{
                return Mouse.model.sync({force:true}).catch(err => console.log("\n\n01" + err))
            })
            .then(()=>{
                console.log("creating enums: ")
                const create_promises = [
                    Enum.model.create({description: '0 breed_status', type: 'BREED_STATUS'}),
                    Enum.model.create({description: '1 breed_status', type: 'BREED_STATUS'}),
                    Enum.model.create({description: 'male', type: 'SEX'}),
                    Enum.model.create({description: 'female', type: 'SEX'}),
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
                return Promise.all(create_promises).catch(err => console.log("\n\n02" + err))

            })
            .then(()=>{
                return Enum.model.findAll({attributes: ['id', 'description'],
                    where: {type: 'CAGE_TYPE'}}) }).catch(err => console.log("\n\n03" + err))
            .then(cage_types =>{
                log_json(cage_types)
                let index = 300
                let create_promises = cage_types.map(cage_type =>{
                    return Cage.model.create({id_alias: index,
                        type_id: cage_type.id,
                        setup_date: Date(),
                        end_date: Date(),
                        update_date: Date(),
                        notes: 'viva la raza!',
                        name: 'Mexico City'
                    })
                    index += 1

                })
                return Promise.all(create_promises).catch(err => console.log("\n\n04" + err))
            })
            .then(()=>{

                Cage.model.findAll().then((cages) => {
                    log_json(cages)
                    return {foo: cages.length}
                })
                .then((cat) =>{
                    log_json(cat)
                }).catch(err => console.log("\n\n05" + err))


            })
            .then(() =>{
                let type_map = {}
               return Enum.model.findAll({attributes: ['id', 'description', 'type'],
                    where: {type: ['SEX', 'MOUSE_STATUS', 'MOUSE_GENOTYPE']}}) })
                    .then(types => {
                        types.forEach(type => {
                            type_map[type.type][type.description].id = type.id
                        })
                    })
                    .catch(err => console.log("\n\n03" + err))
            })
            .then((type_map) =>{
                let index = 100
                Mouse.model.create(
                    {
                        id_alias: index += 1,
                        genotype_id: map['MOUSE_GENOTYPE'][]

                })
            })


        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });