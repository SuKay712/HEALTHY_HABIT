import React, { useContext, useState } from "react";
import "./MainLayout.scss";
import {
  AppstoreOutlined,
  BellOutlined,
  CalendarOutlined,
  EditOutlined,
  LogoutOutlined,
  RocketOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import HeaderComponent from "../../../components/header";
import { AuthContext } from "../../../context/authContext";
import ToastNotification from "../../../components/toast";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Tổng quan", "/general", <AppstoreOutlined />),
  getItem("Lịch trình", "/schedule", <CalendarOutlined />),
  getItem("Mục tiêu", "/aim", <StarOutlined />),
  getItem("Tiến độ", "/progress", <RocketOutlined />),
  getItem("Cộng đồng", "/group", <TeamOutlined />),
  getItem("Cá nhân", "/individual", <UserOutlined />),
  getItem("Cài đặt", "/setting", <SettingOutlined />, [
    getItem("Chỉnh sửa thông tin", "/update_profile", <EditOutlined />),
    getItem("Chỉnh sửa thông báo", "/update_noti", <BellOutlined />),
  ]),
];

function MainLayout(props) {
  const { Component, currentPage = "Tổng quan" } = props;
  // Component truyền phần ruột vào
  // currentPage nhập 1 trong các giá trị ["Lịch trình","Tổng quan","Mục tiêu", "Tiến độ",
  // "Cộng đồng" , "Cá nhân", "Cài đặt", "Chỉnh sửa thông tin", "Chỉnh sửa thông báo"]

  const [collapsed, setCollapsed] = useState(false);

  const { user } = useContext(AuthContext);

  const pages_url = {
    "Lịch trình": "/schedule",
    "Tổng quan": "/general",
    "Mục tiêu": "/aim",
    "Tiến độ": "/progress",
    "Cộng đồng": "/group",
    "Cá nhân": "/individual",
    "Cài đặt": "/setting",
    "Chỉnh sửa thông tin": "/update_profile",
    "Chỉnh sửa thông báo": "/update_noti",
  };

  const navigate = useNavigate();

  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
    // console.log(menuItem.key);
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="slider-container"
      >
        <div className={`sidebar-title-container`}>
          <h2 class="sidebar-title">{collapsed ? "HH" : "HEALTHY HABIT"}</h2>
        </div>
        <Menu
          className="slider-container"
          defaultSelectedKeys={[pages_url[currentPage]]}
          mode="inline"
          theme="light"
          items={items}
          onClick={onMenuClick}
        />
        <div className="d-flex justify-content-center">
          <Button className="logout-button" icon={<LogoutOutlined />}>
            {!collapsed && "Đăng xuất"}
          </Button>
        </div>
      </Sider>
      <Layout>
        <HeaderComponent title={currentPage} url={user.avatar} />
        {Component}
        <ToastNotification />
      </Layout>
    </Layout>
  );
}

export default MainLayout;
