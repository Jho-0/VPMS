import { useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import MonitorVisitorLogs from "../components/MonitorVisitorLogs";

export default function LogsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) navigate("/", { replace: true });
    }, [user, navigate]);
    return (
        <Layout>
            <MonitorVisitorLogs />
        </Layout>
    )
}
