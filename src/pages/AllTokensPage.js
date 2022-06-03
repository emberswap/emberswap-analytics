import React, { useEffect, useState } from 'react'
import 'feather-icons'

import TopTokenList from '../components/TokenList'
import { TYPE } from '../Theme'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { PageWrapper, FullWrapper } from '../components'
import { /*AutoRow,*/ RowBetween } from '../components/Row'
import { useMedia } from 'react-use'
//import QuestionHelper from '../components/QuestionHelper'
//import CheckBox from '../components/Checkbox'
// import CheckBox from '../components/Checkbox'
// import QuestionHelper from '../components/QuestionHelper'

function AllTokensPage() {
  const allTokens = useAllTokenData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below600 = useMedia('(max-width: 800px)')

  //  const [useTracked, setUseTracked] = useState(true)

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader style={{ marginTop: '50px' }}>Top Tokens</TYPE.largeHeader>
        </RowBetween>
        {/* <AutoRow gap="4px">
          <CheckBox checked={useTracked} setChecked={() => setUseTracked(!useTracked)} text={'Hide untracked tokens'} />
          <QuestionHelper text="USD amounts may be inaccurate in low liquidity pairs or pairs without BCH or stablecoins." />
        </AutoRow> */}
        <Panel style={{ marginTop: '6px', padding: below600 && '1rem 0 0 0 ' }}>
          <TopTokenList tokens={allTokens} itemMax={50} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
