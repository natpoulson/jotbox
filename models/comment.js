const { Model, DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

class Commment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        sequelize,
        underscored: true,
        modelName: 'comment',
        hooks: {
            beforeSave: async (comment, options) => {
                comment.body = sanitizeHtml(comment.body);
                return comment;
            }
        }
    }
)