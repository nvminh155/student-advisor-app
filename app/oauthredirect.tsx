import { Redirect } from 'expo-router'
import React from 'react'

const oauthredirect = () => {

  return (
    <Redirect href="/(main)" />
  )
}

export default oauthredirect