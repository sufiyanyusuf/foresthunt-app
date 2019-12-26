import React,{useState,useEffect} from "react";
import styled from 'styled-components';
import { HuntListItem } from './components/HuntListItem'
import { HuntModel, ProfileModel } from './types'
import { Sidebar } from './components/Sidebar'
import { useSubscription } from '@apollo/react-hooks';
import { huntsFeedSubsciption } from "./subscriptions";
import firebase from "firebase/app";
import { CreateHuntSheet } from "./CreateHuntSheet";
import {Container, Row, Col, Modal,Form } from "react-bootstrap";

export default function Home() { 

    const [showCreateHuntSheet, setShowCreateHuntSheet] = useState(false)
    
    let currentUser = firebase.auth().currentUser
    const [userId, setUserId] = useState()
    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid)
        }
    }, [currentUser])

    const HuntList = () => {
        
        let hunts = []

        const { loading, error, data } = useSubscription(huntsFeedSubsciption, {});

        if (!loading && !error) {
            hunts = data.hunts
        }

        const huntListUI = hunts.map((hunt) => {

            if (hunt && hunt.id && hunt.user) { 
                let huntModel: HuntModel = hunt
                huntModel.upvoteCount = hunt.upvotes.aggregate.count || 0
                huntModel.downvoteCount = hunt.downvotes.aggregate.count || 0

                huntModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
                huntModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
                return <HuntListItem key={hunt.id} hunt={hunt} creatorHandle={hunt.user.handle} userId={userId || ""}/> 
            }
            return []
        });

        const HuntListContainer = styled.div`
            padding-top:80px;
            align-items: flex-start;
        `;
        
        const HuntListTitle = styled.span`
            margin-top:80px;
            margin-bottom:40px;
            font-family: DINPro-Medium;
            font-size: 36px;
        `;


        const hideCreateHuntSheet = () => { 
            setShowCreateHuntSheet(false)
        }

        return (

            <Container fluid >
                <HomeContainer>
                    <React.Fragment>
                        <CreateHuntSheet show={showCreateHuntSheet} close={hideCreateHuntSheet} />
                        <HuntListContainer>
                            {huntListUI}
                        </HuntListContainer>
                    </React.Fragment>
                </HomeContainer>
            </Container>

        );
        
    }

    return (
        <div>

        <Container fluid>
            <Row>
                    <Col md={3} >
                        <Row className="d-none d-md-block" style={{ position: "sticky", top:1}}>
                            <SidebarContainer>
                                <Sidebar/>
                            </SidebarContainer>
                        </Row>
                    </Col>
                    
                    <Col md={9}>
                        {currentUser && 
                            <NavContainer style={{  top:0, zIndex:1, background:"#FFFFFF"}}>
                                <Row className="float-right" style={{ position: "sticky", top:1}}>
                                    <Col md={12}>
                                        <ShareHuntCta onClick={() => setShowCreateHuntSheet(true)}>Share Your Hunt</ShareHuntCta>
                                    </Col>
                                </Row>
                            </NavContainer>
                        }
                        <HuntList />
                    </Col>
            </Row>
        </Container>

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

const HomeContainer = styled.div`
    font-family: 'IBM Plex Sans', sans-serif;
`;

const RootContainer = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    flex:1;    
    height:100vh;
`;

const SidebarContainer = styled.div`
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    height:100vh;
    overflow-y: auto; 
    border-right: 1px solid #eee;
    overflow-x: hidden;
    z-index: 1000;
    display: block;
    padding-left:20px;
    padding-right:20px;
`;

const FeedContainer = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    flex:0.8;
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




