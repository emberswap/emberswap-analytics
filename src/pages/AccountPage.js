import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useUserTransactions, useUserPositions /*, useMiningPositions*/ } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum } from '../utils'
import Row, { AutoRow, RowFixed, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import UserChart from '../components/UserChart'
import PairReturnsChart from '../components/PairReturnsChart'
import PositionList from '../components/PositionList'
//import MiningPositionList from '../components/MiningPositionList'
import { TYPE } from '../Theme'
import { ButtonDropdown /*, ButtonLight*/ } from '../components/ButtonStyled'
import { PageWrapper, ContentWrapper, StyledIcon } from '../components'
import DoubleTokenLogo from '../components/DoubleLogo'
import { Bookmark, Activity } from 'react-feather'
import Link from '../components/Link'
import { FEE_WARNING_TOKENS } from '../constants'
import { BasicLink } from '../components/Link'
import { useSavedAccounts } from '../contexts/LocalStorage'
import { useTokenData } from '../contexts/TokenData'
import TreasuryList from '../components/TreasuryList'
import Web3 from 'web3'

let latestKnownBlockNumber = -1
let blockTime = 30000
var fireBalance
var emberBalance

// Our function that will triggered for every block
async function processBlock(blockNumber) {
  const web3 = new Web3('https://smartbch.fountainhead.cash/mainnet/')
  let block = await web3.eth.getBlock(blockNumber)
  let abi = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  let tokenAddress = '0x225FCa2A940cd5B18DFb168cD9B7f921C63d7B6E'
  let emberAddress = '0x6BAbf5277849265b6738e75AEC43AEfdde0Ce88D'
  const UniswapToken = new web3.eth.Contract(abi, tokenAddress)
  const EmberToken = new web3.eth.Contract(abi, emberAddress)
  let balance = await UniswapToken.methods.balanceOf('0x28026B722Bb83B9cA84bE57bB6F818e3F6038627').call()
  var firetreasurybalance = balance / 1e18
  let emberbalance = await EmberToken.methods.balanceOf('0xc6752c2f631416eB6A820e18C159DdF39269c5e9').call()
  var embertreasurybalance = emberbalance / 1e18
  localStorage.setItem('firebalance', firetreasurybalance)
  localStorage.setItem('emberbalance', embertreasurybalance)
  for (const transactionHash of block.transactions) {
    let transaction = await web3.eth.getTransaction(transactionHash)
    let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash)
    transaction = Object.assign(transaction, transactionReceipt)
    // Do whatever you want here
  }
  latestKnownBlockNumber = blockNumber
}
// This function is called every blockTime, check the current block number and order the processing of the new block(s)
async function checkCurrentBlock() {
  const web3 = new Web3('https://smartbch.fountainhead.cash/mainnet/')
  const currentBlockNumber = await web3.eth.getBlockNumber()
  while (latestKnownBlockNumber === -1 || currentBlockNumber > latestKnownBlockNumber) {
    await processBlock(latestKnownBlockNumber === -1 ? currentBlockNumber : latestKnownBlockNumber + 1)
  }
  setTimeout(checkCurrentBlock, blockTime)
}
checkCurrentBlock()

const AccountWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in;
`

const Header = styled.div``

const DashboardWrapper = styled.div`
  width: 100%;
`

const DropdownWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border: 1px solid #edeef2;
  border-radius: 12px;
`

const Flyout = styled.div`
  position: absolute;
  top: 38px;
  left: -1px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 999;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-top: 4px;
  border: 1px solid #edeef2;
  border-top: none;
  transition: all 0.3s ease-in;
`

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
  transition: all 0.3s ease-in;
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
  transition: all 0.3s ease-in;
`

function AccountPage({ account }) {
  var localfireBalance = localStorage.getItem('firebalance')
  var localemberBalance = localStorage.getItem('emberbalance')
  var priceEMBER = useTokenData('0x6babf5277849265b6738e75aec43aefdde0ce88d')
  var priceFIRE = useTokenData('0x225fca2a940cd5b18dfb168cd9b7f921c63d7b6e')
  var firePrice = priceFIRE.priceUSD * fireBalance || priceFIRE.priceUSD * localfireBalance || 0
  var emberPrice = priceEMBER.priceUSD * emberBalance || priceEMBER.priceUSD * localemberBalance || 0
  localStorage.setItem('firePrice', firePrice)
  localStorage.setItem('emberPrice', emberPrice)

  // get data for this account
  const transactions = useUserTransactions(account)
  const positions = useUserPositions(account)
  /* const miningPositions = useMiningPositions(account)*/

  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  let totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
          return total + parseFloat(swap.amountUSD)
        }, 0)
      : 0
  }, [transactions])

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (
          FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) ||
          FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)
        ) {
          setShowWarning(true)
        }
      }
    }
  }, [positions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const aggregateFees = dynamicPositions?.reduce(function (total, position) {
    return total + position.fees.sum
  }, 0)

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
          return (
            total +
            (parseFloat(position?.liquidityTokenBalance) / parseFloat(position?.pair?.totalSupply)) *
              position?.pair?.reserveUSD
          )
        }, 0)
      : null
  }, [dynamicPositions])

  //const AggregateFees =
  //  dynamicPositions?.reduce(function (total, position) {
  //    return total + position.fees.sum
  //  }, 0) /
  //    2 -
  //  positionValue

  //const aggregateTreasuryFees = positionValue - AggregateFees

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  //const below600 = useMedia('(max-width: 600px)')

  // adding/removing account from saved accounts
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const isBookmarked = savedAccounts.includes(account)
  const handleBookmarkClick = useCallback(() => {
    ;(isBookmarked ? removeAccount : addAccount)(account)
  }, [account, isBookmarked, addAccount, removeAccount])

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          {account !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' &&
            account !== '0x8ecb32c33ab3f7ee3d6ce9d4020bc53fecb36be9' && (
              <TYPE.body style={{ marginTop: '50px' }}>
                <BasicLink to="/accounts">{'Accounts '}</BasicLink>→{' '}
                <Link lineHeight={'145.23%'} href={'https://sonar.cash/address/' + account} target="_blank">
                  {' '}
                  {account?.slice(0, 42)}{' '}
                </Link>
              </TYPE.body>
            )}
          {account === '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' && (
            <TYPE.largeHeader style={{ marginTop: '50px' }}>{'Treasury Holdings'}</TYPE.largeHeader>
          )}
          {account === '0x8ecb32c33ab3f7ee3d6ce9d4020bc53fecb36be9' && (
            <TYPE.body style={{ marginTop: '50px' }}>
              <BasicLink to="/accounts">{'Accounts '}</BasicLink>→{' '}
              <Link lineHeight={'145.23%'} href={'https://sonar.cash/address/' + account} target="_blank">
                {' '}
                {'EmberDistributorV2'}{' '}
              </Link>
            </TYPE.body>
          )}
        </RowBetween>
        {account !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' &&
          account !== '0x8ecb32c33ab3f7ee3d6ce9d4020bc53fecb36be9' && (
            <Header>
              <RowBetween>
                <span>
                  <TYPE.header fontSize={24}>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
                  <Link lineHeight={'145.23%'} href={'https://sonar.cash/address/' + account} target="_blank">
                    <TYPE.main fontSize={14}>View on Sonar</TYPE.main>
                  </Link>
                </span>
                <AccountWrapper>
                  <StyledIcon>
                    <Bookmark
                      onClick={handleBookmarkClick}
                      style={{ opacity: isBookmarked ? 0.8 : 0.4, cursor: 'pointer' }}
                    />
                  </StyledIcon>
                </AccountWrapper>
              </RowBetween>
            </Header>
          )}
        {account === '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' && (
          <Header>
            <RowBetween>
              <span>
                <Link lineHeight={'145.23%'} href={'https://sonar.cash/address/' + account} target="_blank">
                  <TYPE.main fontSize={14}>View on Sonar</TYPE.main>
                </Link>
              </span>
              <AccountWrapper>
                <StyledIcon>
                  <Bookmark
                    onClick={handleBookmarkClick}
                    style={{ opacity: isBookmarked ? 0.8 : 0.4, cursor: 'pointer' }}
                  />
                </StyledIcon>
              </AccountWrapper>
            </RowBetween>
          </Header>
        )}
        {account === '0x8ecb32c33ab3f7ee3d6ce9d4020bc53fecb36be9' && (
          <Header>
            <RowBetween>
              <span>
                <TYPE.header fontSize={24}>EmberDistributorV2</TYPE.header>
                <Link lineHeight={'145.23%'} href={'https://sonar.cash/address/' + account} target="_blank">
                  <TYPE.main fontSize={14}>View on Sonar</TYPE.main>
                </Link>
              </span>
              <AccountWrapper>
                <StyledIcon>
                  <Bookmark
                    onClick={handleBookmarkClick}
                    style={{ opacity: isBookmarked ? 0.8 : 0.4, cursor: 'pointer' }}
                  />
                </StyledIcon>
              </AccountWrapper>
            </RowBetween>
          </Header>
        )}
        <DashboardWrapper>
          {showWarning && <Warning>Fees cannot currently be calculated for pairs that include AMPL.</Warning>}
          {!hideLPContent && (
            <DropdownWrapper>
              <ButtonDropdown width="100%" onClick={() => setShowDropdown(!showDropdown)} open={showDropdown}>
                {!activePosition && (
                  <RowFixed>
                    <StyledIcon>
                      <Activity size={16} />
                    </StyledIcon>
                    <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                  </RowFixed>
                )}
                {activePosition && (
                  <RowFixed>
                    <DoubleTokenLogo a0={activePosition.pair.token0.id} a1={activePosition.pair.token1.id} size={32} />
                    <TYPE.body ml={'16px'}>
                      {activePosition.pair.token0.symbol}-{activePosition.pair.token1.symbol} Position
                    </TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              {showDropdown && (
                <Flyout>
                  <AutoColumn gap="0px">
                    {positions?.map((p, i) => {
                      if (p.pair.token1.symbol === 'WBCH') {
                        p.pair.token1.symbol = 'BCH'
                      }
                      if (p.pair.token0.symbol === 'WBCH') {
                        p.pair.token0.symbol = 'BCH'
                      }
                      return (
                        p.pair.id !== activePosition?.pair.id && (
                          <MenuRow
                            onClick={() => {
                              setActivePosition(p)
                              setShowDropdown(false)
                            }}
                            key={i}
                          >
                            <DoubleTokenLogo a0={p.pair.token0.id} a1={p.pair.token1.id} size={32} />
                            <TYPE.body ml={'16px'}>
                              {p.pair.token0.symbol}-{p.pair.token1.symbol} Position
                            </TYPE.body>
                          </MenuRow>
                        )
                      )
                    })}
                    {activePosition && (
                      <MenuRow
                        onClick={() => {
                          setActivePosition()
                          setShowDropdown(false)
                        }}
                      >
                        <RowFixed>
                          <StyledIcon>
                            <Activity size={16} />
                          </StyledIcon>
                          <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                        </RowFixed>
                      </MenuRow>
                    )}
                  </AutoColumn>
                </Flyout>
              )}
            </DropdownWrapper>
          )}
          {!hideLPContent && (
            <Panel style={{ height: '100%', marginBottom: '1rem' }}>
              <AutoRow gap="20px">
                {account !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' ? (
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <TYPE.body>Liquidity (Including Fees)</TYPE.body>
                      <div />
                    </RowBetween>
                    <RowFixed align="flex-end">
                      <TYPE.header fontSize={'24px'} lineHeight={1}>
                        {positionValue
                          ? formattedNum(positionValue, true)
                          : positionValue === 0
                          ? formattedNum(0, true)
                          : '-'}
                      </TYPE.header>
                    </RowFixed>
                  </AutoColumn>
                ) : (
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <TYPE.body>Liquidity (Including Emission Holdings)</TYPE.body>
                      <div />
                    </RowBetween>
                    <RowFixed align="flex-end">
                      <TYPE.header fontSize={'24px'} lineHeight={1}>
                        {positionValue
                          ? formattedNum(positionValue + emberPrice + firePrice, true)
                          : positionValue === 0
                          ? formattedNum(0, true)
                          : '-'}
                      </TYPE.header>
                    </RowFixed>
                  </AutoColumn>
                )}

                {account !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' ? (
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <TYPE.body>Fees Earned (Cumulative)</TYPE.body>
                      <div />
                    </RowBetween>
                    <RowFixed align="flex-end">
                      <TYPE.header fontSize={'24px'} lineHeight={1} color={aggregateFees && 'green'}>
                        {aggregateFees ? formattedNum(aggregateFees, true, true) : '-'}
                      </TYPE.header>
                    </RowFixed>
                  </AutoColumn>
                ) : (
                  <AutoColumn gap="10px">
                    <RowFixed align="flex-end"></RowFixed>
                  </AutoColumn>
                )}
              </AutoRow>
            </Panel>
          )}
          {!hideLPContent && account !== '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' && (
            <PanelWrapper>
              <Panel style={{ gridColumn: '1' }}>
                {activePosition ? (
                  <PairReturnsChart account={account} position={activePosition} />
                ) : (
                  <UserChart account={account} position={activePosition} />
                )}
              </Panel>
            </PanelWrapper>
          )}
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Positions
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <PositionList positions={positions} />
          </Panel>
          {account === '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' && (
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
              Token Holdings
            </TYPE.main>
          )}
          {account === '0xc6752c2f631416eb6a820e18c159ddf39269c5e9' && (
            <Panel
              style={{
                marginTop: '1.5rem',
              }}
            >
              <TreasuryList />
            </Panel>
          )}
          {/*<TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Liquidity Mining Pools
          </TYPE.main>
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            miningPositions && <MiningPositionList miningPositions={miningPositions} />}
            {!miningPositions && (
              <AutoColumn gap="8px" justify="flex-start">
                <TYPE.main>No Staked Liquidity.</TYPE.main>
                <AutoRow gap="8px" justify="flex-start">
                  <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Learn More</ButtonLight>{' '}
                </AutoRow>{' '}
              </AutoColumn>
            )
          </Panel>*/}
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Transactions
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <TxnList transactions={transactions} />
          </Panel>
          <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
            Wallet Stats
          </TYPE.main>{' '}
          <Panel
            style={{
              marginTop: '1.5rem',
            }}
          >
            <AutoRow gap="20px">
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</TYPE.header>
                <TYPE.main>Total Value Swapped</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.0025, true) : '-'}
                </TYPE.header>
                <TYPE.main>Total Fees Paid</TYPE.main>
              </AutoColumn>
              <AutoColumn gap="8px">
                <TYPE.header fontSize={24}>{transactionCount ? transactionCount : '-'}</TYPE.header>
                <TYPE.main>Total Transactions</TYPE.main>
              </AutoColumn>
            </AutoRow>
          </Panel>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default AccountPage
