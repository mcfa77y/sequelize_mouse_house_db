const Sequelize = require('sequelize')
// Constructor
class Mouse_DB {
    constructor(_db_server, _Cage, _Breed, _Enum) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.Cage = _Cage
        this.Breed = _Breed
        this.Enum = _Enum
        this.model = this.model()
    }

    model() {
        const Model = this.db_server.define('sequelize_mouse',
        {
            id_alias:{type: Sequelize.STRING},
            ear_tag:{type: Sequelize.STRING},
            dob:{type: Sequelize.DATE},
            notes:{type: Sequelize.TEXT}
        },
        {underscored: true,
         timestamps: true,
         paranoid: true})

        Model.belongsTo(this.Cage)
        Model.belongsTo(this.Breed)

        Model.belongsTo(this.Enum, {as: 'Sex', foreignKey : 'sex_id'})
        Model.belongsTo(this.Enum, {as: 'Genotype', foreignKey : 'genotype_id'})
        Model.belongsTo(this.Enum, {as: 'Status', foreignKey : 'status_id'})
        return Model
    }

}

// export the class instance
module.exports = function(_db_server, _Cage, _Breed, _Enum) {
    return new Mouse_DB(_db_server, _Cage, _Breed, _Enum)
}