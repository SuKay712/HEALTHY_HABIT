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
// import fakeData from "../../data/fakeData.json";
import getItemDropDownSearchPost from "./dropdown";
import PostAPI from "../../api/postAPI";
import { useNotification } from "../../context/notificationContext";
import { useNavigate } from "react-router";

function HeaderComponent(props) {
  const { url, title } = props;
  const [showNoti, setShowNoti] = useState(false);
  const { notReadCount } = useNotification();
  const [txtSearch, setTxtSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [filterPosts, setFilterPosts] = useState(posts);

  const navigate = useNavigate();

  const onClickNoti = () => {
    setShowNoti((prev) => !prev);
  };

  const callAPI = async () => {
    try {
      const postsAPI = await PostAPI.getAllPost(0, 1000);
      // console.log(postsAPI.data.data.posts)
      setPosts(
        postsAPI.data.data.posts.map((post) => ({
          ...post,
          account: post.postUser,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onChangeSearch = (value) => {
    setTxtSearch(value.target.value);
  };

  const onClickAvatar = () => {
    navigate("/individual");
  };

  useEffect(() => {
    const searchText = txtSearch.toLowerCase();
    const filtered =
      searchText !== ""
        ? posts.filter(
            (post) =>
              post.content.toLowerCase().includes(searchText) ||
              post.account.displayName.toLowerCase().includes(searchText)
          )
        : posts;
    setFilterPosts(filtered);
  }, [txtSearch, posts]);

  return (
    <div class="d-flex align-items-center justify-content-between header-container">
      <h1
        class={`header-title ${
          (title.trim().toLowerCase() === "cá nhân" ||
            title.trim().toLowerCase() === "cộng đồng") &&
          "header-title-search"
        } `}
      >
        {title.trim().toLowerCase() !== "cá nhân" && title}
      </h1>
      {(title.trim().toLowerCase() === "cá nhân" ||
        title.trim().toLowerCase() === "cộng đồng") && (
        <Dropdown
          menu={{
            items: getItemDropDownSearchPost(filterPosts.slice(0, 5)),
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
          {notReadCount !== 0 && (
            <label className="header-noti-not-read">{notReadCount}</label>
          )}
          {showNoti && <Notification show={showNoti} setShow={setShowNoti} />}
        </div>
        <Avatar
          onClick={onClickAvatar}
          size={45}
          icon={!url && <UserOutlined color="" />}
          src={url}
          className="header-user-avatar"
        />
      </div>
    </div>
  );
}

export default HeaderComponent;
