import { useState, useContext, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography
} from '@mui/material'

import './logo-sec.scss'
import logos from '../assets/images/main-logo.png'
import logos2 from '../assets/images/main-logo-2.png'

import { headerBtnData, bodyBtnData, amountData } from './config'
import { AptosContext } from '../context/useAptos'

export const LogoSection = () => {
  const useAptos = useContext(AptosContext);
  const address = useAptos?.address;
  const isConnected = useAptos?.isConnected;
  const play = useAptos?.play;

  useEffect(() => {
    if (!isConnected) {
      setStatusStr("Waiting connect Wallet");
    } else {
      setStatusStr("Waiting user input");
    }
  }, [isConnected]);
  const [activeChoice, setChoice] = useState<number>(-1)
  const [activeValue, setValue] = useState<number>(-1)
  const [activeAmount, setAmount] = useState<number>(0)
  const [statusStr, setStatusStr] = useState<string>("")
  const handleChoice = (index: number) => {
    setChoice(index)
  }
  const handleValue = (index: number) => {
    setValue(index);
    setAmount(amountData[index]);
  }

  const handlePlay = async () => {
    setStatusStr("Waiting transaction accept.")
    setIsLoading(true);
    const result: string = await play(activeAmount, activeChoice);
    if (result === "SUCCESS")
      setStatusStr("Awesome. You win.")
    else if (result === "LOST")
      setStatusStr("We are sorry. You lost");
    else 
      setStatusStr("Waiting user to play.")

    console.log("RESILT ===>", result);
    setIsLoading(false);
  }
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <Container maxWidth='md'>
      <Box component={'div'} className='content-wrapper'>
        <Box
          component={`span`}
          className={`img-contain ${isLoading ? 'spinner-logo' : ''}`}
        >
          <Box className='main-logo'>
            <img src={logos} alt='logo_img' />
          </Box>
          <Box className='main-logo-2'>
            <img src={logos2} alt='logo_img' />
          </Box>
        </Box>

        <Divider />
        <Box component={'div'} className='content-body-wrapper'>
          <section>
            <div className='header-btn-group'>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography component={'h2'}>I LIKE</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Container maxWidth='sm'>
                    <Grid container spacing={5}>
                      {headerBtnData.map((item, index: number) => {
                        return (
                          <Grid item xs={item.grid}>
                            <Box component={'span'}>
                              <Button
                                variant='contained'
                                component={'button'}
                                color={
                                  activeChoice === index ? 'success' : 'primary'
                                }
                                onClick={() => {
                                  handleChoice(index)
                                }}
                              >
                                {item.text}
                              </Button>
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Container>
                </Grid>

                <Grid item xs={12}>
                  <Typography component={'h2'}>FOR</Typography>
                </Grid>
              </Grid>
            </div>
          </section>

          <section>
            <Container maxWidth='sm' className='body-btn-group'>
              <Grid container spacing={2}>
                {bodyBtnData.map((item, index: number) => {
                  return (
                    <Grid item xs={item.grid}>
                      <Box component={'span'}>
                        <Button
                          variant='contained'
                          component={'button'}
                          color={activeValue === index ? 'success' : 'primary'}
                          onClick={() => {
                            handleValue(index)
                          }}
                        >
                          {item.text}
                        </Button>
                      </Box>
                    </Grid>
                  )
                })}
                <Grid item xs={12}>
                  <Box component={'span'}>
                    <Button
                      variant='contained'
                      component={'button'}
                      color={'primary'}
                      onClick={handlePlay}
                      disabled={!isConnected || !(activeChoice > -1) || !(activeValue > -1)}
                    >
                      DOUBLE OR NOTHING
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box component={'span'}>
                  <Typography component={'h3'}>{`STATUS:${statusStr}`}</Typography>
                </Box>
              </Grid>
            </Container>
          </section>
        </Box>
      </Box>
    </Container>
  )
}
