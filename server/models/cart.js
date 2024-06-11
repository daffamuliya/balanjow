const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn');
const users = require('./users');
const produk = require('./produk'); // Import model produk

const cart = sequelize.define(
  'cart',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: users,
        key: 'id',
      },
    },

    produk_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: produk, // Menambahkan referensi ke model produk
        key: 'id',
      },
    },

    id_penjual: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    harga: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    sub_total: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    gambar: {
      type: DataTypes.BLOB,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'cart',
    timestamps: false,
  }
);

// Definisikan relasi dengan model produk
cart.belongsTo(produk, { foreignKey: 'produk_id' }); // Setiap item dalam keranjang berhubungan dengan satu produk

module.exports = cart;
