module.exports = (sequelize, DataTypes) => {
  const Publication = sequelize.define(
    "Publication",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      img_url: DataTypes.STRING,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conference_name: DataTypes.STRING,
      publish_yr: DataTypes.INTEGER,
    },
    {
      tableName: "publications",
      timestamps: true,
    }
  );

  Publication.associate = (models) => {
    Publication.belongsTo(models.PublicationType, { foreignKey: "PublicationTypeId" });
  };

  return Publication;
};
