import React from 'react'
import { Flex } from 'rebass'

import Link from '../Link'

const links = [
  { url: 'https://emberswap.com', text: 'About' },
  { url: 'https://docs.emberswap.com', text: 'Docs' },
  { url: 'https://github.com/emberswap/emberswap-analytics', text: 'Code' },
]

const FooterLink = ({ children, ...rest }) => (
  <Link external color="emberswapred" fontWeight={500} fontSize={12} mr={'8px'} {...rest}>
    {children}
  </Link>
)

const Footer = () => (
  <Flex as="footer" p={24}>
    {links.map((link, index) => (
      <FooterLink key={index} href={link.url}>
        {link.text}
      </FooterLink>
    ))}
  </Flex>
)

export default Footer
