import React, { useState } from "react";
import LMCDCLogo from "../assets/LMCDC.png";
import AddAppointmentModal from "./AddAppointmentModal";

export default function VisitorPreRegistration() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
            <AddAppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full border-t-8 border-green-700">
                <div className="flex flex-col items-center mb-6">
                    <img src={LMCDCLogo} alt="Hospital Logo" className="w-20 h-20 mb-2" />
                    <h1 className="text-3xl font-bold text-green-800 mb-1">Hospital Visitor Portal</h1>
                    <p className="text-gray-600 text-center">Welcome! Please pre-register to set an appointment for your hospital visit.</p>
                </div>
                <div className="flex flex-col gap-4 mt-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow hover:bg-green-800 transition-colors text-center"
                    >
                        Start Pre-Registration
                    </button>
                </div>
            </div>
        </div>
    );
}
