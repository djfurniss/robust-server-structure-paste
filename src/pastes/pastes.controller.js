const pastes = require("../data/pastes-data");

//---VALIDATION---
    //old validation
// const bodyHasTextProperty = (req, res, next) =>{
//     const { data: { text } = {} } = req.body
//     if (text) next();
//     if (!text){
//     next({status: 404, message: "text property required"})
//     };
// };

    //new validation
function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
        return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}` });
    };
};

function exposurePropertyIsValid(req, res, next) {
    const { data: { exposure } = {} } = req.body;
    const validExposure = ["private", "public"];
    if (validExposure.includes(exposure)) {
      return next();
    }
    next({
      status: 400,
      message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
    });
};

function syntaxPropertyIsValid(req, res, next) {
    const { data: { syntax } = {} } = req.body;
    const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
    if (validSyntax.includes(syntax)) {
        return next();
    }
    next({
        status: 400,
        message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
    });
};

function expirationIsValidNumber(req, res, next){
    const { data: { expiration }  = {} } = req.body;
    if (expiration <= 0 || !Number.isInteger(expiration)){
        return next({
            status: 400,
            message: `Expiration requires a valid number`
        });
    }
    next();
};

const pasteExists = (req, res, next) => {
    const pasteId = Number(req.params.pasteId)
    const foundPaste = pastes.find(paste => paste.id === pasteId)
    if (foundPaste) {
        res.locals.paste = foundPaste
        return next() 
    } next({status: 404, message: `paste id: ${pasteId} not found`})
};

const userHasPastes = (req, res, next) => {
    const userId = Number(req.params.userId);
    if (userId) {
        const hasPastes = pastes.filter(paste=> paste.user_id === userId)
        if (hasPastes.length) {
            return next();
        }else {
            return next({status: 400, message: "This user does not have any pastes"})
        }
    }
    next();
}

//---LIST---
function list(req, res) {
    const userId = Number(req.params.userId)
    res.json({ data: pastes.filter(userId ? (paste)=> paste.user_id === userId : paste=>paste) });
};

//---CREATE---
function create (req, res){
    let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
    const newPaste = {
        id: ++lastPasteId, // Increment last ID, then assign as the current ID
        name,
        syntax,
        exposure,
        expiration,
        text,
        user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
};

//---READ---
function read(req, res){
    res.json({ data: res.locals.paste });     
};

//---UPDATE---
function update(req, res) {
    const paste = res.locals.paste
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  
    // Update the paste
    paste.name = name;
    paste.syntax = syntax;
    paste.expiration = expiration;
    paste.exposure = exposure;
    paste.text = text;
  
    res.json({ data: paste });
};

//---DELETE---
function destroy(req, res) {
    const { pasteId } = req.params;
    const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedPastes = pastes.splice(index, 1);
    res.sendStatus(204);
};

module.exports = {
    list: [userHasPastes, list],
    create: [
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        bodyDataHas("user_id"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        create],
    read: [pasteExists, read],
    update: [
        pasteExists,
        bodyDataHas("name"),
        bodyDataHas("syntax"),
        bodyDataHas("exposure"),
        bodyDataHas("expiration"),
        bodyDataHas("text"),
        exposurePropertyIsValid,
        syntaxPropertyIsValid,
        expirationIsValidNumber,
        update],
    delete: [pasteExists, destroy]
};