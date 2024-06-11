const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn');
const users = require('./users');

const active_banner = sequelize.define(
  'active_banner',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: users,
        key: 'id',
      },
    },

    nama_banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gambar: {
      type: DataTypes.BLOB,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Nonaktifkan timestamps
  }
);

active_banner.belongsTo(users, { foreignKey: 'id_user' });

module.exports = active_banner;
