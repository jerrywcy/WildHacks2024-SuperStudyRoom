'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Persistor } from 'redux-persist'

export default function StoreProvider({
    children
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<{ store: AppStore, persistor: Persistor }>()
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    return <Provider store={storeRef.current.store}>
        <PersistGate loading={null} persistor={storeRef.current.persistor}>
            {children}
        </PersistGate>
    </Provider>
}
