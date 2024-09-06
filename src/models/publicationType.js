module.exports = (sequelize, DataTypes) => {
  const PublicationType = sequelize.define(
    "PublicationType",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "publication_type",
      timestamps: false,
    }
  );
  PublicationType.associate = (models) => {
    PublicationType.hasMany(models.Publication, { foreignKey: "PublicationTypeId" });
  };
  return PublicationType;
};
