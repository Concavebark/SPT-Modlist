import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';

// TODO: More data from sp-tarkov.com + fix issues with missing mod image replacement

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    render() {
    return (
            <Container className="fileContainer">
                {console.log(this.props.data)}
                {this.state.data.map((modData) => (
                    <a className="fileData" href={modData.modLink}>
                        <header className="modHeader">
                            <img src={modData.modImg} className="modImg" alt="Mod Img" />
                            <h1 className="modName">{modData.modName}</h1>
                        </header>
                        <section>
                            <h3 className="modDescription">{modData.modDesc}</h3>
                        </section>
                    </a>
                ))}  
            </Container>      
        );
    }
}

export default Card;