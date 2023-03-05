import {
  Button,
  VStack,
  Image,
  Box,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { handleConnect } from '@utils/web3'
import { useState, useContext, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import withTransition from './withTransition'
import ConnectWallet from './web3/ConnectWallet'
import { MyAppContext } from '../pages/_app'
import { ethers } from 'ethers'
import { ABI } from '../abis/ABI'
import Web3Modal from 'web3modal'
import UAuth from '@uauth/js'
import { disconnect } from 'process'
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from '@gelatonetwork/gasless-onboarding'

const getEthereumObject = () => window.ethereum

const findAccount = async () => {}

export function Landing() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const {
    account,
    setAccount,
    contract,
    setContract,
    provider,
    setProvider,
    signer,
    setSigner,
    userUD,
    setUserUD,
    setCurrentAccountUd,
    setMyGaslessWallet,
  } = useContext(MyAppContext)
  console.log('____contract', contract)

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const fetchedAddress = window.localStorage.getItem('ACCOUNT')
  //     if (!account && fetchedAddress) setAccount(fetchedAddress)
  //     if (account && account !== fetchedAddress)
  //       window.localStorage.setItem('ACCOUNT', account)
  //   }

  //   findAccount().then(async (account) => {
  //     if (account !== null) {
  //       setAccount(account)
  //       const provider = new ethers.providers.Web3Provider(window.ethereum)
  //       setProvider(provider)
  //       const { chainId } = await provider.getNetwork()
  //       console.log(
  //         '🚀 ~ file: Landing.tsx:68 ~ findAccount ~ chainId',
  //         chainId,
  //       )
  //       const deployedContract = '0x3f854A33eb072e355EDa90D60f646766C11A3D43'
  //       const signer = provider.getSigner()
  //       setSigner(signer)

  //       if (chainId == 1001) {
  //         const deployedContract = '0x6239B8e5dFE71564f580FDA36609A6D96229B3B7'
  //         let contract = new ethers.Contract(deployedContract, ABI, signer)
  //         setContract(contract)
  //       } else if (chainId == 80001) {
  //         const deployedContract = '0x84260728E9A7fEA9Ab39f8Ca583Ed0afa2557bC0'
  //         let contract = new ethers.Contract(deployedContract, ABI, signer)
  //         setContract(contract)
  //       } else {
  //         alert('Please connect to Klaynt Test Network!')
  //       }
  //     }
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  async function mylogin() {
    const gaslessWalletConfig = {
      apiKey: 'KP1FEqk_oaJpGhrGPD5f4QCzVFB3oIJN_nNbJmIUSHE_',
    }
    const loginConfig = {
      domains: ['http://localhost:3000/'],
      chain: {
        id: 5,
        rpcUrl:
          'https://eth-goerli.g.alchemy.com/v2/wfmZ5V7AL4unxjEHUIfgeSAlxX3Pl0fx',
      },
      openLogin: {
        redirectUrl: `http://localhost:3000/`,
      },
    }
    const gaslessOnboarding = new GaslessOnboarding(
      loginConfig,
      gaslessWalletConfig,
    )
    await gaslessOnboarding.init()
    const web3AuthProvider = await gaslessOnboarding.login()
    console.log('🚀web3AuthProvider:', web3AuthProvider)

    const gaslessWallet = gaslessOnboarding.getGaslessWallet()
    setMyGaslessWallet(gaslessWallet)

    const address = gaslessWallet.getAddress()
    setAccount(address)

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(
      '0xDe36e7cBFF6e9D1136a2b540C6741Eba79Aa30b6',
      ABI,
      signer,
    )
    setContract(contract)
  }

  const connectWallet = async () => {
    console.log('connectWallet')
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    console.log('🚀 ~ file: Landing.tsx:95 ~ connectWal ~ address:', address)
    setProvider(provider)
    setSigner(signer)
    setAccount(address)

    // localStorage.setItem('currentAccountLocalStorage', address)

    // '0x16d7be29ebc6db2e9c92E0Bf1dE5c1cfe6b1AD2a',
    let contract = new ethers.Contract(
      '0xDe36e7cBFF6e9D1136a2b540C6741Eba79Aa30b6',
      ABI,
      signer,
    )
    setContract(contract)
  }

  const unstoppableInstance = new UAuth({
    clientID: '80e2228d-6107-46d6-985e-44d520f38b2b',
    redirectUri: 'https://bounty-hunter2.vercel.app/',
    scope: 'openid wallet email profile:optional social:optional',
  })

  const unstoppableLogin = async () => {
    const user = await unstoppableInstance.loginWithPopup()
    console.log('MY user', user)
    if (user) {
      setUserUD(user)
      setAccount(user?.idToken?.wallet_address)
      setCurrentAccountUd(user?.idToken?.wallet_address)
    }
  }

  const userLogOut = () => {
    setUserUD('')
  }

  return (
    <div className={styles.container}>
      <main className={styles.landing}>
        <VStack gap={3} zIndex={1}>
          <VStack>
            <Box w={400}>
              <Image src="/logo2.png" alt="Learning rewards" />
            </Box>
            <Text className={styles.title}>
              Please connect your wallet to continue.
            </Text>
          </VStack>

          <ConnectWallet />

          <Button onClick={mylogin} className={styles.connectButton}>
            Connect Wallet
          </Button>
        </VStack>
        <Box className={styles.ellipseOne}></Box>
      </main>
    </div>
  )
}

export default withTransition(Landing)
