import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;  // Number of rounds to hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword; // Return the hashed password
    } catch (error) {
        console.error('Error hashing password:', error);  // More informative error logging
        throw new Error('Error hashing password');  // Throw error with a more descriptive message
    }
};
export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword); // Compare password with hashed password
    } catch (error) {
        console.log('Error comparing password:', error);
        throw error; // Throw error so it can be handled in the controller
    }
};
