import "./post.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import Comment from "../commentBox/CommentBox";
import { SocketContext } from "../../Contex/SocketContext";
import CommentBox from "../commentBox/CommentBox";
import { axiosInstance } from "../../config";

export default function Post({ post }) {
  let [like, setLike] = useState(post.likes.length);
  let [isLiked, setIsLiked] = useState(false);
  let [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [fetch, setFetch] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    setFetch(false);
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get("/comment/" + post._id);
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [post, fetch]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/user/?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  function likeHandler() {
    try {
      axiosInstance.put("/post/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    socket.emit("sendNotification", {
      senderName: currentUser.username,
      receiverId: post.userId,
      type: "like",
    });
  }

  return (
    <div id={post._id} className={`post `}>
      <div className="postContainer">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={PF + user.profilePicture}
                alt="something"
                className="postProfileImg"
              />
            </Link>
            <span className="postProfileName">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.caption} </span>
          <img src={PF + post.image} alt="" className="postImage" />
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <FavoriteIcon
                className="heartIcon islike"
                onClick={likeHandler}
              />
            ) : (
              <FavoriteBorderIcon onClick={likeHandler} className="heartIcon" />
            )}

            <div className="postLikeDetail">{like} people like it</div>
          </div>
          <div className="postBottomRight">
            {commentIsOpen ? (
              <TextsmsIcon
                className="commentIcon"
                onClick={() => setCommentIsOpen(!commentIsOpen)}
              />
            ) : (
              <TextsmsOutlinedIcon
                className="commentIcon"
                onClick={() => setCommentIsOpen(!commentIsOpen)}
              />
            )}
            <span className="postComments">{comments.length} comments</span>
          </div>
        </div>
        {commentIsOpen && (
          <CommentBox
            post={post}
            user={currentUser}
            comments={comments}
            setFetch={setFetch}
          />
        )}
      </div>
    </div>
  );
}
