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
                profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
            },
            {
                userName: 'admin Smith',
                email: 'admin@gmail.com',
                password: await bcrypt.hash('admin123',10),
                role: 'admin',
                profilePicture: 'https://pixinvent.com/materialize-material-design-admin-template/laravel/demo-4/images/user/12.jpg',
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

    if (!arguments.includes('i-am-a-pro')) {
        console.log('WARNING!!');
        console.log('You are about to replace all the data in your database');
        console.log('with mockup / seed data ! This operation is ireversable !!');
        console.log('If you know what you are doing, add "i-am-a-pro" argument.');
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