import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">
            {companyName ?? "Unknown Company"}
          </h2>
          <h3 className="text-lg break-words text-gray-500">
            {jobTitle ?? "Unknown Job Title"}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="gradient-border fade-in animate-in duration-1000">
        <div className="w-full h-full">
          <img
            className="w-full h-fit max-sm:h-[250px] object-cover"
            src={imagePath}
            alt="Resume"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
