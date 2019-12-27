import React from "react";
import styled from 'styled-components';
import firebase from "firebase/app";
import twitter_icon from '../assets/twitter-icon.svg'
import google_icon from '../assets/google-icon.svg'
import forest_graphic from '../assets/forest.svg'

const googleProvider = new firebase.auth.GoogleAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();

const signInWithGoogle = async () => {
    try {
        await firebase.auth().signInWithPopup(googleProvider);
    } catch (error) {
        console.log(error);
    }
    };

const signInWithTwitter = async () => {
    try {
        await firebase.auth().signInWithPopup(twitterProvider);
    } catch (error) {
        console.log(error);
    }
};


export const LoggedOut = () => { 
    return (
        <div>
            <div  style={{ padding: 30}}>
                <Title>
                    Hello, Stranger...
                </Title>
                <Subtitle>
                    Welcome to the forest. Great gems lie yonder, if thou shalt dare to enter ...
                </Subtitle>
                <LoginButton onClick={signInWithGoogle}><LoginProviderIcon src = {google_icon}/>Login with Google</LoginButton>
                <LoginButton onClick={signInWithTwitter}><LoginProviderIcon src={twitter_icon} />Login with Twitter</LoginButton>   
            </div>
            <ForestGraphicImage src={forest_graphic}/>
        </div>
    )
}

const ForestGraphicImage = styled.img`
    width:100%;
    position:relative;

`;

const LoginButton = styled.button`
    margin-bottom:20px;
    display:inline-block;
    background: #F3F3F3;
    border-radius: 6px;
    font-size: 16px;
    letter-spacing: 0;
    text-align: center;
    padding-top:12px;
    padding-bottom:12px;
    padding-left:20px;
    padding-right:20px;
    border: none;
    outline:none;
    :hover{
        cursor:pointer;
        background: #ECEDEF;
        transition:0.25s ease-out
    }
    :focus {
        border: none;
        outline: none;
    }
    -webkit-transition: 0.25s ease-out;
    width:100%;
    font-weight:600;
`;


const Title = styled.div`
    font-size: 32px;
    color: #000000;
    font-weight:900;
`;

const Subtitle = styled.div`
    font-size: 20px;
    color: #000000;
    font-weight:300;
    margin-bottom:40px;
    margin-top:10px;
`;


const LoginProviderIcon = styled.img`
    height:25px;
    object-fit: cover;
    margin-right:12px;
`;
