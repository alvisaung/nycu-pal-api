module.exports = (sequelize, DataTypes) => {
  const MemberType = sequelize.define(
    "MemberType",
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
      tableName: "member_type",
      timestamps: false,
    }
  );
  MemberType.associate = (models) => {
    MemberType.hasMany(models.Member, { foreignKey: "MemberTypeId" });
  };
  return MemberType;
};
