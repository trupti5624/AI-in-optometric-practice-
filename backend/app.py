from flask import Flask, request, jsonify
import torch
import torch.nn as nn
# import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms, datasets
import google.generativeai as genai
from PIL import Image
import os
from flask_cors import CORS  
import json

app = Flask(__name__)
CORS(app)
with open('countries+states+cities.json', 'r', encoding='utf-8') as file:
    country_data = json.load(file)
dataset_path = './archive/dataset'  # Update with the correct path
dataset = datasets.ImageFolder(root=dataset_path)
genai.configure(api_key="AIzaSyC4XihK2e8I90bzrYMWfttp1qBsWNesCHI")
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192
#   "response_mime_type": "text/plain",
}

# Create the model
model1 = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

# Number of classes from the dataset
NUMBER_OF_CLASSES = len(dataset.classes)

# Define the CNN model class (same as the one used for training)
class CNN(nn.Module):
    def __init__(self, NUMBER_OF_CLASSES):
        super(CNN, self).__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, stride=2),
            nn.BatchNorm2d(16),
            nn.LeakyReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, stride=2),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, stride=2),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )

        self.dense_layers = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(64 * 3 * 3, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, NUMBER_OF_CLASSES),
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = x.view(x.size(0), -1)
        x = self.dense_layers(x)
        return x


# Load the saved model (replace with the correct path to your model)
model_path = 'cnn_model1.pth'  # Change the path as needed
model = CNN(NUMBER_OF_CLASSES)  # Same number of classes as in training
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model.eval()  # Set the model to evaluation mode

# Preprocessing the input image
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
])

# Prediction function
def predict(image_path):
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)  # Add batch dimension
    output = model(image)
    
    # Apply softmax to get probabilities
    probabilities = F.softmax(output, dim=1)
    confidence, predicted = torch.max(probabilities, 1)
    confidence_percentage = confidence.item() * 100
    class_probabilities = {
        dataset.classes[i]: round(probabilities[0, i].item() * 100, 2)
        for i in range(len(dataset.classes))
    }
    return predicted.item(), confidence_percentage, class_probabilities

@app.route('/predict', methods=['POST'])
def predict_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    temp_dir = '/tmp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    image_path = os.path.join(temp_dir, file.filename)
    file.save(image_path)
    
    prediction, confidence, probabilities = predict(image_path)
    
    # Assuming dataset.classes is available to map the prediction to class label
    class_name = dataset.classes[prediction]
    
    response = {
        'prediction': class_name,
        'confidence': confidence,
        'class_probabilities': probabilities
    }
    
    return jsonify(response)

@app.route('/generate-feedback', methods=['POST'])
def generate_feedback():
    try:
        data = request.get_json()
        
        # Extract information from the request
        name = data.get('name', '')
        age = data.get('age', '')
        symptoms = data.get('symptoms', '')
        medical_history = data.get('medicalHistory', '')
        
        # Generate the feedback prompt
        prompt = f"""
        You are a medical assistant. Generate a feedback for a patient.
        Name: {name}
        Age: {age}
        Symptoms: {symptoms}
        Medical History: {medical_history}
        
        Please create a detailed and polite feedback for the patient's report.
        Include:
        1. Analysis of the symptoms
        2. Potential concerns
        3. Recommendations
        4. Follow-up suggestions
        
        Format the response in clear paragraphs.
        """
        
        # Call Gemini API
        chat_session = model1.start_chat(history=[])
        response = chat_session.send_message(prompt)
        
        # Return feedback as a string that can be split into paragraphs
        return jsonify({"feedback": response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    location = request.args.get('location', '').lower()
    if not location: 
        return jsonify ({"error": "location paramater required"}), 400
    country = next((c for c in country_data if c['name'].lower() == 'india'), None)
    recommendations = []
    for state in country['states']:
        for city in state['cities']:
            if city['name'].lower().startswith(location):  # Match cities starting with the location query
                recommendations.append(f"{city['name']}")

    if not recommendations:
        recommendations = ['No recommendations found for your location.']

    return jsonify({"recommendations": recommendations})
if __name__ == '__main__':
    app.run(debug=True)
