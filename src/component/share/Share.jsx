import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../Contex/AuthContext";
import CancelIcon from "@mui/icons-material/Cancel";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ThemeContext } from "../../Contex/ThemeContext";
import { axiosInstance } from "../../config";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //const desc = useRef();
  const [file, setFile] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [desc, setDesc] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setDesc(desc + emoji);
    setOpenEmoji(false);
  };
  const handleEmoji = () => {
    if (openEmoji === true) {
      setOpenEmoji(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      caption: desc,
    };

    if (file) {
      const data = new FormData();
      const fileName = Date.now().toString() + file.name;
      data.append("file", file);
      // data.append("name", fileName);

      try {
        const res = await axiosInstance.post("/upload", data);
        newPost.image = res.data.filename;
        console.log(res);
      } catch (error) {
        console.log("cant upload");
      }
    }
    try {
      await axiosInstance.post("/post", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`share `}>
      <div className="shareContainer">
        <div className="shareTop">
          <img
            src={PF + user.profilePicture}
            alt="profile"
            className="shareProfileImg"
          />
          <input
            value={desc}
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInput"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="shareImage"
            />
            <CancelIcon
              className="cancelButton"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="crimson" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div
              className="shareOption"
              onClick={() => setOpenEmoji(!openEmoji)}
            >
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <div className="shareOptionText">Feeling</div>
            </div>
            <div className="shareOption">
              <LocalOfferIcon htmlColor="darkcyan" className="shareIcon" />
              <div className="shareOptionText">Tag</div>
            </div>

            <div className="shareOption">
              <LocationOnIcon htmlColor="darkorchid" className="shareIcon" />
              <div className="shareOptionText">Location</div>
            </div>
          </div>
          <button className="shareBtn" type="submit">
            Share
          </button>
        </form>
        {openEmoji && (
          <Picker
            data={data}
            onEmojiSelect={addEmoji}
            previewPosition="none"
            theme={`${theme}`}
          />
        )}
      </div>
    </div>
  );
}
