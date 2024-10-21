import React, { useState } from "react";
import "./index.scss";
import { Checkbox, Input, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { PROGRESSSTATUSENUM } from "../../../../../constants/enum";
import progressAPI from "../../../../../api/progressAPI";

function SmallTask(props) {
    const { smallTask } = props;

    const { aim, description, startTime, id, checked, time } = smallTask;

    const [messageApi, contextHolder] = message.useMessage();
    const [checkedTask, setCheckedTask] = useState(checked);

    const updateTask = async (status) => {
        try {
            const checkedStatus = status
                ? PROGRESSSTATUSENUM.complete
                : PROGRESSSTATUSENUM.inComplete;
            const response = await progressAPI.updateProgress(
                id,
                time,
                checkedStatus
            );
            messageApi.success('Cập nhập trạng thái thành công ');
            console.log(response);

        } catch (e) {
            messageApi.error('Cập nhập trạng thái thất bại');
            console.log(e);
        }
    };
    const onChangeChecked = () => {
        const afterStatus = !checkedTask;
        updateTask(afterStatus);
        setCheckedTask(afterStatus);
    };

    return (
        <div className="small-task-container row">
            {contextHolder}
            <div className="col-3">
                <Input
                    className="small-task-item"
                    value={aim}
                    placeholder="Mục tiêu"
                    readOnly
                />
            </div>
            <div className="col-6">
                <Input
                    className="small-task-item"
                    value={description}
                    placeholder="Mô tả"
                    readOnly
                />
            </div>
            <div className="col-2">
                <Input
                    value={startTime ? startTime : null}
                    className="small-task-item"
                    readOnly
                />
            </div>
            <div className="col-1 d-flex justify-content-center">
                <Checkbox
                    className="col-1"
                    checked={checkedTask}
                    onChange={onChangeChecked}
                />
            </div>
        </div>
    );
}

export default SmallTask;
