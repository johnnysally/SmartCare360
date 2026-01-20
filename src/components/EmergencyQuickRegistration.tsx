import React, { useState } from "react";
import { generateUHID } from "@/lib/uhid";

export default function EmergencyQuickRegistration() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [created, setCreated] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uhid = generateUHID();
    const payload = { uhid, name, phone, age, gender, quick: true };

    try {
      // Attempt backend quick registration; fallback to local demo
      const res = await fetch("/api/patients/quick-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setCreated(data);
      } else {
        setCreated(payload);
      }
    } catch (err) {
      setCreated(payload);
    }
  };

  if (created) {
    return (
      <div className="p-4 bg-white rounded">
        <h3 className="font-semibold mb-2">Quick Registration Created</h3>
        <div>UHID: {created.uhid}</div>
        <div>Name: {created.name}</div>
        <div>Phone: {created.phone}</div>
        <div className="mt-3">
          <button className="btn" onClick={() => setCreated(null)}>
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded">
      <h3 className="font-semibold mb-2">Emergency Quick Registration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="input" />
        <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className="input" />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary">Create UHID & Register</button>
      </div>
    </form>
  );
}
