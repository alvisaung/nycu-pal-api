module.exports = (sequelize, DataTypes) => {
  const research = sequelize.define(
    "Research",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      statement: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("media_url");
          return rawValue;
        },
      },
      is_img: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "research",
      timestamps: false,
    }
  );
  return research;
};
