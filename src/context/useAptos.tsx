import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { Types, AptosClient } from 'aptos';
import { getRandomInt } from "../util"
const APTOS_RPC = 'https://fullnode.devnet.aptoslabs.com/v1';
const protocol_address = '0x16d268213c705852e187efbfdaca4e64126903e2986ca839acd6ee4a80d1b929';

const client = new AptosClient(APTOS_RPC);
// const token1 = `${protocol_address}::arc::Pool<0x1::aptos_coin::AptosCoin>`;
// const token2 = `${protocol_address}::arc::Pool<${protocol_address}::arc_coin::ARC_Coin>`;
// const ticket = `${protocol_address}::arc::Ticket`;
// const balance = `0x1::coin::CoinStore<${protocol_address}::arc_coin::ARC_Coin>`;


interface Props {
  children?: ReactNode; // any props that come into the component
}
export const AptosContext = createContext<AptosInterface | null>(null);
export const AptosContextProvider = ({ children, ...props }: Props) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [resources, setResources] = React.useState<Types.MoveResource[]>([]);
  const [userResources, setUserResources] = React.useState<Types.MoveResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPetra, setIsPetra] = useState<boolean>(false);

  useEffect(() => {
    checkIsConnected(isPetra);
  }, []);

  const handleConnect = async (isPetraConnect: boolean) => {
    try {
      if (isPetraConnect) {
        await window.aptos.connect();
      } else {
        await window.martian.connect();
      }
      setIsPetra(isPetraConnect);
      checkIsConnected(isPetraConnect);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDisconnect = async (isPetraConnect: boolean) => {
    try {
      if (isPetra) await window.aptos.disconnect();
      else await window.martian.disconnect();
      setIsPetra(isPetraConnect);
      checkIsConnected(isPetraConnect);
    } catch (e) {
      console.log(e);
    }
  };

  const checkIsConnected = async (isPetraConnect: boolean) => {
    if (isPetraConnect) {
      try {
        const x = await window.aptos.isConnected();
        setIsConnected(x);
      } catch (error) {
        console.log('Martian Not connected');
      }
    } else {
      try {
        const x = await window.martian.isConnected();
        setIsConnected(x);
      } catch (error) {
        console.log('Martian Not connected');
      }
    }
  };

  // ---------------------   contract test function ----------------------------------
  const play = async (amount: number, choice: number) => {
    const transaction = {
      arguments: [getRandomInt(10000000, 900000000), choice, amount * 1000000],
      function: protocol_address + '::coinflip::play',
      type: 'entry_function_payload',
      type_arguments: []
    };
    try {
      setIsLoading(true);
      let result = await window.aptos.signAndSubmitTransaction(transaction);
      let hash = result.hash;
      const transaction_api_rul = `${APTOS_RPC}/transactions/by_hash/${hash}`;
      const res = await fetch(transaction_api_rul)
      const txJson = await res.json();
      if (txJson && txJson.events) {
        let events: [] = txJson.events;
        if (events.length > 1)
          return "SUCCESS";
        else return "LOST";
      }
    } catch {
      setIsLoading(false);
      return "FAILD";
    }
  };

  useEffect(() => {
    if (isConnected && isPetra) {
      window?.aptos?.account().then((data: any) => {
        setAddress(data.address);
      });
    } else if (isConnected && !isPetra) {
      window?.martian.account().then((data: any) => {
        setAddress(data.address);
      });
    } else {
      // try {
      //   window?.aptos.account().then((data: any) => {
      //     setAddress(data.address);
      //   });
      // } catch (error) {
      setAddress(null);
      // }
    }
  }, [isConnected, isPetra]);

  useEffect(() => {
    client.getAccountResources(protocol_address).then(setResources);
    if (!address) return;
    client.getAccountResources(address).then(setUserResources);
    const bbb = async () => {
      const aaa = await client.getAccountResources(protocol_address);
      // console.log('aaa=========================', aaa);
    };
    bbb();
  }, [address, isLoading]);
  const datacontext: AptosInterface = {
    play,
    handleConnect: handleConnect,
    handleDisconnect: handleDisconnect,
    address: address,
    isConnected: isConnected
  };

  return <AptosContext.Provider value={datacontext}>{children}</AptosContext.Provider>;
};
