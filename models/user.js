const sequelize = require('../config/db');
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
            type: DataTypes.STRING(30)
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
            allowNull: false,
            validate: {
                len: [6, 40], // Keep the password limit relatively low to ensure it doesn't exceed 64b limit
                usesAll(value) {
                    if  (
                        /[A-Z]/.test(value) && // Test uppercase
                        /[a-z]/.test(value) && // Test lowercase
                        /[0-9]/.test(value) && // Test numerals
                        /[!@#$%&*()]/.test(value) &&// Test special characters (number row only for simplicity)
                        !/\p{Emoji_Presentation}/u.test(value) // Filter out any attempts to use emoji characters
                        ) {
                            return true;
                        }
                    return false;
                }
            }
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
                    if ((user.changed('display_name') || user.isNewRecord) && !user['display_name']) {
                        // It can be safely assumed that the email is present, since it would've been screened out by validation otherwise.
                        // The below will capture everything before the @ symbol and use it as the display name as a default if no input is given.
                        user['display_name'] = /^.+?(?:@)/.exec(user['email'])[0];
                    }
                    if (user.changed('password') || user.isNewRecord) {
                        // This is for scenarios where the password's being changed.
                        // It's safe to assume if the password
                        user.password = await crypt.hash(user.password, User.rounds);
                        return user;
                    }
                } catch (error) {
                    console.error('Error while attempting to process user: ', error); // For debugging only
                    return undefined;
                }
            }
        }
    }
);

module.exports = User;