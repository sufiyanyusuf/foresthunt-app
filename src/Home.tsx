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
import { NavbarContainer } from './NavbarContainer'

export default function Home() { 

    const [showCreateHuntSheet, setShowCreateHuntSheet] = useState(false)
    
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

    const getViewModel = (data) => {

        let hunts = data.hunts.map((hunt) => {

            if (hunt && hunt.id && hunt.user) { 
                let huntModel: HuntModel = hunt
                huntModel.upvoteCount = hunt.upvotes.aggregate.count || 0
                huntModel.downvoteCount = hunt.downvotes.aggregate.count || 0
                huntModel.user_handle = hunt.user.handle
                huntModel.user_id = userId
                huntModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
                huntModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
                return huntModel
                // return <HuntListItem key={hunt.id} hunt={hunt} creatorHandle={hunt.user.handle} userId={userId || ""}/> 
            }

        })

        return hunts

    }

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


        return (

            <Container fluid >
                <HomeContainer>
                    <React.Fragment>
                        <HuntListContainer>
                            {huntListUI}
                        </HuntListContainer>
                    </React.Fragment>
                </HomeContainer>
            </Container>

        );
        
    }

    return (
        
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
                            <NavbarContainer/>
                        }
                        <HuntList />
                    </Col>
            </Row>
        </Container>
    )
}

const HomeContainer = styled.div`
    font-family: 'IBM Plex Sans', sans-serif;
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



