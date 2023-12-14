const mongoose = require('mongoose');
const BASE_URL = process.env.NODE_ENVIRONMENT === 'development'
                    ?   `mongodb://0.0.0.0:27017/${process.env.DEVELOPMENT_MONGO_DB_NAME}`
                    :  `mongodb+srv://${process.env.PRODUCTION_MONGO_USER_NAME}:${process.env.PRODUCTION_MONGO_PASSWORD}@cluster0.oygceyq.mongodb.net/${process.env.PRODUCTION_MONGO_DB_NAME}` ;


mongoose.connect(BASE_URL)
.then(response => {
    console.log("DATABASE connection successfully");
})
.catch(err => {
    console.log("DATABASE connection failed");
})