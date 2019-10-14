import React from "react";
import {Motion,spring} from 'react-motion';
import './MenuButton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// CONSTANTS
// Value of 1 degree in radians
const DEG_TO_RAD = 0.0174533;


// UTILITY FUNCTIONS
function toRadians(degrees) {
    return degrees * DEG_TO_RAD;
}

// -------------------------------------------------------
// ---------------   COMPONENT START   -------------------
// -------------------------------------------------------
class MenuButton extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isOpen: true
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu(){
        let { isOpen } = this.state;
        this.setState({
            isOpen: !isOpen
        });
    }

    getMainButtonStyle(){
        let { mainButtonDiam } = this.props;
        return {
            width: mainButtonDiam,
            height: mainButtonDiam
        }
    }

    getInitalChildButtonStyle(){
        let { childButtonDiam, mainButtonDiam, stiffness, damping } = this.props;
        return {
            width: childButtonDiam,
            height: childButtonDiam,
            zIndex: -1,
            top: spring(mainButtonDiam/2 - childButtonDiam/2, {stiffness, damping}),
            left: spring(mainButtonDiam/2 - childButtonDiam/2, {stiffness, damping})
        }
    }

    getFinalChildButtonStyle(index){
        let { childButtonDiam, mainButtonDiam, stiffness, damping } = this.props;
        let { deltaX, deltaY } = this.getFinalDeltaPositions(index);
        return {
            width: childButtonDiam,
            height: childButtonDiam,
            zIndex: spring(0),
            top: spring(mainButtonDiam/2 + deltaX, {stiffness, damping}),
            left: spring(mainButtonDiam/2 - deltaY, {stiffness, damping})
        }
    }

    getFinalDeltaPositions(index) {
        let NUM_CHILDREN = this.props.elements.length;
        let CHILD_BUTTON_DIAM = this.props.childButtonDiam;
        let FLY_OUT_RADIUS = this.props.flyOutRadius;
        let SEPARATION_ANGLE = this.props.seperationAngle;
        let ROTATION = this.props.rotation;
        let FAN_ANGLE = (NUM_CHILDREN - 1) * SEPARATION_ANGLE;
        let BASE_ANGLE = ((180 - FAN_ANGLE)/2)+90+ROTATION;

        let TARGET_ANGLE = BASE_ANGLE + ( index * SEPARATION_ANGLE );
        return {
            deltaX: FLY_OUT_RADIUS * Math.cos(toRadians(TARGET_ANGLE)) - (CHILD_BUTTON_DIAM/2),
            deltaY: FLY_OUT_RADIUS * Math.sin(toRadians(TARGET_ANGLE)) + (CHILD_BUTTON_DIAM/2)
        };
    }

    getCProps(){
        return {
            mainButtonProps: () => ({
                className: "button-menu",
                style: this.getMainButtonStyle(),
                onClick: this.toggleMenu
            }),
            childButtonProps: (style, onClick) => ({
                className: "button-child",
                style,
                onClick
            }),
            childButtonMotionProps: (index, isOpen) => ({
                key: index,
                style: isOpen ?this.getFinalChildButtonStyle(index)
                    :this.getInitalChildButtonStyle()
            }),
            // handle Icons
            childButtonIconProps: (name) => ({
                className: "child-button-icon fa fa-"+name+" fa-"+this.props.childButtonIconSize
            }),
            mainButtonIconProps: (name) => ({
                className: "main-button-icon fa fa-"+name+" fa-"+this.props.mainButtonIconSize
            })
        }
    }

    renderChildButton(item, index){
        let { isOpen } = this.state;

        let cp = this.getCProps();
        //return <div {...cp.childButtonProps(index, isOpen)}/>;

        return <Motion {...cp.childButtonMotionProps(index, isOpen)}>
            {
                (style) => <div {...cp.childButtonProps(style, item.onClick)}>
                    <FontAwesomeIcon icon={item.icon}  size={this.props.childButtonIconSize} />
                </div>
            }
        </Motion>;
    }

    render(){
        let cp = this.getCProps();
        let { elements, mainButtonIcon,mainButtonIconSize } = this.props;
        return <div className="button-container">
            { elements.map((item, i) => this.renderChildButton(item, i)) }
            <div {...cp.mainButtonProps()}>
                <FontAwesomeIcon icon={mainButtonIcon} size={mainButtonIconSize}/>
            </div>
        </div>;
    }
}

export default MenuButton
// -------------------------------------------------------
// ----------------   COMPONENT END   --------------------
// -------------------------------------------------------


// APP
/*
class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            flyOutRadius: 120,
            seperationAngle: 40,
            mainButtonDiam: 90,
            childButtonDiam: 50,
            numElements: 4,
            stiffness: 320,
            damping: 17,
            rotation: 0,
            mainButtonIcon: "bars",
            mainButtonIconSize: "2x",
            childButtonIconSize: "lg"
        }
    }

    getInputProps(type, title){
        return {
            type: type,
            value: this.state[title],
            onChange: (e) => type === "number"
                ? this.setState({[title]: parseInt(e.target.value || 0)})
                : this.setState({[title]: e.target.value })
        }
    }

    render(){
        const NUM = "number";
        const TEX = "text";
        return <div id="app">
            <div id="headline"><h1>React Menu Button</h1></div>
            <div id="content">
                <div id="component">
                    <MenuButton {...this.state} elements={ELEMENTS.slice(0, this.state.numElements)}/>
                </div>
                <div id="config">
                    <h2>Props</h2>
                    <table>
                        <tbody>
                        <tr>
                            <td>fly out radius:</td>
                            <td><input {...this.getInputProps(NUM, "flyOutRadius")}/></td>
                        </tr>
                        <tr>
                            <td>seperation angle:</td>
                            <td><input {...this.getInputProps(NUM, "seperationAngle")}/></td>
                        </tr>
                        <tr>
                            <td>main button diam:</td>
                            <td><input {...this.getInputProps(NUM, "mainButtonDiam")}/></td>
                        </tr>
                        <tr>
                            <td>child button diam:</td>
                            <td><input {...this.getInputProps(NUM, "childButtonDiam")}/></td>
                        </tr>
                        <tr>
                            <td>num elements:</td>
                            <td><input {...this.getInputProps(NUM, "numElements")}/></td>
                            <td><i className="fa fa-info" onClick={() =>
                                alert("normaly no number, but an array of obj {icon, onClick}")}/></td>
                        </tr>
                        <tr>
                            <td>stiffness:</td>
                            <td><input {...this.getInputProps(NUM, "stiffness")}/></td>
                        </tr>
                        <tr>
                            <td>damping:</td>
                            <td><input {...this.getInputProps(NUM, "damping")}/></td>
                        </tr>
                        <tr>
                            <td>rotation:</td>
                            <td><input {...this.getInputProps(NUM, "rotation")}/></td>
                        </tr>
                        <tr>
                            <td>main button icon:</td>
                            <td><input {...this.getInputProps(TEX, "mainButtonIcon")}/></td>
                            <td><i className="fa fa-info" onClick={() =>
                                alert("font awesome icon")}/></td>
                        </tr>
                        <tr>
                            <td>main button icon size:</td>
                            <td><input {...this.getInputProps(TEX, "mainButtonIconSize")}/></td>
                            <td><i className="fa fa-info" onClick={() =>
                                alert("none | lg | 2x | 3x | 4x | 5x")}/></td>
                        </tr>
                        <tr>
                            <td>child button icon size:</td>
                            <td><input {...this.getInputProps(TEX, "childButtonIconSize")}/></td>
                            <td><i className="fa fa-info" onClick={() =>
                                alert("none | lg | 2x | 3x | 4x | 5x")}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>;
    }
}

// render ToggleButton to DOM
ReactDOM.render(
    <App/>,
    document.getElementById("main")
);
*/
