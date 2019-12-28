import React,{useRef,FunctionComponent} from "react";
import {Container, Row, Col, Modal,Form } from "react-bootstrap";
import styled from 'styled-components';
import { HuntModel } from "./types";
import { useMutation } from '@apollo/react-hooks';
import { AddHunt } from "./mutations";
import bear from './assets/bear.svg'

type Props = {
    close:()=>any,
    show:boolean
}

export const CreateHuntSheet: FunctionComponent<Props> = ({ close, show }) => {
    
    const linkRef = useRef(null);
    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const currencyRef = useRef(null);
    const tagsRef = useRef(null);

    const [addHunt, { error, data }] = useMutation(AddHunt);

    const submit = async() => { 
        let tagsVal = tagsRef.current.value;
        let tagsArray = tagsVal.split(',');
        let hunt: HuntModel = {
            title: titleRef.current.value,
            link: linkRef.current.value,
            price: priceRef.current.value,
            currency: currencyRef.current.value,
            tags:tagsArray
        }
        try {
            await addHunt({
                variables: {
                    title: hunt.title,
                    link: hunt.link,
                    price: hunt.price,
                    currency: hunt.currency,
                    tags: hunt.tags
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
                            <Col><Title>Share Your Hunt</Title></Col>
                        </Row>
                        <Row>
                            <Col md={true} xs={12}>
                               
                               <Row style={{paddingTop:80}}>
                                   <Col>
                                       <Form.Label>Link/URL</Form.Label>
                                       <Form.Control placeholder="https://www.amazon.ae/dp/B07Y3L4N12/" ref={linkRef}/>
                                   </Col>   
                               </Row>
                               <Row style={{paddingTop:20}}>
                                   <Col>
                                       <Form.Label>Title</Form.Label>
                                       <Form.Control placeholder="Apple iPhone 11 Pro with FaceTime - 64GB, 4G LTE, Midnight Green" ref={titleRef}/>
                                   </Col>   
                               </Row>
                               <Row style={{paddingTop:20}}>
                                   <Col>
                                       <Form.Label>Price</Form.Label>
                                       <Form.Control placeholder="1299" ref={priceRef}/>
                                   </Col> 
                                   <Col lg={4}>
                                       <Form.Label>Currency</Form.Label>
                                       <Form.Control placeholder="USD" ref={currencyRef}/>
                                   </Col> 
                               </Row>
                               <Row style={{paddingTop:20}}>
                                   <Col>
                                       <Form.Label>Tags (seperated by commas)</Form.Label>
                                       <Form.Control placeholder="apple, iphone11pro, discount" ref={tagsRef}/>
                                   </Col>   
                               </Row>

                               
                           </Col>
                            <Col md={{ span: 4, offset: 1 }} className="d-none d-lg-block">
                                <BearGraphic src={bear}/>
                            </Col> 
                            
                        </Row>
                        <Row style={{paddingTop:40}}>
                            <Col>
                                <ShareHuntCta onClick={submit}>Create & Share Hunt</ShareHuntCta>
                                <CancelCta onClick={close}>Cancel</CancelCta>
                            </Col>
                        </Row>  

                    </ModalContainer>
                </Modal.Body>
            </Modal>
            
            
        </Container>
  );
}

const BearGraphic = styled.img`
    width:100%;
    position:absolute;
    top: 0;
    bottom: 0;
    margin: auto;
`;

const ModalContainer = styled.div`
    padding-top:60px;
    padding-left:80px;
    padding-right:80px;
    padding-bottom:60px;
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