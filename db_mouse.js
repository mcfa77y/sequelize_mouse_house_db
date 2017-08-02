const Sequelize = require('sequelize')
// Constructor
class Mouse_DB {
    constructor(_db_server, _Cage, _Breed, _Enum) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.model = this._model(_Breed, _Cage, _Enum)
    }

    _model(_Breed, _Cage, _Enum) {
        const model = this.db_server.define('sequelize_mouse',
        {
            id_alias:{type: Sequelize.STRING},
            ear_tag:{type: Sequelize.STRING},
            dob:{type: Sequelize.DATE},
            notes:{type: Sequelize.TEXT}
        },
        {
            underscored: true,
            timestamps: true,
            paranoid: true
        })

        model.belongsTo(_Cage)
        model.belongsTo(_Breed)

        model.belongsTo(_Enum, {as: 'sex', foreignKey : 'sex_id'})
        model.belongsTo(_Enum, {as: 'genotype', foreignKey : 'genotype_id'})
        model.belongsTo(_Enum, {as: 'status', foreignKey : 'status_id'})
        return model
    }

}

// export the class instance
module.exports = function(_db_server, _Breed, _Cage, _Enum) {
    return new Mouse_DB(_db_server, _Breed, _Cage, _Enum)
}