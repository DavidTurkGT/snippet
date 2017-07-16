'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    salt: DataTypes.TEXT,
    iterations: DataTypes.INTEGER,
    hash: DataTypes.TEXT
  }, {});

  Users.associates = (models) => {
    Users.hasMany(
      models.Snippets,
      {as: "snippets", foreignKey: "userId"}
    );
    Users.hasMany(
      models.Stars,
      {as: "stars", foreignKey: "userId"}
    );
  }

  return Users;
};
