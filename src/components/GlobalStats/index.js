import React, { useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import { useGlobalData, useEthPrice } from '../../contexts/GlobalData'
import { formattedNum, localNumber } from '../../utils'

import UniPrice from '../UniPrice'
import { TYPE } from '../../Theme'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  width: 100%;
  border-radius: 16px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.bg9};
  transition: background-color 0.3s ease-in;
`

const Medium = styled.span`
  font-weight: 500;
`

export default function GlobalStats() {
  const below640 = useMedia('(max-width: 640px)')
  const below400 = useMedia('(max-width: 400px)')
  const below816 = useMedia('(max-width: 816px)')

  const [showPriceCard, setShowPriceCard] = useState(false)

  const { oneDayVolumeUSD, oneDayTxns, pairCount } = useGlobalData()
  const [ethPrice] = useEthPrice()
  const formattedEthPrice = ethPrice ? formattedNum(ethPrice, true) : '-'
  const oneDayFees = oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD * 0.0025, true) : ''

  return (
    <Header>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>
          <TYPE.main
            mr={'1rem'}
            onMouseEnter={() => {
              setShowPriceCard(true)
            }}
            onMouseLeave={() => {
              setShowPriceCard(false)
            }}
            style={{ position: 'relative' }}
          >
            BCH Price: <Medium>{formattedEthPrice}</Medium>
            {showPriceCard && <UniPrice />}
          </TYPE.main>
          {!below400 && (
            <TYPE.main mr={'1rem'}>
              Transactions (24H): <Medium>{localNumber(oneDayTxns)}</Medium>
            </TYPE.main>
          )}
          {!below640 && (
            <TYPE.main mr={'1rem'}>
              Pairs: <Medium>{localNumber(pairCount)}</Medium>
            </TYPE.main>
          )}
          <TYPE.main mr={'1rem'}>
            Fees (24H): <Medium>{oneDayFees}</Medium>&nbsp;
          </TYPE.main>
        </RowFixed>
      </RowBetween>
    </Header>
  )
}
