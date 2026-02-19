const validateSignup = (req, res, next) => {
    const { name, email, password, address } = req.body;

    // Name: Min 20, Max 60
    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: "Name must be between 20 and 60 characters." });
    }

    // Address: Max 400
    if (address && address.length > 400) {
        return res.status(400).json({ error: "Address cannot exceed 400 characters." });
    }

    // Password: 8-16 chars, 1 uppercase, 1 special
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be 8-16 characters, with at least 1 uppercase letter and 1 special character." });
    }

    // Email standard validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    next();
};

module.exports = { validateSignup };