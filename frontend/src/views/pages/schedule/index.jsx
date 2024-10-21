import React, { useContext, useEffect, useState } from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DateTask from "./components/DateTask";
import progressAPI from "../../../api/progressAPI";
import { AuthContext } from "../../../context/authContext";
import { PROGRESSSTATUSENUM } from "../../../constants/enum";

function Schedule() {
    const [data, setData] = useState([]);

    const [selectedDay, setSelectedDay] = useState(dayjs());

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const callAPI = async () => {
            const response = await progressAPI.getTaskByDate(user.id, selectedDay.format('DD-MM-YYYY'));
            // const response = await progressAPI.getTaskByDate(
            //     "67129cbb09f4ab91f1a24903",
            //     "24-10-2024"
            // );

            const responseData = response.data.data;

            const previousDay = selectedDay
                .subtract(1, "day")
                .format("DD-MM-YYYY");
            const nextDay = selectedDay.add(1, "day").format("DD-MM-YYYY");
            const today = selectedDay.format("DD-MM-YYYY");

            const data2 = [];
            data2.push({
                date: previousDay,
                tasks: responseData["yesterdayTasks"].map((taskObject) => {
                    const task = taskObject.task;
                    console.log(task);
                    return {
                        id: task.id,
                        aim: task.name,
                        description: task.description,
                        startTime: task.timeExpired,
                        checked:
                            taskObject.status === PROGRESSSTATUSENUM.complete,
                        time: previousDay,
                    };
                }),
            });
            data2.push({
                date: today,
                tasks: responseData["todayTasks"].map((taskObject) => {
                    const task = taskObject.task;
                    return {
                        id: task.id,
                        aim: task.name,
                        description: task.description,
                        startTime: task.timeExpired,
                        checked:
                            taskObject.status === PROGRESSSTATUSENUM.complete,
                        time: today,
                    };
                }),
            });
            data2.push({
                date: nextDay,
                tasks: responseData["tommorrowTasks"].map((taskObject) => {
                    const task = taskObject.task;
                    return {
                        id: task.id,
                        aim: task.name,
                        description: task.description,
                        startTime: task.timeExpired,
                        checked:
                            taskObject.status === PROGRESSSTATUSENUM.complete,
                        time: nextDay,
                    };
                }),
            });
            setData(data2);
        };
        callAPI();
    }, [user.id, selectedDay]);

    const handleChange = (date) => {
        setSelectedDay(date);
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
                        value={selectedDay}
                        onChange={handleChange}
                        format="DD-MM-YYYY"
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
