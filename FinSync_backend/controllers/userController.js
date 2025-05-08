const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// Helper functions for validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 8;
};

exports.signup = async (req, res) => {
    try {
        console.log('Received signup data:', {
            ...req.body,
            password: req.body.password ? '[HIDDEN]' : undefined,
            confirmPassword: req.body.confirmPassword ? '[HIDDEN]' : undefined
        });
        
        const { firstName, lastName, email, password, confirmPassword, phoneNumber } = req.body;

        // Input validation
        const validationErrors = {};
        
        // Validate firstName
        if (!firstName || firstName.trim().length === 0) {
            validationErrors.firstName = 'First name is required';
        }

        // Validate lastName
        if (!lastName || lastName.trim().length === 0) {
            validationErrors.lastName = 'Last name is required';
        }
        
        // Validate email
        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            validationErrors.email = 'Invalid email format';
        }
        
        // Validate password
        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (!isValidPassword(password)) {
            validationErrors.password = 'Password must be at least 8 characters long';
        }

        // Validate confirm password
        if (!confirmPassword) {
            validationErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                details: validationErrors
            });
        }

        // Create new user
        const newUser = await UserModel.createUser({
            email: email.toLowerCase(),
            password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: phoneNumber || null
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser.UserID,
                email: newUser.Email,
                role: 'user'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.UserID,
                firstName: newUser.First_Name,
                lastName: newUser.Last_Name,
                email: newUser.Email,
                phoneNumber: newUser.Phone_Number,
                dateJoined: newUser.Date_Joined
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        if (error.message.includes('Email already exists')) {
            return res.status(409).json({
                message: 'Signup failed',
                details: { email: 'This email is already registered' }
            });
        }
        res.status(500).json({
            message: 'Error creating user',
            details: { server: 'An unexpected error occurred' }
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Login failed',
                details: { credentials: 'Email and password are required' }
            });
        }

        // Find user
        const user = await UserModel.findUserByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).json({
                message: 'Login failed',
                details: { credentials: 'Invalid email or password' }
            });
        }

        // Verify password
        const isValidPass = await bcrypt.compare(password, user.UserPassword);
        if (!isValidPass) {
            return res.status(401).json({
                message: 'Login failed',
                details: { credentials: 'Invalid email or password' }
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: user.UserID,
                email: user.Email,
                role: 'user'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.UserID,
                firstName: user.First_Name,
                lastName: user.Last_Name,
                email: user.Email,
                phoneNumber: user.Phone_Number
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            details: { server: 'An unexpected error occurred' }
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        const updates = {};
        if (firstName) updates.firstName = firstName.trim();
        if (lastName) updates.lastName = lastName.trim();
        if (email) updates.email = email.toLowerCase();
        if (password) updates.password = password;
        if (phoneNumber) updates.phoneNumber = phoneNumber;

        const updatedUser = await UserModel.updateUser(userId, updates);

        res.json({
            message: 'User updated successfully',
            user: {
                id: updatedUser.UserID,
                firstName: updatedUser.First_Name,
                lastName: updatedUser.Last_Name,
                email: updatedUser.Email,
                phoneNumber: updatedUser.Phone_Number
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'Update failed',
            details: { server: 'An unexpected error occurred' }
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        await UserModel.deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Delete failed',
            details: { server: 'An unexpected error occurred' }
        });
    }
};