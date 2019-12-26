import React,{FunctionComponent,useState} from "react";
import { ProfileModel } from '../types'
import { useQuery} from '@apollo/react-hooks';
import { UserProfileQuery } from '../queries';
import styled from 'styled-components';
import { EditBioSheet } from '../EditBioSheet'

type props = {
    signOut:()=>any,
    userId: string;
}

export const ProfileFragment: FunctionComponent<props> = ({ userId, signOut }) => {

    let profile: ProfileModel;

    const [showEditBioSheet, setShowEditBioSheet] = useState(false)

    const hideEditBioSheet = () => { 
        setShowEditBioSheet(false)
    }

    const { loading, error, data } = useQuery(UserProfileQuery, {
        variables: { user_id: userId },
    });

    if (!loading && !error) {
        let user = data.users[0]
        let userProfile: ProfileModel = {
            id:user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            bio: user.bio || "You haven't yet setup a bio. Write a line or two about yourself...",
            handle: user.handle,
            profilePicUrl: 'https://static.dezeen.com/uploads/2016/05/jonathan-ive_apple_dezeen.jpg',
        }
        profile = userProfile
    }


    return (
    
        <div>
            { userId && profile &&
                <ProfileContainer>
                    
                <EditBioSheet show={showEditBioSheet} close={hideEditBioSheet} userId={userId}/>
                    <ProfilePicture src={profile.profilePicUrl} />
                    
                    <Title>
                        {profile.firstName} {profile.lastName}
                        <Cta onClick={() => signOut()}>Logout</Cta>
                    </Title>
                    
                    <Handle>@{profile.handle}</Handle>
                    <Cta>Edit</Cta>
                    
                    <Bio>
                        {profile.bio}
                        <Cta onClick={() => setShowEditBioSheet(true)}>Edit</Cta>
                    </Bio>

                
                </ProfileContainer>
            }
            {loading &&
                <span>loading.</span>
            }
        </div> 

    )

}

const ProfileContainer = styled.div`
border-bottom: 1px solid #eee;
margin-bottom:20px;
`;
const Title = styled.div`
font-size: 32px;
color: #000000;
font-weight:900;
`;

const Handle = styled.span`
font-size: 18px;
padding-right:10px;
font-weight:500;
`;

const Bio = styled.div`
font-size: 18px;
color: #000000;
letter-spacing: 0;
padding-top:20px;
padding-bottom:20px;
`;

const ProfilePicture = styled.img`
height:80px;
width:80px;
border-radius:40px;
object-fit: cover;
filter: alpha(opacity=95);
opacity: 0.95;
background:'#000000';
filter: brightness(98%);
border: 1px solid #F2F2F2;
margin-top:20px;
margin-bottom:20px;
`;


const Cta = styled.button`
font-weight:500;
border-radius: 6px;
font-size: 14px;
letter-spacing: 0;
border: none;
outline:none;
:focus {
    border: none;
    outline: none;
}
:hover{
    font-weight:700;
    cursor:pointer;
}
padding-left:10px;
padding-right:10px;
color:#737888;
background: #FFFFFF;
border-radius: 3px;
`;

