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
        modelName: 'blog',
        hooks: {
            // Invokes sanitisation code whenever creating or updating the model
            beforeSave: async (post, options) => {
                post.body = sanitizeHtml(post.body);
                return post;
            }
        }
    }
);