import { Sequelize, Model, DataTypes } from 'sequelize';
import Church from './Church';
import Event from './Event';
import EventChurch from './EventChurch';
import EventChurchMember from './EventChurchMember';
import Manager from './Manager';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3307'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'awana_events',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
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

// 관계 설정
Event.belongsToMany(Church, { through: EventChurch, foreignKey: 'event_ID' });
Church.belongsToMany(Event, { through: EventChurch, foreignKey: 'church_ID' });

Event.belongsToMany(Manager, { through: EventChurch, foreignKey: 'event_ID' });
Manager.belongsToMany(Event, { through: EventChurch, foreignKey: 'manager_ID' });

Church.belongsToMany(Manager, { through: EventChurch, foreignKey: 'church_ID' });
Manager.belongsToMany(Church, { through: EventChurch, foreignKey: 'manager_ID' });

EventChurch.hasMany(EventChurchMember, { foreignKey: 'event_church_id' });
EventChurchMember.belongsTo(EventChurch, { foreignKey: 'event_church_id' });

// 연결 테스트
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스 연결이 성공적으로 설정되었습니다.');
  })
  .catch((err) => {
    console.error('데이터베이스 연결에 실패했습니다:', err);
  });

export {
  Church,
  Event,
  EventChurch,
  EventChurchMember,
  Manager
};

export default {
  Church,
  Event,
  EventChurch,
  EventChurchMember,
  Manager
}; 