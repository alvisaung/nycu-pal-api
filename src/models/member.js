module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "Member",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      research_dir: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img_url: DataTypes.STRING,
      experiences: DataTypes.TEXT,
      phone: DataTypes.STRING,
      is_graduated: DataTypes.BOOLEAN,
      graduate_paper: DataTypes.STRING,
    },
    {
      tableName: "member",
      timestamps: false,
      indexes: [{ fields: ["id"] }],
    }
  );
  Member.associate = (models) => {
    Member.belongsTo(models.MemberType, { foreignKey: "MemberTypeId" });
  };

  return Member;
};
