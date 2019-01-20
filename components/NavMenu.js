import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

class NavMenu extends Component {

  renderDonateItem() {

    if ( this.props.settings.enableDonations ) {
      return (
        <Link href="/donate">
          <li className="nav-menu__item">
            <a>Donate</a>
          </li>
        </Link>
      )
    }
  }


  render() {

    return (
      <nav>
        <ul className="nav-menu">

          <Link href="/">
            <div className="nav-menu__logo">
              <img src={this.props.logo} />
            </div>
          </Link>

          <div className="nav-menu__items">
          
            <input type="checkbox" className="nav-menu__item--checkbox" id="nav-menu-checkbox" />
            <label 
              htmlFor="nav-menu-checkbox" 
              className="nav-menu__item nav-menu__item--hamburger"
            ></label>

            <Link href="/">
              <li className="nav-menu__item">
                <a>Home</a>
              </li>
            </Link>

            <Link href="/about">
              <li className="nav-menu__item">
                <a>About</a>
              </li>
            </Link>

            <Link href="/services">
              <li className="nav-menu__item">
                <a>Services</a>
              </li>
            </Link>

            <Link href="/contact">
              <li className="nav-menu__item">
                <a>Contact</a>
              </li>
            </Link>

            { this.renderDonateItem() }
          </div>

        </ul>
      </nav>
    )
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect( mapStateToProps )( NavMenu )
