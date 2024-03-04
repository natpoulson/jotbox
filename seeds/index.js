const db = require('../config/db');
const { User, Comment, Post } = require('../models');

const userSeeds = require('./users.json');
const postSeeds = require('./posts.json');
const commentSeeds = require('./comments.json');

const seedDatabase = async () => {
    await db.sync({force: true});

    // Users initialise first since all other tables are dependent on them
    await User.bulkCreate(userSeeds);
    // Initialise posts first because comments are dependent on them as well
    await Post.bulkCreate(postSeeds);
    await Comment.bulkCreate(commentSeeds);

    // Quit the app once done
    process.exit(0);
}

seedDatabase();