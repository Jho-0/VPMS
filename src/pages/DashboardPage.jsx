import { useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/", { replace: true });
  }, [user, navigate]);
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
