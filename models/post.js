const sequelize = require('../config/db');
const { Model, DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        author_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT
        }
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'post',
        hooks: {
            // Invokes sanitisation code whenever creating or updating the model
            beforeSave: async (post, options) => {
                try {
                    post.body = sanitizeHtml(post.body);
                    return post;
                } catch (error) {
                    console.error("An error occured while trying to sanitise the content provided: ", error);
                    return undefined;
                }
            }
        }
    }
);

module.exports = Post;