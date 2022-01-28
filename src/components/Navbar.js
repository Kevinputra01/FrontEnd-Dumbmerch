import React, {useContext} from 'react'
import { Container, Navbar as NavbarComp, Nav, NavDropdown } from 'react-bootstrap'
import {
    Link,
    useHistory
} from "react-router-dom"

import { UserContext } from '../context/userContext'

import ImgDumbMerch from '../assets/DumbMerch.png'

export default function Navbar(props) {
    const [state, dispatch] = useContext(UserContext)

    let history = useHistory()

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        history.push("/auth")
    }

    return (
        <NavbarComp expand="lg">
            <Container>
                <NavbarComp.Brand as={Link} to="/">
                    <img src={ImgDumbMerch} className="img-fluid" style={{ width: '60px', height: '60px' }} alt="brand"/>
                </NavbarComp.Brand>
                <NavbarComp.Toggle aria-controls="basic-navbar-nav" />
                <NavbarComp.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/complain" className={props?.title == 'Complain' ? `text-navbar-active` : `text-navbar`}>Complain</Nav.Link>
                        <Nav.Link as={Link} to="/profile" className={props?.title == 'Profile' ? `text-navbar-active` : `text-navbar`}>Profile</Nav.Link>
                        <Nav.Link onClick={logout} className="text-navbar">Logout</Nav.Link>
                    </Nav>
                </NavbarComp.Collapse>
            </Container>
        </NavbarComp>
    )
}
