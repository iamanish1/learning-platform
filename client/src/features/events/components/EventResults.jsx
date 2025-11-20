import Card from '../../../shared/components/Card';

const EventResults = ({ results }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Results & Leaderboard</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={result.teamId}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-400' :
                index === 1 ? 'bg-gray-300' :
                index === 2 ? 'bg-orange-300' :
                'bg-white'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-semibold">{result.teamName}</p>
                <p className="text-sm text-gray-500">{result.projectTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{result.score} points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EventResults;

