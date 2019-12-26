import React,{useState,useEffect} from "react";
import styled from 'styled-components';
import firebase from "firebase/app";
import { Row, Col} from "react-bootstrap";
import { CreateHuntSheet } from "./CreateHuntSheet";
import { HuntList } from './HuntList'
import { HuntModel } from "./types";

export const MainContainer = (hunts) => {

    let currentUser = firebase.auth().currentUser
    const [userId, setUserId] = useState()

    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid)
        }
    }, [currentUser])

    const hideCreateHuntSheet = () => { 
        setShowCreateHuntSheet(false)
    }

    const [showCreateHuntSheet, setShowCreateHuntSheet] = useState(false)

    const convertToViewModel = (data): Array<HuntModel> => {
        console.log(data.hunts.hunts)
        if (data.hunts.hunts && data.hunts.hunts.length > 0) {
            return data.hunts.hunts.map( hunt => {
                if (hunt && hunt.id && hunt.user) { 
                    let huntModel: HuntModel = hunt
                    huntModel.upvoteCount = hunt.upvotes.aggregate.count || 0
                    huntModel.downvoteCount = hunt.downvotes.aggregate.count || 0
                    huntModel.user_handle = hunt.user.handle
                    huntModel.user_id = hunt.user.id
                    huntModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
                    huntModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
                    return huntModel
                }
            })
        } else {
            return []
        }
    }

    return (
        <div>
            {currentUser && 
            <NavContainer style={{  top:0, zIndex:1, background:"#FFFFFF"}}>
                <Row className="float-right" style={{ position: "sticky", top:1}}>
                    <Col md={12}>
                        <ShareHuntCta onClick={() => setShowCreateHuntSheet(true)}>Share Your Hunt</ShareHuntCta>
                        <CreateHuntSheet show={showCreateHuntSheet} close={hideCreateHuntSheet} />
                    </Col>
                </Row>
            </NavContainer>
            }
            <HuntList hunts={convertToViewModel(hunts)} />
        </div>
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
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
    
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



