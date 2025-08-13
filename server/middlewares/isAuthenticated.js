import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, please login"
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token, please login again"
            });
        }

        req.id = decode.userId;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, please login"
        });
    }
}

export default isAuthenticated;