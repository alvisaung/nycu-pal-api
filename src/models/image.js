module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    filename: DataTypes.STRING,
    url: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
  });

  return Image;
};
