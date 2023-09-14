// 01 Find all the topics and tasks which are thought in the month of October

db.topics.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "topicId",
      foreignField: "topicId",
      as: "taskInfo",
    },
  },
  {
    $match: {
      $and: [
        {
          $and: [
            { topicDate: { $gt: new Date("30-sep-2020") } },
            { topicDate: { $lt: new Date("01-nov-2020") } },
          ],
        },
        {
          $and: [
            { "taskInfo.dueDate": { $gt: new Date("30-sep-2020") } },
            { "taskInfo.dueDate": { $lt: new Date("01-nov-2020") } },
          ],
        },
      ],
    },
  },
  {
    $project: {
      _id: 0,
      topic: 1,
      topicDate: 1,
      "taskInfo.userId": 1,
      "taskInfo.task": 1,
      "taskInfo.dueDate": 1,
      "taskInfo.submitted": 1,
    },
  },
]);

/*------------------------------------------------------------------------------------------*/
// 02 Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.companyDrives.find({
  driveDate: { $gte: new Date("2020-10-15"), $lte: new Date("2020-10-31") },
});

/*------------------------------------------------------------------------------------------*/
// 03 Find all the company drives and students who are appeared for the placement.

db.companyDrives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "userId",
      as: "studentsInfo",
    },
  },
  {
    $project: {
      _id: 0,
      "studentsInfo.userName": 1,
      company: 1,
      driveDate: 1,
      "studentsInfo.userEmail": 1,
      "studentsInfo.userId": 1,
    },
  },
]);

/*------------------------------------------------------------------------------------------*/
// 04 Find the number of problems solved by the user in codekata

db.codekata.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "userId",
      as: "studentsInfo",
    },
  },
  {
    $project: {
      _id: 0,
      userId: 1,
      problemSolved: 1,
      "studentsInfo.userName": 1,
    },
  },
]);

/*------------------------------------------------------------------------------------------*/
// 05 Find all the mentors with who has the mentee's count more than 15

db.users.aggregate([
  {
    $lookup: {
      from: "mentors",
      localField: "mentorId",
      foreignField: "mentorId",
      as: "mentorInfo",
    },
  },
  {
    $group: {
      _id: {
        mentorId: "$mentorInfo.mentorId",
        mentorName: "$mentorInfo.mentorName",
      },
      menteeCount: { $sum: 1 },
    },
  },
  {
    $match: {
      menteeCount: { $gt: 15 },
    },
  },
]);

/*------------------------------------------------------------------------------------------*/
// 06 Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

db.attendance.aggregate([
  {
    $lookup: {
      from: "topics",
      localField: "topicId",
      foreignField: "topicId",
      as: "topicInfo",
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "topicId",
      foreignField: "topicId",
      as: "taskInfo",
    },
  },
  {
    $match: {
      $and: [{ attended: false }, { "taskInfo.submitted": false }],
    },
  },
  {
    $match: {
      $and: [
        {
          $and: [
            { "topicInfo.topicDate": { $gt: new Date("30-sep-2020") } },
            { "topicInfo.topicDate": { $lt: new Date("01-nov-2020") } },
          ],
        },
        {
          $and: [
            { "taskInfo.dueDate": { $gt: new Date("30-sep-2020") } },
            { "taskInfo.dueDate": { $lt: new Date("01-nov-2020") } },
          ],
        },
      ],
    },
  },
  {
    $count: "No_of_students_absent & task not submitted",
  },
]);

/*------------------------------------------------------------------------------------------*/