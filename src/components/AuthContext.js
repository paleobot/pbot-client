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
    const [token, setToken] = React.useState(localStorage.getItem('PBOTMutationToken'))
    const value = React.useMemo(() => [token, setToken], [token])
    return <AuthContext.Provider value={value} {...props} />
}

export {AuthProvider, useAuth}