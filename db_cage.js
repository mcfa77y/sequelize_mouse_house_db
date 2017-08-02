const Sequelize = require('sequelize')
// Constructor
class Cage_DB {
    constructor(_db_server, _Enum) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.model = this._model(_Enum)
    }

    _model(_Enum) {
        const model = this.db_server.define('sequelize_cage',
        {
            id_alias:{type: Sequelize.STRING},
            name:{type: Sequelize.STRING},
            setup_date:{type: Sequelize.DATE},
            update_date:{type: Sequelize.DATE},
            end_date:{type: Sequelize.DATE},
            notes:{type: Sequelize.TEXT}
        },
        {
            underscored: true,
            timestamps: true,
            paranoid: true
        })

        model.belongsTo(_Enum, { as:'type', foreignKey : 'type_id'})

        return model

    }
}

// export the class instance
module.exports = function(_db_server, _Enum) {
    return new Cage_DB(_db_server, _Enum)
}