import React, { useState } from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import fakeData from "../../../data/fakeData.json";
import DateTask from "./components/DateTask";

function Schedule() {
    const [data, setData] = useState(fakeData.task);

    const [selectedDate, setSelectedDate] = useState(dayjs()); // Initialize with current date using dayjs()

    const handleChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="schedule-container">
            <div className="schedule-content-container">
                <div className="schedule-content-header-container">
                    <Button
                        icon={<PlusOutlined />}
                        className="schedule-add-task-button"
                    >
                        Thêm mục tiêu
                    </Button>

                    {/* DatePicker to select date */}
                    <DatePicker
                        value={selectedDate}
                        onChange={handleChange}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        className="schedule-date-time-picker"
                    />
                </div>

                <div className="schedule-task-content-container">
                    {data &&
                        data.map((task) => (
                            <DateTask key={task.id} task={task} />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Schedule;
