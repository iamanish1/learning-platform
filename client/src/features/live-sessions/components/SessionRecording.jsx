import Card from '../../../shared/components/Card';

const SessionRecording = ({ recording }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Session Recording</h2>
        {recording?.videoUrl ? (
          <video controls className="w-full rounded-lg" src={recording.videoUrl} />
        ) : (
          <p className="text-gray-600">Recording not available</p>
        )}
      </div>
    </Card>
  );
};

export default SessionRecording;

