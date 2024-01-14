import swaggerJSDoc from "swagger-jsdoc"
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: "Backend app docs",
            description: "Coderhouse Backend project (47285)"
        }
    },
    apis: [path.join(__dirname,'reference','*.yaml')] 
}

export const specs = swaggerJSDoc(swaggerOptions)

 