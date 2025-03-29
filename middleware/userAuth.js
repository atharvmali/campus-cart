import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.redirect('/login');
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            // Set req.userData using token info
            req.userData = {
                _id: tokenDecode.id,
                name: tokenDecode.name || 'User'
            };
            next();
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        return res.redirect('/login');
    }
}

export default userAuth;