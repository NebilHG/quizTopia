const jwt= require('jsonwebtoken')
const {sendError} = require('../responses');


const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '');
            const bodyId = request.event.body.id;

            console.log('Received Token: ', token);

            if (!token) {
                return sendError(400, { success: false, error: "No token" });
              }

            const data = jwt.verify(token, 'a1b1c1');
            console.log('Extracted User ID:', data.userid);
            
            request.event.userid = data.userid;
            //request.event.username = data.username;

            return request.response;
        } catch (error) {
            console.log(error);

            return sendError(401, { success: false, error: "Invalid or expired token" });
        }
    },
    onError: async (request) => {
        request.event.error = '401';
        return request.response;
    }
};

module.exports = { validateToken };
