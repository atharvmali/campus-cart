import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.redirect('/login');
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id) {
            // Fetch complete user data to get email
            const user = await userModel.findById(tokenDecode.id).lean();
            
            if (!user) {
                return res.redirect('/login');
            }
            
            req.body.userId = tokenDecode.id;
            // Set req.userData using token info and user data
            req.userData = {
                _id: tokenDecode.id,
                name: user.name || tokenDecode.name || 'User',
                email: user.email
            };
            console.log("Set userData in middleware:", req.userData);
            next();
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.redirect('/login');
    }
}

export default userAuth;