const Sequelize = require('sequelize')
// Constructor
class Enum_Type_DB {
    constructor(_db_server) {
        // always initialize all instance properties
        this.db_server = _db_server
        this.model = this.model()
    }
    model() {
        const model = this.db_server.define('sequelize_enum_type',
        {
            code:{
                type: Sequelize.STRING,
                allowNull: false,
                set(val) {
                    this.setDataValue('code', val.toUpperCase())
                }
            }
        },
        {underscored: true,
         timestamps: true,
         paranoid: true})
        return model
    }
}

// export the class instance
module.exports = function(_db_server) {
    return new Enum_Type_DB(_db_server)
}