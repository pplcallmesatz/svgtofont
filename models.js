const { Sequelize, DataTypes } = require('sequelize');

// Use environment variables for DB credentials, with defaults for local dev
const DB_NAME = process.env.DB_NAME || 'font';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql'; // or 'postgres' for Supabase

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
}, { timestamps: true });

const Group = sequelize.define('Group', {
  name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

const Icon = sequelize.define('Icon', {
  filename: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

// Associations
User.hasMany(Group, { foreignKey: 'user_id' });
Group.belongsTo(User, { foreignKey: 'user_id' });
Group.hasMany(Icon, { foreignKey: 'group_id' });
Icon.belongsTo(Group, { foreignKey: 'group_id' });
User.hasMany(Icon, { foreignKey: 'user_id' });
Icon.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Group, Icon }; 