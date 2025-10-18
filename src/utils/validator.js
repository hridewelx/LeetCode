import validator from "validator";

const validateInformation = (data) => {
    try {
        const mandatoryFields = ["firstName", "emailId", "password"];
        mandatoryFields.forEach((field) => {
            if (!data[field] || data[field].trim() === "") {
                throw new Error(`${field} is required`);
            }
        });

        if (!validator.isEmail(data.emailId)) {
            throw new Error("Invalid email");
        }

        if (!validator.isStrongPassword(data.password)) {
            throw new Error("Invalid password");
        }
    } catch (error) {
        throw error;
    }
}

export default validateInformation;