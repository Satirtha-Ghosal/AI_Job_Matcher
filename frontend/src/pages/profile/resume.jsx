import { useState } from "react";
import { useNavigate } from "react-router";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Link
} from "@react-pdf/renderer";

import { toast } from 'react-toastify';

import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf-worker.js";

const styles = StyleSheet.create({
  page: { fontSize: 11, padding: 30, lineHeight: 1.6 },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, fontWeight: 'bold', marginBottom: 6, borderBottom: '1 solid black' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  subheading: { fontSize: 12, fontWeight: 'bold' },
  textSmall: { fontSize: 10 },
  link: { color: 'blue', textDecoration: 'underline', fontSize: 10 }
});

const ResumePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header */}
      <View style={{ textAlign: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18 }}>{data.user.firstname} {data.user.lastname}</Text>
        <Text>{data.user.email} | {data.user.phone}</Text>
        <Text>LinkedIn: {data.user.linkedin}</Text>
        <Text>GitHub: {data.user.github}</Text>
        <Text>Portfolio: {data.user.portfolio}</Text>
      </View>

      {/* Skills */}
      {data.skills.length != 0 ? <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        {data.skills.map((skill, i) => (
          <Text key={i} style={styles.textSmall}>
            • <Text style={styles.subheading}>{skill.subsection_name}</Text>: {skill.subsections_skills.join(', ')}
          </Text>
        ))}
      </View> : ""}

      {/* Experience */}
      {data.domain_experience.length != 0 ? <View style={styles.section}>
        <Text style={styles.heading}>Professional Experience</Text>
        {data.domain_experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={styles.subheading}>{exp.title} – {exp.company}</Text>
              <Text style={styles.textSmall}>{exp.duration}</Text>
            </View>
            <Text style={styles.textSmall}>{exp.description}</Text>
          </View>
        ))}
      </View> : ""}

      {/* Education */}
      {data.education.length != 0 ? <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <View style={styles.row}>
              <Text style={styles.textSmall}>
                • <Text style={styles.subheading}>{edu.level}</Text> – {edu.institution}
              </Text>
              <Text style={styles.textSmall}>{edu.duration}</Text>
            </View>
            <Text style={styles.textSmall}>Score: {edu.percentage_point}</Text>
          </View>
        ))}
      </View> : ""}

      {/* Projects */}
      {data.projects.length != 0 ? <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        {data.projects.map((proj, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={styles.subheading}>• {proj.title}</Text>
              {proj.link && (
                <Link style={styles.link} src={proj.link}>
                  View Project
                </Link>
              )}
            </View>
            <Text style={styles.textSmall}>About: {proj.about}</Text>
            <Text style={styles.textSmall}>Tech Stack: {proj.techstack.join(', ')}</Text>
            <Text style={styles.textSmall}>Features: {proj.feature.join(', ')}</Text>
          </View>
        ))}
      </View> : ""}

      {/* Certifications */}
      {data.certifications.length != 0 ? <View style={styles.section}>
        <Text style={styles.heading}>Certifications</Text>
        {data.certifications.map((cert, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.row}>
              <Text style={styles.subheading}>• {cert.title} - {cert.institution}</Text>
              {cert.link && (
                <Link style={styles.link} src={cert.link}>
                  View Certificate
                </Link>
              )}
            </View>
            <Text style={styles.textSmall}>{cert.description}</Text>
          </View>
        ))}
      </View> : ""}

    </Page>
  </Document>
);

export default function ResumeBuilder() {

  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [OptimizeResultData, setOptimizeResultData] = useState(null);
  const [overleafURL, setOverleafURL] = useState(null);

  const [activeTab, setActiveTab] = useState("build");

  const [jobDesc, setJobDesc] = useState("");
  const [pdfText, setPdfText] = useState("");

  const [loading, setLoading] = useState(false);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          fullText += strings.join(" ") + "\n\n";
        }

        setPdfText(fullText);
      } catch (err) {
        console.error("Error reading PDF: ", err);
        alert("Failed to read the PDF. See console for error.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleStartOptimize = async () => {
    if (!jobDesc.trim()) return alert("Please paste a job description.");
    setLoading(true);
    setOptimizeResultData(null);
    setOverleafURL(null);
    setResultData(null);
    setResumeData(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in.");
        navigate(".././auth/login");
        return;
      }
      const response = await fetch("http://localhost:3000/api/resume/optimizeResume", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          jd: jobDesc,
          resume: pdfText
        })
      })
      if (response.status === 403) {
        // Invalid or expired token
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate(".././auth/login");
        return;
      }
      if (!response.ok) {
        toast.error("Something Went Wrong !!! Try Again")
      }

      const data = await response.json();

      if (response.ok) {
        setOptimizeResultData(data);
        const cleanedResume = data.latex_resume
          .replace(/^```latex\s*/, '')
          .replace(/^```\s*/, '')
          .replace(/```$/, '')
          .replace(/\\n/g, '\n')
          .replace(/\\\\/g, '\\')
          .trim();

        const base64Encoded = window.btoa(
          new TextEncoder().encode(cleanedResume)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const fileName = 'resume.tex';
        const overleafLink = `https://www.overleaf.com/docs?snip_name=${encodeURIComponent(fileName)}&snip_uri=data:text/plain;base64,${base64Encoded}`;
        setOverleafURL(overleafLink)
      }

      console.log(data);

    } catch (error) {
      toast.error("Something Went Wrong !!! Try Again")
    } finally {
      setLoading(false)
    }
  }

  const handleStartBuild = async () => {
    if (!jobDesc.trim()) return alert("Please paste a job description.");
    setLoading(true);
    setResultData(null);
    setResumeData(null);
    setOptimizeResultData(null);
    setOverleafURL(null);

    try {
      if (!token) {
                toast.error("You must be logged in.");
                navigate(".././auth/login");
                return;
            }
      const response = await fetch("http://localhost:3000/api/resume/buildResume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ jd: jobDesc }),
      });

      if (response.status === 403) {
                // Invalid or expired token
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate(".././auth/login");
                return;
            }

      if (!response.ok) {
        toast.error("Something Went Wrong !!! Try Again")
      }

      const data = await response.json();
      if (response.ok) {
        setResumeData(data);
        setResultData({
          match_scores: data.match_scores,
          missing_keywords: data.missing_keywords,
          overall_ats_match_score: data.overall_ats_match_score
        })
      }

      console.log(data)

    } catch (error) {
      toast.error("Something Went Wrong !!! Try Again")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-4xl font-bold text-blue-950 mb-6">Resume Builder</h2>

      <div className="bg-slate-200 rounded-2xl px-10 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-5 py-2 rounded-lg font-semibold ${activeTab === "build" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"}`}
            onClick={() => setActiveTab("build")}
          >
            Build Resume
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-semibold ${activeTab === "optimize" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"}`}
            onClick={() => setActiveTab("optimize")}
          >
            Optimize Resume
          </button>
        </div>

        {/* Job Description + Report */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between flex-wrap bg-gray-50 rounded-2xl p-5 h-[500px]">
          {/* Job Description Input */}
          <div className=" w-full lg:w-[47%] flex h-full flex-col gap-3">
            <label className="text-lg font-medium text-gray-700">📌 Job Description</label>
            <textarea
              className="grow-1 space-y-6 w-full h-60 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />

            {activeTab === "optimize" && (
              <div>
                <label className="text-lg font-medium text-gray-700 block">Upload Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  onChange={handlePDFUpload}
                />
              </div>
            )}

            {/* Start Button */}
            <div className="text-center mt-10 flex gap-5 justify-start">
              {activeTab == 'build' ? <button
                onClick={handleStartBuild}
                className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processing..." : "🚀 Start"}
              </button> :
                <button
                  onClick={handleStartOptimize}
                  className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "🚀 Start"}
                </button>}

              {overleafURL != null ? <a
                href={overleafURL}
                target="_blank"
                className="bg-green-600 hover:bg-green-700 transition px-8 py-3 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"

              >
                See Resume on Overleaf
              </a> : ""}
            </div>
          </div>


          {/* Loading Spinner */}
          {loading && (
            <div className="mt-6 grow flex justify-center items-center">
              <div className="w-25 h-25 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* Report Section Build Resume */}
          {resultData != null ?
            <div className="rounded-xl shadow shadow-black/50 p-6 space-y-4 w-full lg:w-[47%] overflow-y-scroll h-full">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Report</h3>
              <p className="text-gray-700 text-lg">
                ATS Score: <span className="font-bold text-blue-600">{resultData.overall_ats_match_score}%</span>
              </p>
              <p className="text-gray-700 text-lg">Section Wise Match Scores</p>
              <ul className="list-disc pl-10">
                <li><span className="text-[17px] font-semibold">Certifications Match Score:</span> {resultData?.match_scores.certificates_match_score}%</li>
                <li><span className="text-[17px] font-semibold">Domain Experience Match Score:</span> {resultData?.match_scores.domain_experience_match_score}%</li>
                <li><span className="text-[17px] font-semibold">Educational Qualification Match Score:</span> {resultData?.match_scores.edu_match_score}%</li>
                <li><span className="text-[17px] font-semibold">Relevant Projects Match Score:</span> {resultData?.match_scores.projects_match_score}%</li>
                <li><span className="text-[17px] font-semibold">Soft Skills Match Score:</span> {resultData?.match_scores.soft_skills_match_score}%</li>
                <li><span className="text-[17px] font-semibold">Technical Skills Match Score:</span> {resultData?.match_scores.technical_skills_match_score}%</li>
              </ul>
              <p className="text-gray-700 text-lg">Missing Keywords: </p>
              <ul className="list-disc pl-10">
                {resultData.missing_keywords.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            : ""}

          {/* Report Section Optimize Resume */}
          {OptimizeResultData ?
            <div className="rounded-xl shadow shadow-black/50 p-6 space-y-4 w-full lg:w-[47%] overflow-y-scroll h-full">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Report</h3>
              <p className="text-gray-700 text-lg">
                ATS Score: <span className="font-bold text-blue-600">{OptimizeResultData.ats_match_score}%</span>
              </p>
              <p className="text-gray-700 text-lg">Section Wise Match Scores</p>
              <ul className="list-disc pl-10">
                <li><span className="text-[17px] font-semibold">Certifications Match Score:</span> {OptimizeResultData?.section_wise_scores.certifications}%</li>
                <li><span className="text-[17px] font-semibold">Domain Experience Match Score:</span> {OptimizeResultData?.section_wise_scores.domain_experience}%</li>
                <li><span className="text-[17px] font-semibold">Educational Qualification Match Score:</span> {OptimizeResultData?.section_wise_scores.education}%</li>
                <li><span className="text-[17px] font-semibold">Relevant Projects Match Score:</span> {OptimizeResultData?.section_wise_scores.projects}%</li>
                <li><span className="text-[17px] font-semibold">Soft Skills Match Score:</span> {OptimizeResultData?.section_wise_scores.soft_skills}%</li>
                <li><span className="text-[17px] font-semibold">Technical Skills Match Score:</span> {OptimizeResultData?.section_wise_scores.technical_skills}%</li>
              </ul>
              <p className="text-gray-700 text-lg">Missing Keywords: </p>
              <ul className="list-disc pl-10">
                {OptimizeResultData.missing_keywords.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            : ""}
        </div>

        {/* Resume Preview */}
        {resumeData != null ? <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Resume Preview</h2>
          <div className="w-full h-[800px] rounded-lg overflow-hidden shadow">
            <PDFViewer width="100%" height="100%">
              <ResumePDF data={resumeData} />
            </PDFViewer>
          </div>

          {/* Download Button */}
          <div className="mt-6 text-center">
            <PDFDownloadLink
              document={<ResumePDF data={resumeData} />}
              fileName="resume.pdf"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              {({ loading }) => (loading ? "Preparing PDF..." : "⬇️ Download PDF")}
            </PDFDownloadLink>
          </div>
        </div> : ""}

      </div>
    </div>
  );
}
