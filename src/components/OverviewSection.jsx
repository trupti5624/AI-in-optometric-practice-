import { AlertCircle, CheckCircle } from 'lucide-react';
import React from 'react';
import CustomProgress from './CustomProgress';

const eyeData = {
  right: {
    healthStatus: 'Normal Eye Health Detected',
    confidence: { Normal: 92, Cataract: 5, DiabeticRetinopathy: 2, Glaucoma: 1 },
  },
  left: {
    healthStatus: 'Normal Eye Health Detected',
    confidence: { Normal: 89, Cataract: 7, DiabeticRetinopathy: 3, Glaucoma: 1 },
  },
  keyFindings: [
    'Clear optical media with no opacities detected',
    'Normal retinal blood vessel patterns',
    'Healthy optic nerve appearance',
    'No signs of retinal hemorrhages or exudates',
    'Normal optic cup-to-disc ratio',
  ],
  recommendations: [
    'Schedule your next AI eye screening in 12 months',
    'Continue wearing UV-protective sunglasses outdoors',
    'Take regular breaks when using digital screens (20-20-20 rule)',
    'Maintain a healthy diet rich in vitamins A, C, and E',
  ],
};

const OverviewSection = () => {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2">
        {['right', 'left'].map((eye) => (
          <div key={eye}>
            <div className="rounded-lg border bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{eye === 'right' ? 'Right Eye' : 'Left Eye'}</h3>
                  <p className="mt-1 text-sm text-slate-600">{eyeData[eye].healthStatus}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 mt-4">
              <div>
                <h3 className="mb-2 font-medium">Detection Confidence</h3>
                <div className="space-y-5">
                  {Object.entries(eyeData[eye].confidence).map(([condition, value]) => (
                    <div key={condition}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{condition}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <CustomProgress
                        value={value}
                        className={`h-2 ${condition !== 'Normal' ? 'bg-slate-100' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Findings and Recommendations (Shown Only Once) */}
      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-medium">Key Findings</h3>
          <ul className="space-y-4 text-sm">
            {eyeData.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 mt-4">
          <h3 className="mb-2 font-medium">Recommendations</h3>
          <ul className="space-y-2 text-sm">
            {eyeData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <AlertCircle className="h-3 w-3 text-blue-600" />
                </div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
