import React, { useState } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum } from '../../utils'
import { AutoColumn } from '../Column'
import { RowFixed } from '../Row'
import { TYPE } from '../../Theme'
import FormattedName from '../FormattedName'
import EmberLogo from '../../assets/ember.png'
import FireLogo from '../../assets/fire.png'

//import { useRouter } from 'next/router'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const Dividertreasury = styled.div`
  height: 1px;
  width: 100%;
  position: relative;
  top: 75px;
  background-color: ${({ theme }) => theme.divider};
  z-index: 99999;
`
const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 5px 0.5fr 1fr 1fr;
  grid-template-areas: 'number name uniswap return';
  align-items: flex-start;
  padding: 20px 0;

  > * {
    justify-content: flex-end;
    width: 100%;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 35px 2.5fr 1fr 1fr;
    grid-template-areas: 'number name uniswap return';
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr 1fr;
    grid-template-areas: 'name uniswap return';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name uniswap';
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  text-align: end;
  user-select: none;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};
  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

function PositionList() {
  const below740 = useMedia('(max-width: 740px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage] = useState(1)

  var fireBalance = localStorage.getItem('firebalance') || 0
  var emberBalance = localStorage.getItem('emberbalance') || 0
  var firePrice = localStorage.getItem('firePrice')
  var emberPrice = localStorage.getItem('emberPrice')
  const ListItem = () => {
    return (
      <DashGrid style={{ opacity: 1 }} focus={true}>
        {!below740 && <DataText area="number"></DataText>}
        <DataText area="name" justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="14px" justify="flex-start" align="flex-start">
            <img
              size={'32px'}
              src={EmberLogo}
              style={{
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
                borderRadius: '24px',
              }}
              alt=""
            />
            <Divider />
            <img
              size={'32px'}
              src={FireLogo}
              style={{
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
                borderRadius: '24px',
              }}
              alt=""
            />
          </AutoColumn>
          <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
            <CustomLink to={'/token/0x6babf5277849265b6738e75aec43aefdde0ce88d'}>
              <TYPE.main style={{ whiteSpace: 'nowrap' }} to={'/token/0x6babf5277849265b6738e75aec43aefdde0ce88d'}>
                <FormattedName text={'EMBER'} maxCharacters={below740 ? 10 : 18} />
              </TYPE.main>
            </CustomLink>
            <Divider />
            <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
              <CustomLink to={'/token/0x225FCa2A940cd5B18DFb168cD9B7f921C63d7B6E'}>
                <TYPE.main style={{ whiteSpace: 'nowrap' }} to={'/token/0x225FCa2A940cd5B18DFb168cD9B7f921C63d7B6E'}>
                  <FormattedName text={'FIRE'} maxCharacters={below740 ? 10 : 18} />
                </TYPE.main>
              </CustomLink>
            </AutoColumn>
          </AutoColumn>
        </DataText>
        <DataText area="uniswap">
          <AutoColumn gap="12px" justify="flex-end">
            <TYPE.main>{formattedNum(emberPrice, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <TYPE.small fontWeight={400}>{formattedNum(emberBalance)} </TYPE.small>
                <FormattedName text={'EMBER'} maxCharacters={below740 ? 10 : 18} margin={true} fontSize={'11px'} />
              </RowFixed>
            </AutoColumn>
            <Divider />
            <AutoColumn gap="12px" justify="flex-end">
              <TYPE.main>{formattedNum(firePrice, true, true)}</TYPE.main>
              <AutoColumn gap="4px" justify="flex-end">
                <RowFixed>
                  <TYPE.small fontWeight={400}>{formattedNum(fireBalance)} </TYPE.small>
                  <FormattedName text={'FIRE'} maxCharacters={below740 ? 10 : 18} margin={true} fontSize={'11px'} />
                </RowFixed>
              </AutoColumn>
            </AutoColumn>
          </AutoColumn>
        </DataText>
      </DashGrid>
    )
  }
  return (
    <ListWrapper>
      <DashGrid center={true} style={{ height: '32px', padding: 0 }}>
        {!below740 && (
          <Flex alignItems="flex-start" justifyContent="flexStart">
            <TYPE.main area="number">#</TYPE.main>
          </Flex>
        )}
        <Flex alignItems="flex-start" justifyContent="flex-start">
          <TYPE.main area="number">Name</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText area="uniswap"> {below740 ? 'Value' : 'Liquidity'} </ClickableText>
        </Flex>
      </DashGrid>
      <Divider />
      <Dividertreasury />
      <DashGrid style={{ opacity: 1 }} focus={true}>
        {!below740 && <DataText area="number"></DataText>}
        <DataText area="name" justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="12px" justify="flex-start" align="flex-start">
            <img
              width={'32px'}
              src={EmberLogo}
              style={{
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
              }}
              alt=""
            />
            <Divider />
            <img
              width={'32px'}
              src={FireLogo}
              style={{
                marginTop: '16px',
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
              }}
              alt=""
            />
          </AutoColumn>
          <AutoColumn gap="16px" justify="flex-start" style={{ marginLeft: '20px', marginTop: '8px' }}>
            <CustomLink to={'/token/0x6babf5277849265b6738e75aec43aefdde0ce88d'}>
              <TYPE.main style={{ whiteSpace: 'nowrap' }} to={'/token/0x6babf5277849265b6738e75aec43aefdde0ce88d'}>
                <FormattedName text={'Ember (EMBER)'} />
              </TYPE.main>
            </CustomLink>
            <Divider />
            <CustomLink to={'/token/0x225FCa2A940cd5B18DFb168cD9B7f921C63d7B6E'}>
              <TYPE.main
                style={{ whiteSpace: 'nowrap', marginTop: '24px' }}
                to={'/token/0x225FCa2A940cd5B18DFb168cD9B7f921C63d7B6E'}
              >
                <FormattedName text={'Incinerate (FIRE)'} />
              </TYPE.main>
            </CustomLink>
          </AutoColumn>
        </DataText>
        <DataText area="uniswap">
          <AutoColumn gap="12px" justify="flex-end">
            <TYPE.main>{formattedNum(emberPrice, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <TYPE.small fontWeight={400}>{formattedNum(emberBalance)} </TYPE.small>
                <FormattedName text={'EMBER'} maxCharacters={below740 ? 10 : 18} margin={true} fontSize={'11px'} />
              </RowFixed>
            </AutoColumn>
            <Divider />
            <TYPE.main>{formattedNum(firePrice, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <TYPE.small fontWeight={400}>{formattedNum(fireBalance)} </TYPE.small>
                <FormattedName text={'FIRE'} maxCharacters={below740 ? 10 : 18} margin={true} fontSize={'11px'} />
              </RowFixed>
            </AutoColumn>
         </AutoColumn>
        </DataText>
      </DashGrid>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(PositionList)
