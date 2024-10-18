import React, { useState } from "react";
import "./index.scss";
import { Checkbox, Input } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

function SmallTask(props) {
    const { smallTask } = props;

    const {aim, description, startTime} = smallTask;

    const [checked, setChecked] = useState(smallTask.checked)

    const onChangeChecked = () => {
        setChecked(!checked);
    };

    return (
        <div className="small-task-container row">
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
                    checked={checked}
                    onChange={onChangeChecked}
                />
            </div>
        </div>
    );
}

export default SmallTask;
