function generatePassword() {
    let letters = process.env.GENERATEPASSWORD;
    let password = "";

    for (let i = 0; i < 12; i++) {
        let generate = letters[Math.floor(Math.random() * 62)];
        password += generate;
    }

    return password;
}

module.exports = generatePassword;