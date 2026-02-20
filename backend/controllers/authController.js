const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming you have a mysql2/promise connection pool exported here

// @desc    Register a Normal User
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, address, role = 'USER' } = req.body;

    try {
        // 1. Check if user already exists
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into database (Role defaults to 'USER' in schema)
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role] 
        );

        res.status(201).json({
            message: 'User registered successfully.',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
};

// @desc    Login for ALL Roles (Admin, User, Store Owner)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 3. Generate JWT Token containing user ID and Role
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Send response (excluding the password)
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
};

// @desc    Update Password for authenticated user
// @route   PUT /api/auth/update-password
// @access  Private (Requires JWT Token)
// const updatePassword = async (req, res) => {
//     const userId = req.userId; 
//     const { newPassword } = req.body;
//     console.log(req.body)

//     if (!newPassword) {
//         return res.status(400).json({ error: 'Please provide a newPassword.' });
//     }
    

//     try {
//         // 1. Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        
//         console.log("Attempting DB update for user:", userId);
//         // 2. Update the database
//         await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
//         console.log("DB update successful");

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (error) {
//         console.error('Update Password Error:', error);
//         res.status(500).json({ error: 'Internal server error while updating password.' });
//     }
// };

const updatePassword = async (req, res) => {
    const userId = req.userId; 
    const { newPassword } = req.body;
    
    // ADD THIS CHECK: Ensure newPassword exists
    if (!newPassword) {
        return res.status(400).json({ error: 'Please provide a newPassword.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        
        console.log("Attempting DB update for user:", userId);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
        console.log("DB update successful");

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Update Password Error:', error);
        res.status(500).json({ error: 'Internal server error while updating password.' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    updatePassword
};