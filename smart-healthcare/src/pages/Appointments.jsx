import React, { useEffect, useState } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      alert("Error loading appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId, date, time }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Appointment created");
      fetchAppointments(); // reload
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow rounded">
        <input
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          placeholder="Doctor ID"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Book Appointment
        </button>
      </form>

      <div>
        {appointments.map((appt) => (
          <div key={appt._id} className="mb-3 p-4 bg-gray-100 rounded shadow">
            <p><strong>Doctor ID:</strong> {appt.doctorId}</p>
            <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appt.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
