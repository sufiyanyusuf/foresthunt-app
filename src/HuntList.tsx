import React,{FunctionComponent,useMemo,useState,useEffect} from "react";
import { HuntModel } from './types'
import styled from 'styled-components';
import HuntListItem from './components/HuntListItem'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import {Container} from "react-bootstrap";
import { useSubscription } from '@apollo/react-hooks';
import { huntsFeedSubsciption } from "./subscriptions";
import firebase from "firebase/app";



export const HuntList: FunctionComponent = React.memo(() => {
  
    let currentUser = firebase.auth().currentUser
    const [userId, setUserId] = useState()
   
    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid)
        }
    }, [currentUser])


    useSubscription(huntsFeedSubsciption, {onSubscriptionData:(data)=>updateModel(data)});

    const [huntsViewModel,setHuntsViewModel] = useState([])
    

    const updateModel = (data) => {

        let updatedHuntsDataModel = data.subscriptionData.data.hunts

        let updatedHuntsViewModel:Array<HuntModel> = updatedHuntsDataModel.map((hunt) => {
           
            let huntViewModel: HuntModel = hunt
            huntViewModel.upvoteCount = hunt.upvotes.aggregate.count || 0
            huntViewModel.downvoteCount = hunt.downvotes.aggregate.count || 0
            huntViewModel.user_handle = hunt.user.handle
            huntViewModel.user_id = userId
            huntViewModel.upvotes = hunt.upvotes.nodes.map(user => { return user.user_id }) || []
            huntViewModel.downvotes = hunt.downvotes.nodes.map(user => { return user.user_id }) || []
            return huntViewModel
            
        })

        setHuntsViewModel(updatedHuntsViewModel)
    }


    useScrollPosition(({ prevPos, currPos }) => {
    
        const list = document.getElementById('huntList')
        
        if (window.scrollY + window.innerHeight === list.clientHeight + list.offsetTop + 16) {
            console.log('load more')
        }

    })

    const HuntListContainer = styled.ul`
        padding-top:80px;
        align-items: flex-start;
    `;
    
    const HuntListTitle = styled.span`
        margin-top:80px;
        margin-bottom:40px;
        font-family: DINPro-Medium;
        font-size: 36px;
    `;

    const HomeContainer = styled.div`
        font-family: 'IBM Plex Sans', sans-serif;
    `;

    return (
        <Container fluid >
            <HomeContainer>
                <React.Fragment>
                    <HuntListContainer id="huntList">
                        {huntsViewModel.map((hunt,i) => { 
                            return <HuntListItem hunt={hunt} key={hunt.id}/>
                        })}
                    </HuntListContainer>
                </React.Fragment>
            </HomeContainer>
        </Container>
    );
    
})