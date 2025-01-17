import React from "react";
import styled from 'styled-components';
import { HuntModel } from '../types'
import  remove_icon  from "../assets/remove_icon.svg";
import moment from "moment";

const UserHuntListItem = ({hunt,remove}:{hunt:HuntModel, remove:(hunt:HuntModel)=>any}) => { 

    return (
        <StyledRow>

            <Container>

                <div>
                    <a style={{ textDecoration: "none" }} href="someLink" target="_blank">
                        <TitleLabel>{hunt.title} - <PriceLabel>{hunt.currency} {hunt.price}</PriceLabel></TitleLabel>
                        <StatsLabel><TimestampLabel>Created {moment(hunt.timestamp).fromNow()} </TimestampLabel> - {hunt.views} Views, {hunt.upvoteCount} Upvotes</StatsLabel>
                    </a>
                </div>

                <RemoveButton>
                    <RemoveIcon src={remove_icon} onClick={()=>remove(hunt)}/>
                </RemoveButton>
            
            </Container>
      
        </StyledRow>
    )

}

const areEqual = (prevProps, nextProps) => {
   
    if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
        return true
    } else {
        return false
    }

};

export default React.memo(UserHuntListItem, areEqual);


const PriceLabel = styled.span`
    font-weight:900;
`;

const StatsLabel = styled.span`
    font-size:14px;
    font-weight:500;
    color:#737888;
`;

const TimestampLabel = styled.span`
    padding-top:10px;
    font-size: 14px;
    font-weight:500;
    color: #737888;
    padding-bottom:2px;
`;


const Container = styled.div`
    display: -webkit-flex;
    -webkit-flex-direction: row;
    display: flex;
    flex-direction: row; 
    justify-content: space-between;
    flex:1;
`;

const StyledRow = styled.div`
    padding-top:20px;
    padding-bottom:20px;
    padding-right:20px;
    padding-left:20px;
    transition: 0.2s;
    opacity:0.75;
    background:#FFFFFF;
    :hover{
        cursor:pointer;
        opacity:100;
        background:#F5F6F7;
        transition:0.25s ease-out
    }
    -webkit-transition: 0.25s ease-out;
    border-bottom: 1px solid #eee;
`;



const TitleLabel = styled.div`
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    padding-bottom:4px;
    padding-right:10px;
    font-weight:400;
`;

const LinkLabel = styled.div`
    font-size: 12px;
    color: #000000;
    letter-spacing: 0;
`;

const VoteLabel = styled.div`
    font-size: 18px;
    color: #000000;
    letter-spacing: 0;
`;

const ViewerBadge = styled.div`
    background: #00FFCA;
    border-radius: 3px;
    font-size: 12px;
    color: #000000;
    letter-spacing: 0;
    padding-left:7px;
    padding-right:7px;
    margin-left:20px;
`;

const RemoveIcon = styled.img`
    height:15px;
    width:15px;
    padding-top:4px;
    opacity:0.5;
    :hover{
        opacity:1;
    }
`;

const RemoveButton = styled.div`
    textDecoration: none;
    border:none; 
    outline:none;
    cursor:pointer;
    margin-left:10px;
`;

const VoteIcon = styled.img`
    height:27px;
    object-fit: cover;
    padding-right:12px;
    padding-bottom:10px;
    padding-left:10px;
`;