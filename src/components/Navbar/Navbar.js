import React, { useState } from 'react'
import styled from 'styled-components'
import Search from '../Search'
import { useMedia } from 'react-use'
import Toggle from '../Toggle'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import Wordmark from '../../assets/wordmark_white.svg'
import { TrendingUp, List, PieChart, Framer, Disc, Activity } from 'react-feather'
import { withRouter } from 'react-router-dom'
import { HeaderLink, Link } from '../Link'

function Navbar({ history }) {
  const below1333 = useMedia('(max-width: 1333px)')

  const [isOpen, setIsOpen] = useState(false)

  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <Nav>
      <Logo href="/home">
        <EmberLogo src={Wordmark} alt="logo" onClick={() => setIsOpen(false)} />
      </Logo>
      {below1333 && (
        <MobileSearcher>
          {' '}
          <Search small={true} style={{ background: '#fff !important' }} />
        </MobileSearcher>
      )}
      {below1333 && <Toggle isActive={isDark} toggle={toggleDarkMode} />}
      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <span />
        <span />
        <span />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <HeaderLink to="/home" onClick={() => setIsOpen(false)}>
          <MenuLink activeText={history.location.pathname === '/home' ?? undefined}>
            <TrendingUp size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Overview
          </MenuLink>
        </HeaderLink>
        <HeaderLink to="/tokens" onClick={() => setIsOpen(false)}>
          <MenuLink
            activeText={
              (history.location.pathname.split('/')[1] === 'tokens' ||
                history.location.pathname.split('/')[1] === 'token') ??
              undefined
            }
          >
            <Disc size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Tokens
          </MenuLink>
        </HeaderLink>
        <HeaderLink to="/pairs" onClick={() => setIsOpen(false)}>
          <MenuLink
            activeText={
              (history.location.pathname.split('/')[1] === 'pairs' ||
                history.location.pathname.split('/')[1] === 'pair') ??
              undefined
            }
          >
            <PieChart size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Pairs
          </MenuLink>
        </HeaderLink>
        <HeaderLink to="/account/0xc6752c2f631416eb6a820e18c159ddf39269c5e9" onClick={() => setIsOpen(false)}>
          <MenuLink
            activeText={
              history.location.pathname.split('/')[2] === '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' ?? undefined
            }
          >
            <Framer size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Treasury
          </MenuLink>
        </HeaderLink>
        <HeaderLink to="/accounts" onClick={() => setIsOpen(false)}>
          <MenuLink
            activeText={
              ((history.location.pathname.split('/')[1] === 'accounts' ||
                history.location.pathname.split('/')[1] === 'account') &&
                history.location.pathname.split('/')[2] !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9') ??
              undefined
            }
          >
            <List size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Accounts
          </MenuLink>
        </HeaderLink>
        <Link href="https://dex.emberswap.com" rel="noreferrer" onClick={() => setIsOpen(false)}>
          <MenuLink style={{ fontWeight: '900' }}>
            <Activity size={20} style={{ marginRight: '.75rem', position: 'relative', top: '0.4em' }} />
            Swap
          </MenuLink>
        </Link>
        {!below1333 && (
          <Searcher>
            <Search small={true} style={{ background: '#fff !important' }} />
          </Searcher>
        )}
        {!below1333 && <Toggle isActive={isDark} toggle={toggleDarkMode} />}
      </Menu>
    </Nav>
  )
}

const MobileSearcher = styled.span`
  padding-top: 0.8rem;
  z-index: 999999999;
`
const Searcher = styled.span`
  padding-top: 1em;
  padding-right: 10em;
  z-index: 999999999;
  @media (max-width: 1333px) {
    padding-right: -10em;
  }
`

const Nav = styled.div`
  padding: 0 2 rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 99999;
  background: ${({ theme }) => theme.headerbg};
  transition: background-color 0.3s ease-in;
`

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  top: 30px;
  padding-right: 6em;
  span {
    height: 2px;
    width: 25px;
    background: ${({ theme }) => theme.hamburger};
    transition: background-color 0.3s ease-in;
    margin-bottom: 4px;
    border-radius: 4px;
  }
  @media (max-width: 1333px) {
    display: flex;
    padding-right: 2em;
  }
`

const MenuLink = styled.span`
  padding: 1rem 2rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  border-radius: 12px;
  padding: 8px 12px;
  background-color: ${({ theme, activeText }) => (activeText ? theme.buttonbg : '')};
  font-weight: ${({ activeText }) => (activeText ? 600 : 0)};
  opacity: ${({ activeText }) => (activeText ? 1 : 0.6)};
  color: ${({ theme }) => theme.text1};
  transition: all 0.3s ease-in;
  font-size: 0.9rem;

  &:hover {
    color: ${({ theme }) => theme.hoverontext};
  }
`

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 1333px) {
    overflow: hidden;
    flex-direction: column;
    width: 100%;
    max-height: ${({ isOpen }) => (isOpen ? '100%' : '0px')};
  }
`

const Logo = styled.a`
  padding: 1rem 0;
  color: #000;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.7rem;
  span {
    font-weight: 300;
    font-size: 1.3rem;
  }
`
const EmberLogo = styled.img`
  width: 136px;
  margin-left: 16px;
  position: relative;
  top: 5px;

  @media (max-width: 1485px) {
    display: none;
  }
  @media (max-width: 1333px) {
    display: block;
    margin-left: 30px;
    width: 170px;
    top: 0px;
  }
  @media (max-width: 550px) {
    margin-left: 16px;
    width: 100px;
    top: 10px;
  }
`
export default withRouter(Navbar)
