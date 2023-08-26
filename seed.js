require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Movie = require('./models/movie')

const seedUsers = async () => {
    try {
        await User.deleteMany();

        const mockUsers = [
            {
                userName: 'Will Smith',
                email: 'user@gmail.com',
                password: await bcrypt.hash('user123',10),
                role: 'user',
                profilePicture: 'https://png.pngtree.com/png-clipart/20210310/original/pngtree-default-male-avatar-png-image_5939655.jpg',
            },
            {
                userName: 'admin Smith',
                email: 'admin@gmail.com',
                password: await bcrypt.hash('admin123',10),
                role: 'admin',
                profilePicture: 'https://png.pngtree.com/png-clipart/20210310/original/pngtree-default-male-avatar-png-image_5939655.jpg',
            }
        ];

    await User.create(mockUsers);
    console.log('Mockup users created successfully');

    } catch(error) {
        console.log('Error occured while seeding Users : ',error)
    }
};

const seedMovies = async () => {
    try {
        await Movie.deleteMany();

        const seedMoviesJson = require('./data/seedMovies.json');

        await Movie.create(seedMoviesJson);

        console.log('Seed movies added successfully');

    } catch(error) {
        console.log('Error occured while seeding movies to database', error);
    }
};

const seedAll = async () => {

    // Guard
    const arguments = process.argv;

    if (!arguments.includes('goodbye-database')) {
        console.log('WARNING!!');
        console.log('You are about to replace all the data in your database');
        console.log('with mockup / seed data ! This operation is ireversable !!');
        console.log('If you know what you are doing, add "goodbye-database" argument.');
        process.exit(1);
    };

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Run the seed functions
    await seedUsers();
    await seedMovies();

    // Finish up
    console.log('Done seeding');
    process.exit(0);
}

seedAll();