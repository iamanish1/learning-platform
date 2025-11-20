import Card from '../../../shared/components/Card';

const AttendanceTracker = ({ attendance }) => {
  return (
    <Card>
      <h3 className="font-semibold mb-4">Attendance</h3>
      <div className="space-y-2">
        {attendance.map((record) => (
          <div key={record.userId} className="flex justify-between items-center">
            <span>{record.userName}</span>
            <span className={`px-2 py-1 text-xs rounded ${
              record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {record.present ? 'Present' : 'Absent'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AttendanceTracker;

