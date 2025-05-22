import { useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import UserManagement from "../components/UserManagement";

export default function ManageUser() {
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) navigate("/", { replace: true });
    }, [user, navigate]);
    return (
        <Layout>
            <UserManagement />
        </Layout>
    )
}
