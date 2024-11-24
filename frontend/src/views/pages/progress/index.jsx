import React, { useContext, useEffect, useState } from "react";
import "./index.scss";
import { TASKPRIORITY } from "../../../constants/enum";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import SmallStatistic from "./component/SmallStatistic";
import progressAPI from "../../../api/progressAPI";
import { AuthContext } from "../../../context/authContext";

function Progress() {
  const [taskPiorities, setTaskPiorities] = useState([]);
  const [taskPriority, setTaskPriority] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [progresses, setProgresses] = useState([]);
  const [filterProgress, setFilterProgress] = useState(progresses);

  const { user } = useContext(AuthContext);

  const callAPI = async () => {
    try {
      const response = await progressAPI.getAllProgressTaskInDate(
        user.userId,
        selectedDay.format("DD-MM-YYYY")
      );

      const newProgresses = [];

      for (let progress of response.data.data) {
        newProgresses.push({
          date: progress.localDate,
          tasks: progress.incompletedTasks
            ? progress.incompletedTasks.map((task) => {
                return {
                  name: task.name,
                  time: task.timeExpired,
                  priority: task.priority,
                };
              })
            : [],
          percent: {
            COMPLETE: progress.completedTasksCount,
            OVERDUE: progress.overduedTasksCount,
            INCOMPLETE: progress.incompletedTasks
              ? progress.incompletedTasks.length
              : 0,
          },
        });
      }
      setProgresses(newProgresses);
      setFilterProgress(newProgresses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const priorities = [
      {
        value: "ALL",
        label: "Toàn bộ",
      },
    ];

    TASKPRIORITY.forEach((item) => {
      priorities.push({
        value: item.value,
        label: item.label,
      });
    });

    setTaskPiorities(priorities);

    callAPI();
  }, []);

  useEffect(() => {
    console.log(taskPriority)
    setTaskPriority("ALL")
    callAPI();
  }, [selectedDay]);

  const onChangePriority = (value) => {
    setTaskPriority(value);
    setFilterProgress(
      progresses.map((progress) => ({
        ...progress,
        tasks:
          value === "ALL"
            ? progress.tasks
            : progress.tasks.filter((task) => task.priority === value),
      }))
    );
  };
  const handleChange = (date) => {
    setSelectedDay(date);
  };

  return (
    <div className="progress-container">
      <div className="progress-filter-container">
        <h5>Bộ lộc:</h5>
        <div className="progress-filter-main-container">
          <div className="progress-fitler-item">
            <p>Mức độ ưu tiên</p>
            <Select
              placeholder="Chọn độ ưu tiên"
              value={taskPriority}
              onChange={onChangePriority}
              options={taskPiorities}
              className="progress-fitler-item-input"
            />
          </div>
          <div className="progress-fitler-item">
            <p>Thời gian</p>
            <DatePicker
              value={selectedDay}
              onChange={handleChange}
              format="DD-MM-YYYY"
              placeholder="Chọn ngày"
              className="progress-fitler-item-input"
            />
          </div>
        </div>
      </div>
      <div className="progress-small-statistic-container">
        {filterProgress.map((progress) => (
          <SmallStatistic progress={progress} />
        ))}
      </div>
    </div>
  );
}

export default Progress;
