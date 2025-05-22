import React, { useEffect } from 'react'
import { useAuth } from '../context/Authcontext'
import { useNavigate } from 'react-router'
import Layout from '../components/Layout'
import VisitorManagement from '../components/VisitorManagement'

export default function ReceptionistDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) navigate('/', { replace: true })
    }, [user, navigate])

    return (
        <Layout>
            <VisitorManagement />
        </Layout>
    )
}
