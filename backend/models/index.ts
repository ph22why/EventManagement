import { Sequelize, Model, DataTypes } from 'sequelize';
import Event from './Event';
import Church from './Church';
import EventChurch from './EventChurch';
import EventChurchMember from './EventChurchMember';
import Manager from './Manager';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'awana_events',
});

// Event 모델 정의
const EventModel = sequelize.define('Event', {
  event_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_Name: DataTypes.STRING,
  event_Date: DataTypes.DATE,
  event_Location: DataTypes.STRING,
  event_Description: DataTypes.TEXT,
  event_Place: DataTypes.STRING,
  event_Month: DataTypes.INTEGER,
  event_Year: DataTypes.INTEGER,
  event_Open_Available: DataTypes.BOOLEAN,
});

// Church 모델 정의
const ChurchModel = sequelize.define('Church', {
  church_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  church_reg_ID: DataTypes.STRING,
  church_sub_ID: DataTypes.STRING,
  church_Name: DataTypes.STRING,
  church_Location: DataTypes.STRING,
  church_Phone: DataTypes.STRING,
});

// Manager 모델 정의
const ManagerModel = sequelize.define('Manager', {
  manager_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manager_Name: DataTypes.STRING,
  manager_Phone: DataTypes.STRING,
  manager_Email: DataTypes.STRING,
  manager_Password: DataTypes.STRING,
});

// Define associations
Event.hasMany(EventChurch, { foreignKey: 'event_ID', as: 'EventChurches' });
Church.hasMany(EventChurch, { foreignKey: 'church_ID', as: 'EventChurches' });
EventChurch.belongsTo(Event, { foreignKey: 'event_ID', as: 'AssociatedEvent' });
EventChurch.belongsTo(Church, { foreignKey: 'church_ID', as: 'AssociatedChurch' });
EventChurch.hasMany(EventChurchMember, { foreignKey: 'event_church_id', as: 'ChurchMembers' });
EventChurchMember.belongsTo(EventChurch, { foreignKey: 'event_church_id', as: 'EventChurch' });

// Define many-to-many relationships
Event.belongsToMany(Church, { through: EventChurch, foreignKey: 'event_ID' });
Church.belongsToMany(Event, { through: EventChurch, foreignKey: 'church_ID' });
Event.belongsToMany(Manager, { through: EventChurch, foreignKey: 'event_ID' });
Manager.belongsToMany(Event, { through: EventChurch, foreignKey: 'manager_ID' });
Church.belongsToMany(Manager, { through: EventChurch, foreignKey: 'church_ID' });
Manager.belongsToMany(Church, { through: EventChurch, foreignKey: 'manager_ID' });

// Sync all models with database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables created!');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

const models = {
  EventModel: Event,
  ChurchModel: Church,
  EventChurchModel: EventChurch,
  EventChurchMemberModel: EventChurchMember,
  ManagerModel: Manager
};

export {
  Event as EventModel,
  Church as ChurchModel,
  EventChurch as EventChurchModel,
  EventChurchMember as EventChurchMemberModel,
  Manager as ManagerModel
};

export default models; 