import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { RiImageAddFill } from "react-icons/ri";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BsStars } from "react-icons/bs";
import AIAssistant from "./AIAssistant";
import { motion, AnimatePresence } from "framer-motion";
const Createpost = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const[show,setshow]=useState(false);
  const uploadRef = useRef(null); 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

  };

  // cleanup memory links
  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // ---------- REMOVE FILE ----------
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  // ---------- SEND POST ----------
  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", text);
      if (file) formData.append("file", file);

      await axios.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setText("");
      setFile(null);
      setPreviewUrl(null);

      alert("Post Created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div>
      <div className="w-[428px] bg-gradient-background rounded-[55px] shadow-xl/45 ">
        <div className="flex-col justify-center items-center mt-8 p-8 space-y-14 pb-36">
          <p className="text-white text-[48px] text-center">{t("create")}</p>

          {/* TEXT */}
          <Textarea
            placeholder="Share your ideas."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-white"
          />

          {/* PREVIEW AREA */}
          {file && (
            <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <FaFileAlt className="text-gray-600 text-[40px]" />
              )}

              <span>{file.name}</span>

              <button onClick={removeFile}>
                <FaRegTrashAlt className="text-red-500 hover:text-red-700 text-[25px]" />
              </button>
            </div>
          )}

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            ref={uploadRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*, .pdf, .doc, .docx, .txt, .zip"
          />

          {/* BUTTONS */}
          <div className="flex space-x-6">
            {/* UPLOAD FILE BUTTON */}
            <Button onClick={() => uploadRef.current.click()}>
              <RiImageAddFill className="text-white size-[40px]" />
            </Button>

            {/* POST */}
            <Button
              className="text-white bg-post-button w-[100px] h-[41px] text-[24px]"
              onClick={handlePost}
            >
              {t("post")}
            </Button>

            {/* CANCEL */}
            {text.trim() !== "" && (
              <Button
                className="text-white bg-cancel w-[100px] h-[41px] text-[24px]"
                onClick={() => {
                  setText("");
                  removeFile();
                }}
              >
                {t("cancel")}
              </Button>
            )}
          </div>

          
          <div className="text-white text-[24px] text-center leading-11">
            {t("help")}
            <Button className="text-[22px] border-2 rounded-[50px] ml-4 pt-1 pb-1" onClick={()=>setshow(!show)}>
              {t("ai")} <BsStars className="size-[22px]" />
            </Button>
            <AnimatePresence>
            {
            show&&(
             <motion.div    initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.2 }}>
              <AIAssistant/>
              </motion.div>
            )
            }</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createpost;
