import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
export const meta = () => [
  { title: "Remumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { kv, fs, auth, isLoading } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) {
        return console.log("resume dont yoq");
      }

      const data = JSON.parse(resume);
      const resumeBlob = await fs.read(data.resumeUrl);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setFeedback(data.feedback);
      setResumeUrl(resumeUrl);
    };

    loadResume();
    console.log("ID from URL:", id);
    console.log("KV get key:", `resume:${id}`);
  }, [id]);

  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to={"/"}>
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] sticky top-0 items-center justify-center bg-cover animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
          {imageUrl && resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={imageUrl}
                alt="resume"
                className="w-full h-full object-contain rounded-2xl"
              />
            </a>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
