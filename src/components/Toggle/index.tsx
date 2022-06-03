import React from 'react'
import styled from 'styled-components'
import { Sun, Moon } from 'react-feather'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const IconWrapper = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 0.8 : 0.4)};
  :hover {
    opacity: 1;
  }
`

const StyledToggle = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  margin: 1rem;
  z-index: 9999999999;
  margin-right: 4rem;
  @media (max-width: 1333px) {
    margin-left: 18rem;
    margin-top: 25px;
    border-radius: 6px;
  }
  @media (max-width: 850px) {
    margin-right: 0rem;
    margin-left: 10rem;
    margin-top: 25px;
    border-radius: 6px;
  }
  @media (max-width: 730px) {
    margin-right: 0rem;
    margin-left: -4rem;
    margin-top: 25px;
    border-radius: 6px;
  }
  color: ${({ theme }) => theme.text1};
  :hover {
    text-decoration: none;
  }
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProps) {
  const [darkMode] = useDarkModeManager()
  return (
    <StyledToggle onClick={toggle}>
      <span>
        <IconWrapper isActive={!isActive}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</IconWrapper>
      </span>
    </StyledToggle>
  )
}
