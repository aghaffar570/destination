const Sequelize = require('sequelize');
const pkg = require('../../package.json');
const databaseName = pkg.name;

const db = new Sequelize(`postgres://jhotetiodigsfa:f7c1348384f1c1dec34785a410f6f4925baf9823851363c51d6261b72b0a096c@ec2-54-163-234-88.compute-1.amazonaws.com:5432/di504v7mdcbvp`, {
  logging: false
});

module.exports = db;
