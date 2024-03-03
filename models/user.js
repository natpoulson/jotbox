const { Model, DataTypes } = require('sequelize');
const crypt = require('bcrypt');

class User extends Model {
    static rounds = 10;
    checkLogin(password) {
        return crypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        display_name: {
            type: DataTypes.STRING(30),
            defaultValue: this.email
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamp: true,
        underscored: true,
        modelName: 'user',
        hooks: {
            beforeSave: async (user, options) => {
                try {
                    user.password = await crypt.hash(user.password, User.rounds);
                    return user;
                } catch (error) {
                    console.error('Error while attempting to treat password: ', error); // You want to genericise this and include NOTHING if ever going prod
                    return undefined;
                }
            }
        }
    }
);

module.exports = User;