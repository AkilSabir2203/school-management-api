import { globalErrorHandler, notFound } from "./error-middleware.js";
import { handleValidationErrors, validateAddSchool, validateListSchools } from "./validation-middleware.js";

export { globalErrorHandler, handleValidationErrors, notFound, validateAddSchool, validateListSchools };
