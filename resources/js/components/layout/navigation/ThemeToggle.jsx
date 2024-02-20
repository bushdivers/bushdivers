import { Flex, Icon, IconButton, useColorMode } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'
import React from 'react'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex alignItems="center" gap={1}>
      <IconButton size="sm" variant="ghost" onClick={toggleColorMode}>
        {colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />}
      </IconButton>
    </Flex>
  )
}

export default ThemeToggle
