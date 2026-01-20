import React, { useEffect, useState } from 'react';

const OTBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/ot/bookings')
      .then((r) => r.json())
      .then((data) => setBookings(data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">OT Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 && <p className="text-muted-foreground">No bookings found.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{b.patientname || b.patientName || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">Room: {b.operatingroom || b.operatingRoom || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{b.scheduledat || b.scheduledAt}</div>
                  <div className="text-sm">Status: {b.status}</div>
                </div>
              </div>
              {b.notes && <div className="mt-2 text-sm text-muted-foreground">Notes: {b.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OTBooking;
