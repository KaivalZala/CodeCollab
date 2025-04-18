// import jwt from "jsonwebtoken";

// const userAuth = (req, res, next) => {
//     const authHeader = req.header("Authorization");

//     // ✅ Ensure the Authorization header exists and is properly formatted
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ 
//             success: false, 
//             message: "Access Denied. Invalid or missing token."
//         });
//     }

//     const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next(); // ✅ Proceed to the next middleware or route handler
//     } catch (error) {
//         let errorMessage = "Invalid Token"; // Default error message

//         // ✅ Handle specific JWT errors
//         if (error.name === "TokenExpiredError") {
//             errorMessage = "Token has expired. Please log in again.";
//         } else if (error.name === "JsonWebTokenError") {
//             errorMessage = "Token is invalid.";
//         }

//         return res.status(401).json({ success: false, message: errorMessage });
//     }
// };

// export default userAuth;





import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    // ✅ Ensure the Authorization header exists and is properly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false, 
            message: "Access Denied. Invalid or missing token."
        });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Log decoded token in development mode
        if (process.env.NODE_ENV === "development") {
            console.log("Decoded Token:", decoded);
        }

        req.user = decoded; // Attach decoded user info to the request
        next(); // ✅ Proceed to the next middleware or route handler
    } catch (error) {
        let errorMessage = "Invalid Token"; // Default error message

        // ✅ Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            errorMessage = "Token has expired. Please log in again.";
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Token is invalid.";
        }

        // ✅ Log error in development mode
        if (process.env.NODE_ENV === "development") {
            console.error("JWT Error:", error);
        }

        return res.status(401).json({ 
            success: false, 
            message: errorMessage,
            code: error.name // Include the error name for easier debugging
        });
    }
};

export default userAuth;