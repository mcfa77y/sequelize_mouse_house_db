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

function random_int(max) {
    return Math.floor(Math.random() * (max));
}
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
                    Enum.model.create({description: 'breed_status_0', type: 'BREED_STATUS'}),
                    Enum.model.create({description: 'breed_status_1', type: 'BREED_STATUS'}),
                    Enum.model.create({description: 'male', type: 'SEX'}),
                    Enum.model.create({description: 'female', type: 'SEX'}),
                    Enum.model.create({description: 'mouse_status_0', type: 'MOUSE_STATUS'}),
                    Enum.model.create({description: 'mouse_status_1', type: 'MOUSE_STATUS'}),
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
                    return Cage.model.create({id_alias: index += 1,
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
            .then(() =>{
                let type_map = {}
                return Enum.model.findAll(
                    {
                        attributes: ['id', 'type'],
                        where: {type: ['SEX', 'MOUSE_STATUS', 'MOUSE_GENOTYPE']}
                    })
                    .then(types => {
                        // log_json(types)
                        let type_map = {}
                        types.forEach(type => {
                            log_json(type)
                            if (type_map[type.type]){
                                type_map[type.type].push(type.id)
                            }
                            else {
                              type_map[type.type] = [type.id]
                            }
                        })
                        return type_map
                    })
                    .catch(err => console.log("\n\n03" + err))
            })
            .then((type_map) =>{
                log_json(type_map)
                let index = 100
                for(i=0; i < 10; i++){
                    const random_g =random_int(type_map.MOUSE_GENOTYPE.length)
                    const random_sx =random_int(type_map.SEX.length)
                    const random_s =random_int(type_map.MOUSE_STATUS.length)
                    const random_e = random_int(100)
                    Mouse.model.create(
                    {
                        status_id: type_map.MOUSE_STATUS[random_s],
                        id_alias: index += 1,
                        genotype_id: type_map.MOUSE_GENOTYPE[random_g],
                        dob: Date(),
                        sex_id: type_map.SEX[random_sx],
                        ear_tag: random_e,
                        notes: 'i am minerva mouse ' + index
                    })
                }


            })


        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });