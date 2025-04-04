import Event from './Event';
import Church from './Church';
import Manager from './Manager';
import EventChurch from './EventChurch';
import EventChurchMember from './EventChurchMember';

// Event와 Church 간의 관계 설정
Event.belongsToMany(Church, { through: EventChurch, foreignKey: 'event_ID' });
Church.belongsToMany(Event, { through: EventChurch, foreignKey: 'church_ID' });

// Event와 Manager 간의 관계 설정
Event.belongsToMany(Manager, { through: EventChurch, foreignKey: 'event_ID' });
Manager.belongsToMany(Event, { through: EventChurch, foreignKey: 'manager_ID' });

// Church와 Manager 간의 관계 설정
Church.belongsToMany(Manager, { through: EventChurch, foreignKey: 'church_ID' });
Manager.belongsToMany(Church, { through: EventChurch, foreignKey: 'manager_ID' });

// EventChurch와 EventChurchMember 간의 관계 설정
EventChurch.hasMany(EventChurchMember, { foreignKey: 'event_church_id' });
EventChurchMember.belongsTo(EventChurch, { foreignKey: 'event_church_id' });

export {
  Event,
  Church,
  Manager,
  EventChurch,
  EventChurchMember
}; 