import React,{useState,useEffect} from "react";
import styled from 'styled-components';
import firebase from "firebase/app";
import { CreateHuntSheet } from "./CreateHuntSheet";
import {Row, Col,} from "react-bootstrap";

export const NavbarContainer = () => { 

    const [showCreateHuntSheet, setShowCreateHuntSheet] = useState(false)

    const hideCreateHuntSheet = () => { 
        setShowCreateHuntSheet(false)
    }

    return (
        <NavContainer style={{  top:0, zIndex:1, background:"#FFFFFF"}}>
            <CreateHuntSheet show={showCreateHuntSheet} close={hideCreateHuntSheet} />
            <Row className="float-right" style={{ position: "sticky", top:1}}>
                <Col md={12}>
                    <ShareHuntCta onClick={() => setShowCreateHuntSheet(true)}>Share Your Hunt</ShareHuntCta>
                </Col>
            </Row>
        </NavContainer>
    )
    
}

const NavContainer = styled.div`
    border-bottom: 1px solid #eee;
    position: -webkit-sticky; /* Safari */
    position: sticky;
    height:80px;
    margin-left:-15px;
    margin-right:-15px;
    padding-left:25px;
    padding-right:25px;
    
`;


const ShareHuntCta = styled.button`

font-family: 'IBM Plex Sans', sans-serif;
margin-bottom:20px;
display:inline-block;
background: #0031CD;
border-radius: 6px;
font-size: 14px;
color: #FFFFFF;
letter-spacing: 0;
text-align: center;
padding-top:10px;
padding-bottom:10px;
padding-left:20px;
padding-right:20px;
border: none;
outline:none;
:hover{
    cursor:pointer;
    background: #0028A9;
    transition:0.25s ease-out
}
:focus {
    border: none;
    outline: none;
}
-webkit-transition: 0.25s ease-out;
font-weight:600;
margin-top:20px;
`;




