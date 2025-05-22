import { jwtDecode } from 'jwt-decode'
import * as React from 'react'

const AuthContext = React.createContext()

const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error(`useAuth must be used within an AuthProvider`)
    }
    return context
}

const AuthProvider = (props) => {
    const [token, setToken] = React.useState(localStorage.getItem('AzlibAdminToken'))
    const [decode, setDecode] = React.useState(token ? jwtDecode(token) : {aud: null})
    const [user, setUser] = React.useState(decode.aud)
    const value = {token, setToken, user}//React.useMemo(() => {return {token, setToken, user}}, [token, user])//React.useMemo(() => [token, setToken], [token])
    return <AuthContext.Provider value={value} {...props} />
}

export {AuthProvider, useAuth}