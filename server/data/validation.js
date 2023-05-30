let methodsToExport = {
    checkForSpace: (value, arg) => {
        const checkForSpaceRegex = /^\S*$/;
        if (!checkForSpaceRegex.test(value)) throw { statusCode: 400, message: `${arg} cannot contain spaces` };
        return value;
    },

    isArgumentPassed: (obj) => {
        for (const [key, value] of Object.entries(obj)) {
            if (!value) throw { statusCode: 400, message: `All arguments must be passed` };
        }
    },

    isValidString: (str) => {
        if (typeof str != 'string') throw { statusCode: 400, message: `${args} is not a valid string` };
        return str;
    },

    isStrEmpty: (str) => {
        if (!str.trim() || str.length < 1) throw { statusCode: 400, message: `${str} cannot be empty` };
        return str;
    },

    validateStr: (str) => {
        isValidStr(str);
        isStrEmpty(str);

        return str.trim();
    },

    validateInteger: (num) => {
        if (isNaN(parseInt(num))) throw { statusCode: 400, message: `${num} is not a valid integer` };
        return parseInt(num);
    },

    validateFloat: (num) => {
        if (isNaN(parseFloat(num))) throw { statusCode: 400, message: `${num} is not a valid float` };
        return parseFloat(num);
    },

    isValidObjectID: (id) => {
        const objectIdFormat = /^[a-fA-F0-9]{24}$/;
        id = ObjectId(id);

        if (!ObjectId.isValid(id) || !objectIdFormat.test(id)) throw { statusCode: 400, message: `Given value is not a valid ObjectId` };

        return ObjectId(id);
    }
}

module.exports = methodsToExport;