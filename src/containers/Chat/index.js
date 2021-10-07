import MenuAppBar from '../../components/AppBar'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MyCard from '../../components/Card';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './style.css';
import { BiSearchAlt, BiPhoneCall } from 'react-icons/bi';
import { RiRefreshLine, RiContactsBookLine, RiArchiveDrawerLine } from 'react-icons/ri';
import { FiUsers, FiSend } from 'react-icons/fi';
import { MdVideoCall } from 'react-icons/md';
import { FaRegSmile } from 'react-icons/fa';
import { db, doc, getDocs, collection, query, where, setDoc, onSnapshot, addDoc, orderBy } from '../../config/Firebase'
function Chat(props) {
    const location = useLocation()
    const { uid } = useParams()
    const [users, setUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const [message, setMessage] = useState("")
    const [allMessages, setAllMessage] = useState([])
    const getAllUsers = async () => {
        const docRef = query(collection(db, "users"), where("uid", '!=', uid));
        const querySnapshot = await getDocs(docRef);
        let arr = [];
        querySnapshot.forEach((doc) => {
            arr.push(doc.data())
        });
        setUsers(arr)
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllMessages = async () => {
        let chat_id = "";
        if (uid < currentChat.uid) {
            chat_id = uid + currentChat.uid
        } else {
            chat_id = currentChat.uid + uid
        }
        const q = query(collection(db, "messages"), where("chat_id", "==", chat_id), orderBy('timestamp', 'desc')
        );
        onSnapshot(q, (querySnapshot) => {
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push(doc.data());
            });
            setAllMessage([...arr])
        });
    }

    console.log("messages==>", allMessages)

    useEffect(() => {
            
        getAllMessages()
    }, [currentChat])

    const send_message = async (event) => {
        if (event.keyCode === 13) {
            let chat_id = "";
            if (uid < currentChat.uid) {
                chat_id = uid + currentChat.uid
            } else {
                chat_id = currentChat.uid + uid
            }
            let collectionRef = collection(db, 'messages')
            await addDoc(collectionRef, { message, uid, chat_id, timestamp: new Date() })
                .then(() => {
                    setMessage("")
                })
        }
    }
    return (
        <div>
            <MenuAppBar title="Login" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <div className="users_sidebar">
                            <div className="search_box">
                                <div className="search_bar">
                                    <BiSearchAlt color="#fff" size={24} />
                                    <input type="text" placeholder="search" />
                                </div>
                            </div>
                            <div className="icons">
                                <RiRefreshLine color="#fff" size={24} />
                                <FiUsers color="#fff" size={24} />
                                <RiContactsBookLine color="#fff" size={24} />
                                <RiArchiveDrawerLine color="#fff" size={24} />
                            </div>
                            <div className="users_list">
                                {
                                    users.map((v, i) => {
                                        return (
                                            <div onClick={() => setCurrentChat(users[i])} key={i} className="user_card">
                                                <div className="user_card_pic">
                                                    <img src="https://wl-brightside.cf.tsp.li/resize/728x/jpg/f6e/ef6/b5b68253409b796f61f6ecd1f1.jpg" alt="" />
                                                </div>
                                                <div className="user_data">
                                                    <h6>{v.fullName}</h6>
                                                    
                                                </div>
                                                <div className="my_badge">
                                                    <span>2</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        {Object.keys(currentChat).length ?
                            <div className="chat_container">
                                <div className="header">
                                    <div className="online_dot"></div>
                                    <div className="username">
                                        <h4>{currentChat.fullName}</h4>
                                    </div>
                                    <div className="chat_icons">
                                        <div className="icon_box">
                                            <BiPhoneCall size={24} color="#fff" />
                                        </div>
                                        <div className="icon_box">
                                            <MdVideoCall size={24} color="#fff" />
                                        </div>
                                    </div>
                                </div>
                                <div className="messages">

                                    {allMessages.map((v, i) => {
                                        return (
                                            v.uid === uid ?
                                                <div className="message_left message_right">
                                                    <div className="user_message">
                                                        {v.message}
                                                        <div className="message_arrow_right"></div>
                                                    </div>
                                                    <div className="message_right_image">
                                                        <img src="https://wl-brightside.cf.tsp.li/resize/728x/jpg/f6e/ef6/b5b68253409b796f61f6ecd1f1.jpg" alt="" />
                                                    </div>
                                                </div>
                                                :
                                                <div className="message_left">
                                                    <div>
                                                        <img src="https://wl-brightside.cf.tsp.li/resize/728x/jpg/f6e/ef6/b5b68253409b796f61f6ecd1f1.jpg" alt="" />
                                                    </div>
                                                    <div className="user_message">
                                                        {v.message}
                                                        <div className="message_arrow"></div>
                                                    </div>
                                                </div>
                                        )
                                    }).reverse()}

                                </div>
                                <div className="message_box">
                                    <div className="message_input">
                                        <input onKeyUp={send_message} value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type your message here" />
                                    </div>
                                    <div>
                                        <FaRegSmile color="grey" size={28} />
                                    </div>
                                    <div className="icon_box_send">
                                        <FiSend color="#fff" size={18} />
                                    </div>
                                </div>
                            </div> :
                            null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;