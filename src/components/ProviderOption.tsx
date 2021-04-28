import { Box, Text } from 'grommet'
import React from 'react'
import styled, { css } from 'styled-components'

import selectedIconSrc from './images/icon-selected.svg'

function noop() {}

type LogoImageProps = { src: string }

const LogoImage = styled.div<LogoImageProps>`
  position: relative;
  display: inline-block;
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-size: cover;
  ${({ src }: LogoImageProps) => css`
    background-image: url(${src});
  `}
`

const SelectedImage = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: -15px;
  margin-right: -15px;
`

export type ProviderDisplay = {
  label: string
  logo: string
}

export type ProviderOptionProps = ProviderDisplay & {
  disabled?: boolean
  onClick: () => void
  selected?: boolean
}

export function ProviderOption({ disabled, label, logo, onClick, selected }: ProviderOptionProps) {
  const selectedIcon = selected ? (
    <SelectedImage>
      <img alt="✓" src={selectedIconSrc} />
    </SelectedImage>
  ) : null

  return (
    <Box
      align="center"
      direction="column"
      flex={false}
      margin="small"
      onClick={disabled ? noop : onClick}>
      <LogoImage src={logo}>{selectedIcon}</LogoImage>
      <Text>{label}</Text>
    </Box>
  )
}
