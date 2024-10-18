import "./index.scss";
import React from "react";
import { Avatar, Button } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";

function HeaderComponent(props) {
    const {url, title} = props

    const onClickNoti = ()=>{
        console.log("click noti")
    }
    return (
        <div class='d-flex align-items-center justify-content-between header-container'>
            <h1 class='header-title'>{title && title}</h1>
            <div>
                <Button onClick={onClickNoti} icon={<BellOutlined/>} className="header-noti-button"/>
                <Avatar size={45} icon={!url && <UserOutlined color="" />} src={url}/>
            </div>
        </div>
    );
}

export default HeaderComponent;
