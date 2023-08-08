const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../config/jwt');
const { AUTH_MAX_AGE } = process.env;

const signUp = async (req,res) => {
    // new user sign-up
    const { userName, email, password, profilePicture } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({error: 'User already exists'});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create the user in database
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            profilePicture,
        });

        const payload = {
            id: newUser.id,
            userName: newUser.userName,
            role: newUser.role,
            profilePicture: newUser.profilePicture,
        };

        const token = await generateToken(payload);

        res.cookie('token', token, {
            httpOnly: false,
            maxAge: AUTH_MAX_AGE,
        });

        return res.status(200).json(payload);
    } catch(error) {
        return res.status(400).json({ error: error });
    }
};

const signIn = async (req,res) => {

    const { email, password } = req.body;

    try {

        // 1. Check if user exists in db

        const user = await User.findOne({ email });
        
        // this email does not exist
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 2. Compare passwords

        const isMatch = await bcrypt.compare(password, user.password);

        // the password is incorrect
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 3. Generate and send token

        // create the payload object
        const payload = {
            id: user.id,
            userName: user.userName,
            role: user.role,
            profilePicture: user.profilePicture,
        };

        // wrap the payload inside a jwt token
        const token = await generateToken(payload);

        // send a cookie containing the token
        res.cookie('token', token, {
            httpOnly: false,
            maxAge: AUTH_MAX_AGE,
        });

        res.status(200).json(payload);
        
    } catch(error) {

        res.status(400).json({error: 'Cannot sign you in'});

    }

};

const signOut = (req,res) => {
    res.clearCookie('token');
    res.status(200).json({message: 'Signed out successfully'});
};

module.exports = { signUp, signIn, signOut };