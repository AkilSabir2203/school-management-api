export default function defineSchoolModel(sequelize, DataTypes) {
    return sequelize.define(
        "School",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            longitude: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {
            tableName: "schools",
            timestamps: false
        }
    );
}