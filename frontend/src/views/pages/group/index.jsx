import { Avatar, Button, Dropdown, Space, Typography } from "antd";
import "./index.scss";
import BackgroundImage from "./components/background-image/background-image";
import {
  AntDesignOutlined,
  BellOutlined,
  DownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import TextArea from "antd/es/input/TextArea";
import { FaRegImage } from "react-icons/fa";
import { ImGrin } from "react-icons/im";
import PostAPI from "../../../api/postAPI";
import SmallPost from "../individual/SmallPost";
import AddPostForm from "../individual/AddPostForm";
import Modal from "../../../components/modal";

export default function Group() {
  const { user, setUser } = useContext(AuthContext);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sort, setSort] = useState("Phù hợp nhất");
  const [isNotificationOn, setIsNotificationOn] = useState(false);

  const items = [
    {
      key: "1",
      label: "Phù hợp nhất",
    },
    {
      key: "2",
      label: "Mới nhất",
    },
    {
      key: "3",
      label: "Cũ nhất",
    },
  ];

  // Refs for file inputs
  const avatarInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const callAPI = async () => {
    try {
      const response = await PostAPI.getAllPost(user.userId);

      const newPosts = response.data.data.map((post) => ({
        ...post,
        id: post.id,
        content: post.content,
        image: post.image,
        likeNum: post.likes?.length || 0,
        commentNum: post.comments?.length || 0,
        comments: post.comments
          ? post.comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              account: comment.user,
            }))
          : [],
      }));

      console.log(newPosts);
      setPosts(newPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const onChangeNewPost = (value) => {
    setNewPost(value.target.value);
  };

  const handleAddLocalPost = (post) => {
    setPosts((posts) => [
      {
        ...post,
        id: post.id,
        content: post.content,
        image: post.image,
        likeNum: post.likes?.length || 0,
        commentNum: post.comments?.length || 0,
        comments: post.comments
          ? post.comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              account: comment.user,
            }))
          : [],
      },
      ...posts,
    ]);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };
  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const handleTurnOnNotification = () => {
    setIsNotificationOn(false);
  };

  const handleTurnOffNotification = () => {
    setIsNotificationOn(true);
  };

  const handleSort = (e) => {
    const sortItem = items.map((item, _) => {
      if (item.key === e.key) {
        return item.label;
      }
    });
    setSort(sortItem);
  };

  return (
    <div
      className="group-section"
      style={{
        padding: 10,
        margin: 10,
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {showAddForm && (
        <Modal onClickOutside={handleCloseAddForm}>
          <AddPostForm
            handleAddLocalPost={handleAddLocalPost}
            handleCloseForm={handleCloseAddForm}
          />
        </Modal>
      )}

      <BackgroundImage />
      <h2 className="text-uppercase fw-bold mt-2 ms-3">
        Cộng đồng hướng đến lối sống lành mạnh
      </h2>
      <div className="group-description-section ms-3">
        <div className="member-number-section">
          <div className=" member-number">
            <TeamOutlined />
            <span>27.4K Thành viên</span>
          </div>
          <Avatar.Group>
            {Array.from({ length: 5 }).map((index) => {
              return (
                <Avatar
                  key={index}
                  style={{ backgroundColor: "#1677ff" }}
                  icon={<AntDesignOutlined />}
                />
              );
            })}
          </Avatar.Group>
        </div>

        <div className="notify-button-section me-4">
          {isNotificationOn ? (
            <Button
              className="turn-on-notify-button"
              onClick={handleTurnOnNotification}
            >
              <BellOutlined />
              <span>Bật thông báo</span>
            </Button>
          ) : (
            <Button
              className="turn-off-notify-button"
              onClick={handleTurnOffNotification}
            >
              <BellOutlined />
              <span>Tắt thông báo</span>
            </Button>
          )}
        </div>
      </div>

      <div className="new-post-container">
        <img alt="user avatar" src={user.avatar} className="new-post-avatar" />
        <div className="new-post-input-container">
          <TextArea
            placeholder="Bạn đang nghĩ gì ?"
            className="new-post-input"
            autoSize
            value={newPost}
            onChange={onChangeNewPost}
            onClick={handleShowAddForm}
          />
          <div className="new-post-button-container">
            <Button icon={<FaRegImage />} className="new-post-button" />
            <Button icon={<ImGrin />} className="new-post-button" />
          </div>
        </div>
      </div>

      <div className="sort">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["1"],
            onClick: handleSort,
          }}
        >
          <Typography.Link>
            <Space className="sortLabel">
              {sort}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>

      <div className="posts-container">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => <SmallPost post={post} user={user} />)}
      </div>
    </div>
  );
}
