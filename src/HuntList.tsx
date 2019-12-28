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
    const [cursor, setCursor] = useState(100000000)
    const [huntsViewModel,setHuntsViewModel] = useState(Array<HuntModel>())

    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid)
        }
    }, [currentUser])

    useSubscription(huntsFeedSubsciption, {variables: { cursor: cursor }, onSubscriptionData:(data)=>updateModel(data)});


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

        console.log('outdated',huntsViewModel)
        console.log('updatedmodel',updatedHuntsViewModel)

        if (updatedHuntsViewModel.length > 0) {
            //for empty model, set updated array
            //model length is 0

            if (huntsViewModel.length === 0) {
                setHuntsViewModel(updatedHuntsViewModel)
                return
            }

            //for new results at bottom, concat updated to model
            //updated first element id is < model last element id

            if (updatedHuntsViewModel[0].id < huntsViewModel[huntsViewModel.length - 1].id) {
                setHuntsViewModel([...huntsViewModel, ...updatedHuntsViewModel])
                return
            }
            

            //for new results added on top, remove overlapping indices from model, then append to updated results
            //updated first element id > model first element id
            if (updatedHuntsViewModel[0].id > huntsViewModel[0].id) {

                let _huntsViewModel: Array<HuntModel> = huntsViewModel.map(oldModel => {
                    let newModel = updatedHuntsViewModel.filter(_model => { return _model.id === oldModel.id })
                    if (newModel.length === 0) {
                        return oldModel
                    } else {
                        return null
                    }
                }).filter(Boolean)

                setHuntsViewModel(updatedHuntsViewModel.concat(_huntsViewModel))
                return
            }

            //for updates, map and replace the updated element(s) in array
            //updated first element id === model first element id
            if (updatedHuntsViewModel[0].id === huntsViewModel[0].id) {

                let _huntsViewModel: Array<HuntModel> = huntsViewModel.map((oldModel) => {
                    
                    let newModel = updatedHuntsViewModel.filter(_model => { return _model.id === oldModel.id })

                    if (newModel.length === 1) {
                        return newModel[0]
                    } else {
                        return oldModel
                    }

                })

                setHuntsViewModel(_huntsViewModel)
                return
            }
        }

    }


    useScrollPosition(({ prevPos, currPos }) => {
    
        const list = document.getElementById('huntList')
        
        if (window.scrollY + window.innerHeight === list.clientHeight + list.offsetTop + 16) {
            let lastHunt = huntsViewModel.slice(-1).pop()
            console.log('load more', lastHunt.id)
            if (lastHunt) {
                setCursor(lastHunt.id)
            }
        }

    })

    const HuntListContainer = styled.ul`
        padding-top:40px;
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
                            return <div key = {hunt.id}>{hunt.id}<HuntListItem hunt={hunt} key={hunt.id}/></div>
                        })}
                    </HuntListContainer>
                </React.Fragment>
            </HomeContainer>
        </Container>
    );
    
})