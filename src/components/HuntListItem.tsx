import React, { useState} from "react";
import styled from 'styled-components';
import { HuntModel } from '../types'
import upvote_icon from '../assets/upvote_icon.svg'
import downvote_icon from '../assets/downvote_icon.svg'
import upvoted_icon from '../assets/upvoted_icon.svg'
import downvoted_icon from '../assets/downvoted_icon.svg'
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant'
import {Container, Row, Col} from "react-bootstrap";

import moment from "moment";
import {useMutation } from '@apollo/react-hooks';
import { Downvote, Upvote, Unvote, TrackClicks } from "../mutations";

type props = {
    hunt: HuntModel
}

type VoteState = {
    upvote?: boolean,
    downvote?: boolean,
    unvote?:boolean
}

const HuntListItem = ({hunt}:{hunt:HuntModel})  => { 

    const [upvote] = useMutation(Upvote)
    const [downvote] = useMutation(Downvote)
    const [unvote] = useMutation(Unvote)
    const [trackClick] = useMutation(TrackClicks)

    const [didUpvote,setDidUpvote] = useState<boolean>((hunt.upvotes.includes(hunt.user_id)))
    const [didDownvote, setDidDownvote] = useState<boolean>((hunt.downvotes.includes(hunt.user_id)))
    
    const [upvoteCount,setUpvoteCount] = useState(hunt.upvoteCount || 0)
    const [downvoteCount,setDownvoteCount] = useState(hunt.downvoteCount || 0)


    const mockUpvote = () => {
        //toggle if already upvoted or if upvoted and then downvoted
        if (didUpvote) {
            setUpvoteCount(upvoteCount - 1)
            setDidUpvote(false)
            let voteState:VoteState = {unvote:true}
            castVoteDebounced(voteState)
        } else {
            setUpvoteCount(upvoteCount + 1)
            setDidUpvote(true)
            let voteState:VoteState = {upvote:true}
            castVoteDebounced(voteState)
        }

        if (didDownvote) {
            setDownvoteCount(downvoteCount - 1)
            setDidDownvote (false)
        }

    }

    const mockDownvote = () => {
        //toggle if already downvoted or if downvoted and then upvoted
        if (didDownvote) {
            setDownvoteCount(downvoteCount - 1)
            setDidDownvote (false)
            let voteState:VoteState = {unvote:true}
            castVoteDebounced(voteState)
        } else {
            setDownvoteCount(downvoteCount + 1)
            setDidDownvote(true)
            let voteState:VoteState = {downvote:true}
            castVoteDebounced(voteState)
        }

        if (didUpvote) {
            setUpvoteCount(upvoteCount - 1)
            setDidUpvote (false)
        }

    }
    
    const castVote = async (vote:VoteState) => {
   
        try {
            
            if (vote.upvote === true) { 
                await upvote({
                    variables: {
                        hunt_id: hunt.id,
                    }
                }) 
            }else if (vote.downvote === true){ 
                await downvote({
                    variables: {
                        hunt_id: hunt.id,
                    }
                }) 
            }else if (vote.unvote === true){ 
                await unvote({
                    variables: {
                        hunt_id: hunt.id,
                    }
                }) 
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const castVoteDebounced = useConstant(() =>
        AwesomeDebouncePromise(castVote, 50)
    );

    const linkOpened = async () => {
        try {
            await trackClick({
                variables: {
                    hunt_id: hunt.id,
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container fluid={true}>
        <StyledRow>
                <Row>
                    <Col md={8} xs={12}>
                        <Row>
                            <Col md="12" xs="auto" onClick = {()=>linkOpened()}>
                                <a style={{ textDecoration: "none" }} href={hunt.link} target="_blank" rel="noopener noreferrer">
                                    <TitleLabel><span style={{opacity:0.75}}>{hunt.title} - </span><PriceLabel> {hunt.currency} {hunt.price} </PriceLabel></TitleLabel>
                                    <LinkContainer>
                                        <LinkLabel>{hunt.link}</LinkLabel>
                                        <Col md="auto" xs="auto">
                                            <ViewerBadge>{hunt.views} Views</ViewerBadge>
                                        </Col>
                                    </LinkContainer>
                                </a>
                            </Col> 
                        </Row>
                    </Col>

                    <Col md={2} xs={8}>
                        <Row>
                            <VoteButton onClick={() => mockUpvote()}>
                                {didUpvote && <VoteIcon src = {upvoted_icon}/>}
                                {!didUpvote && <VoteIcon src = {upvote_icon}/>}
                                <VoteCountLabel>{upvoteCount|| 0}</VoteCountLabel>
                            </VoteButton>
                        
                            <VoteButton onClick={() =>  mockDownvote() }>
                                {didDownvote && <VoteIcon src = {downvoted_icon}/>}
                                {!didDownvote && <VoteIcon src = {downvote_icon}/>}
                                <VoteCountLabel>{downvoteCount || 0}</VoteCountLabel>
                            </VoteButton>
                        </Row>
                    </Col>

                    <Col md={2} xs={4}>
                        <Row>
                            <div style={{ paddingRight: 10}}>
                                <CreatorLabel>By <b>{hunt.user_handle}</b></CreatorLabel> 
                                <TimestampLabel>{moment(hunt.timestamp).fromNow()}</TimestampLabel>
                            </div>
                        </Row>
                    </Col>
                </Row>
        </StyledRow>
        </Container>
    )

}

const areEqual = (prevProps, nextProps) => {
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
        return true
    } else {
        return false
    }
};

export default React.memo(HuntListItem, areEqual);


const VoteButton = styled.div`
    font-size: 20px;
    color: #000000;
    letter - spacing: 0;
    text-align:left;
    border-radius:8px;
    padding:8px;
    :hover{
        background: #F1F1F1;
        transition:0.25s ease-out;
    }
    font-weight:400;
    -webkit-transition: 0.25s ease-out;
`;

const VoteIcon = styled.img`
    height:35px;
    object-fit: cover;
    padding-right:12px;
    padding-bottom:10px;
    padding-left:10px;
`;

const VoteCountLabel = styled.span`
    vertical-align:5px;
    padding-right:5px;
`;


const LinkContainer = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    align-items: flex-start;
`;

const StyledRow = styled.div`
    padding-left:10px;
    padding-right:10px;
    padding-top:10px;
    padding-bottom:10px;
    background-color: #FFFFFF;
    transition: 0.2s;
    border-radius:8px;
    opacity:0.95;
    :hover{
        // background-color: #F7F7F7;
        cursor:pointer;
        opacity:100;
    };
    margin-top: auto;
    margin-bottom: auto;
    font-family: 'IBM Plex Sans', sans-serif;
`;

const CreatorLabel = styled.div`
    font-size: 16px;

    padding-bottom:2px;
`;

const TimestampLabel = styled.div`
    font-size: 12px;

`;

const TitleLabel = styled.div`
    font-size: 18px;
    color: #000000;
    letter-spacing: 0;
    padding-bottom:4px;
    font-weight:500;
`;

const PriceLabel = styled.span`
    font-size: 18px;
    color: #000000;
    letter-spacing: 0;
    padding-bottom:4px;
    font-weight:900;
`;

const LinkLabel = styled.div`
    font-size: 12px;
    color: #000000;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-bottom:12px;
    opacity:0.5;
    :hover{
        opacity:1;
        transition:0.25s ease-out;
    }
`;

const ViewerBadge = styled.div`
    background: #00FFCA;
    border-radius: 3px;
    font-size: 12px;
    color: #000000;
    padding-left:7px;
    padding-right:7px;
`;

