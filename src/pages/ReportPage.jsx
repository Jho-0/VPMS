import { useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router";
import GenerateReport from "../components/GenerateReport";
import Layout from "../components/Layout";

export default function ReportPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) navigate("/", { replace: true });
    }, [user, navigate]);
    return (
        <Layout>
            <GenerateReport />
        </Layout>
    );
}
