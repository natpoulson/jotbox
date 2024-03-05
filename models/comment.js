const sequelize = require('../config/db');
const { Model, DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        commenter_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        post_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT
        }
    },
    {
        sequelize,
        underscored: true,
        modelName: 'comment',
        hooks: {
            beforeSave: async (comment, options) => {
                try {
                    comment.body = sanitizeHtml(comment.body);
                    return comment;
                } catch (error) {
                    console.error("An error occured while trying to sanitise the content provided: ", error);
                    return undefined;
                }
            }
        }
    }
);

module.exports = Comment;