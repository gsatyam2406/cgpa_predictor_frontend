import { useState } from "react";
import { predictCGPA } from "../api";

const fields = [
  { name: "prev_cgpa", label: "Previous CGPA", placeholder: "e.g. 8.2", min: 0, max: 10 },
  { name: "attendance_percent", label: "Attendance %", placeholder: "e.g. 90", min: 0, max: 100 },
  { name: "assignments_completed", label: "Assignments Completed %", placeholder: "e.g. 95", min: 0, max: 100 },
  { name: "midterm_score", label: "Midterm Score", placeholder: "e.g. 80", min: 0, max: 100 },
  { name: "lab_score", label: "Lab Score", placeholder: "e.g. 85", min: 0, max: 100 },
  { name: "extracurricular_activities", label: "Extracurricular Activities", placeholder: "e.g. 2", min: 0, max: 10 },
];

function getGrade(cgpa) {
  if (cgpa >= 9) return { label: "Outstanding 🌟", color: "#34d399" };
  if (cgpa >= 8) return { label: "Excellent 🎯", color: "#60a5fa" };
  if (cgpa >= 7) return { label: "Good 👍", color: "#a78bfa" };
  if (cgpa >= 6) return { label: "Average 📚", color: "#fbbf24" };
  return { label: "Needs Improvement 💪", color: "#f87171" };
}

function CGPAForm() {
  const [form, setForm] = useState({
    prev_cgpa: "",
    attendance_percent: "",
    assignments_completed: "",
    midterm_score: "",
    lab_score: "",
    extracurricular_activities: "",
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {};
    fields.forEach(({ name, label }) => {
      if (form[name] === "") {
        newErrors[name] = `${label} is required`;
      } else if (isNaN(form[name])) {
        newErrors[name] = "Must be a number";
      }
    });
    return newErrors;
  }

  async function handlePredict() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await predictCGPA(form);
      setResult(response.predicted_cgpa);
    } catch (e) {
      alert("Could not connect to backend. Make sure uvicorn is running.");
    }
    setLoading(false);
  }

  const grade = result ? getGrade(result) : null;

  return (
    <div className="card">
      <h1>🎓 CGPA Predictor</h1>
      <p className="subtitle">Enter your academic details to predict your CGPA</p>

      {fields.map(({ name, label, placeholder }) => (
        <div className="field" key={name}>
          <label>{label}</label>
          <input
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            className={errors[name] ? "error" : ""}
          />
          {errors[name] && <p className="error-msg">⚠ {errors[name]}</p>}
        </div>
      ))}

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict CGPA"}
      </button>

      {result && (
        <div className="result">
          <p>Your Predicted CGPA</p>
          <h2>{result}</h2>
          <p className="grade" style={{ color: grade.color }}>{grade.label}</p>
        </div>
      )}
    </div>
  );
}

export default CGPAForm;