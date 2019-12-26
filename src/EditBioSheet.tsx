import React,{useRef,FunctionComponent} from "react";
import {Container, Row, Col, Modal,Form } from "react-bootstrap";
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { EditBio } from "./mutations";

type Props = {
    close:()=>any,
    show: boolean
    userId:string
}

export const EditBioSheet: FunctionComponent<Props> = ({ close, show, userId }) => {
    
    const bioRef = useRef(null);

    const [editBio, { error, data }] = useMutation(EditBio);

    const submit = async () => { 
        console.log(userId, bioRef.current.value)
        
        try {
            await editBio({
                variables: {
                    id: userId,
                    bio: bioRef.current.value
                }
            })
            close()
        } catch (error) {
            console.log(error,data)
        }
    }

    return (
        <Container>
            <Modal
                show={show}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <ModalContainer>
                        
                        <Row>
                            <Col>
                                <Row>
                                    <Col><Title>Write Something About Yourself.</Title></Col>
                                </Row>
                                
                                <Row style={{paddingTop:80}}>
                                    <Col>
                                        <Form.Label>Story of your life, in a line or two...</Form.Label>
                                        <Form.Control as="textarea" placeholder="Human, living on planet earth. Dead serious about falafel." ref={bioRef}/>
                                    </Col>   
                                </Row>
                                
                                <Row style={{paddingTop:40}}>
                                    <Col>
                                        <ShareHuntCta onClick={submit}>Save</ShareHuntCta>
                                        <CancelCta onClick={close}>Cancel</CancelCta>
                                    </Col>
                                </Row>
                            </Col>
                                
                        </Row>
                            

                    </ModalContainer>
                </Modal.Body>
            </Modal>
            
            
        </Container>
  );
}


const ModalContainer = styled.div`
    padding-top:40px;
    padding-left:80px;
    padding-right:120px;
    padding-bottom:40px;
    font-family: 'IBM Plex Sans', sans-serif;

    input::-webkit-input-placeholder {
        font-weight:400;
        color: #999CA8 !important;
        }
         
    input:-moz-placeholder { /* Firefox 18- */
        font-weight:400;
        color: #999CA8 !important;  
    }
        
    input::-moz-placeholder {  /* Firefox 19+ */
        font-weight:400;
        color: #999CA8 !important;  
    }
        
    input:-ms-input-placeholder {  
        font-weight:400;
        color: #999CA8 !important;  
    }

    input, textarea{
        font-weight:500;
    }

    font-weight:500;
`;

const Title = styled.div`
    font-size: 36px;
    color: #000000;
    letter-spacing: 0;
    font-weight:900;
`;

const ShareHuntCta = styled.button`
    margin-top:40px;
    display:inline-block;
    border-radius: 6px;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    padding-top:8px;
    padding-bottom:10px;
    padding-left:20px;
    padding-right:20px;
    border: none;
    outline:none;
    :hover{
        cursor:pointer;
        background: #F7D000;
        transition:0.25s ease-out
    }
    background: #FFD700;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    margin-right:20px;
    font-weight:500;
`;

const CancelCta = styled.button`
    margin-top:40px;
    display:inline-block;
    border-radius: 6px;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    padding-top:8px;
    padding-bottom:10px;
    padding-left:20px;
    padding-right:20px;
    border: none;
    outline:none;
    :hover{
        cursor:pointer;
        background: #EDEDED;
        transition:0.25s ease-out
    }
    :focus {
        border: none;
        outline: none;
    }
    -webkit-transition: 0.25s ease-out;
    background: #F3F3F3;
    color: #000000;
    letter-spacing: 0;
    text-align: center;
    font-weight:500;
`;