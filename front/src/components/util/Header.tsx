//redux
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

//redux
import {changeFollowModalOpen} from "../../../store/MypageSlice";
import {changeDetailModalOpen} from "../../../store/FeedSlice";

import UtilStyle from "./Util.module.css";


const Header = () => {

  //redux 관리
  let state = useSelector((state:any)=>state.util);
  let dispatch = useDispatch();

  const navigate = useNavigate();

  return (
    <div className={`${UtilStyle.header_total}`}>
      <div onClick={()=>{navigate(`/`)}} className={`${UtilStyle.header_logo}`}><img src={process.env.PUBLIC_URL + `/img/logo.png`} alt="HDIL" /></div>
      { state.loginYN?
        <div className={`${UtilStyle.etcMenu}`}>
          <div onClick={()=>{navigate(`/closet`)}}>내 옷장</div>
          <div onClick={()=>{navigate(`/mypage`)}}>마이페이지</div>
        </div>:
        <div className={`${UtilStyle.etcMenu}`}>
          <div onClick={()=>{navigate(`/login`)}}>로그인</div>
      </div>
      }
    </div>
  );
};

export default Header;




