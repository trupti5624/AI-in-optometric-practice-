import React from 'react';
import CustomProgress from './CustomProgress';

const assessments = [
  {
    title: 'Cataract Assessment',
    riskLevel: 'Very Low (5%)',
    value: 5,
    details: [
      'No lens opacities detected',
      'Clear visualization of retinal details',
      'No light scatter patterns indicative of early cataract',
      'Normal lens transparency',
    ],
  },
  {
    title: 'Diabetic Retinopathy Assessment',
    riskLevel: 'Very Low (2%)',
    value: 2,
    details: [
      'No microaneurysms detected',
      'Normal retinal blood vessel patterns',
      'No signs of retinal hemorrhages',
      'No hard exudates or cotton wool spots',
      'No neovascularization',
    ],
  },
  {
    title: 'Glaucoma Assessment',
    riskLevel: 'Very Low (1%)',
    value: 1,
    details: [
      'Normal optic cup-to-disc ratio (0.3)',
      'No signs of optic nerve damage',
      'Normal neuroretinal rim',
      'No nerve fiber layer defects',
      'Normal visual field (based on previous tests)',
    ],
  },
  {
    title: 'Normal Eye Assessment',
    riskLevel: 'High (92%)',
    value: 92,
    details: [
      'Clear optical media',
      'Normal retinal appearance',
      'Healthy optic nerve',
      'Normal macula',
      'Normal vascular patterns',
      'No abnormal lesions or deposits',
    ],
  },
];

const aiMethodology = [
  {
    title: 'Cataract Detection',
    description:
      'Analyzes lens opacity, light scatter patterns, and visual clarity to identify early to advanced cataracts.',
  },
  {
    title: 'Diabetic Retinopathy Detection',
    description:
      'Identifies microaneurysms, hemorrhages, exudates, and neovascularization characteristic of diabetic eye disease.',
  },
  {
    title: 'Glaucoma Detection',
    description:
      'Evaluates optic disc cupping, neuroretinal rim thinning, and nerve fiber layer defects indicative of glaucomatous damage.',
  },
];

const DetailedSummary = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {['Right Eye', 'Left Eye'].map((eye) => (
          <div key={eye}>
            <h2 className="text-2xl font-bold text-center mb-4">{eye}</h2>
            <div className="grid gap-4">
              {assessments.map((assessment, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md space-y-3">
                  <h3 className="text-xl font-semibold">{assessment.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level</span>
                    <span className="text-sm font-medium text-green-600">{assessment.riskLevel}</span>
                  </div>
                  <CustomProgress value={assessment.value} />

                  <div className="rounded-lg bg-slate-50 p-3">
                    <h4 className="text-sm font-medium">Analysis Details</h4>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {assessment.details.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Detection Methodology (Shown Only Once) */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold">AI Detection Methodology</h2>
        <p className="text-sm text-slate-600 mt-2">
          Our AI system analyzes your eye images using deep learning algorithms trained on millions of validated
          eye scans. The system evaluates multiple features including retinal blood vessels, optic disc
          morphology, lens clarity, and macular integrity to detect signs of cataracts, diabetic retinopathy,
          and glaucoma.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {aiMethodology.map((method, i) => (
            <div key={i} className="rounded-lg bg-slate-50 p-3">
              <h4 className="text-sm font-medium">{method.title}</h4>
              <p className="mt-1 text-xs text-slate-600">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedSummary;
