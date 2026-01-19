const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swagger_output.json'
const endpointsFiles = ['./src/routes/auth.route.js']

swaggerAutogen(outputFile, endpointsFiles)