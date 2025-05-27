import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';

export function RecentTests({dashboardData}) {
  const [tests, setTests] = useState()
  const navigate = useNavigate()
  // const [predictions, setPredictions] = useState()
  useEffect(() => {
    setTests(dashboardData?.feedbacks)
    // setPredictions(dashboardData?.feedbacks)
  }, [dashboardData])
  console.log(tests, "dashboardData in recenttests")

  const sendData = (test, prediction, name, age) => {
    console.log(test, "test")
    navigate('/feedback', {
      state: {
        isfeedback: true,
        feedback: test,
        predictions: prediction,
        name: name,
        age: age
      }
    });
  }
  // const tests = [
  //   {
  //     id: 1,
  //     type: "Eye Disease Detection",
  //     date: "May 2, 2023",
  //     result: "Normal",
  //     confidence: "92%",
  //     status: "Completed",
  //   },
  //   {
  //     id: 2,
  //     type: "Eye Disease Detection",
  //     date: "April 15, 2023",
  //     result: "Normal",
  //     confidence: "90%",
  //     status: "Completed",
  //   },
  //   {
  //     id: 3,
  //     type: "Eye Disease Detection",
  //     date: "March 28, 2023",
  //     result: "Early Cataract",
  //     confidence: "78%",
  //     status: "Completed",
  //   },
  // ];

  return (
    
    <div className="space-y-4 p-4 ml-24 w-3/4">
      
      {tests?.map((test) => 
      { 
        const appointmentDate = new Date(test?.createdAt);
        return(
       
        <div key={test._id} className="flex items-start gap-4 rounded-lg border p-3 w-[100%]">
          {/* Icon with Dynamic Background */}
          <div
  className={`rounded-full p-2 ${
    test?.prediction?.leftEye?.result === "normal" && test?.prediction?.rightEye?.result === "normal"
      ? "text-green-600"
      : test?.prediction?.leftEye?.result === "cataract" || test?.prediction?.rightEye?.result === "cataract"
      ? "text-amber-600"
      : test?.prediction?.leftEye?.result === "diabetic_retinopathy" || test?.prediction?.rightEye?.result === "diabetic_retinopathy"
      ? "text-red-600"
      : test?.prediction?.leftEye?.result === "glaucoma" || test?.prediction?.rightEye?.result === "glaucoma"
      ? "text-purple-600"
      : "text-blue-600"
  }`}
>
            <FileText
              className={`h-4 w-4 ${
                test?.prediction?.leftEye?.result === "normal" && test?.prediction?.rightEye?.result === "normal"
                ? "text-green-600"
                : test?.prediction?.leftEye?.result === "cataract" || test?.prediction?.rightEye?.result === "cataract"
                ? "text-amber-600"
                : test?.prediction?.leftEye?.result === "diabetic_retinopathy" || test?.prediction?.rightEye?.result === "diabetic_retinopathy"
                ? "text-red-600"
                : test?.prediction?.leftEye?.result === "glaucoma" || test?.prediction?.rightEye?.result === "glaucoma"
                ? "text-purple-600"
                : "text-blue-600"
              }`}
            />
          </div>

          {/* Test Details */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-16">
              <p className="font-medium">{test?.name}'s Test</p>
              <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
                Completed
              </span>
            </div>
            <p className="text-sm text-gray-500">{format(appointmentDate, 'PPP')} at {format(appointmentDate, 'p')}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Result:{" "}
                <span
                  className={`font-medium ${
                    test?.prediction?.leftEye?.result === "normal" && test?.prediction?.rightEye?.result === "normal"
                    ? "text-green-600"
                    : test?.prediction?.leftEye?.result === "cataract" || test?.prediction?.rightEye?.result === "cataract"
                    ? "text-amber-600"
                    : test?.prediction?.leftEye?.result === "diabetic_retinopathy" || test?.prediction?.rightEye?.result === "diabetic_retinopathy"
                    ? "text-red-600"
                    : test?.prediction?.leftEye?.result === "glaucoma" || test?.prediction?.rightEye?.result === "glaucoma"
                    ? "text-purple-600"
                    : "text-blue-600"
                  }`}
                >
                  {(test?.prediction?.leftEye?.result === "normal" && test?.prediction?.rightEye?.result === "normal") ? "Normal" : (test?.prediction?.leftEye?.result === "cataract" || test?.prediction?.rightEye?.result === "cataract") ? "Cataract" :  test?.prediction?.leftEye?.result === "glaucoma" || test?.prediction?.rightEye?.result === "glaucoma" ? "Glaucoma" : (test?.prediction?.leftEye?.result === "diabetic_retinopathy" || test?.prediction?.rightEye?.result === "diabetic_retinopathy") ? "Diabetic Retinopathy" : "Normal"}
                </span>{" "}
                {/* ({test.confidence}) */}
              </p>
              <button className="text-xs text-blue-600 hover:underline" onClick={() => sendData(test?.responseData, test?.prediction, test?.name, test?.age)}>
                View Details
              </button>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
}

export default RecentTests;
