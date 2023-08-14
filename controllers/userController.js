const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Get all users (with pagination)
const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 25 } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            select: '-password',
        }

        const users = await User.paginate({}, options);

        const usersFixed = { ... users };
        usersFixed.data = usersFixed.docs;
        delete usersFixed.docs;

        return res.status(200).json(usersFixed);

    } catch(error) {
        next(error);
    }
 };

// Get a user by ID
const getUserById = async (req, res, next) => { 
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) {
            return res.status(404).json({error: 'User not found'});
        }
        return res.status(200).json({data: user});
    } catch(error) {
        next(error);
    }
 };

const createUser = async (req, res, next) => {
    // Validation schema for creating a new user
    const userSchema = Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        profilePicture: Joi.string().required().default('https://png.pngtree.com/png-clipart/20210310/original/pngtree-default-male-avatar-png-image_5939655.jpg'),
        role: Joi.string().optional().default('user').valid('user','admin'),
    });

    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }

        const { userName, email, password, profilePicture, role } = req.body;
        
        const found = User.findOne({email});

        if(found) {
            return res.status(400).json({error: 'This email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            profilePicture,
            role,
        });

        return res.status(201).json({ created: user });
    } catch(error) {
        next(error);
    }
 };

const updateUser = async (req, res, next) => {
    // Validation schema for updating an existing user
    const userSchema = Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(0).required(),
        profilePicture: Joi.string().optional(),
        role: Joi.string().optional().default('user').valid('user','admin'),
    });
    
    try {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }

        const { userName, email, password, profilePicture, role } = req.body;

        let updatedUser;
        if (password !== '') {  // we want to update the password
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    userName,
                    email,
                    password: hashedPassword,
                    profilePicture,
                    role,
                },
                { new: true }
            ).select('-password');
        } else {
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    userName,
                    email,
                    profilePicture,
                    role,
                },
                { new: true }
            ).select('-password');
        };

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ updated: updatedUser });

    } catch(error) {
        next(error);
    }
 };

// Delete use by id
const deleteUser = async (req, res, next) => { 

    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id).select('-password');
    
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        return res.status(200).json({ deleted: deletedUser });

    } catch(error) {
        next(error);
    }
 };

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };