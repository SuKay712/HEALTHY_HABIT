import "./index.scss";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Input } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  ToTopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from "./notification";
import fakeData from "../../data/fakeData.json";
import getItemDropDownSearchPost from "./dropdown";

function HeaderComponent(props) {
  const { url, title } = props;
  const [showNoti, setShowNoti] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [posts, setPosts] = useState(fakeData.individual.posts);
  const [filterPosts, setFilterPosts] = useState(posts);

  const onClickNoti = () => {
    setShowNoti((prev) => !prev);
  };

  const onChangeSearch = (value) => {
    setTxtSearch(value.target.value);
  };

  useEffect(() => {
    const searchText = txtSearch.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchText) ||
        post.account.name.toLowerCase().includes(searchText)
    );
    setFilterPosts(filtered);
  }, [txtSearch, posts]);

  return (
    <div class="d-flex align-items-center justify-content-between header-container">
      <h1 class="header-title">
        {title.trim().toLowerCase() !== "cá nhân" && title}
      </h1>
      {(title.trim().toLowerCase() === "cá nhân" ||
        title.trim().toLowerCase === "cộng đồng") && (
        <Dropdown
          menu={{
            items: getItemDropDownSearchPost(filterPosts),
          }}
          trigger={["click"]}
          placement="bottom"
        >
          <Input
            className="header-tx-search"
            suffix={<SearchOutlined />}
            onChange={onChangeSearch}
            value={txtSearch}
          />
        </Dropdown>
      )}
      <div>
        <div className="header-noti-container">
          <Button
            onClick={onClickNoti}
            icon={<BellOutlined />}
            className="header-noti-button"
          />
          {showNoti && <Notification show={showNoti} setShow={setShowNoti} />}
        </div>
        <Avatar size={45} icon={!url && <UserOutlined color="" />} src={url} />
      </div>
    </div>
  );
}

export default HeaderComponent;
