import SampleEventModel from '../models/SampleEvent';
import sequelize from '../config/sequelize';

const sampleEvents = [
  {
    event_Name: '성경퀴즈대회',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '1월',
  },
  {
    event_Name: 'YM Summit',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '1월',
  },
  {
    event_Name: '상반기 연합 BT',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '2월',
  },
  {
    event_Name: '컨퍼런스',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '3월',
  },
  {
    event_Name: '올림픽 설명회',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '4월',
  },
  {
    event_Name: '올림픽',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '5월',
  },
  {
    event_Name: '조정관 학교 101',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '6월',
  },
  {
    event_Name: '조정관 학교 201',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '6월',
  },
  {
    event_Name: 'T&T Camp',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '7월',
  },
  {
    event_Name: '감독관 학교 101',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '8월',
  },
  {
    event_Name: 'YM MIT',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '8월',
  },
  {
    event_Name: '하반기 연합 BT',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '9월',
  },
  {
    event_Name: '영성수련회',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '10월',
  },
  {
    event_Name: '성경퀴즈대회 설명회',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '11월',
  },
  {
    event_Name: '비전캠프',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '12월',
  },
  {
    event_Name: '장학캠프',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '미정',
  },
  {
    event_Name: '수시 BT',
    event_Location: '미정',
    event_Year: '미정',
    event_Date: '미정',
    event_Open_Available: '비공개',
    event_Place: '미정',
    event_Month: '미정',
  },
];

const seedSampleEvents = async () => {
  try {
    // Sync the database
    await sequelize.sync({ force: true });

    // Create sample events
    await SampleEventModel.bulkCreate(sampleEvents);

    console.log('Sample events seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sample events:', error);
    process.exit(1);
  }
};

seedSampleEvents(); 