import { useEffect, useState, useRef } from "react";
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import * as StompJs from '@stomp/stompjs';

//css
import chatHistoryStyle from "./ChatHistory.module.css";

const ChatHistory = () => {

    const navigate = useNavigate();

    // a유저와 b유저가 나눈 채팅 기록
    interface ChatList{
        date:string,
        id:string,
        nickname:string,
        profile?:string,
        content:string,
        time:string
    }

    let [chatList, setChatList] = useState<ChatList[]|null>([]); //채팅방 사람들의 채팅 내역들
    let [chat, setChat] = useState<string|null>(''); //내가 치고 있는 채팅
    let [otherNickname, setNickname] = useState<string>(''); //상대방 닉네임

    const nickname:string = "user3"; //나의 닉네임
    // const profileImg = JSON.parse(); //로그인 구현시 가져올 것
    // const userId = JSON.parse(); //로그인 구현 시 가져올 것
    const {roomId} = useParams(); //파라미터에 있는 채팅룸 아이디
    const {otherId} = useParams(); //파라미터에 있는 다른 유저 아이디

    const client = useRef({}); //useRef는 저장공간 또는 DOM요소에 접근하기 위해 사용되는 React Hook == like query selector

    // 1. 서버와 소켓 연결
    function connect(){
        // 클라이언트 소켓 생성
        client.current = new StompJs.Client({
            brokerURL : 'http://localhost:8081/ws',
            onConnect: () => {
                console.log('success');
                subscribe();
            }
        });

        client.current.activate();
    }

    //2. 채팅방 1:1 구독
    function subscribe(){
        client.current.subscribe('sub/soloChat'+roomId,(chatMessage)=>{
            const message = JSON.parse(chatMessage.body);

            setChatList((_chatList)=>[
                ..._chatList, message
            ]);
        });
    }

    //3. 채팅방에 메세지를 보낸다. (사전 셋팅)
    function sendMessage(event, chat){
        event.preventDefault();//버튼 눌렀을 때 새로고침 방지
        if(chat!==""){//빈문자열 입력 방지
            publish(chat);
        }
    }

    //4. 채팅방에 메세지를 보낸다. (서버전송)
    function publish(chat){
        if(!client.current.connected){
            return;
        }

        client.current.publish({
            destination: 'pub/soloChat',
            body: JSON.stringify({
                roomId: roomId,
                userId : 1,
                // nickname: nickname,
                // profileImg: profileImg,
                content: chat,
            })

        });

        setChat('');
    }

    //지금 내가 어떤 id를 가진 유저인지 확인
    const myId:string = "ssafy";


    // let [chatList, setChatList] = useState<ChatList[]>([
    //     {
    //         date:"2023년 7월 15일 토요일",
    //         id:"user3",
    //         nickname:"user3",
    //         // profile:null,
    //         content:"피드 잘보고 있어요~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    //         time:"오후 3:12"
    //     },{
    //         date:"2023년 7월 15일 토요일",
    //         id:"user3",
    //         nickname:"user3",
    //         // profile:null,
    //         content:"저랑 팔로우 해요!",
    //         time:"오후 3:13"
    //     },
    //     {
    //         date:"2023년 7월 16일 일요일",
    //         id:"ssafy",
    //         nickname:"미팅만 50번",
    //         // profile:null,
    //         content:"좋아요! 팔로우해요!",
    //         time:"오전 8:10"
    //     },
    //     {
    //         date:"2023년 7월 16일 일요일",
    //         id:"ssafy",
    //         nickname:"미팅만 50번",
    //         // profile:null,
    //         content:"좋게 봐주셔서 감사합니다!!",
    //         time:"오전 8:11"
    //     },
    //     {
    //         date:"2023년 7월 16일 토요일",
    //         id:"user3",
    //         nickname:"user3",
    //         // profile:null,
    //         content:"꺅 너무 감사합니다 ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ",
    //         time:"오후 3:12"
    //     },{
    //         date:"2023년 7월 17일 일요일",
    //         id:"ssafy",
    //         nickname:"미팅만 50번",
    //         // profile:null,
    //         content:"저번에 해드린 코디는 어떠셨나요?",
    //         time:"오전 8:10"
    //     },{
    //         date:"2023년 7월 17일 일요일",
    //         id:"ssafy",
    //         nickname:"미팅만 50번",
    //         // profile:null,
    //         content:"반응이 좋았나요?",
    //         time:"오전 8:10"
    //     },
    //     {
    //         date:"2023년 7월 17일 일요일",
    //         id:"ssafy",
    //         nickname:"미팅만 50번",
    //         // profile:null,
    //         content:"반응이 좋았나요?",
    //         time:"오전 8:10"
    //     },
    // ]);

    // 현재 채팅이 들어오는 날짜
    let [curDate, setCurDate] = useState<string|null>("");
    useEffect(()=>{
        setCurDate(null);
    },[]);
    
    // function changeCurDate(newDate:string){
    //     setCurDate(newDate);
    // }

    return(
        <div className={`${chatHistoryStyle.total}`}>
            <div className={`${chatHistoryStyle.totalChat}`}>
                {chatList?.map((one)=>{
                    return(
                        <div className={`${chatHistoryStyle.chatArea}`}>
                            {/* 날짜 */}
                            {curDate!==one.date?<div className={`${chatHistoryStyle.date}`}><div>{one.date}</div></div>:null}
                            {myId!==one.id?<div className={`${chatHistoryStyle.oneChat}`}>
                                {/* 유저 프로필 */}
                                <div className={`${chatHistoryStyle.profile}`}>
                                    <div className={`${chatHistoryStyle.profileCircle_G}`}>
                                        <img src={process.env.PUBLIC_URL+`/img/user/profileImg.png`}></img>
                                    </div>
                                </div>

                                {/* 유저 닉네임, 내용/시간 */}
                                <div className={`${chatHistoryStyle.mid}`}>
                                    <div>{one.nickname}</div>
                                    <div>
                                        <div className={`${chatHistoryStyle.midContent}`}>{one.content}</div>
                                        <div className={`${chatHistoryStyle.midTime}`}>{one.time}</div>
                                    </div>
                                </div>
                            </div> :
                            <div className={`${chatHistoryStyle.oneChat2}`}>
                                <div className={`${chatHistoryStyle.mid2}`}>    
                                    <div className={`${chatHistoryStyle.midTime}`}>{one.time}</div>
                                    <div className={`${chatHistoryStyle.midContent}`}>{one.content}</div>
                                </div>
                            </div>}

                        </div>
                    );
                })}
            </div>

            {/* input과 전송 */}
            <div className={`${chatHistoryStyle.sendArea}`}>
                <input type="text" placeholder="메세지를 입력하세요."/>
                <button>전송</button>
            </div>

        </div>
        
    );
}


export default ChatHistory;