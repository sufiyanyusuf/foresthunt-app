import React, {useState, useEffect} from "react";
import styled from 'styled-components';
import { ProfileFragment } from "../components/ProfileFragment";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { UserHuntList } from "../components/UserHuntList";
import { LoggedOut } from '../components/LoggedOut';


export const Sidebar = () => { 
 
    let currentUser = firebase.auth().currentUser
    const [userId,setUserId] = useState<string>()

    useEffect(() => {
        if (currentUser) {
            console.log(firebase.auth().currentUser.uid)
            setUserId(currentUser.uid)
        } else {
            setUserId(null)
        }
    }, [currentUser])


    const signOut = async () => {
        try {
            await firebase.auth().signOut();
            localStorage.setItem("token", null)
            localStorage.setItem('userId', null)
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>

            {!currentUser &&
                <LoggedOut/>
            }

            {currentUser &&
                <div>
                    <ProfileFragment userId={userId} signOut={()=>signOut()}/>
                    <UserHuntList userId={userId}/>
                </div>
            }


        </Container>
    )

    
}


const Container = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    padding-top:20px;
    flex:0.5;
    font-family: 'IBM Plex Sans', sans-serif;
`;


