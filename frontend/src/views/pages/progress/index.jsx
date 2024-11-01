import React, { useEffect, useState } from "react";
import "./index.scss";
import { TASKPIORITY } from "../../../constants/enum";
import { Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import fakeData from "../../../data/fakeData.json";
import SmallStatistic from "./component/SmallStatistic";

function Progress() {
  const [taskPiorities, setTaskPiorities] = useState([]);
  const [taskPiority, setTaskPiority] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [progresses, setProgresses] = useState(fakeData.progress);
  const [filterProgress, setFilterProgress] = useState(progresses)

  useEffect(() => {
    const priorities = [
      {
        value: "ALL",
        label: "Toàn bộ",
      },
    ];

    TASKPIORITY.forEach((item) => {
      console.log(item);
      priorities.push({
        value: item.value,
        label: item.label,
      });
    });

    setTaskPiorities(priorities);
  }, []);

  const onChangePiority = (value) => {
    setTaskPiority(value);
    setFilterProgress(progresses.map((progress)=>({
      ...progress,
      tasks: value === "ALL"
        ? progress.tasks 
        : progress.tasks.filter((task) => task.piority === value),
    })))
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
              defaultValue={taskPiority}
              onChange={onChangePiority}
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
          <Button icon={<SearchOutlined />} className="progress-search-button">
            Search
          </Button>
        </div>
      </div>
      <div className="progress-small-statistic-container">
        {filterProgress.map((progress) => (
          <SmallStatistic progress={progress}/>
        ))}
      </div>
    </div>
  );
}

export default Progress;
