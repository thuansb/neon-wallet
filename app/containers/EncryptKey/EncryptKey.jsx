// @flow
import React, { Component } from 'react'
import { isNil } from 'lodash'
import { Link } from 'react-router'
import DisplayWalletKeys from '../../components/DisplayWalletKeys'
import Logo from '../../components/Logo'
import { ROUTES } from '../../core/constants'

type Props = {
    generateNewWallet: Function,
    saveKey: Function,
    resetKey: Function,
    address: string,
    generating: boolean,
    wif: string,
    encryptedWif: string,
    passphrase: string
}

type State = {
  passphrase: string,
  passphrase2: string,
  wif: string,
}

export default class EncryptKey extends Component<Props, State> {
  state = {
    passphrase: '',
    passphrase2: '',
    wif: ''
  }

  generateNewWallet = () => {
    const { passphrase, passphrase2, wif } = this.state
    const { generateNewWallet } = this.props
    const result = generateNewWallet(passphrase, passphrase2, wif)
    if (!result) {
      this.resetFields()
    }
  }

  resetFields () {
    this.setState({
      passphrase: '',
      passphrase2: '',
      wif: ''
    })
  }

  render () {
    const { generating, address, encryptedWif, saveKey, resetKey } = this.props
    const passphraseFromProps = this.props.passphrase
    const wifFromProps = this.props.wif
    const { passphrase, passphrase2, wif } = this.state
    const disabledButton = passphrase === '' || passphrase2 === '' || wif === ''

    const passphraseDiv = (
      <div>
        <div className='info'>
          Choose a passphrase to encrypt your existing private key:
        </div>
        <input
          type='text'
          value={passphrase}
          onChange={(e) => this.setState({ passphrase: e.target.value })}
          placeholder='Enter passphrase here'
          autoFocus
        />
        <input
          type='text'
          value={passphrase2}
          onChange={(e) => this.setState({ passphrase2: e.target.value })}
          placeholder='Enter passphrase again'
        />
        <input
          type='text'
          value={wif}
          onChange={(e) => this.setState({ wif: e.target.value })}
          placeholder='Enter existing WIF here'
        />
        <button disabled={disabledButton} className={disabledButton && 'disabled'} onClick={this.generateNewWallet}> Generate encrypted key </button>
        <Link to={ROUTES.HOME}><button className='altButton'>Home</button></Link>
      </div>
    )
    return (
      <div id='newWallet'>
        <Logo />
        {isNil(wifFromProps) && passphraseDiv}
        {generating && <div className='generating'>Generating keys...</div>}
        {!generating && !isNil(wifFromProps) &&
          <DisplayWalletKeys
            address={address}
            wif={wifFromProps}
            passphrase={passphraseFromProps}
            passphraseKey={encryptedWif}
            resetKey={resetKey}
            saveKey={saveKey}
          />
        }
      </div>
    )
  }
}