import React from 'react'
import { Link as RebassLink } from 'rebass'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { lighten, darken } from 'polished'

const WrappedLink = ({ external, children, ...rest }) => (
  <RebassLink
    target={external ? '_blank' : null}
    rel={external ? 'noopener noreferrer' : null}
    color="#dcae25"
    {...rest}
  >
    {children}
  </RebassLink>
)

WrappedLink.propTypes = {
  external: PropTypes.bool,
}

export const Link = styled(WrappedLink)`
  color: ${({ color, theme }) => (color ? color : theme.link)};
  @media (max-width: 1333px) {
    padding-bottom: 2em !important;
  }
`

export default Link

export const CustomLink = styled(RouterLink)`
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: ${({ color, theme }) => (color ? color : theme.link)};

  &:visited {
    color: ${({ color, theme }) => (color ? lighten(0.1, color) : lighten(0.1, theme.link))};
  }

  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
    color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.link))};
  }
`

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
  }
  margin-left: 1.25rem !important;
  margin-right: 1.25rem !important;
  margin-bottom: 1.25rem !important;
`

export const HeaderLink = styled(RouterLink)`
  @media (max-width: 1333px) {
    padding-top: 0.5em;
    padding-bottom: 1.5em;
  }
`