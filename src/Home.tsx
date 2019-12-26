import React,{useState,useEffect} from "react";
import styled from 'styled-components';
import { HuntModel } from './types'
import { Sidebar } from './components/Sidebar'
import { useSubscription } from '@apollo/react-hooks';
import { huntsFeedSubsciption } from "./subscriptions";
import firebase from "firebase/app";
import { Container, Row, Col} from "react-bootstrap";
import { NavbarContainer } from './NavbarContainer'
import { HuntList } from './HuntList'

export const Home = () => { 

    let currentUser = firebase.auth().currentUser
    const [userId, setUserId] = useState()
   
    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid)
        }
    }, [currentUser])

    let hunts:Array<HuntModel> = []

    const [huntsViewModel,setHuntsViewModel] = useState([])

    const { loading, error, data } = useSubscription(huntsFeedSubsciption, {onSubscriptionData:(data)=>updateModel(data)});

    const updateModel = (data) => {

        // avoid mutations - update data only where it's changed
        // 1 -> implement concat
        // 2 -> selectively update

        let updatedHuntsDataModel = data.subscriptionData.data.hunts

        let updateHuntsViewModel:Array<HuntModel> = updatedHuntsDataModel.map((hunt) => {
            if (hunt && hunt.id && hunt.user) {
                let huntViewModel: HuntModel = hunt
                huntViewModel.upvoteCount = hunt.upvotes.aggregate.count || 0
                huntViewModel.downvoteCount = hunt.downvotes.aggregate.count || 0
                huntViewModel.user_handle = hunt.user.handle
                huntViewModel.user_id = userId
                huntViewModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
                huntViewModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
                return huntViewModel
            } else {
                return null
            }
        })
        
        
        setHuntsViewModel (updateHuntsViewModel)
            //if not exists in updated array, remove
    }

    // if (!loading && !error) {

    //     hunts = data.hunts.map((hunt) => {

    //         if (hunt && hunt.id && hunt.user) { 
    //             let huntModel: HuntModel = hunt
    //             huntModel.upvoteCount = hunt.upvotes.aggregate.count || 0
    //             huntModel.downvoteCount = hunt.downvotes.aggregate.count || 0
    //             huntModel.user_handle = hunt.user.handle
    //             huntModel.user_id = userId
    //             huntModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
    //             huntModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
    //             return huntModel
    //         }
    //         return []
    //     })
        
    // }


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
                    <HuntList hunts={huntsViewModel}/>
                    </Col>
            </Row>
        </Container>
    )
}

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



