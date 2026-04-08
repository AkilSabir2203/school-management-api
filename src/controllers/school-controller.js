import { StatusCodes } from "http-status-codes";

import { createSchool, getSchoolsSortedByDistance } from "../services/school-service.js";

const addSchool = async (req, res, next) => {
    try {
        const school = await createSchool(req.body);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "School created successfully",
            data: school
        });
    } catch (error) {
        return next(error);
    }
};

const listSchools = async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const schools = await getSchoolsSortedByDistance(Number(latitude), Number(longitude));

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Schools fetched successfully",
            data: schools
        });
    } catch (error) {
        return next(error);
    }
};

export { addSchool, listSchools };