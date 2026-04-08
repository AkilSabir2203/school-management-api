import { School } from "../models/index.js";

const EARTH_RADIUS_KM = 6371;

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistance = (userLatitude, userLongitude, schoolLatitude, schoolLongitude) => {
    const latitudeDifference = toRadians(schoolLatitude - userLatitude);
    const longitudeDifference = toRadians(schoolLongitude - userLongitude);

    const a =
        Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
        Math.cos(toRadians(userLatitude)) *
            Math.cos(toRadians(schoolLatitude)) *
            Math.sin(longitudeDifference / 2) *
            Math.sin(longitudeDifference / 2);

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

const createSchool = async ({ name, address, latitude, longitude }) => {
    return School.create({
        name,
        address,
        latitude,
        longitude
    });
};

const getSchoolsSortedByDistance = async (userLatitude, userLongitude) => {
    const schools = await School.findAll();

    return schools
        .map((school) => {
            const schoolData = school.get({ plain: true });

            return {
                ...schoolData,
                distance: Number(
                    calculateDistance(
                        userLatitude,
                        userLongitude,
                        Number(schoolData.latitude),
                        Number(schoolData.longitude)
                    ).toFixed(2)
                )
            };
        })
        .sort((firstSchool, secondSchool) => firstSchool.distance - secondSchool.distance);
};

export { calculateDistance, createSchool, getSchoolsSortedByDistance };