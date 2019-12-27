import React from "react";
import styled from 'styled-components';
import { Sidebar } from './components/Sidebar'
import firebase from "firebase/app";
import { Container, Row, Col} from "react-bootstrap";
import { NavbarContainer } from './NavbarContainer'
import { HuntList } from './HuntList'

export const Home = () => { 

    let currentUser = firebase.auth().currentUser
   
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
                    <HuntList/>
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



