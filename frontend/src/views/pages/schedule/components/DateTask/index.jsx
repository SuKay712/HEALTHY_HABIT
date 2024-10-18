import React from "react";
import "./index.scss";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import SmallTask from "../SmallTask";

function DateTask(props) {
    const { task } = props;

    const {date, tasks} = task


    return (
        <div className="date-task-container">
            <h6>{date}</h6>
            <div className="row">
                <div className="col-3 d-flex align-items-center date-task-header-items">
                    <CalendarOutlined />
                    <p>Mục tiêu</p>
                </div>
                <div className="col-6 d-flex align-items-center date-task-header-items">
                    <InfoCircleOutlined />
                    <p>Mô tả</p>
                </div>
                <div className="col-2 d-flex align-items-center date-task-header-items">
                    <ClockCircleOutlined />
                    <p>Thời gian bắt đầu làm</p>
                </div>
                <div className="col-1 d-flex align-items-center date-task-header-items">
                    <RocketOutlined />
                    <p>Tiến độ</p>
                </div>
            </div>
            {(!tasks || tasks.length === 0) ? <p class='date-task-no-task'>Không có mục tiêu trong ngày này</p> : tasks.map((smallTask => <SmallTask smallTask ={smallTask}/>))}
        </div>
    );
}

export default DateTask;
