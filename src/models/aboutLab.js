module.exports = (sequelize, DataTypes) => {
  const AboutLab = sequelize.define(
    "AboutLab",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_gp_url: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "about_lab",
      timestamps: false,
    }
  );

  return AboutLab;
};
