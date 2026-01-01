import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summery from "~/components/Summery";
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
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated && !isLoading) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);
        if (!resume) {
          console.log("Resume topilmadi");
          return;
        }

        const data = JSON.parse(resume);

        // const resumeBlob = await fs.read(data.resumePath);
        // const imageBlob = await fs.read(data.imagePath);

        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) {
          console.error("Resume fayl topilmadi");
          return;
        }

        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) {
          console.error("Image fayl topilmadi");
          return;
        }

        const pdfUrl = URL.createObjectURL(
          new Blob([resumeBlob], { type: "application/pdf" })
        );

        const imgUrl = URL.createObjectURL(imageBlob);

        setResumeUrl(pdfUrl);
        setImageUrl(imgUrl);
        const parsedFeedback = JSON.parse(JSON.parse(data.feedback));
        console.log("PARSED FEEDBACK:", parsedFeedback);

        setFeedback(parsedFeedback);
      } catch (err) {
        console.error("Xatolik:", err);
      }
    };

    console.log(imageUrl);

    loadResume();
  }, [id]);

  console.log(feedback);

  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to={"/"} className="back-button">
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

        <section className="feedback-section">
          <h2 className="text-4xl text-black font-bold">Resume Review</h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summery feedback={feedback} />{" "}
              {/* <ATS
                score={feedback?.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />{" "}
              <Details feedback={feedback} /> */}
            </div>
          ) : (
            <div>
              <img src="/images/resume-scan-2.gif" alt="scan gif" />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
