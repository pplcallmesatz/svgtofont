const dotenv = require('dotenv');
dotenv.config();
const { Sequelize, DataTypes } = require('sequelize');

// Update these with your MySQL credentials
const sequelize = new Sequelize(
  process.env.DB_NAME || 'new_font',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

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