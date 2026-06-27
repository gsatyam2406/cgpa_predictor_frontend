import axios from "axios";

const API_URL = "https://cgpa-predictor-k5tf.onrender.com";
export async function predictCGPA(data) {
  const response = await axios.post(
    `${API_URL}/predict`,
    {
      prev_cgpa: Number(data.prev_cgpa),
      attendance_percent: Number(data.attendance_percent),
      assignments_completed: Number(data.assignments_completed),
      midterm_score: Number(data.midterm_score),
      lab_score: Number(data.lab_score),
      extracurricular_activities: Number(data.extracurricular_activities),
    }
  );
  return response.data;
}
