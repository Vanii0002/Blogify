import JWT from "jsonwebtoken";

const secret="superMan@123";

function createTokenForUser(user){
const payload={
    _id:user._id,
    Email:user.Email,
    profileImage:user.profileImage,
    role:user.role

};

const token =JWT.sign(payload,secret);
return token;
}

function validateToken(token)
{
    const payload=JWT.verify(token,secret);
    return payload;
}

export default {createTokenForUser,validateToken};