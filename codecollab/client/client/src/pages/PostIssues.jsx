import { useState, useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import { FaUpload } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { postIssue } from "../api";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

export default function PostIssuesPage() {
  const { userToken } = useContext(AppContent);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [file, setFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
  
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }
  
    console.log("📂 Selected File:", selectedFile);
    setFile(selectedFile); // ✅ Ensure this stores a valid File object
  };
  
  
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);


  const handleSubmit = async () => {
    if (!title || !subject || !description) {
        toast.error("Title, subject, and description are required!");
        return;
    }


    console.log("📂 Attaching File:", file?.name);

    const token = userToken || localStorage.getItem("token");

    if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
    }

    try {
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("subject", subject);
        formData.append("description", description);
        formData.append("codeSnippet", code);
        formData.append("language", language);



        // ✅ Append file ONLY if it exists
        if (file instanceof File) {
            console.log("📌 Appending file:", file.name);
            formData.append("uploadedFile", file);
        }

        console.log("📌 FormData Entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0], ":", pair[1]);
        }

        const data = await postIssue(formData, token);

        if (data.success) {
            toast.success("Issue posted successfully!");
            setTitle("");
            setSubject("");
            setDescription("");
            setCode("");
            setLanguage("");
            setFile(null);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("❌ Upload Error:", error);
        toast.error("Failed to post issue. Try again.");
    } finally {
        setLoading(false);
    }
};

  
  

  
  

  
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600 ">
      <UserNavbar />
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mt-10 border border-gray-300">
        <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">Post Your Issue</h2>

        <input type="text" placeholder="Issue Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-md mb-4" />
        <input type="text" placeholder="Subject (Issue Category)" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 border rounded-md mb-4" />
        <textarea placeholder="Describe the error..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-md mb-4" rows="4" />

        <label className="flex items-center p-3 bg-gray-200 border rounded-md mb-4 cursor-pointer">
          <FaUpload className="mr-2" /> Upload File
          <input type="file" onChange={handleFileUpload} className="hidden" />
          {file && <span className="ml-2 text-sm">{file.name}</span>}
        </label>

        <button onClick={handleOpenPopup} className="w-full p-3 bg-gray-200 border rounded-md mb-4 text-left">
          {code ? "Edit Code" : "Paste your code here..."}
        </button>

        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 border rounded-md mb-4">
          <option value="" disabled>Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
        </select>



        <button onClick={handleSubmit} className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition" disabled={loading}>
          {loading ? "Submitting..." : "Submit Issue"}
        </button>

        {isPopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50">
            <div className="w-11/12 md:w-3/5 h-4/5 p-6 rounded-lg bg-white text-gray-900 relative">
              <h3 className="text-2xl font-bold mb-4">Paste Your Code</h3>
              <button onClick={handleClosePopup} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl">✖</button>
              <Editor height="70vh" language={language || "javascript"} theme="light" value={code} onChange={setCode} options={{ minimap: { enabled: false } }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
