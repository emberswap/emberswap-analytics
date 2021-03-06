import React from 'react'
import styled from 'styled-components'
import TokenLogo from '../TokenLogo'

export default function DoubleTokenLogo({ a0, a1, size = 36, margin = true }) {
  const TokenWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 2 + 8).toString() + 'px'};
  `

  const HigherLogo = styled(TokenLogo)`
    z-index: 2;
    background-color: transparent;
    border-radius: 50%;
  `

  const CoveredLogo = styled(TokenLogo)`
    position: absolute;
    left: ${({ sizeraw }) => (sizeraw / 2 + 8).toString() + 'px'};
    background-color: transparent;
    border-radius: 50%;
  `

  return (
    <TokenWrapper sizeraw={size} margin={margin}>
      <HigherLogo address={a0} size={size.toString() + 'px'} sizeraw={size} />
      <CoveredLogo address={a1} size={size.toString() + 'px'} sizeraw={size} />
    </TokenWrapper>
  )
}
