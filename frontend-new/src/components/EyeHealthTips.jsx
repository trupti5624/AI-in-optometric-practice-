import { Check, Info } from "lucide-react";

export function EyeHealthTips({ condition }) {
  console.log(condition, "condition")
  // Default tips for normal eye health
  const normalTips = [
    {
      id: 1,
      tip: "Schedule regular eye check-ups to monitor for early signs of eye diseases.",
      completed: true,
    },
    {
      id: 2,
      tip: "Maintain healthy blood sugar levels to prevent diabetic retinopathy.",
      completed: true,
    },
    {
      id: 3,
      tip: "Wear UV-protective sunglasses to reduce cataract risk.",
      completed: false,
    },
    {
      id: 4,
      tip: "Monitor eye pressure regularly to detect early signs of glaucoma.",
      completed: false,
    },
  ];

  // Tips for Diabetic Retinopathy
  const diabeticRetinopathyTips = [
    {
      id: 1,
      tip: "Keep your blood sugar levels in check to prevent further damage to the retina.",
      completed: true,
    },
    {
      id: 2,
      tip: "Visit an eye doctor regularly to check for diabetic retinopathy.",
      completed: false,
    },
    {
      id: 3,
      tip: "Maintain a healthy diet and exercise routine to help manage diabetes.",
      completed: false,
    },
    {
      id: 4,
      tip: "Avoid smoking, as it can worsen diabetic retinopathy.",
      completed: false,
    },
  ];

  // Tips for Cataract
  const cataractTips = [
    {
      id: 1,
      tip: "Wear sunglasses with UV protection to protect your eyes from sun damage.",
      completed: true,
    },
    {
      id: 2,
      tip: "Have regular eye exams to monitor for early signs of cataracts.",
      completed: false,
    },
    {
      id: 3,
      tip: "Avoid excessive use of alcohol, which can increase cataract risk.",
      completed: false,
    },
    {
      id: 4,
      tip: "Maintain a healthy diet rich in antioxidants, which can help slow cataract progression.",
      completed: false,
    },
  ];

  // Tips for Glaucoma
  const glaucomaTips = [
    {
      id: 1,
      tip: "Monitor eye pressure regularly to detect early signs of glaucoma.",
      completed: true,
    },
    {
      id: 2,
      tip: "Use prescribed medications regularly to manage eye pressure.",
      completed: false,
    },
    {
      id: 3,
      tip: "Avoid activities that can cause a sudden increase in eye pressure.",
      completed: false,
    },
    {
      id: 4,
      tip: "Maintain a healthy lifestyle, including a balanced diet and regular exercise.",
      completed: false,
    },
  ];

  // Choose tips based on the condition
  const getTipsForCondition = (condition) => {
    switch (condition) {
      case 'Diabetic Retinopathy':
        return diabeticRetinopathyTips;
      case 'Cataract':
        return cataractTips;
      case 'Glaucoma':
        return glaucomaTips;
      default:
        return normalTips;
    }
  };

  const tips = getTipsForCondition(condition);

  const isDiseaseDetected = condition && condition !== 'Normal'; // Check if disease is detected

  return (
    <div className="space-y-4 p-4 w-[80%] ml-24">
      {/* AI Detection Result Box */}
      <div className={`rounded-lg p-3 ${isDiseaseDetected ? "bg-red-50" : "bg-green-50"}`}>
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${isDiseaseDetected ? "bg-red-100" : "bg-green-100"}`}>
            <Info className={`h-5 w-5 ${isDiseaseDetected ? "text-red-600" : "text-green-600"}`} />
          </div>
          <div>
            <p className={`font-medium ${isDiseaseDetected ? "text-red-800" : "text-green-800"}`}>
              AI Detection Result
            </p>
            <p className={`mt-1 text-sm ${isDiseaseDetected ? "text-red-700" : "text-green-700"}`}>
              {isDiseaseDetected
                ? "Your recent eye scan has detected some issues related to your eye health. Please follow the recommendations provided below."
                : "Your recent eye scan shows no signs of cataracts, diabetic retinopathy, or glaucoma. Continue with your current eye care routine."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Eye Care Tips */}
      <div className="space-y-2">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div
              className={`rounded-full p-2 ${tip.completed ? "bg-green-100" : "bg-gray-200"}`}
            >
              <Check
                className={`h-5 w-5 ${tip.completed ? "text-green-600" : "text-gray-400"}`}
              />
            </div>
            <p className="flex-1 text-sm text-gray-700">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Button to View All Recommendations */}
      {/* <button className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
        View All Recommendations
      </button> */}
    </div>
  );
}

export default EyeHealthTips;