import { prepareInstructions } from "constants";
import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

interface handleAnalyzeProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

const Upload = () => {
  const { kv, auth, isLoading, ai, fs } = usePuterStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSelectFile = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async ({
    companyName,
    jobDescription,
    jobTitle,
    file,
  }: handleAnalyzeProps) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");

    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error:Failed to upload file");
    setStatusText("Converting to image...");

    const imageFileResult = await convertPdfToImage(file);
    if (!imageFileResult.file) {
      return setStatusText(
        imageFileResult.error || "Error: Failed to convert PDF to image..."
      );
    }

    setStatusText("Uploading  the image...");
    const uploadedImage = await fs.upload([imageFileResult.file]);
    if (!uploadedImage) {
      return setStatusText("Error:Failed to Uploaded image...");
    }

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobDescription,
      jobTitle,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing...");
    const instructions = prepareInstructions({ jobDescription, jobTitle });
    const feedback = await ai.feedback(
      uploadedFile.path,
      typeof instructions === "string"
        ? instructions
        : JSON.stringify(instructions)
    );

    if (!feedback) return setStatusText("Error:Failed to analysis...");
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.stringify(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");

    console.log(data);
    navigate(`/resume/${uuid}`);
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

    handleAnalyze({
      companyName,
      jobDescription,
      jobTitle,
      file,
    });
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
