import React from 'react';
import  ReactDOM  from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';
const Content = (props)=>{

  return (
     (<CSSTransition in={props.show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit><aside className="side-drawer" onClick={props.onClick}>{props.lola}</aside></CSSTransition>)
  )
}
const SideDrawer = props => {
  return ReactDOM.createPortal(<Content lola={props.children} onClick={props.onClick} show={props.show}/>,document.getElementById("drawer-hook"))
};

export default SideDrawer;