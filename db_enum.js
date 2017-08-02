const Sequelize = require('sequelize')
// Constructor
class Enum_DB {
    constructor(_db_server) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.model = this._model()
    }
    _model() {
        const model = this.db_server.define('sequelize_enum',
        {
            description:{type: Sequelize.STRING},
            type:{
                type: Sequelize.STRING,
                allowNull: false,
                set(val) {
                    this.setDataValue('type', val.toUpperCase())
                  }
            }
        },
        {
            underscored: true,
             timestamps: true,
             paranoid: true
        })

        return model
    }
}

// export the class instance
module.exports = function(_db_server ) {
    return new Enum_DB(_db_server)
}