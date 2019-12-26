import React, {FunctionComponent} from "react";
import { UserHuntListItem } from "../components/UserHuntListItem";
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { userHuntsSubscription } from "../subscriptions";
import { HuntModel } from '../types'
import styled from 'styled-components';
import { RemoveHunt } from "../mutations";

type props = {
    userId: string;
}

export const UserHuntList: FunctionComponent<props> = ({ userId }) => {
     

    const [removehunt] = useMutation(RemoveHunt)
      
    const remove = async (hunt: HuntModel) => {
        try {
            await removehunt({
                variables: {
                    id: hunt.id
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const { loading, error, data } = useSubscription(userHuntsSubscription, {
        variables: { user_id: userId },
    });

    let userHunts: Array<HuntModel>;
    let huntListUI;

    if (!loading && !error) {
        userHunts = data.hunts.map (hunt => {
                let huntModel: HuntModel = {
                    id: hunt.id,
                    currency: hunt.currency,
                    user_id: hunt.user_id,
                    price: hunt.price,
                    title: hunt.title,
                    tags: hunt.tags,
                    link: hunt.link,
                    views: hunt.views,
                    timestamp:hunt.timestamp,
                    upvoteCount: hunt.upvotes.aggregate.count,
                    downvoteCount: hunt.downvotes.aggregate.count, 
                }
                return huntModel
            }
        )

        huntListUI = userHunts.map((hunt:HuntModel) => 
            <UserHuntListItem key={hunt.id} hunt={hunt} remove={remove}/> 
        );
    }

    

    return (
        <div style = {{paddingBottom:40}}>
            <React.Fragment>
                <UserHuntListContainer>
                    {huntListUI}
                </UserHuntListContainer>
            </React.Fragment>
        </div>
    );
 
}



const UserHuntListContainer = styled.div`
    align-items: flex-start;
`;
    
