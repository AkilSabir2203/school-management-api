import { Sequelize, sequelize } from "../config/db-config.js";
import defineSchoolModel from "./school.js";

const School = defineSchoolModel(sequelize, Sequelize.DataTypes);

export { Sequelize, School, sequelize };

export default {
  Sequelize,
  School,
  sequelize
};
