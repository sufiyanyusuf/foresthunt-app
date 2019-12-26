import React,{FunctionComponent} from "react";
import { HuntModel } from './types'
import styled from 'styled-components';
import { HuntListItem } from './components/HuntListItem'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import {Container} from "react-bootstrap";

type props = {
    hunts: Array<HuntModel>
}

export const HuntList: FunctionComponent<props> = ({ hunts }) => {
  
    useScrollPosition(({ prevPos, currPos }) => {
    
        const list = document.getElementById('huntList')
        
        if (window.scrollY + window.innerHeight === list.clientHeight + list.offsetTop + 16) {
            console.log('load more')
        }

    })

    let huntListUI

    if (hunts.length > 0) {
        huntListUI = hunts.map((hunt) => {
            return <HuntListItem key={hunt.id} hunt={hunt} creatorHandle={hunt.user_handle} userId={hunt.user_id}/>
        });
    } 

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
                        {huntListUI}
                    </HuntListContainer>
                </React.Fragment>
            </HomeContainer>
        </Container>
    );
    
}