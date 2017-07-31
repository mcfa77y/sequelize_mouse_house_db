const Sequelize = require('sequelize')
// Constructor
class Breed_DB {
    constructor(_db_server, _Enum) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.Enum = _Enum
        this.model = this.model()
    }
    model() {
        const model = this.db_server.define('sequelize_breed',
            {
                id_alias:{type: Sequelize.STRING},
                pairing_date:{type: Sequelize.DATE},
                plug_date:{type: Sequelize.DATE},
                pup_check_date:{type: Sequelize.DATE},
                ween_date:{type: Sequelize.DATE},
                male_count:{type: Sequelize.INTEGER},
                female_count:{type: Sequelize.INTEGER},
                notes:{type: Sequelize.TEXT}
            },
           {underscored: true,
             timestamps: true,
             paranoid: true})

        model.belongsTo(this.Enum, {as: 'Status', foreignKey : 'status_id'})
        return model
    }
}

// export the class instance
module.exports = function(_db_server, _Enum) {
    return new Breed_DB(_db_server, _Enum)
}