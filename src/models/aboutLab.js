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
      banner_urls: {
        type: DataTypes.JSON,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("banner_urls");
          if (!rawValue) return null;

          const parsed = JSON.parse(rawValue);

          return parsed;
        },
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
