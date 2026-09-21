import { Construction, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const StillInDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent text-white py-24 px-4 flex flex-col items-center justify-center space-y-8">
      {/* Decorative header with icons */}

      <div className="flex items-center gap-4 mb-2">
        <Construction className="text-[#9b87f5] h-8 w-8 animate-bounce" />
        <h1 className="text-4xl font-bold text-center">Still In Development</h1>
        <Wrench className="text-[#9b87f5] h-8 w-8 animate-bounce delay-150" />
      </div>

      {/* Underline */}
      <div className="w-32 h-1 bg-[#9b87f5] rounded-full"></div>

      {/* Description */}
      <div className="max-w-lg text-center space-y-6">
        <p className="text-lg text-[#D6BCFA]">
          We're working hard to bring you this feature. It will be available
          soon!
        </p>

        <div className="bg-[#1A1F2C]/60 border border-[#9b87f5]/20 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-[#9b87f5] mb-4">
            What to expect
          </h2>
          <ul className="text-[#8E9196] space-y-3 text-left">
            <li className="flex items-start gap-2">
              <span className="text-[#9b87f5]">•</span>
              <span>Enhanced user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#9b87f5]">•</span>
              <span>New interactive features</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#9b87f5]">•</span>
              <span>Improved performance and reliability</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] w-3/4 rounded-full"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#8E9196]">
          <span>Development in progress</span>
          <span>75%</span>
        </div>
      </div>


      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mt-8 bg-transparent text-[#9b87f5] border-[#9b87f5] hover:bg-[#9b87f5]/10"
      >
        Go Back
      </Button>
    </div>
  );
};

export default StillInDevelopment;
