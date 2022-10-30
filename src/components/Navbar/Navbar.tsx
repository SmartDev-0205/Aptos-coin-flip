import { Button, Box, Typography, Divider } from '@mui/material'
import aptosLogo from '../../assets/images/aptos_word.svg'
import './Navbar.scss'
import { useState,useContext } from 'react'
import { AptosContext } from '../../context/useAptos'

export const Navbar = () => {

  const useAptos = useContext(AptosContext);
  const address = useAptos?.address;
  const handleDisconnect = useAptos?.handleDisconnect;
  const handleConnect = useAptos?.handleConnect;
  const isConnected = useAptos?.isConnected;
 
  const handleWalletConnect = () => {
    console.log('connect wallet')
  }
  return (
    <>
      <Box component='div' className='Nav-container'>
        <Box component={`span`}>
          <img src={aptosLogo} alt='aptos-logo' />
        </Box>
        {!isConnected ? (
          <Button variant='outlined' onClick={handleConnect}>
            Connect Wallet
          </Button>
        ) : (
          <Button variant='outlined' onClick={handleDisconnect}>
            <Typography component={'span'}>{`${address?.slice(0,4)}...${address?.slice(-4)}`}</Typography>
          </Button>
        )}
      </Box>
      <Divider />
    </>
  )
}
