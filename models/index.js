// Establish relationships here
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

// One (User) to Many (Post)
User.hasMany(Post, {
    foreignKey: 'author_id'
});

Post.belongsTo(User, {
    foreignKey: 'author_id'
});

// One (User) to Many (Comment)
User.hasMany(Comment, {
    foreignKey: 'commenter_id'
});

Comment.belongsTo(User, {
    foreignKey: 'commenter_id'
});

// One (Post) to Many (Comment)
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

module.exports = {
    User,
    Post,
    Comment
}