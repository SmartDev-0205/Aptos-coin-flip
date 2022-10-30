import Box from '@mui/material/Box'

import { LogoSection } from '../common/logo-sec '
import { Navbar } from '../components/Navbar/Navbar'

const Main = () => {
  return (
    <Box component={'section'}>
      <Navbar />
      <LogoSection />
    </Box>
  )
}

export default Main
