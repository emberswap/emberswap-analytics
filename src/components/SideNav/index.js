import React from 'react'
import styled from 'styled-components'
import { RowFixed } from '../Row'
import { useMedia } from 'react-use'
import { TYPE } from '../../Theme'
import { withRouter } from 'react-router-dom'
import { useSessionStart } from '../../contexts/Application'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 10px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  position: sticky;
  top: 0px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 99999;
  background: ${({ theme }) => theme.bg8};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  background-color: ${({ theme }) => theme.bg0};
  transition: all 0.3s ease-in;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    width: calc(100%);
    position: sticky;
  }
`

const DesktopWrapper = styled(RowFixed)`
  @media (max-width: 1080px) {
    margin-top: auto;
    margin-bottom: auto;

    width: 100%;
  }
`

const Polling = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  padding: 1rem;
  color: ${({ theme }) => theme.text1};
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
  transition: all 0.3s ease-in;
`

function SideNav({ history }) {
  const below1180 = useMedia('(max-width: 1180px)')

  const seconds = useSessionStart()

  return (
    <Wrapper>
      <DesktopWrapper>
        {/*<AutoRow gap="0.5rem" style={{ marginLeft: '.75rem', marginBottom: '4rem' }}>
          <HeaderText>
            <Link href="https://emberswap.com">EmberSwap.com</Link>
          </HeaderText>
          <HeaderText>
            <Link href="https://docs.emberswap.com">Docs</Link>
          </HeaderText>
          <HeaderText>
            <Link href="https://discord.com/invite/D96Bd42aS3" target="_blank">
              Discord
            </Link>
          </HeaderText>
          <HeaderText>
            <Link href="https://twitter.com/EmberSwapDEX" target="_blank">
              Twitter
            </Link>
          </HeaderText>

                </AutoRow>*/}
        {!below1180 && (
          <Polling style={{ marginLeft: '.5rem' }}>
            <PollingDot />
            <a href="/">
              <TYPE.small>
                Updated {!!seconds ? seconds + 's' : '-'} ago <br />
              </TYPE.small>
            </a>
          </Polling>
        )}
      </DesktopWrapper>
    </Wrapper>
  )
}

export default withRouter(SideNav)
