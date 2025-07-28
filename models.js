const dotenv = require('dotenv');
dotenv.config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DB_DIALECT || 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
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