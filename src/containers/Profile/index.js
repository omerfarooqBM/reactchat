import MenuAppBar from '../../components/AppBar'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MyCard from '../../components/Card';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import COVER from '../../assets/images/cover.png';
import './style.css';
import { db, doc, getDoc } from '../../config/Firebase'

function Profile() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const getUser = async () => {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setName(docSnap.data().fullName)
            setEmail(docSnap.data().email)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    return (
        <div>
            <MenuAppBar title="Login" />
            <div className="container-fluid">
                <div className="profile_box">
                    <img className="cover_pic" src={COVER} alt="" />
                    <div className="profile_pic">
                        <img
                            src={'https://wl-brightside.cf.tsp.li/resize/728x/jpg/f6e/ef6/b5b68253409b796f61f6ecd1f1.jpg'} alt="" />
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 120 }}>
                    <div>
                        <h4>{name}</h4>
                        <h6>{email}</h6>
                    </div>
                    <Link to={`/chat/${id}`}>Chat</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile;