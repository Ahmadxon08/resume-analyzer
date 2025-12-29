import { useState } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSelectFile = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your resume PDF");
      return;
    }

    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(e.currentTarget);

    if (!formData) {
      return;
    }

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    console.log(companyName, jobTitle, jobDescription);
    formData.append("resume", file);

    console.log("PDF FILE 👉", file);
    console.log("FormData resume 👉", formData.get("resume"));
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job!</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="gif"
                className="w-[70%]"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips!</h2>
          )}
          {!isProcessing && (
            <form
              action=""
              id="upload-form"
              className="mt-8"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input id="company-name" type="text" name="company-name" />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  placeholder="Job Title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  rows={5}
                  name="job-description"
                />
              </div>

              <div className="form-div">
                <label>Uploader</label>
                <FileUploader onFileSelect={handleSelectFile} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
