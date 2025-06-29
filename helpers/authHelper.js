const bcrypt = require("bcrypt");

 const hashPassword = async (password) => {   
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
}

 const comparePassword = async (password, hashedPassword) => {    
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing password");
    }
}
module.exports = { hashPassword, comparePassword };