import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MainHeader from './MainHeader';
import NavLinks from './NavLink';
import SideDrawer from './SideDrawer';
import Bacdrop from "../UIElements/Backdrop"
import './MainNavigation.css';

const MainNavigation = props => {
  const [drawerIsOpen,setDrawer] = useState(false)
  const openDrawer = ()=>{
    setDrawer(true);
  }
  const closeDrawer = ()=>{
    setDrawer(false);
  }
  return (
    
  <>

    {
      drawerIsOpen && <Bacdrop onClick={closeDrawer}/>
    }

 <SideDrawer onClick={closeDrawer} show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>

    </>
  );
};

export default MainNavigation;
