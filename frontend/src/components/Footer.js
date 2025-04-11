import React from 'react'
import { Container, Row,Col } from 'react-bootstrap'
function Footer() {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-centre py-3">copyright &copy; proShop</Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
