import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

//css
import liveStyle from "./LiveList.module.css";

//redux
import { useSelector, useDispatch } from "react-redux";
import { action, changeModalOpen, isCreate } from "../../../store/LiveSlice";

//컴포넌트
import LiveSlot from "../../../components/streaming/list/LiveSlot";
import Pagination from "../../../components/util/Pagination";
import FollowSlot from "../../../components/util/FollowSlot";
import Header from "../../../components/util/Header";
import Menu from "../../../components/util/Menu";
import Footer from "../../../components/util/Footer";
import LiveFollow from "../../../components/streaming/list/LiveFollow";
import IntroArea from "../../../components/streaming/list/IntroArea";
import LiveCreate from "../../../components/streaming/list/LiveCreate";
import { login } from "../../../store/UserSlice";

const LiveList = () => {
  const navigate = useNavigate();

  //redux 관리
  let state = useSelector((state: any) => state.live);
  let dispatch = useDispatch();
  const loginUser = JSON.parse(sessionStorage.getItem("loginUser"));

  // 페이지네이션
  const [liveList, setLiveList] = useState([]);
  const [len, setLen] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const offset = (page - 1) * limit;
  const [ModalOpen, setModalOpene] = useState(false);
  // 유저정보 가져오기

  useEffect(() => {
    //리스트 가져오기
    dispatch(
      action.getLiveList({
        userId: "",
        type: "",
        search: "",
        pageNum: page,
      })
    );
    //회원 follow목록 가져오기
  }, []);

  function upload() {
    console.log("upload");
    isCreate(true);
    dispatch(changeModalOpen(true));
  }

  function sortChange(flow: boolean, type, keyword) {
    var id = "";
    if (flow) {
      id = loginUser.id;
    }
    console.log(id);
    dispatch(
      action.getLiveList({
        userId: id,
        type: type,
        search: keyword,
        pageNum: 0,
      })
    );
  }

  return (
    <div>
      {
        // 업로드 모달
        ModalOpen ? (
          <div className={`${liveStyle.createModal}`}>
            <LiveCreate />
          </div>
        ) : null
      }
      <div className={`${liveStyle.total}`}>
        <div className={`${liveStyle.header}`}>
          <Header />
        </div>
        <div>
          {/* 문구 & 해시태그 */}
          <IntroArea />
        </div>

        <div className={`${liveStyle.main}`}>
          {/* 메인은 두 영역으로 나뉨 */}

          <div className={`${liveStyle.menuArea}`}>
            {/* floating menu start */}
            <div>
              <Menu />
            </div>
          </div>

          {/* 메인 컨텐츠 시작 */}
          <div className={`${liveStyle.contentsArea}`}>
            <div className={`${liveStyle.uploadBtn}`}>
              {/* 업로드 버튼 */}
              <button
                onClick={() => {
                  upload();
                }}
              >
                업로드
              </button>
            </div>

            <div className={`${liveStyle.title}`}>
              <div>LIVE</div>
              <div className={`${liveStyle.sortBtn}`}>
                <button
                  onClick={async () => {
                    sortChange(false, "", "");
                  }}
                >
                  ALL
                </button>
                <button
                  onClick={async () => {
                    sortChange(true, "", "");
                  }}
                >
                  FLOWING
                </button>
              </div>
            </div>

            {/* 방송 리스트 */}
            <div className={`${liveStyle.list}`}>
              {liveList?.map((one, index) => {
                return (
                  <div key={index} className={`${liveStyle.onelive}`}>
                    <LiveSlot oneRoom={one} key={index} />
                  </div>
                );
              })}
            </div>

            <div className={`${liveStyle.paginationContainer}`}>
              <Pagination
                total={liveList?.length}
                limit={limit}
                page={page}
                setPage={setPage}
              />
            </div>
          </div>

          <LiveFollow />
        </div>

        <div className={`${liveStyle.footer}`}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LiveList;
